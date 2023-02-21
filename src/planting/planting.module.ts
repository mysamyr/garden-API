import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { PlantingService } from "./planting.service";
import { PlantingController } from "./planting.controller";
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
import { CalcModule } from "../calc/calc.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Area.name, schema: AreaSchema },
      { name: Planting.name, schema: PlantingSchema },
      { name: Price.name, schema: PriceSchema },
      { name: Sort.name, schema: SortSchema },
      { name: User.name, schema: UserSchema },
    ]),
    CalcModule,
  ],
  providers: [PlantingService],
  controllers: [PlantingController],
})
export class PlantingModule {}
