import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from "class-validator";
import { ACTIONS } from "../../common/enums";

export class AddActionDto {
  @IsEnum(ACTIONS)
  readonly action: string;
  @IsString()
  @Length(10)
  @IsNotEmpty()
  readonly date: string;
  @IsString()
  @MaxLength(30)
  @IsOptional()
  @IsNotEmpty()
  readonly name?: string;
  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  @IsOptional()
  readonly amount?: number;
}
