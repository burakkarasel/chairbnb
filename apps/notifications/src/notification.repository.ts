import { AbstractRepository } from "@app/common";
import { Notification } from "./model";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export class NotificationRepository extends AbstractRepository<Notification> {
  protected logger: Logger = new Logger();
  constructor(
    @InjectRepository(Notification)
    notificationRepository: Repository<Notification>,
    entityManager: EntityManager,
  ) {
    super(notificationRepository, entityManager);
  }
}
