import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { GeneratorService } from "./generator.service";
import { GeneratorController } from "./generator.controller";
import {
  Area,
  AreaSchema,
  Planting,
  PlantingSchema,
  Price,
  PriceSchema,
  Tree,
  TreeSchema,
  User,
  UserSchema,
} from "../models";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Area.name, schema: AreaSchema },
      { name: Planting.name, schema: PlantingSchema },
      { name: Price.name, schema: PriceSchema },
      { name: Tree.name, schema: TreeSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [GeneratorService],
  controllers: [GeneratorController],
})
export class GeneratorModule {}
