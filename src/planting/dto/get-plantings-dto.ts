class Planting {
  readonly id: string;
  readonly name: string;
  readonly sort: string;
  readonly count: string;
  readonly readyForSale: boolean;
  readonly user: object;

  constructor(planting) {
    this.id = planting._id;
    this.name = planting.name;
    this.sort = planting.sort.sort;
    this.count = planting.live;
    this.readyForSale = planting.ready;
    this.user = {
      id: planting.user._id,
      name: planting.user.name,
    };
  }
}
class Area {
  readonly totalArea: number;
  readonly plantedArea: number;

  constructor(area) {
    this.totalArea = area.totalArea;
    this.plantedArea = area.plantedArea;
  }
}

export class GetPlantingsDto {
  readonly plantings: [Planting];
  readonly area: Area;

  constructor(props) {
    this.plantings = props.plantings.map((planting) => new Planting(planting));
    if (props.area) {
      this.area = new Area(props.area);
    }
  }
}
