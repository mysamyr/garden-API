import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";

import { transaction } from "../common/transaction";
import { Price, PriceDocument, Sort, SortDocument } from "../models";
import { QueryPaginationDto } from "../common/dto";
import { CreateSort } from "./dto";

@Injectable()
export class SortService {
  constructor(
    @InjectModel(Price.name) private priceModel: Model<PriceDocument>,
    @InjectModel(Sort.name) private sortModel: Model<SortDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async addSort(addPlantingDto): Promise<any> {
    return transaction(this.connection, async (session) => {
      await this.sortModel.updateOne(
        {
          sort: addPlantingDto.sort,
        },
        new CreateSort(addPlantingDto),
        { upsert: true, session },
      );
      const prices = this.getPricesFromRequest(addPlantingDto);
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

  async getAll(type: string, query: QueryPaginationDto): Promise<any> {
    const { skip, limit } = query;

    const sorts = await this.sortModel.find(
      { name: type },
      {},
      { skip, limit },
    );
    const names = this.getNamesForPrices(sorts);
    const prices = await this.priceModel.find({ name: names });

    return this.attachPricesToSort(sorts, prices);
  }

  private getNamesForPrices(sorts): string[] {
    return sorts.reduce((acc, sort) => {
      acc.push(sort.sort);
      sort.fertilizers.forEach((fertilizer) => {
        acc.push(fertilizer.name);
      });
      return acc;
    }, []);
  }

  private attachPricesToSort(sorts, prices): object[] {
    const pricesObject: object = prices.reduce((acc, price) => {
      acc[price.name] = price.price;
      return acc;
    }, {});
    return sorts.reduce((acc, sort) => {
      const price = pricesObject[sort.name];
      const fertilizers = sort.fertilizers.map((fertilizer) => ({
        name: fertilizer.name,
        month: fertilizer.month,
        price: pricesObject[fertilizer.name],
      }));
      acc.push({
        name: sort.name,
        sort: sort.sort,
        price,
        fertilizers,
      });
      return acc;
    }, []);
  }

  private getPricesFromRequest(sort) {
    // prevent duplications
    const fertilizerPrices: object = sort.fertilizers.reduce((acc, f) => {
      if (!acc[f.name]) {
        acc[f.name] = {
          name: f.name,
          price: f.price,
        };
      }
      return acc;
    }, {});
    return [
      { name: sort.sort, price: sort.price },
      ...Object.values(fertilizerPrices),
    ];
  }
}
