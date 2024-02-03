import axios from "axios";
import { LOCAL_DOMAIN } from "./constants";
import { Currency } from "./type";

export async function getCurrency(currencyId: string) {
  const { data } = await axios.get<Currency>(
    `${LOCAL_DOMAIN}/currency/info/${currencyId}`
  );

  return data;
}
