import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsNumber,
  Length,
  IsMongoId,
} from "class-validator";

export class AddPlantingDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly name: string;
  @IsMongoId()
  @IsNotEmpty()
  readonly sort: string;
  @IsNumber()
  @IsNotEmpty()
  readonly count: number;
  @IsNumber()
  @IsNotEmpty()
  readonly price: number;
  @IsNumber()
  @IsNotEmpty()
  readonly cost: number;
  @IsString()
  @Length(10)
  @IsNotEmpty()
  readonly date: string;
}

export class CreateNewPlantingDto {
  readonly name: string;
  readonly sort: string;
  readonly planted: number;
  readonly price: number;
  readonly cost: number;
  readonly date: string;
  readonly live: number;
  readonly user: string;

  constructor(param) {
    this.name = param.name;
    this.sort = param.sort;
    this.planted = param.count;
    this.price = param.price;
    this.cost = param.cost;
    this.date = param.date;
    this.live = param.count;
    this.user = param.user;
  }
}

export class PlantingWithUserDto extends AddPlantingDto {
  readonly user: string;
}
