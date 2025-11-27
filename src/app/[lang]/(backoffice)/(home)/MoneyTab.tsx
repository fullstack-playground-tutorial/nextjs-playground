"use client";
import { useState } from "react";
import Pack from "./Pack";
import PlusIcon from "@/assets/images/icons/plus.svg";
import PackForm from "./PackForm";
import MoneyIcon from "@/assets/images/icons/money_pack.svg";
import { PassBook, PFAccount } from "@/app/feature/personal-finance";

type Props = {
  passBooks: PassBook[];
  personalFinanceAccount: PFAccount;
};

export default function MoneyTab({
  passBooks: saveDeposits,
  personalFinanceAccount,
}: Props) {
  const [isCreating, setIsCreating] = useState(false);

  const formatMoney = (money: number) => {
    return Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 4,
    }).format(money);
  };

  const totalMoney =
    personalFinanceAccount.walletMoney + personalFinanceAccount.investMoney;

  return (
    <div className="dark:bg-surface-0 flex flex-col h-full p-4 gap-2">
      <div className="flex items-center">
        <MoneyIcon className="size-6 dark:fill-accent-0 transition-all" />
        <h2 className="text-xl font-medium dark:text-accent-0">
          Total: {formatMoney(totalMoney)}
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <MoneyIcon className="size-6 dark:fill-green-500 transition-all" />
            <h2 className="text-xl font-medium dark:text-green-500">
              Wallet: {formatMoney(personalFinanceAccount.walletMoney)}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <MoneyIcon className="size-6 dark:fill-blue-500 transition-all" />
            <h2 className="text-xl font-medium dark:text-blue-500">
              Invest: {formatMoney(personalFinanceAccount.investMoney)}
            </h2>
          </div>
        </div>
      </div>
      <div className="text-center grid grid-cols-4 gap-2 size-full h-60">
        {saveDeposits.map((item) => (
          <Pack
            key={item.name}
            dueDate={item.dueDate}
            startDate={item.startDate}
            name={item.name}
            interestRate={item.interest}
            amount={item.deposit}
            savingTerm={item.savingTerm}
            currency={item.currency}
            penalty={item.interestPenalty}
            status={item.status}
          />
        ))}
        <div
          onClick={() => setIsCreating(true)}
          className="max-h-60 w-full dark:border-4 dark:border-tertiary-0 rounded-md items-center justify-center flex dark:hover:border-accent-0 dark:hover:border-6 cursor-pointer dark:hover:*:fill-accent-0 dark:hover:*:size-28 dark:hover:bg-surface-1 transition-all"
        >
          <PlusIcon className="size-24 dark:fill-tertiary-0 transition-all" />
        </div>
      </div>
      {isCreating && <PackForm onClose={() => setIsCreating(false)} />}
    </div>
  );
}
