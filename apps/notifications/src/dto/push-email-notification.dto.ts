import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class PushEmailNotificationDto {
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  text: string;
}
