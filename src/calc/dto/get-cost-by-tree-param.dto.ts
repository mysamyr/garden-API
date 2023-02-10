import { IsAlphanumeric, IsNotEmpty } from "class-validator";

export class GetCostByTreeParamDto {
  @IsAlphanumeric()
  @IsNotEmpty({ message: "type can not be empty" })
  readonly type: string;

  @IsAlphanumeric()
  @IsNotEmpty({ message: "sort can not be empty" })
  readonly sort: string;
}

export class CostDto {
  readonly tree: string;
  readonly cost: number;

  constructor(tree) {
    this.tree = tree.tree;
    this.cost = tree.cost;
  }
}
