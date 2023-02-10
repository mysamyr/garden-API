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
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { PricesService } from "./prices.service";
import { QueryPaginationDto, ObjectIdParamDto } from "../common/dto";
import { UpdatePriceDto } from "./dto";

@UseGuards(AuthGuard("jwt"))
@Controller("price")
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Put(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePrice(
    @Param() param: ObjectIdParamDto,
    @Body() updatePriceDto: UpdatePriceDto,
  ) {
    return await this.pricesService.updatePrice(param.id, updatePriceDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getPrices(@Query() queryPaginationDto: QueryPaginationDto) {
    return await this.pricesService.getAllPrices(queryPaginationDto);
  }
}
