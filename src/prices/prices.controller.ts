import {
  Body,
  Controller,
  Get,
  Put,
  HttpStatus,
  Param,
  Query,
  HttpCode,
  // UseGuards,
} from "@nestjs/common";
// import { AuthGuard } from "@nestjs/passport";

import { PricesService } from "./prices.service";
import { QueryPaginationDto } from "../common/dto";
import { UpdatePriceDto } from "./dto";

// @UseGuards(AuthGuard("jwt"))
@Controller("price")
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Put(":id")
  async updatePrice(
    @Param("id") id: string,
    @Body() updatePriceDto: UpdatePriceDto,
  ) {
    return await this.pricesService.updatePrice(id, updatePriceDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getPrices(@Query() queryPaginationDto: QueryPaginationDto) {
    return await this.pricesService.getAllPrices(queryPaginationDto);
  }
}
