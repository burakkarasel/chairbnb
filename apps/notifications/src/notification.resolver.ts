import { Query, Resolver } from "@nestjs/graphql";
import { NotificationsService } from "./notifications.service";
import { CurrentUser, Notification, User } from "@app/common";

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationsService) {}

  @Query(() => [Notification], { name: "notifications" })
  listNotifications(@CurrentUser() user: User) {
    return this.notificationService.listNotifications(user);
  }
}
