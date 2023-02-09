import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { GetByAreaParamDto } from "./dto/get-by-area-param.dto";
import { GetByProfitParamDto } from "./dto/get-by-profit-param.dto";
import { GetAmountDto } from "./dto/get-amount.dto";
import { GetCostByTreeParamDto, CostDto } from "./dto/get-cost-by-tree-param.dto";
import { Price, PriceDocument, Tree, TreeDocument, TreeSchema } from "src/models";
import { TreeEntity } from "src/common/entities";
import { TreeDto } from "./dto/tree.dto";

@Injectable()
export class CalcService {
  constructor(
    @InjectModel(Tree.name) private treeModel: Model<TreeDocument>,
    @InjectModel(Price.name) private priceModel: Model<PriceDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection
  ) { }

  async getByArea(param: GetByAreaParamDto): Promise<GetAmountDto> {
    const treeArea = new TreeEntity(param.type).area;
    return {
      amount: Math.floor(param.area / treeArea),
    };
  }

  async getCostByTree(params: GetCostByTreeParamDto): Promise<CostDto> {
    const treeData: TreeDto = await this.treeModel.findOne({ sort: params.sort });
    const { growingTime, pruningCount } = new TreeEntity(params.type);
    const growingInYears: number = parseFloat((growingTime / 12).toFixed(2));
    const fertilizers: string[] = treeData.fertilizers.map(tree => tree.name);
    const pricesToCalc = await this.priceModel.find({ name: ['cut', 'fertilize', params.sort, ...fertilizers] }).select("price name")

    const result = pricesToCalc.reduce((acc, item) => {
      if (item.name === 'cut') {
        return acc + item.price * pruningCount * growingInYears;
      } else if (item.name === 'fertilize') {
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
    console.log(params);
    return;
  }
  async getIncomeByArea(params: GetCostByTreeParamDto): Promise<CostDto> {
    console.log(params);
    return;
  }
}
