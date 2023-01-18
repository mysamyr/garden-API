import { Body, Controller, Get, Put, HttpStatus, Res, Param, Query } from "@nestjs/common";

import { PricesService } from "./prices.service";
import { UpdatePriceDto } from './dto/update-price.dto';

@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}
  
  @Put(':id')
  async updatePrice(@Res() response, @Param('id') id: string, @Body() updatePriceDto: UpdatePriceDto) {
    try {
      const price = await this.pricesService.updatePrice(id, updatePriceDto);

      return response.status(HttpStatus.OK).json({
        message: `Price ${id} has been successfully updated`,
        price,
      })
    } catch (error) {

      return response.status(error.status).json(error.response);
    }
  }

  @Get()
  async getPrices(@Res() response, @Query() {skip, limit}) {
    try {
      const prices = await this.pricesService.getAllPrices(skip, limit);

      return response.status(HttpStatus.OK).json({
        message: 'All prices data',
        prices,
      })
    } catch (error) {

      return response.status(error.status).json(error.response);
    }
  }
}
