export class DateUtil {
  static getDaysForGrowing(plantingDate: string, monthsToGrow: number): number {
    const date: Date = new Date(Date.parse(plantingDate));
    date.setMonth(date.getMonth() + monthsToGrow);
    return Math.ceil(
      (date.getTime() - new Date().getTime()) / (1000 * 3600 * 24),
    );
  }

  static IsValidDateForPlanting(
    plantingDate: string,
    actionDate: string,
  ): boolean {
    return Date.parse(actionDate) - Date.parse(plantingDate) >= 0;
  }

  static toTwoChars(number: number): string {
    if (number < 10) {
      return "0" + number;
    }
    return number.toString();
  }

  static getDate(date = new Date()): string {
    const year = date.getFullYear();
    const month = this.toTwoChars(date.getMonth() + 1);
    const day = this.toTwoChars(date.getDate());

    return `${year}-${month}-${day}`;
  }
}
