import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Model, Connection } from "mongoose";

import {
  ALREADY_EXISTS,
  INCORRECT_FERTILIZERS_COUNT,
  NO_SORT_FOUND,
} from "../common/constants/error-messages";
import { TreeEntity } from "../common/entities";
import { transaction } from "../common/transaction";
import { QueryPaginationDto } from "../common/dto";
import {
  AddSortDto,
  CheckSortDto,
  CreateSort,
  Fertilizer,
  GetSortsDto,
  PriceDto,
  UpdateSortDto,
} from "./dto";
import {
  Planting,
  PlantingDocument,
  Price,
  PriceDocument,
  Sort,
  SortDocument,
} from "../models";
import { GetSortFilterDto } from "./dto/get-sorts.dto";
import { StringOrUndefined } from "../common/types";
import { UpdateSortParamsDto } from "./dto/update-sort.dto";

@Injectable()
export class SortService {
  constructor(
    @InjectModel(Planting.name) private plantingModel: Model<PlantingDocument>,
    @InjectModel(Price.name) private priceModel: Model<PriceDocument>,
    @InjectModel(Sort.name) private sortModel: Model<SortDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async addSort(addPlantingDto: AddSortDto): Promise<any> {
    return transaction(this.connection, async (session) => {
      const tree: TreeEntity = new TreeEntity(addPlantingDto.name);
      if (addPlantingDto.fertilizers.length !== tree.fertilizersCount)
        throw new BadRequestException(INCORRECT_FERTILIZERS_COUNT);

      const isSortExist: SortDocument = await this.sortModel.findOne(
        {
          sort: addPlantingDto.sort,
        },
        {},
        { session },
      );
      if (isSortExist) throw new BadRequestException(ALREADY_EXISTS);

      await this.sortModel.create([new CreateSort(addPlantingDto)], {
        session,
      });
      const prices = this.getPricesForSort(addPlantingDto);
      await this.priceModel.bulkWrite(
        prices.map((price) => ({
          updateOne: {
            filter: { name: price.name },
            update: price,
            upsert: true,
          },
        })),
        { session },
      );
    });
  }

  async getAll(
    query: QueryPaginationDto,
    type: StringOrUndefined,
    isDisabled = false,
  ): Promise<GetSortsDto[]> {
    const { skip, limit } = query;

    const filter: GetSortFilterDto = this.getFindSortFilter(type, isDisabled);
    const sorts: SortDocument[] = await this.sortModel
      .find(filter)
      .skip(skip)
      .limit(limit);
    const names = this.getNamesForPrices(sorts);
    const prices: PriceDocument[] = await this.priceModel.find({ name: names });

    return this.attachPricesToSort(sorts, prices);
  }

  async updateSort(id: string, updateSortDto: UpdateSortDto): Promise<any> {
    const { fertilizers, name } = updateSortDto;
    return transaction(this.connection, async (session) => {
      const sort = await this.sortModel.findById(id).session(session);
      if (!sort) throw new BadRequestException(NO_SORT_FOUND);

      if (fertilizers) {
        const tree: TreeEntity = new TreeEntity(sort.name);
        if (fertilizers.length !== tree.fertilizersCount)
          throw new BadRequestException(INCORRECT_FERTILIZERS_COUNT);

        const prices: PriceDto[] = this.getPricesForFertilizers(fertilizers);
        await this.priceModel.bulkWrite(
          prices.map((price) => ({
            updateOne: {
              filter: { name: price.name },
              update: price,
              upsert: true,
            },
          })),
          { session },
        );
      }
      if (name) {
        // update sort name for price too
        await this.priceModel.updateOne(
          { name: sort.sort },
          { name },
          { session },
        );
      }

      const updateParams: UpdateSortParamsDto = new UpdateSortParamsDto(updateSortDto);
      await this.sortModel.updateOne({ _id: id }, updateParams, { session });
    });
  }

  async checkUsageForSort(id: string): Promise<CheckSortDto> {
    const plantings: number = await this.plantingModel
      .find({ sort: id })
      .count();

    const used = !!plantings;
    return new CheckSortDto(used);
  }

  private getNamesForPrices(sorts: SortDocument[]): string[] {
    return sorts.reduce((acc, sort) => {
      acc.push(sort.sort);
      sort.fertilizers.forEach((fertilizer) => {
        acc.push(fertilizer.name);
      });
      return acc;
    }, []);
  }

  private attachPricesToSort(
    sorts: SortDocument[],
    prices: PriceDocument[],
  ): GetSortsDto[] {
    const pricesObject: object = prices.reduce((acc, p) => {
      acc[p.name] = p.price;
      return acc;
    }, {});
    return sorts.reduce((acc, sort) => {
      const price = pricesObject[sort.sort];
      const fertilizers = sort.fertilizers.map((fertilizer) => ({
        name: fertilizer.name,
        month: fertilizer.month,
        price: pricesObject[fertilizer.name],
      }));
      acc.push({
        id: sort._id,
        name: sort.name,
        sort: sort.sort,
        price,
        fertilizers,
      });
      return acc;
    }, []);
  }

  private getPricesForSort(sort: AddSortDto): PriceDto[] {
    // prevent duplications
    const fertilizerPrices: PriceDto[] = this.getPricesForFertilizers(
      sort.fertilizers,
    );
    return [{ name: sort.sort, price: sort.price }, ...fertilizerPrices];
  }

  private getPricesForFertilizers(fertilizers: Fertilizer[]): PriceDto[] {
    const fertilizerPrices: object = fertilizers.reduce((acc, f) => {
      if (!acc[f.name]) {
        acc[f.name] = {
          name: f.name,
          price: f.price,
        };
      }
      return acc;
    }, {});
    return Object.values(fertilizerPrices);
  }

  private getFindSortFilter(
    type: StringOrUndefined,
    isDisabled: boolean,
  ): GetSortFilterDto {
    const filter: { name?: string; active: boolean } = {
      active: !isDisabled,
    };
    if (type) filter.name = type;
    return filter;
  }
}
