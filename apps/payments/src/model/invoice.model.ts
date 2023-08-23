import { AbstractDocument } from "@app/common";
import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";

@Schema({ versionKey: false })
export class InvoiceDocument extends AbstractDocument {
  @Prop()
  lastFour: string;
  @Prop()
  amount: number;
  @Prop()
  timestamp: Date;
  @Prop()
  stripeId: string;
}

export const InvoiceSchema = SchemaFactory.createForClass(InvoiceDocument);
