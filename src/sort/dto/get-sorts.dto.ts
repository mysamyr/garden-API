import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from "class-validator";
import { QueryPaginationDto } from "../../common/dto";
import { Fertilizer } from "./add-sort.dto";
import { StringOrUndefined } from "../../common/types";

export class GetSortsTypeDto extends QueryPaginationDto {
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

export class GetSortFilterDto {
  name?: StringOrUndefined;
  active: boolean;
  constructor(params) {
    if (params.type) {
      this.name = params.type;
    }
    this.active = !params.isDisabled;
  }
}
