import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsStrongPassword,
  IsMobilePhone,
} from "class-validator";

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @IsStrongPassword()
  readonly password: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @IsStrongPassword()
  readonly newPassword: string;
}

export class ChangePhoneDto {
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
