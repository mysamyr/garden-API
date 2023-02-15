import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdatePriceDto {
  @IsNumber()
  @IsNotEmpty()
  readonly price: number;
}
