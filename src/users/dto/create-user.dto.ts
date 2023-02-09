import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsMobilePhone,
  IsStrongPassword,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly name: string;
  @IsString()
  @IsNotEmpty()
  readonly email: string;
  @IsString()
  @IsNotEmpty()
  @IsMobilePhone()
  readonly phone: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @IsStrongPassword()
  readonly password: string;
}
