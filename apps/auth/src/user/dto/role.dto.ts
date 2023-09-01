import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

@InputType()
export class RoleDto {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  id?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @Field({ nullable: true })
  name?: string;
}
