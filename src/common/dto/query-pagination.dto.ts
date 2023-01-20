import { IsNumber } from "class-validator";

export class QueryPaginationDto {
  @IsNumber()
  readonly skip: number;
  @IsNumber()
  readonly limit: number;

  constructor(query) {
    this.skip = +query?.skip || 0;
    this.limit = +query?.limit || 10;
  }
}
