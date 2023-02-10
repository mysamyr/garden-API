import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";

import { APPLE, CHERRY, AREA, ACTIONS } from "../common/enums";
import { FERTILIZERS, SORTS } from "./enums";
import { transaction } from "../common/transaction";
import { TreeEntity } from "../common/entities";
import {
  Area,
  AreaDocument,
  Planting,
  PlantingDocument,
  Price,
  PriceDocument,
  Sort,
  SortDocument,
  User,
  UserDocument,
} from "../models";
import { DateUtil } from "../utils/date.util";

@Injectable()
export class GeneratorService {
  constructor(
    @InjectModel(Area.name) private areaModel: Model<AreaDocument>,
    @InjectModel(Planting.name) private plantingModel: Model<PlantingDocument>,
    @InjectModel(Price.name) private priceModel: Model<PriceDocument>,
    @InjectModel(Sort.name) private sortModel: Model<SortDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async generate(params): Promise<any> {
    const { truncate } = params;
    return transaction(this.connection, async (session) => {
      if (truncate) {
        // reset area and truncate other collections
        await this.plantingModel.deleteMany({}, { session });
        await this.priceModel.deleteMany({}, { session });
        await this.sortModel.deleteMany({}, { session });
        await this.userModel.deleteMany({}, { session });
      }

      const { users, trees, prices, plantings, areaUpdate } =
        this.getTestData(params);

      await this.userModel.bulkWrite(
        users.map((user) => ({
          updateOne: {
            filter: { email: user.email },
            update: { name: user.name, email: user.email, phone: user.phone },
            upsert: true,
          },
        })),
        { session },
      );
      await this.sortModel.bulkWrite(
        trees.map((tree) => ({
          updateOne: {
            filter: { sort: tree.sort },
            update: tree,
            upsert: true,
          },
        })),
        { session },
      );
      await this.priceModel.bulkWrite(
        prices.map((price) => ({
          updateOne: {
            filter: { name: price.name },
            update: price,
            upsert: true,
          },
        })),
        { session },
      );
      await this.plantingModel.create(plantings, { session });
      await this.areaModel.updateOne(
        {
          name: AREA,
        },
        areaUpdate,
        { upsert: true, session },
      );
    });
  }

  private getTestData({ totalArea, users, trees, plantings, prices }) {
    const apple = new TreeEntity(APPLE);
    const cherry = new TreeEntity(CHERRY);

    const newUsers = this.createUsers(users);
    const newTrees = this.createTrees(trees);
    const newPrices = this.createPrices(prices, newTrees);
    const newPlantings = this.createPlantings(
      plantings,
      newUsers,
      newPrices,
      newTrees,
    );
    // calculate planted area
    const areaUpdate: { plantedArea: number; totalArea?: number } = {
      plantedArea: newPlantings.reduce((acc, planting) => {
        acc +=
          planting.name === APPLE
            ? planting.planted * apple.area
            : planting.planted * cherry.area;
        return acc;
      }, 0),
    };
    // optional update total area
    if (totalArea) areaUpdate.totalArea = totalArea;

    return {
      users: newUsers,
      trees: newTrees,
      plantings: newPlantings,
      prices: newPrices,
      areaUpdate,
    };
  }

  private createUsers({ count, data }) {
    if (!count) return [];
    const userStore = [
      {
        _id: new mongoose.Types.ObjectId(),
        name: "Johny Silverhand",
        email: "samurai@cp.ice",
        phone: "+123456789001",
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: "Jackie Welles",
        email: "night_city_legend@cp.ice",
        phone: "+123456789002",
      },
    ];
    const allUsersWithId = [...data, ...userStore].map((user) => ({
      _id: new mongoose.Types.ObjectId(),
      name: user.name,
      email: user.email,
      phone: user.phone,
    }));
    const result = [];

    for (let i = 0; i < count; i++) {
      if (allUsersWithId[i]) {
        result.push(allUsersWithId[i]);
      } else {
        const newUser = {
          _id: new mongoose.Types.ObjectId(),
          name: this.generateName(),
          email: this.generateEmail(),
          phone: this.generatePhone(),
        };
        result.push(newUser);
      }
    }
    return result;
  }
  private createTrees({ count, data }) {
    if (!count) return [];
    const treeStore = [
      {
        name: APPLE,
        sort: SORTS.APPLE,
        fertilizers: [
          { name: FERTILIZERS[0], month: 0 },
          { name: FERTILIZERS[1], month: 2 },
          { name: FERTILIZERS[2], month: 4 },
          { name: FERTILIZERS[3], month: 6 },
          { name: FERTILIZERS[4], month: 8 },
          { name: FERTILIZERS[5], month: 10 },
        ],
      },
      {
        name: CHERRY,
        sort: SORTS.CHERRY,
        fertilizers: [
          { name: FERTILIZERS[6], month: 2 },
          { name: FERTILIZERS[7], month: 5 },
          { name: FERTILIZERS[8], month: 8 },
          { name: FERTILIZERS[9], month: 11 },
        ],
      },
    ];
    const allTrees = [...data, ...treeStore];
    const result = [];

    for (let i = 0; i < count; i++) {
      if (allTrees[i]) {
        result.push(allTrees[i]);
      } else {
        // return opposite to the last tree type
        const type = allTrees.at(-1) === APPLE ? CHERRY : APPLE;
        const fertilizersCount = type === APPLE ? 6 : 4;
        const newTree = {
          name: type,
          sort: this.generateName(),
          fertilizers: this.generateFertilizers(fertilizersCount),
        };
        result.push(newTree);
      }
    }
    return result;
  }
  private createPrices(prices, trees) {
    const plantingStoreSet = {
      [ACTIONS.CUT]: 200,
      [ACTIONS.FERTILIZE]: 100,
      [SORTS.APPLE]: 20,
      [SORTS.CHERRY]: 50,
      [FERTILIZERS[0]]: 100,
      [FERTILIZERS[1]]: 2000,
      [FERTILIZERS[2]]: 300,
      [FERTILIZERS[3]]: 400,
      [FERTILIZERS[4]]: 500,
      [FERTILIZERS[5]]: 600,
      [FERTILIZERS[6]]: 0.01,
      [FERTILIZERS[7]]: 0.02,
      [FERTILIZERS[8]]: 0.03,
      [FERTILIZERS[9]]: 0.04,
    };
    const result = [];
    result.push({
      name: ACTIONS.CUT,
      price: prices[ACTIONS.CUT] || plantingStoreSet[ACTIONS.CUT],
    });
    result.push({
      name: ACTIONS.FERTILIZE,
      price: prices[ACTIONS.FERTILIZE] || plantingStoreSet[ACTIONS.FERTILIZE],
    });
    trees.forEach((tree) => {
      const name = tree.sort;
      const price =
        prices[name] ||
        plantingStoreSet[name] ||
        this.generateRandomNumber(1, 20);
      result.push({ name, price });
      tree.fertilizers.forEach((fertilizer) => {
        const name = fertilizer.name;
        const price =
          prices[name] ||
          plantingStoreSet[name] ||
          this.generateRandomNumber(1, 50);
        result.push({ name, price });
      });
    });
    return result;
  }
  private createPlantings({ count, data }, users, prices, trees) {
    if (!count) return [];
    const date: string = DateUtil.getDate();
    const result = [];

    for (let i = 0; i < count; i++) {
      const userId = users[i]?._id || users[users.length % i]._id;
      if (data[i]) {
        result.push({ ...data[i], user: userId });
      } else {
        result.push(this.generatePlanting(trees, prices, date, userId));
      }
    }
    return result;
  }

  private generateRandomNumber(min = 1, max = 200): number {
    return Math.floor(Math.random() * (max - min) + min);
  }
  private generateRandomFloat(min = 1, max = 200): number {
    const numString = (Math.random() * (max - min) + min).toFixed(2);
    return parseFloat(numString);
  }
  private generateName(length = 7): string {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  private generateEmail(): string {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    const end = "@test.com";
    const charactersLength = characters.length;
    for (let i = 0; i < 4; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result + end;
  }
  private generatePhone(): string {
    let result = "";
    const characters = "1234567890";
    const start = "+380";
    const charactersLength = characters.length;
    for (let i = 0; i < 9; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return start + result;
  }
  private generateFertilizers(length: number): object[] {
    const result = [];
    for (let i = 0; i < length; i++) {
      result.push({
        name: this.generateName(),
        month: Math.random() * 11,
      });
    }
    return result;
  }
  private generatePlanting(
    trees, // : object[]
    prices, // : object[]
    date: string,
    userId: string,
  ): object {
    const planted = this.generateRandomNumber(10, 50);
    const index = this.generateRandomNumber(0, trees.length - 1);
    const sort = trees[index];
    const price = prices.find((price) => price.name === sort.sort);

    return {
      name: sort.name,
      sort: sort.sort,
      planted,
      price: price.price,
      cost: this.generateRandomFloat(500, 5000),
      date,
      live: planted,
      user: userId,
    };
  }
}
