import { Currency } from "./currency";

export interface AssetView {
  [key: string]: string | number | Currency;
  id: number;
  price: number;
  value: number;
  currentValue: number;
  currency: Currency;
  quantity: number;
  profit: number;
}

export interface AssetDTO {
  currencyId: number;
  quantity: number;
  value: number;
  creator: string;
}
