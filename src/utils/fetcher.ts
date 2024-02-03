import axios from "axios";
import { LOCAL_DOMAIN } from "./constants";
import { Currency } from "./type";

type User = {
  id: string;
  address: string;
};

export async function userAssetsFetcher(key: { url: string; address: string }) {
  const { url, address } = key;

  const { data: _user } = await axios.get<User>(`${LOCAL_DOMAIN}/user`, {
    params: { address },
  });

  const { id } = _user;
  const { data: assets } = await axios.get(url, { params: { userId: id } });

  return assets;
}

export async function currencyFetcher(url: string, idList?: number[]) {
  if (idList) {
    const { data } = await axios.get<Currency[]>(`${url}/${idList.join(",")}`);

    return data;
  } else {
    const { data } = await axios.get<Currency[]>(url);

    return data;
  }
}
