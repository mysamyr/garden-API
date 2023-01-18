import { IsNotEmpty, IsString, Length, IsAlphanumeric } from "class-validator";

export class ObjectIdParamDto {
  @IsString()
  @IsAlphanumeric()
  @Length(24, 24, { message: "Id must be 24 characters long" })
  @IsNotEmpty({ message: "Id can not be empty" })
  readonly id: string;
}
