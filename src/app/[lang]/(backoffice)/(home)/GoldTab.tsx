import React from "react";
import LineChart from "../components/Chart";
import { GoldPrice } from "@/app/feature/gold";

export type Gold = {
  title: string;
  price: GoldPrice;
};

type Props = {
  golds: Gold[];
};

export default function GoldTab({ golds }: Props) {
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
            <React.Fragment key={item.title}>
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
            </React.Fragment>
          ))}
        </tbody>
      </table>
    );
  };
  return (
    <>
      <div className="overflow-x-auto scrollbar scrollbar-thin pb-2 dark:border dark:border-border rounded-md">
        {table()}
      </div>
      <div className="w-full dark:bg-surface-1 rounded-lg dark:border-border dark:border overflow-hidden flex items-center justify-center">
        <LineChart />
      </div>
    </>
  );
}
