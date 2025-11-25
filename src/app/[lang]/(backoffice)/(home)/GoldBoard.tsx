"use client";
import { GoldPrice } from "@/app/feature/gold";
import LineChart from "../components/Chart";
import { useState } from "react";

type Gold = {
  title: string;
  price: GoldPrice;
};

type Props = {
  golds: Gold[];
};

export default function GoldBoard({ golds }: Props) {
  const [show, setShow] = useState(true);
  const table = () => {
    const allKeys = golds
      .map((item) => Object.keys(item.price))
      .flat()
      .filter((k) => k.startsWith("buy_"))
      .map((k) => k.replace("buy_", ""))
      .sort();

    return (
      <table className="dark:border dark:border-border text-center ">
        <thead className="dark:bg-surface-1">
          <tr>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2"></th>
            {allKeys.map((product) => (
              <th
                key={product}
                className="px-4 py-2 dark:border dark:border-border dark:text-accent-0 text-sm"
              >
                {product}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {golds.map((item) => (
            <>
              <tr>
                <td
                  rowSpan={2}
                  className="dark:bg-surface-0 font-bold uppercase p-2 dark:border dark:border-border text-yellow-500"
                >
                  {item.title}
                </td>
                <td className="dark:bg-surface-1 dark:border dark:border-border text-sm px-4 py-2 font-bold text-accent-0">
                  buy
                </td>

                {allKeys.map((product) => {
                  const key = `buy_${product}`;
                  return (
                    <td
                      key={key}
                      className="px-4 py-2 dark:border dark:border-border"
                    >
                      {isNaN(Number(item.price[key]))
                        ? "-"
                        : Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                            maximumFractionDigits: 4,
                          }).format(item.price[key])}
                    </td>
                  );
                })}
              </tr>
              <tr className="dark:bg-surface-1">
                <td className="dark:bg-surface-0 dark:border dark:border-border text-sm px-4 py-2 font-bold text-accent-0">
                  sell
                </td>
                {allKeys.map((product) => {
                  const key = `sell_${product}`;
                  return (
                    <td
                      key={key}
                      className="px-4 py-2 dark:border dark:border-border"
                    >
                      {isNaN(Number(item.price[key]))
                        ? "-"
                        : Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                            maximumFractionDigits: 4,
                          }).format(item.price[key])}
                    </td>
                  );
                })}
              </tr>
            </>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <>
      <div className="w-full h-full p-4 flex flex-col gap-2">
        <div
          onClick={() => {
            setShow(!show);
          }}
          className={
            "h-8 dark:border min-w-24 text-nowrap px-3 py-2 dark:border-border flex items-center self-end justify-center cursor-pointer shadow rounded-full font-bold dark:hover:text-accent-0 dark:hover:shadow-md dark:hover:bg-surface-1 transition-all"
          }
        >
          {show ? "Hide" : "Gold Price"}
        </div>
        <div
          className={`h-0 overflow-hidden ${
            show
              ? "h-auto opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none h-0"
          }dark:bg-surface-1 rounded-lg transition-all flex flex-col gap-2`}
        >
          <div className="overflow-x-auto scrollbar scrollbar-thin pb-2 dark:border dark:border-border rounded-md">
            {table()}
          </div>
          <div className="w-full dark:bg-surface-1 rounded-lg dark:border-border dark:border overflow-hidden flex items-center justify-center">
            <LineChart />
          </div>
        </div>
      </div>
    </>
  );
}
