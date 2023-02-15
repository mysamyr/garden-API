import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from "class-validator";
import { Fertilizer } from "./add-sort.dto";

export class GetSortsTypeDto {
  @IsString()
  @IsNotEmpty()
  readonly type: string;
}

export class GetSortsDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;
  @IsString()
  @IsNotEmpty()
  readonly name: string;
  @IsString()
  @IsNotEmpty()
  readonly sort: string;
  @IsArray()
  @ArrayMinSize(4)
  readonly fertilizers: Fertilizer[];
  @IsNumber()
  readonly price: number;
}
