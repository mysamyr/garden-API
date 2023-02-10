import { IsAlphanumeric, IsNotEmpty } from "class-validator";

export class GetByProfitParamDto {
  @IsAlphanumeric()
  @IsNotEmpty({ message: "profit can not be empty" })
  readonly profit: number;

  @IsAlphanumeric()
  @IsNotEmpty({ message: "sort can not be empty" })
  readonly sort: string;
}
