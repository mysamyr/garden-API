import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import * as bcrypt from "bcrypt";

import { APPLE, CHERRY, AREA, ACTIONS } from "../common/enums";
import { FERTILIZERS, PASSWORD, SORTS } from "./enums";
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
import {
  FertilizerDto,
  GenerateBodyDto,
  PlantingDto,
  PriceDto,
  SortDto,
  UserDto,
} from "./dto";

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

  async generate(params: GenerateBodyDto): Promise<any> {
    const { truncate } = params;
    return transaction(this.connection, async (session) => {
      if (truncate) {
        // reset area and truncate other collections
        await this.plantingModel.deleteMany({}, { session });
        await this.priceModel.deleteMany({}, { session });
        await this.sortModel.deleteMany({}, { session });
        await this.userModel.deleteMany({}, { session });
      }

      const { users, sorts, prices, plantings, areaUpdate } =
        this.getTestData(params);

      const hashedPassword: string = await bcrypt.hash(
        PASSWORD,
        +process.env.BCRYPT_SALT,
      );

      await this.userModel.bulkWrite(
        users.map((user) => ({
          updateOne: {
            filter: { email: user.email },
            update: {
              _id: new mongoose.Types.ObjectId(user.id),
              name: user.name,
              email: user.email,
              phone: user.phone,
              password: hashedPassword,
            },
            upsert: true,
          },
        })),
        { session },
      );
      await this.sortModel.bulkWrite(
        sorts.map((sort) => ({
          updateOne: {
            filter: { sort: sort.sort },
            update: sort,
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
    const apple: TreeEntity = new TreeEntity(APPLE);
    const cherry: TreeEntity = new TreeEntity(CHERRY);

    const newUsers: UserDto[] = this.createUsers(users);
    const newSorts: SortDto[] = this.createSorts(trees);
    const newPrices: PriceDto[] = this.createPrices(prices, newSorts);
    const newPlantings: PlantingDto[] = this.createPlantings(
      plantings,
      newUsers,
      newPrices,
      newSorts,
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
      sorts: newSorts,
      plantings: newPlantings,
      prices: newPrices,
      areaUpdate,
    };
  }

  private createUsers({ count, data }): UserDto[] {
    if (!count) return [];
    const userStore = [
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
    const allUsersWithId = [...data, ...userStore].map((user) => ({
      id: new mongoose.Types.ObjectId().toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: PASSWORD,
    }));
    const result = [];

    for (let i = 0; i < count; i++) {
      if (allUsersWithId[i]) {
        result.push(allUsersWithId[i]);
      } else {
        const newUser = {
          id: new mongoose.Types.ObjectId().toString(),
          name: this.generateName(),
          email: this.generateEmail(),
          phone: this.generatePhone(),
          password: PASSWORD,
        };
        result.push(newUser);
      }
    }
    return result;
  }
  private createSorts({ count, data }): SortDto[] {
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
    const allSorts: SortDto[] = [...data, ...treeStore].map((sort) => ({
      id: new mongoose.Types.ObjectId().toString(),
      ...sort,
    }));
    const result = [];

    for (let i = 0; i < count; i++) {
      if (allSorts[i]) {
        result.push(allSorts[i]);
      } else {
        // return opposite to the last sort type
        const type: string = allSorts.at(-1).name === APPLE ? CHERRY : APPLE;
        const fertilizersCount: number = type === APPLE ? 6 : 4;
        const newTree: SortDto = {
          id: new mongoose.Types.ObjectId().toString(),
          name: type,
          sort: this.generateName(),
          fertilizers: this.generateFertilizers(fertilizersCount),
        };
        result.push(newTree);
      }
    }
    return result;
  }
  private createPrices(prices, sorts): PriceDto[] {
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
    sorts.forEach((sort) => {
      const name = sort.sort;
      const price =
        prices[name] ||
        plantingStoreSet[name] ||
        this.generateRandomNumber(1, 20);
      result.push({ name, price });
      sort.fertilizers.forEach((fertilizer) => {
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
  private createPlantings(
    { count, data },
    users,
    prices,
    trees,
  ): PlantingDto[] {
    if (!count) return [];
    const date: string = DateUtil.getDate();
    const result = [];

    for (let i = 0; i < count; i++) {
      const userId = users[i]?.id || users[users.length % i].id;
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
  private generateFertilizers(length: number): FertilizerDto[] {
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
    sorts: SortDto[],
    prices: PriceDto[],
    date: string,
    userId: string,
  ): PlantingDto {
    const planted: number = this.generateRandomNumber(10, 50);
    const index: number = this.generateRandomNumber(0, sorts.length - 1);
    const sort: SortDto = sorts[index];
    const price: PriceDto = prices.find((price) => price.name === sort.sort);

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
