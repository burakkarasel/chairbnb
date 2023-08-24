import { Controller, UsePipes, ValidationPipe } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { EventPattern, Payload } from "@nestjs/microservices";
import { PushEmailNotificationDto } from "./dto";

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
  @UsePipes(new ValidationPipe())
  @EventPattern("pushEmailNotification")
  async pushNotification(@Payload() data: PushEmailNotificationDto) {
    return this.notificationsService.pushEmailNotification(data);
  }
}
