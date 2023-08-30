import { User } from "@app/common";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class PushEmailNotificationDto {
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  text: string;
  @IsNotEmpty()
  user: User;
}
