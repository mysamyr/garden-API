import { IsNotEmpty, IsMongoId } from "class-validator";

export class ObjectIdParamDto {
  @IsMongoId()
  @IsNotEmpty({ message: "Id can not be empty" })
  readonly id: string;
}
