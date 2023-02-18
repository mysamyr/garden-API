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
import { CreatePaginationDto, ObjectIdParamDto } from "../common/dto";
import {
  AddSortDto,
  CheckSortDto,
  GetSortsDto,
  GetSortsTypeDto,
  UpdateSortDto,
} from "./dto";
import { StringOrUndefined } from "../common/types";

@UseGuards(AuthGuard("jwt"))
@Controller("sort")
export class SortController {
  constructor(private readonly sortService: SortService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  addSort(@Body() addSortDto: AddSortDto): Promise<any> {
    return this.sortService.addSort(addSortDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getSorts(@Query() query: GetSortsTypeDto): Promise<GetSortsDto[]> {
    const type: StringOrUndefined = query.type;
    const paginationParams = new CreatePaginationDto(query);

    return this.sortService.getAll(paginationParams, type);
  }

  @Put(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  updateSort(
    @Param() param: ObjectIdParamDto,
    @Body() updateSortDto: UpdateSortDto,
  ): Promise<AddSortDto[]> {
    return this.sortService.updateSort(param.id, updateSortDto);
  }

  @Get("disabled")
  @HttpCode(HttpStatus.OK)
  getDisabledSorts(@Query() query: GetSortsTypeDto): Promise<GetSortsDto[]> {
    const type: StringOrUndefined = query.type;
    const paginationParams = new CreatePaginationDto(query);

    return this.sortService.getAll(paginationParams, type, true);
  }

  @Get(":id/in-use")
  @HttpCode(HttpStatus.OK)
  checkIfSortInUse(@Param() param: ObjectIdParamDto): Promise<CheckSortDto> {
    const { id } = param;

    return this.sortService.checkUsageForSort(id);
  }
}
