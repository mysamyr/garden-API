import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";

import {
  TOO_BIG_AREA_PLANTED,
  NO_PLANTING_FOUND,
  NOT_EXISTING_USER,
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
import { GetPlantingDto, GetPlantingsDto, CreateNewPlantingDto } from "./dto";
import {
  Area,
  AreaDocument,
  Planting,
  PlantingDocument,
  Price,
  PriceDocument,
  Tree,
  TreeDocument,
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
    @InjectModel(Tree.name) private treeModel: Model<TreeDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async plant(addPlantingDto): Promise<any> {
    const { name, sort, count, price, user } = addPlantingDto;
    return transaction(this.connection, async (session) => {
      const tree = new TreeEntity(name);

      // todo move user checking to auth middleware
      const isUserExists = await this.userModel.findById(user).session(session);
      if (!isUserExists) throw new BadRequestException(NOT_EXISTING_USER);

      // area
      const [{ totalArea, plantedArea }] = await this.areaModel
        .find()
        .session(session);
      const totalPlantedArea: number = tree.area * count + +plantedArea;
      if (totalPlantedArea > totalArea) {
        throw new BadRequestException(TOO_BIG_AREA_PLANTED);
      }
      await this.areaModel
        .updateOne({ name: AREA }, { plantedArea: totalPlantedArea })
        .session(session);

      // price
      await this.priceModel.updateOne(
        {
          name: sort,
        },
        {
          price,
        },
        { upsert: true, session },
      );

      await this.plantingModel.create(new CreateNewPlantingDto(addPlantingDto));
    });
  }

  async addAction(id: string, addActionDto): Promise<any> {
    const { action, date, name, amount } = addActionDto;

    return transaction(this.connection, async (session) => {
      const planting = await this.plantingModel
        .findById(id)
        .session(session)
        .exec();
      if (!planting) throw new BadRequestException(NO_PLANTING_FOUND);

      const tree = new TreeEntity(planting.name);
      const area = await this.areaModel
        .findOne({ name: AREA })
        .session(session);

      if (!DateUtil.IsValidDateForPlanting(planting.date, date))
        throw new BadRequestException(INVALID_DATE_FOR_PLANTING);
      if (
        DateUtil.getDaysForGrowing(planting.date, tree.growingTime) <= 0 &&
        !planting.ready
      ) {
        planting.ready = true;
      }

      switch (action) {
        case ACTIONS.CUT:
          planting.actions.push({
            action: ACTIONS.CUT,
            date: date,
          });
          break;
        case ACTIONS.FERTILIZE:
          planting.actions.push({
            action: ACTIONS.FERTILIZE,
            name: name,
            date: date,
          });
          break;
        case ACTIONS.SELL:
          if (planting.sold) throw new BadRequestException(ALREADY_SOLD);
          if (!planting.ready)
            throw new BadRequestException(NOT_READY_FOR_SALE);
          planting.sold = true;
          // recalculate area
          area.plantedArea = this.getNewArea(
            area.plantedArea,
            planting.live,
            tree.area,
          );
          area.save();
          break;
        case ACTIONS.DIE:
          const liveTrees = planting.live - amount;
          if (liveTrees < 0) throw new BadRequestException(TOO_MANY_DIED);
          planting.live = liveTrees;
          // recalculate area
          area.plantedArea = this.getNewArea(
            area.plantedArea,
            amount,
            tree.area,
          );
          area.save();
          break;
        default:
          throw new BadRequestException(UNKNOWN_ACTION);
      }
      return planting.save();
    });
  }

  async getAll(query: QueryPaginationDto): Promise<GetPlantingsDto> {
    const { skip, limit } = query;

    const plantings = await this.plantingModel
      .find({ sold: false }, {}, { skip, limit })
      .select("name sort live ready")
      .populate("user", "name", User.name);

    const area = await this.areaModel.findOne({ name: AREA });

    return new GetPlantingsDto({ plantings, area });
  }

  async getSold(query: QueryPaginationDto): Promise<GetPlantingsDto> {
    const { skip, limit } = query;

    const plantings = await this.plantingModel
      .find({ sold: true }, {}, { skip, limit })
      .select("name sort live ready")
      .populate("user", "name", User.name);

    return new GetPlantingsDto({ plantings });
  }

  async getById(id: string): Promise<GetPlantingDto> {
    const planting = await this.plantingModel
      .findById(id)
      .populate("user", "name", User.name)
      .exec();
    if (!planting) throw new BadRequestException(NO_PLANTING_FOUND);

    const { fertilizers } = await this.treeModel
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

  private getNewArea(planted, count, area) {
    return planted - area * count;
  }
}
