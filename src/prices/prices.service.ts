import { Injectable, NotFoundException } from "@nestjs/common";

import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

import { Price } from "../models/price.schema";
import { IPrice } from "../interfaces/price.interface";
import { UpdatePriceDto } from "./dto/update-price.dto";

@Injectable()
export class PricesService {
  constructor(
    @InjectModel(Price.name)
    private priceModel: Model<IPrice>,
  ) {}

  async updatePrice(
    priceId: string,
    updatePriceDto: UpdatePriceDto,
  ): Promise<IPrice> {
    const price = await this.priceModel.findByIdAndUpdate(
      priceId,
      updatePriceDto,
      { new: true },
    );

    if (!price) {
      throw new NotFoundException(`Price ${priceId} is not found`);
    }

    return price;
  }

  async getAllPrices(skip = 0, limit = 10): Promise<IPrice[]> {
    const prices = await this.priceModel.find().skip(skip).limit(limit);

    if (!prices || prices.length === 0) {
      throw new NotFoundException("There is no prices data");
    }

    return prices;
  }
}
