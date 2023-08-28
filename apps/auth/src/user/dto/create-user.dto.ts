import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from "class-validator";

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  roles?: string[];
}
