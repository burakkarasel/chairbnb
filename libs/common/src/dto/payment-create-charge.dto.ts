import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { CreateChargeDto } from "./create-charge.dto";

export class PaymentCreateChargeDto extends CreateChargeDto {
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  userId: string;
}
