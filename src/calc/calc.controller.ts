import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { CalcService } from "./calc.service";
import { GetByProfitParamDto } from "src/calc/dto/get-by-profit-param.dto";
import { GetByAreaParamDto, GetCostByTreeParamDto } from "./dto";

@UseGuards(AuthGuard("jwt"))
@Controller("calc")
export class CalcController {
  constructor(private readonly calcService: CalcService) {}

  @Get("profit")
  @HttpCode(HttpStatus.OK)
  getCalcByProfit(@Query() query: GetByProfitParamDto): Promise<any> {
    return this.calcService.getByProfit(query);
  }

  @Get("area")
  @HttpCode(HttpStatus.OK)
  getCalcByArea(@Query() query: GetByAreaParamDto): Promise<any> {
    return this.calcService.getByArea(query);
  }

  @Get("cost")
  @HttpCode(HttpStatus.OK)
  getCost(@Query() query: GetCostByTreeParamDto): Promise<any> {
    return this.calcService.getCostByTree(query);
  }

  @Get("income")
  @HttpCode(HttpStatus.OK)
  getIncome(@Query() query: GetCostByTreeParamDto): Promise<any> {
    return this.calcService.getIncomeByArea(query);
  }
}
