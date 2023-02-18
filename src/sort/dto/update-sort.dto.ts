import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
} from "class-validator";
import { Fertilizer } from "./add-sort.dto";

export class UpdateSortDto {
  @IsString()
  @IsOptional()
  readonly name?: string;
  @IsBoolean()
  @IsOptional()
  readonly active?: boolean;
  @IsArray()
  @IsOptional()
  @ArrayMinSize(4)
  readonly fertilizers: Fertilizer[];
}

export class UpdateSortParamsDto {
  sort?: string;
  active?: boolean;
  fertilizers?: Fertilizer[];
  constructor(params: UpdateSortDto) {
    if (params.name) {
      this.sort = params.name;
    }
    if (params.hasOwnProperty("active")) {
      this.active = params.active;
    }
    if (params.fertilizers) {
      this.fertilizers = params.fertilizers;
    }
  }
}
