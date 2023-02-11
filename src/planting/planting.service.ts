import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";

import {
  TOO_BIG_AREA_PLANTED,
  NO_PLANTING_FOUND,
  UNKNOWN_ACTION,
  ALREADY_SOLD,
  TOO_MANY_DIED,
  NOT_READY_FOR_SALE,
  INVALID_DATE_FOR_PLANTING,
} from "../common/constants/error-messages";
import { ACTIONS, AREA } from "../common/enums";
import { TreeEntity } from "../common/entities";
import { transaction } from "../common/transaction";
import { QueryPaginationDto } from "../common/dto";
import {
  GetPlantingDto,
  GetPlantingsDto,
  CreateNewPlantingDto,
  PlantingWithUserDto,
} from "./dto";
import {
  Area,
  AreaDocument,
  Planting,
  PlantingDocument,
  Price,
  PriceDocument,
  Sort,
  SortDocument,
  User,
  UserDocument,
} from "../models";
import { DateUtil } from "../utils/date.util";

@Injectable()
export class PlantingService {
  constructor(
    @InjectModel(Area.name) private areaModel: Model<AreaDocument>,
    @InjectModel(Planting.name) private plantingModel: Model<PlantingDocument>,
    @InjectModel(Price.name) private priceModel: Model<PriceDocument>,
    @InjectModel(Sort.name) private sortModel: Model<SortDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async plant(addPlantingDto: PlantingWithUserDto): Promise<any> {
    const { name, sort, count, price } = addPlantingDto;
    return transaction(this.connection, async (session) => {
      const tree = new TreeEntity(name);

      // area update

      const addArea: number = tree.area * count;
      const { totalArea, plantedArea } = await this.areaModel
        .findOneAndUpdate(
          { name: AREA },
          { $inc: { plantedArea: addArea } },
          { new: true },
        )
        .session(session);

      if (plantedArea > totalArea) {
        throw new BadRequestException(TOO_BIG_AREA_PLANTED);
      }

      // price
      await this.priceModel
        .updateOne(
          {
            name: sort,
          },
          {
            price,
          },
          { upsert: true },
        )
        .session(session);
      const newPlanting = new CreateNewPlantingDto(addPlantingDto);

      await this.plantingModel.create([newPlanting], { session });
    });
  }

  async addAction(id: string, addActionDto): Promise<any> {
    return transaction(this.connection, async (session) => {
      const planting: PlantingDocument = await this.plantingModel
        .findById(id)
        .session(session)
        .exec();
      if (!planting) throw new BadRequestException(NO_PLANTING_FOUND);

      const tree: TreeEntity = new TreeEntity(planting.name);

      if (!DateUtil.IsValidDateForPlanting(planting.date, addActionDto.date))
        throw new BadRequestException(INVALID_DATE_FOR_PLANTING);
      if (
        DateUtil.getDaysForGrowing(planting.date, tree.growingTime) <= 0 &&
        !planting.ready
      ) {
        planting.ready = true;
      }

      switch (addActionDto.action) {
        case ACTIONS.CUT:
          planting.actions.push({
            action: ACTIONS.CUT,
            date: addActionDto.date,
          });
          break;
        case ACTIONS.FERTILIZE:
          planting.actions.push({
            action: ACTIONS.FERTILIZE,
            name: addActionDto.fertilizer,
            date: addActionDto.date,
          });
          break;
        case ACTIONS.SELL:
          if (planting.sold) throw new BadRequestException(ALREADY_SOLD);
          if (!planting.ready)
            throw new BadRequestException(NOT_READY_FOR_SALE);
          planting.sold = true;
          // recalculate area
          await this.areaModel
            .findOneAndUpdate(
              { name: AREA },
              {
                $inc: {
                  plantedArea: -this.calculateArea(planting.live, tree.area),
                },
              },
              { new: true },
            )
            .session(session);
          // area.plantedArea = this.getNewArea(
          //   area.plantedArea,
          //   planting.live,
          //   tree.area,
          // );
          // area.save();
          break;
        case ACTIONS.DIE:
          const liveTrees: number = planting.live - addActionDto.died;
          if (liveTrees < 0) throw new BadRequestException(TOO_MANY_DIED);
          planting.live = liveTrees;
          // recalculate area
          await this.areaModel
            .findOneAndUpdate(
              { name: AREA },
              {
                $inc: {
                  plantedArea: -this.calculateArea(
                    addActionDto.died,
                    tree.area,
                  ),
                },
              },
              { new: true },
            )
            .session(session);
          // area.plantedArea = this.getNewArea(
          //   area.plantedArea,
          //   amount,
          //   tree.area,
          // );
          // area.save();
          break;
        default:
          throw new BadRequestException(UNKNOWN_ACTION);
      }
      return planting.save();
    });
  }

  async getPlantings(
    query: QueryPaginationDto,
    isSold = false,
  ): Promise<GetPlantingsDto> {
    const { skip, limit } = query;

    const plantings = await this.plantingModel
      .find({ sold: isSold }, {}, { skip, limit })
      .select("name sort live ready")
      .populate("user", "name", User.name);

    const area = !isSold && (await this.areaModel.findOne({ name: AREA }));

    return new GetPlantingsDto({ plantings, area });
  }

  async getPlantingById(id: string): Promise<GetPlantingDto> {
    const planting = await this.plantingModel
      .findById(id)
      .populate("user", "name", User.name)
      .exec();
    if (!planting) throw new BadRequestException(NO_PLANTING_FOUND);

    const { fertilizers } = await this.sortModel
      .findOne({
        name: planting.name,
        sort: planting.sort,
      })
      .exec();
    const tree = new TreeEntity(planting.name);
    const daysLeft: number = DateUtil.getDaysForGrowing(
      planting.date,
      tree.growingTime,
    );

    return new GetPlantingDto({
      planting,
      daysLeft,
      fertilizers,
    });
  }

  private calculateArea(count, area) {
    return count * area;
  }
}
