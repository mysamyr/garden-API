import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { AREA } from "../common/enums";

export type AreaDocument = Area & Document;

@Schema()
export class Area {
  @Prop({ required: true, default: AREA })
  name: string;

  @Prop({ required: true })
  totalArea: number;

  @Prop({ required: true })
  plantedArea: number;
}

export const AreaSchema = SchemaFactory.createForClass(Area);
