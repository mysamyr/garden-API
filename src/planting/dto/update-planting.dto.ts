import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdatePlantingDto {
  @IsNumber()
  @IsNotEmpty()
  readonly price: number;
}
