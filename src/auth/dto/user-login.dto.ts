import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsStrongPassword,
} from "class-validator";

export class SignInUserDto {
  @IsString()
  @IsNotEmpty()
  readonly email: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @IsStrongPassword()
  readonly password: string;
}

export class SignInTokenDto {
  readonly accessToken: string;
}
