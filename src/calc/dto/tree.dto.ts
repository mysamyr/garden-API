export class TreeDto {
  readonly name: string;
  readonly sort: string;
  readonly fertilizers: { name: string; month: number }[];

  constructor(tree) {
    this.name = tree.name;
    this.sort = tree.sort;
    this.fertilizers = tree.fertilizers;
  }
}