import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RoleDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;
}
