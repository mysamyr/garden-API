import { IsNotEmpty, IsString } from "class-validator";

export class GetSortsTypeDto {
  @IsString()
  @IsNotEmpty()
  readonly type: string;
}
