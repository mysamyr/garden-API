export class DateUtil {
  static getDaysForGrowing(plantingDate: string, growingTime: number): number {
    const date: Date = new Date(Date.parse(plantingDate));
    date.setDate(date.getDate() + growingTime);
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
}
