import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Model, Connection } from "mongoose";

import {
  GetByAreaParamDto,
  GetByProfitParamDto,
  GetAmountDto,
  TreeDto,
  GetCostByTreeParamDto,
  CostDto,
} from "./dto";
import { Price, PriceDocument, Sort, SortDocument } from "src/models";
import { TreeEntity } from "src/common/entities";
import { ACTIONS } from "src/common/enums";

@Injectable()
export class CalcService {
  constructor(
    @InjectModel(Sort.name) private treeModel: Model<SortDocument>,
    @InjectModel(Price.name) private priceModel: Model<PriceDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async getByArea(param: GetByAreaParamDto): Promise<GetAmountDto> {
    const treeArea = new TreeEntity(param.type).area;
    return {
      amount: Math.floor(param.area / treeArea),
    };
  }

  async getCostByTree(params: GetCostByTreeParamDto): Promise<CostDto> {
    const treeData: TreeDto = await this.treeModel.findOne({
      sort: params.sort,
    });
    const { growingTime, pruningCount } = new TreeEntity(params.type);
    const growingInYears: number = parseFloat((growingTime / 12).toFixed(2));
    const fertilizers: string[] = treeData.fertilizers.map(
      (fertilizer) => fertilizer.name,
    );
    const pricesToCalc = await this.priceModel
      .find({
        name: [ACTIONS.CUT, ACTIONS.FERTILIZE, params.sort, ...fertilizers],
      })
      .select("price name")
      .exec();

    const result: number = pricesToCalc.reduce((acc, item) => {
      if (item.name === ACTIONS.CUT) {
        return acc + item.price * pruningCount * growingInYears;
      } else if (item.name === ACTIONS.FERTILIZE) {
        return acc + fertilizers.length * growingInYears * item.price;
      } else if (item.name === params.sort) {
        return acc + item.price;
      } else {
        return acc + item.price * growingInYears;
      }
    }, 0);

    return {
      tree: params.sort,
      cost: result,
    };
  }

  async getByProfit(params: GetByProfitParamDto): Promise<GetAmountDto> {
    // eslint-disable-next-line no-console
    console.log(params);
    return;
  }
  async getIncomeByArea(params: GetCostByTreeParamDto): Promise<CostDto> {
    // eslint-disable-next-line no-console
    console.log(params);
    return;
  }
}
