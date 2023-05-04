import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type AuditDocument = Audit & Document;

@Schema()
export class Audit {
  @Prop({ required: true })
  entity: string;

  @Prop({ required: true })
  entity_id: Types.ObjectId;

  @Prop({ required: true })
  actions: object[];
}

export const AuditSchema = SchemaFactory.createForClass(Audit);
