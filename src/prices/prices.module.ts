import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { PricesController } from "./prices.controller";
import { PricesService } from "./prices.service";
import { Price, PriceSchema } from "../models";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Price.name, schema: PriceSchema }]),
  ],
  controllers: [PricesController],
  providers: [PricesService],
})
export class PricesModule {}
