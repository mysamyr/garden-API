import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import {
  NO_PRICE_FOUND,
  NO_PRICE_ID_FOUND,
} from "../common/constants/error-messages";
import { UpdatePriceDto } from "./dto";
import { Price, PriceDocument } from "../models";

@Injectable()
export class PricesService {
  constructor(
    @InjectModel(Price.name)
    private priceModel: Model<PriceDocument>,
  ) {}

  async updatePrice(
    priceId: string,
    updatePriceDto: UpdatePriceDto,
  ): Promise<PriceDocument> {
    const price = await this.priceModel.findByIdAndUpdate(
      priceId,
      updatePriceDto,
      { new: true },
    );

    if (!price) {
      throw new BadRequestException(NO_PRICE_ID_FOUND);
    }

    return price;
  }

  async getAllPrices({ skip, limit }): Promise<PriceDocument[]> {
    const prices = await this.priceModel.find().skip(skip).limit(limit);

    if (!prices || prices.length === 0) {
      throw new BadRequestException(NO_PRICE_FOUND);
    }

    return prices;
  }
}
