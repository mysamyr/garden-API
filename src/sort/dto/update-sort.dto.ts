import { ArrayMinSize, IsArray } from "class-validator";
import { Fertilizer } from "./add-sort.dto";

export class UpdateSortDto {
  @IsArray()
  @ArrayMinSize(4)
  readonly fertilizers: Fertilizer[];
}
