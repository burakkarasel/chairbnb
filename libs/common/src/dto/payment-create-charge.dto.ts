import { IsEmail, IsNotEmpty } from "class-validator";
import { CreateChargeDto } from "./create-charge.dto";
import { User } from "@app/common";

export class PaymentCreateChargeDto extends CreateChargeDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  user: User;
}
