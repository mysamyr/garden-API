import { IsAlphanumeric, IsNotEmpty } from "class-validator";

export class GetByAreaParamDto {
  @IsAlphanumeric()
  @IsNotEmpty({ message: "amount can not be empty" })
  readonly area: number;

  @IsAlphanumeric()
  @IsNotEmpty({ message: "sort can not be empty" })
  readonly type: string;
}
