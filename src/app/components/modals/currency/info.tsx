import { Currency } from "@/utils/type";
import Image from "next/image";
import React from "react";

const Info = (currency: Currency) => {
  return (
    <div className="mt-4 flex flex-row justify-between px-10">
      <div className="flex flex-row gap-x-5">
        <Image
          width={20}
          height={20}
          style={{ width: "auto", height: 20 }}
          src={currency.logo}
          alt="logo"
        />
        <p>{currency.symbol}</p>
      </div>
      <p className="text-slate-500">{currency.name}</p>
    </div>
  );
};

export default Info;
