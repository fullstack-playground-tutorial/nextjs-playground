"use client";
import { useState } from "react";
import GoldTab from "./GoldTab";
import { Gold } from "./GoldTab";
import MoneyTab from "./MoneyTab";
import { UserInfo } from "@/app/feature/auth";
import { PassBook, PFAccount } from "@/app/feature/personal-finance";

type Props = {
  personFinanceAccount?: PFAccount;
  golds: Gold[];
  userInfo?: UserInfo;
  passBooks?: PassBook[];
};

export default function HomeBoard({
  golds,
  userInfo,
  passBooks,
  personFinanceAccount,
}: Props) {
  const [tab, setShow] = useState("home");

  return (
    <>
      <div className="w-full h-full p-4 flex flex-col gap-2">
        <div className="flex flex-row gap-2 justify-end">
          <div
            onClick={() => {
              setShow("gold");
            }}
            className={
              "h-8 dark:border min-w-24 text-nowrap px-3 py-2 dark:border-border flex items-center self-end justify-center cursor-pointer shadow rounded-full font-bold dark:hover:text-accent-0 dark:hover:shadow-md dark:hover:bg-surface-1 transition-all"
            }
          >
            Gold Price
          </div>
          <div
            onClick={() => {
              setShow("money");
            }}
            className={
              "h-8 dark:border min-w-24 text-nowrap px-3 py-2 dark:border-border flex items-center self-end justify-center cursor-pointer shadow rounded-full font-bold dark:hover:text-accent-0 dark:hover:shadow-md dark:hover:bg-surface-1 transition-all"
            }
          >
            Money Saving
          </div>
          <div
            onClick={() => {
              setShow("home");
            }}
            className={
              "h-8 dark:border min-w-24 text-nowrap px-3 py-2 dark:border-border flex items-center self-end justify-center cursor-pointer shadow rounded-full font-bold dark:hover:text-accent-0 dark:hover:shadow-md dark:hover:bg-surface-1 transition-all"
            }
          >
            Home
          </div>
        </div>
        <div
          className={`h-0 overflow-hidden ${
            tab === "gold"
              ? "h-auto opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none h-0"
          }dark:bg-surface-1 rounded-lg transition-all flex flex-col gap-2`}
        >
          <GoldTab golds={golds} />
        </div>
        <div
          className={`h-0 overflow-hidden ${
            tab === "money"
              ? "h-screen opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none h-0"
          }dark:bg-surface-1 rounded-lg transition-all flex flex-col gap-2`}
        >
          {userInfo && passBooks && personFinanceAccount && (
            <MoneyTab
              passBooks={passBooks}
              personalFinanceAccount={personFinanceAccount}
            />
          )}
        </div>
      </div>
    </>
  );
}
