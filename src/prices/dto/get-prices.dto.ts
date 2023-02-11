export class GetPricesDto {
  readonly id: string;
  readonly name: string;
  readonly price: number;

  constructor(price) {
    this.id = price._id.toString();
    this.name = price.name;
    this.price = price.price;
  }
}
