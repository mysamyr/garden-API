import { IsAlphanumeric, IsOptional } from "class-validator";

export class QueryPaginationDto {
  @IsOptional()
  @IsAlphanumeric()
  readonly skip: number;
  @IsOptional()
  @IsAlphanumeric()
  readonly limit: number;
}

export class CreatePaginationDto {
  readonly skip: number;
  readonly limit: number;

  constructor(query) {
    this.skip = +query?.skip || 0;
    this.limit = +query?.limit || 10;
  }
}
