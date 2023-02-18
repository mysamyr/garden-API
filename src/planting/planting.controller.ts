import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { PlantingService } from "./planting.service";
import {
  CreatePaginationDto,
  QueryPaginationDto,
  ObjectIdParamDto,
} from "../common/dto";
import { GetUserDto } from "../auth/dto";
import {
  AddActionPipe,
  AddActionType,
  AddPlantingDto,
  GetPlantingDto,
  GetPlantingsDto,
} from "./dto";

@UseGuards(AuthGuard("jwt"))
@Controller("tree")
export class PlantingController {
  constructor(private readonly plantingService: PlantingService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  plant(@Body() addPlantingDto: AddPlantingDto, @Req() req): Promise<any> {
    const user: GetUserDto = req.user;
    return this.plantingService.plant({ ...addPlantingDto, user: user.id });
  }
  @Put(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  addAction(
    @Param() param: ObjectIdParamDto,
    @Body(new AddActionPipe()) addActionDto: AddActionType,
  ): Promise<any> {
    return this.plantingService.addAction(param.id, addActionDto);
  }
  @Get()
  @HttpCode(HttpStatus.OK)
  getAllPlantings(
    @Query() query: QueryPaginationDto,
  ): Promise<GetPlantingsDto> {
    const paginationParams: CreatePaginationDto = new CreatePaginationDto(
      query,
    );
    return this.plantingService.getPlantings(paginationParams);
  }
  @Get("/sold")
  @HttpCode(HttpStatus.OK)
  getSoldPlantings(
    @Query() query: QueryPaginationDto,
  ): Promise<GetPlantingsDto> {
    const paginationParams: CreatePaginationDto = new CreatePaginationDto(
      query,
    );
    return this.plantingService.getPlantings(paginationParams, true);
  }
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  getPlanting(@Param() param: ObjectIdParamDto): Promise<GetPlantingDto> {
    return this.plantingService.getPlantingById(param.id);
  }
}
