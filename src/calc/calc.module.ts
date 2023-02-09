import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Tree, TreeSchema, Price, PriceSchema, Area, AreaSchema } from "src/models";
import { CalcController } from "./calc.controller";
import { CalcService } from "./calc.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tree.name, schema: TreeSchema },
      { name: Price.name, schema: PriceSchema },
      { name: Area.name, schema: AreaSchema },
    ]),
  ],
  providers: [CalcService],
  controllers: [CalcController],
})
export class CalcModule { }
