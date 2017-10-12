export interface SpotPriceQueryReturn {
  data: SpotPrice;
}

export interface SpotPrice {
  base: string;
  currency: string;
  amount: number;
}
