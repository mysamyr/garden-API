import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from "class-validator";

class Fertilizer {
  @IsString()
  readonly name: string;
  @IsNumber()
  @Min(0)
  readonly month: number;
  @IsNumber()
  @Min(0)
  readonly price: number;
}

export class AddSortDto {
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

export class CreateSort {
  readonly name: string;
  readonly sort: string;
  readonly fertilizers: object[];

  constructor(sort) {
    this.name = sort.name;
    this.sort = sort.sort;
    this.fertilizers = sort.fertilizers.map((i) => ({
      name: i.name,
      month: i.month,
    }));
  }
}
