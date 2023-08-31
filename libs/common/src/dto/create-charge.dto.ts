import {
  IsNotEmptyObject,
  IsDefined,
  ValidateNested,
  IsNumber,
  IsNotEmpty,
} from "class-validator";
import { CardDto } from "./card.dto";
import { Type } from "class-transformer";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateChargeDto {
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CardDto)
  @Field(() => CardDto)
  card: CardDto;
  @IsNumber()
  @IsNotEmpty()
  @Field()
  amount: number;
}
