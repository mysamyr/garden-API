import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { SortService } from "./sort.service";
import {
  CreatePaginationDto,
  ObjectIdParamDto,
  QueryPaginationDto,
} from "../common/dto";
import { AddSortDto, GetSortsDto, GetSortsTypeDto, UpdateSortDto } from "./dto";

@UseGuards(AuthGuard("jwt"))
@Controller("sort")
export class SortController {
  constructor(private readonly sortService: SortService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  addSort(@Body() addSortDto: AddSortDto): Promise<any> {
    return this.sortService.addSort(addSortDto);
  }
  @Get(":type")
  @HttpCode(HttpStatus.OK)
  getSorts(
    @Param() param: GetSortsTypeDto,
    @Query() query: QueryPaginationDto,
  ): Promise<GetSortsDto[]> {
    const type: string = param.type;
    const paginationParams = new CreatePaginationDto(query);

    return this.sortService.getAll(type, paginationParams);
  }
  @Put(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  updateSort(
    @Param() param: ObjectIdParamDto,
    @Body() updateSortDto: UpdateSortDto,
  ): Promise<AddSortDto[]> {
    return this.sortService.updateSort(param.id, updateSortDto.fertilizers);
  }
}
