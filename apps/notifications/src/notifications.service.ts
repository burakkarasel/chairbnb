import { Injectable } from "@nestjs/common";
import { PushEmailNotificationDto } from "./dto";
import { ConfigService } from "@nestjs/config";
import { NotificationRepository } from "./notification.repository";
import { EmailTypes } from "@app/common";
import { Notification } from "@app/common";

@Injectable()
export class NotificationsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly notificationRepository: NotificationRepository,
  ) {}
  /*private readonly transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAUTH2",
      user: this.configService.getOrThrow("SMTP_USER"),
      clientId: this.configService.getOrThrow("GOOGLE_OAUTH_CLIENT_ID"),
      clientSecret: this.configService.getOrThrow("GOOGLE_OAUTH_CLIENT_SECRET"),
      refreshToken: this.configService.getOrThrow("GOOGLE_OAUTH_REFRESH_TOKEN"),
    },
  });*/
  async pushEmailNotification({ email, text, user }: PushEmailNotificationDto) {
    const subject = "Chairbnb New Reservation";
    const notificationToCreate = new Notification({
      text,
      user,
      to: email,
      type: EmailTypes.INFORMAL_EMAIL,
      subject,
    });
    await this.notificationRepository.create(notificationToCreate);
    /*await this.transporter.sendMail({
      from: this.configService.getOrThrow("SMTP_USER"),
      to: email,
      subject,
      text,
    });*/
  }
}
