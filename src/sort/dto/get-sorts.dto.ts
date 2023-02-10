import { IsNotEmpty, IsString } from "class-validator";

export class getSortsDto {
  @IsString()
  @IsNotEmpty()
  readonly type: string;
}
