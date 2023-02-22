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
  readonly actions: [];

  constructor({ planting, daysLeft }) {
    this.id = planting._id;
    this.name = planting.name;
    this.sort = planting.sort.sort;
    this.planted = planting.planted;
    this.live = planting.live;
    this.plantingDate = planting.date;
    this.readyForSale = daysLeft <= 0;
    this.daysLeft = daysLeft > 0 ? daysLeft : 0;
    this.user = {
      id: planting.user._id,
      name: planting.user.name,
    };
    this.fertilizers = planting.sort.fertilizers;
    this.actions = planting.actions;
  }
}
