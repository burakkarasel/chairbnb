import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ versionKey: false })
export class NotificationDocument extends AbstractDocument {
  @Prop()
  to: string;
  @Prop()
  text: string;
  @Prop()
  userId: string;
  @Prop()
  timestamp: Date;
  @Prop()
  type: string;
  @Prop()
  subject: string;
}

export const NotificationSchema =
  SchemaFactory.createForClass(NotificationDocument);
