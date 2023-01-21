import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";

import { APPLE, CHERRY, AREA, ACTIONS } from "../common/enums";
import { transaction } from "../common/transaction";
import {
  Area,
  AreaDocument,
  Planting,
  PlantingDocument,
  Price,
  PriceDocument,
  Tree,
  TreeDocument,
  User,
  UserDocument,
} from "../models";

@Injectable()
export class GeneratorService {
  constructor(
    @InjectModel(Area.name) private areaModel: Model<AreaDocument>,
    @InjectModel(Planting.name) private plantingModel: Model<PlantingDocument>,
    @InjectModel(Price.name) private priceModel: Model<PriceDocument>,
    @InjectModel(Tree.name) private treeModel: Model<TreeDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async generate(): Promise<any> {
    return transaction(this.connection, async (session) => {
      // reset area and truncate other collections
      await this.areaModel.updateOne(
        {
          name: AREA,
        },
        {
          plantedArea: 700,
        },
        { upsert: true, session },
      );
      await this.plantingModel.deleteMany({}, { session });
      await this.priceModel.deleteMany({}, { session });
      await this.treeModel.deleteMany({}, { session });
      await this.userModel.deleteMany({}, { session });

      const users = [
        {
          name: "Johny Silverhand",
          email: "samurai@cp.ice",
          phone: "+123456789001",
        },
        {
          name: "Jackie Welles",
          email: "night_city_legend@cp.ice",
          phone: "+123456789002",
        },
      ];
      const createdUsers = await this.userModel.create(users, { session });
      const trees = [
        {
          name: APPLE,
          sort: "golden",
          fertilizers: [
            { name: "Скоророст 1000", month: 0 },
            { name: "Скоророст 2000", month: 2 },
            { name: "Скоророст 3000", month: 4 },
            { name: "Скоророст 4000", month: 6 },
            { name: "Скоророст 5000", month: 8 },
            { name: "Скоророст 6000", month: 10 },
          ],
        },
        {
          name: CHERRY,
          sort: "Мелітопольська десертна",
          fertilizers: [
            { name: "Орк 200", month: 2 },
            { name: "Мобік 200", month: 5 },
            { name: "Москаль 200", month: 8 },
            { name: "Окупант 200", month: 11 },
          ],
        },
      ];
      await this.treeModel.create(trees, { session });
      const prices = [
        { name: ACTIONS.CUT, price: 200.0 },
        { name: ACTIONS.FERTILIZE, price: 100.0 },
        { name: "golden", price: 20.0 },
        { name: "Мелітопольська десертна", price: 50.0 },
        { name: "Скоророст 1000", price: 100.0 },
        { name: "Скоророст 2000", price: 200.0 },
        { name: "Скоророст 3000", price: 300.0 },
        { name: "Скоророст 4000", price: 400.0 },
        { name: "Скоророст 5000", price: 500.0 },
        { name: "Скоророст 6000", price: 600.0 },
        { name: "Орк 200", price: 0.01 },
        { name: "Мобік 200", price: 0.02 },
        { name: "Москаль 200", price: 0.03 },
        { name: "Окупант 200", price: 0.04 },
      ];
      await this.priceModel.create(prices, { session });
      const plantings = [
        {
          name: APPLE,
          sort: "golden",
          planted: 50,
          price: 20.0,
          cost: 5000.0,
          date: "2023-01-01",
          live: 50,
          user: createdUsers[0]._id,
        },
        {
          name: CHERRY,
          sort: "Мелітопольська десертна",
          planted: 100,
          price: 50.0,
          cost: 10000.0,
          date: "2022-01-01",
          live: 100,
          user: createdUsers[1]._id,
        },
      ];
      await this.plantingModel.create(plantings, { session });
    });
  }
}
