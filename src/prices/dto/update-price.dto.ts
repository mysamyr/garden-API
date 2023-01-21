import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class UpdatePriceDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly name: string;
  @IsNumber()
  @IsNotEmpty()
  readonly price: number;
}
