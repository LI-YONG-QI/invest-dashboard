import { Currency } from "./type";

export function getProfitTextColor(profit: number): string {
  if (profit < 0) {
    return "text-[#FF0000]";
  } else {
    return "text-[#00FF00]";
  }
}

export function getSymbol(Currency: Currency[], id: number): string {
  const asset = Currency.find((item) => item.id === id);
  return asset?.symbol ?? "";
}

export function getLogo(Currency: Currency[], id: number): string {
  const asset = Currency.find((item) => item.id === id);
  return asset?.logo ?? "";
}
