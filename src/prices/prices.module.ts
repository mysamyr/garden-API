import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { PricesController } from "./prices.controller";
import { PricesService } from "./prices.service";
import { Audit, AuditSchema, Price, PriceSchema } from "../models";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Audit.name, schema: AuditSchema },
      { name: Price.name, schema: PriceSchema },
    ]),
  ],
  controllers: [PricesController],
  providers: [PricesService],
})
export class PricesModule {}
