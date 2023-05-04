import {
  Body,
  Controller,
  Get,
  Put,
  HttpStatus,
  Param,
  Query,
  HttpCode,
  UseGuards,
  Req,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { PricesService } from "./prices.service";
import {
  QueryPaginationDto,
  ObjectIdParamDto,
  CreatePaginationDto,
} from "../common/dto";
import { GetPricesDto, UpdatePriceDto } from "./dto";
import { GetUserDto } from "../auth/dto";

@UseGuards(AuthGuard("jwt"))
@Controller("price")
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Put(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePrice(
    @Param() param: ObjectIdParamDto,
    @Body() updatePriceDto: UpdatePriceDto,
    @Req() req,
  ): Promise<any> {
    const user: GetUserDto = req.user;
    return await this.pricesService.updatePrice(param.id, updatePriceDto, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getPrices(@Query() query: QueryPaginationDto): Promise<GetPricesDto[]> {
    const paginationParams = new CreatePaginationDto(query);

    return await this.pricesService.getAllPrices(paginationParams);
  }
}
