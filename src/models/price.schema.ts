import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type PriceDocument = Price & Document;

@Schema()
export class Price {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;
}

export const PriceSchema = SchemaFactory.createForClass(Price);
