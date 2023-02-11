export class FertilizerDto {
  readonly name: string;
  readonly month: number;
}

export class SortDto {
  readonly id: string;
  readonly name: string;
  readonly sort: string;
  readonly fertilizers: FertilizerDto[];
}
