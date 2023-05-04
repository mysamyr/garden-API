import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";

import {
  NO_PRICE_FOUND,
  NO_PRICE_ID_FOUND,
} from "../common/constants/error-messages";
import { UpdatePriceDto, GetPricesDto } from "./dto";
import { Audit, AuditDocument, Price, PriceDocument } from "../models";
import { transaction } from "../common/transaction";
import { AUDIT_ENTITIES } from "../common/enums";
import { GetUserDto } from "../auth/dto";

@Injectable()
export class PricesService {
  constructor(
    @InjectModel(Price.name) private priceModel: Model<PriceDocument>,
    @InjectModel(Audit.name) private auditModel: Model<AuditDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async updatePrice(
    priceId: string,
    updatePriceDto: UpdatePriceDto,
    user: GetUserDto,
  ): Promise<any> {
    await transaction(this.connection, async (session) => {
      const price: PriceDocument = await this.priceModel.findByIdAndUpdate(
        priceId,
        updatePriceDto,
        { new: false, session },
      );

      if (!price) {
        throw new BadRequestException(NO_PRICE_ID_FOUND);
      }

      await this.auditModel.updateOne(
        { entity: AUDIT_ENTITIES.PRICE, entity_id: priceId },
        {
          $push: {
            actions: {
              changes: [
                {
                  field: "price",
                  prev: price.price,
                  next: updatePriceDto.price,
                },
              ],
              datetime: Date.now(),
              user: user.id,
            },
          },
        },
        { upsert: true, session },
      );
    });
  }

  async getAllPrices({ skip, limit }): Promise<GetPricesDto[]> {
    const prices: PriceDocument[] = await this.priceModel
      .find()
      .skip(skip)
      .limit(limit);

    if (!prices || !prices.length) {
      throw new BadRequestException(NO_PRICE_FOUND);
    }

    return prices.map((price) => new GetPricesDto(price));
  }
}
