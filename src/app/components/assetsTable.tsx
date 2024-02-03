"use client";
import { getProfitTextColor } from "@/utils/assets";
import { LOCAL_DOMAIN } from "@/utils/constants";
import { currencyFetcher, userAssetsFetcher } from "@/utils/fetcher";
import { AssetView } from "@/utils/type";
import { ConnectKitButton, useSIWE } from "connectkit";
import Image from "next/image";
import { useState } from "react";
import { GoPlus } from "react-icons/go";
import useSWR from "swr";
import AssetDialog from "./modals";
import CurrencyDialog from "./modals/currency";

const AssetTable = () => {
  const [isAssetOpen, setIsAssetOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [sortKey, setSortKey] = useState(false);
  const { data, signOut } = useSIWE();

  const {
    data: portfolio,
    isLoading,
    mutate,
  } = useSWR(
    { url: `${LOCAL_DOMAIN}/assets`, address: data.address },
    userAssetsFetcher
  );

  const { data: currency } = useSWR(
    `${LOCAL_DOMAIN}/currency`,
    currencyFetcher
  );

  const sort = async (key: "value" | "price" | "profit") => {
    if (portfolio) {
      const sortedPortfolio = [...portfolio].sort(
        (a: AssetView, b: AssetView) => {
          if (sortKey) {
            return a[key] - b[key];
          } else {
            return b[key] - a[key];
          }
        }
      );

      setSortKey(!sortKey);

      await mutate(sortedPortfolio, { revalidate: false });
    } else {
      alert("Error! Please try again later.");
    }
  };

  return (
    <section className="max-w-[1000px] w-[60%] min-w-[500px] mx-auto">
      <div className="flex flex-col">
        <div className="flex self-end gap-x-4">
          <ConnectKitButton />
          <button
            onClick={() => setIsAssetOpen(true)}
            className="self-end rounded bg-blue-500 text-center text-[20px] px-4 py-3 cursor-pointer"
          >
            <GoPlus />
          </button>
          <button
            onClick={signOut}
            className="py-2 px-4 bg-white text-black rounded-lg"
          >
            sign out
          </button>
        </div>

        {isLoading ? (
          <div
            className="inline-block h-[100px] w-[100px] animate-spin rounded-full border-[10px] border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mx-auto mt-4"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        ) : (
          <table className="border-white border-[1px] text-center my-[20px]">
            <thead>
              <tr>
                <th className="cursor-pointer">no.</th>
                <th>name</th>

                <th className="cursor-pointer" onClick={() => sort("value")}>
                  value
                </th>

                <th className="cursor-pointer" onClick={() => sort("price")}>
                  price
                </th>

                <th className="cursor-pointer" onClick={() => sort("value")}>
                  cost
                </th>

                <th className="cursor-pointer" onClick={() => sort("value")}>
                  quantity
                </th>

                <th className="cursor-pointer" onClick={() => sort("profit")}>
                  profit
                </th>
              </tr>
            </thead>
            <tbody>
              {portfolio?.map((asset: AssetView, index: number) => {
                const {
                  currentValue,
                  quantity,
                  value,
                  price,
                  profit,
                  currency,
                } = asset;

                return (
                  <tr key={index} className="tracking-wider">
                    <td className="text-center">{index + 1}</td>
                    <td className="text-center flex flex-row gap-x-2.5">
                      <Image
                        width={20}
                        height={20}
                        style={{ width: "auto", height: 20 }}
                        src={currency.logo || "/images/unknown.png"}
                        alt="logo"
                      />
                      <p>{currency.symbol}</p>
                    </td>
                    <td>$ {currentValue.toFixed(2)}</td>
                    <td>$ {price.toFixed(2)} </td>
                    <td>$ {value.toFixed(2)} </td>
                    <td>$ {quantity.toFixed(2)} </td>
                    <td>
                      <p className={getProfitTextColor(profit)}>
                        {profit.toFixed(2)} %
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {currency && (
        <AssetDialog
          isOpen={isAssetOpen}
          setIsOpen={setIsAssetOpen}
          setIsCurrencyOpen={setIsCurrencyOpen}
          currency={currency}
          mutate={mutate}
        />
      )}

      <CurrencyDialog isOpen={isCurrencyOpen} setIsOpen={setIsCurrencyOpen} />
    </section>
  );
};

export default AssetTable;
