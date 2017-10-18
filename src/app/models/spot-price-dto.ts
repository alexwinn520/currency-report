export interface SpotPriceQueryReturn {
  data: SpotPrice;
}

export interface SpotPrice {
  base: string;
  currency: string;
  amount: string;
}

export interface SpotPriceWithTimeStamp extends SpotPrice {
  timeStamp: Date;
}
