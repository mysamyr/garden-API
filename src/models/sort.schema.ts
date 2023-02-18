import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type SortDocument = Sort & Document;

@Schema()
export class Sort {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  sort: string;

  @Prop({ required: true, default: true })
  active: boolean;

  @Prop({ required: true, default: [] })
  fertilizers: { name: string; month: number }[];
}

export const SortSchema = SchemaFactory.createForClass(Sort);
