export class GetAmountDto {
  readonly amount: number;

  constructor(amount) {
    this.amount = amount.amount;
  }
}
