import { AbstractRepository } from "@app/common";
import { InjectModel } from "@nestjs/mongoose";
import { NotificationDocument } from "./model";
import { Model } from "mongoose";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class NotificationRepository extends AbstractRepository<NotificationDocument> {
  protected logger: Logger = new Logger();
  constructor(
    @InjectModel(NotificationDocument.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {
    super(notificationModel);
  }
}
