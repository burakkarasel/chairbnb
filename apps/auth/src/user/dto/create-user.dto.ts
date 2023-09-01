import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
  ValidateNested,
} from "class-validator";
import { RoleDto } from "./role.dto";
import { Type } from "class-transformer";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @Field()
  email: string;
  @IsNotEmpty()
  @IsStrongPassword()
  @Field()
  password: string;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => RoleDto)
  @Field(() => RoleDto, { nullable: true })
  roles?: RoleDto[];
}
