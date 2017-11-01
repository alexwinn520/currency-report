export interface HistoricalPriceData {
  average: number;
  time: string;
}

export interface HistoricalPriceDataWithType extends HistoricalPriceData {
  currencyType: string;
}