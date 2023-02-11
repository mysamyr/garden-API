import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import {
  NO_PRICE_FOUND,
  NO_PRICE_ID_FOUND,
} from "../common/constants/error-messages";
import { UpdatePriceDto, GetPricesDto } from "./dto";
import { Price, PriceDocument } from "../models";

@Injectable()
export class PricesService {
  constructor(
    @InjectModel(Price.name) private priceModel: Model<PriceDocument>,
  ) {}

  async updatePrice(
    priceId: string,
    updatePriceDto: UpdatePriceDto,
  ): Promise<any> {
    const price: PriceDocument = await this.priceModel.findByIdAndUpdate(
      priceId,
      updatePriceDto,
      { new: true },
    );

    if (!price) {
      throw new BadRequestException(NO_PRICE_ID_FOUND);
    }
  }

  async getAllPrices({ skip, limit }): Promise<GetPricesDto[]> {
    const prices: PriceDocument[] = await this.priceModel.find(
      {},
      {},
      { skip, limit },
    );

    if (!prices || !prices.length) {
      throw new BadRequestException(NO_PRICE_FOUND);
    }

    return prices.map((price) => new GetPricesDto(price));
  }
}
