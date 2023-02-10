import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { SortService } from "./sort.service";
import {
  Area,
  AreaSchema,
  Planting,
  PlantingSchema,
  Price,
  PriceSchema,
  Sort,
  SortSchema,
  User,
  UserSchema,
} from "../models";
import { SortController } from "./sort.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Area.name, schema: AreaSchema },
      { name: Planting.name, schema: PlantingSchema },
      { name: Price.name, schema: PriceSchema },
      { name: Sort.name, schema: SortSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [SortService],
  controllers: [SortController],
})
export class SortModule {}
