import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";
import {
  DatabaseModule,
  Invoice,
  Reservation,
  Role,
  Notification,
} from "@app/common";
import { User } from "@app/common";
import { LoggerModule } from "@app/common/logger";
import { UserResolver } from "./user.resolver";

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([User, Role, Notification, Reservation, Invoice]),
    LoggerModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserResolver],
  exports: [UserService],
})
export class UserModule {}
