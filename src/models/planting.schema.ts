import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId } from "mongoose";

export type PlantingDocument = Planting & Document;

@Schema()
export class Planting {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  sort: string;

  @Prop({ required: true })
  planted: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  cost: number;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  live: string;

  @Prop({ required: true, default: false })
  ready: boolean;

  @Prop({ required: true, default: false })
  sold: boolean;

  @Prop({ required: true })
  actions: { action: string; date: string }[];

  @Prop({ required: true })
  user: ObjectId;
}

export const PlantingSchema = SchemaFactory.createForClass(Planting);
