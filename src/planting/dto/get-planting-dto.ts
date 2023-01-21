export class GetPlantingDto {
  readonly id: string;
  readonly name: string;
  readonly sort: string;
  readonly planted: number;
  readonly live: number;
  readonly plantingDate: string;
  readonly readyForSale: boolean;
  readonly daysLeft: number;
  readonly user: object;
  readonly fertilizers: [];

  constructor({ planting, daysLeft, fertilizers }) {
    this.id = planting._id;
    this.name = planting.name;
    this.sort = planting.sort;
    this.planted = planting.planted;
    this.live = planting.live;
    this.plantingDate = planting.date;
    this.readyForSale = planting.ready;
    this.daysLeft = daysLeft;
    this.user = {
      id: planting.user._id,
      name: planting.user.name,
    };
    this.fertilizers = fertilizers;
  }
}
