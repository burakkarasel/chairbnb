import { IsCreditCard, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CardDto {
  @IsString()
  @IsNotEmpty()
  cvc: string;
  @IsNumber()
  @IsNotEmpty()
  expMonth: number;
  @IsNumber()
  @IsNotEmpty()
  expYear: number;
  @IsCreditCard()
  number: string;
}
