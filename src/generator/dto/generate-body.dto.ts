import {
  IsNumber,
  IsOptional,
  IsBoolean,
  IsObject,
  ValidateNested,
  IsNotEmptyObject,
  IsNotEmpty,
  IsArray,
  IsString,
  IsEmail,
  IsPhoneNumber,
  MaxLength,
} from "class-validator";
import { Type } from "class-transformer";

class UserDto {
  @IsString()
  @MaxLength(30)
  readonly name: string;
  @IsString()
  @IsEmail()
  readonly email: string;
  @IsString()
  @IsPhoneNumber()
  readonly phone: string;
}

class CategoryDto {
  @IsNumber()
  @IsNotEmpty()
  readonly count: number;
  @IsArray()
  @Type(() => UserDto)
  readonly data: UserDto[];
}

export class GenerateBodyDto {
  @IsBoolean()
  @IsOptional()
  readonly truncate: boolean;
  @IsNumber()
  @IsOptional()
  readonly totalArea: string;
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CategoryDto)
  readonly users: string;
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CategoryDto)
  readonly trees: string;
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CategoryDto)
  readonly plantings: string;
  @IsObject()
  readonly prices: string;
}
