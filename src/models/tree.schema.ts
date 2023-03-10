import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type TreeDocument = Tree & Document;

@Schema()
export class Tree {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  sort: string;

  @Prop({ required: true })
  fertilizers: { name: string; month: number }[];
}

export const TreeSchema = SchemaFactory.createForClass(Tree);
