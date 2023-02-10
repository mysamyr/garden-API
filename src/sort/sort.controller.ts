import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  // UseGuards,
} from "@nestjs/common";
// import {AuthGuard} from "@nestjs/passport";

import { SortService } from "./sort.service";
import { CreatePaginationDto, QueryPaginationDto } from "../common/dto";
import { AddSortDto, getSortsDto } from "./dto";

// @UseGuards(AuthGuard("jwt"))
@Controller("sort")
export class SortController {
  constructor(private readonly sortService: SortService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  plant(@Body() addSortDto: AddSortDto): Promise<any> {
    return this.sortService.addSort(addSortDto);
  }
  @Get(":type")
  @HttpCode(HttpStatus.OK)
  getAllPlantings(
    @Param() param: getSortsDto,
    @Query() query: QueryPaginationDto,
  ): Promise<any> {
    const type: string = param.type;
    const paginationParams = new CreatePaginationDto(query);

    return this.sortService.getAll(type, paginationParams);
  }
}
