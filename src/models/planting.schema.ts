import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { User } from "./user.schema";

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
  live: number;

  @Prop({ required: true, default: false })
  ready: boolean;

  @Prop({ required: true, default: false })
  sold: boolean;

  @Prop({ required: true, default: [] })
  actions: { action: string; name?: string; date: string }[];

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: User;
}

export const PlantingSchema = SchemaFactory.createForClass(Planting);
