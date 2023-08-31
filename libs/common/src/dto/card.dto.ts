import { Field, InputType } from "@nestjs/graphql";
import { IsCreditCard, IsNotEmpty, IsNumber, IsString } from "class-validator";

@InputType()
export class CardDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  cvc: string;
  @IsNumber()
  @IsNotEmpty()
  @Field()
  expMonth: number;
  @IsNumber()
  @IsNotEmpty()
  @Field()
  expYear: number;
  @Field()
  @IsCreditCard()
  number: string;
}
