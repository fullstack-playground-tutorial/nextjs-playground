"use client";
import { useState } from "react";
import Pack from "./Pack";
import PlusIcon from "@/assets/images/icons/plus.svg";
import MinusIcon from "@/assets/images/icons/minus.svg";
import PackForm from "./PackForm";
import MoneyIcon from "@/assets/images/icons/money_pack.svg";
import WalletIcon from "@/assets/images/icons/wallet.svg";
import BankIcon from "@/assets/images/icons/bank.svg";
import { PassBook, PFAccount } from "@/app/feature/personal-finance";
import WalletForm from "./WalletForm";

type Props = {
  passBooks: PassBook[];
  personalFinanceAccount: PFAccount;
};

export default function MoneyTab({
  passBooks: saveDeposits,
  personalFinanceAccount,
}: Props) {
  const [isCreating, setIsCreating] = useState(false);
  const [showWalletActions, setShowWalletActions] = useState(false);
  const [walletAction, setWalletAction] = useState<
    "deposit" | "withdraw" | null
  >(null);
  const { walletMoney, investMoney } = personalFinanceAccount;
  const formatMoney = (money: number) => {
    const n = Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 4,
    })
      .format(money)
      .replace(".", " ");
    return n;
  };

  const totalMoney = walletMoney + investMoney;

  return (
    <div className="dark:bg-surface-0 flex flex-col h-full p-4 gap-2">
      <div className="flex flex-row items-center justify-start gap-4">
        <div
          onClick={() => setShowWalletActions(!showWalletActions)}
          className="btn btn-sm dark:bg-surface-0 dark:hover:bg-surface-1 flex items-center gap-2 dark:border-border dark:border rounded-md cursor-pointer transition-all"
        >
          <WalletIcon className="size-6 dark:fill-accent-0 transition-all" />
          <h2 className="text-base font-medium dark:text-accent-0">
            {formatMoney(walletMoney)}
          </h2>
          <div
            className={`flex items-center gap-1 transition-all duration-300 ease-in-out overflow-hidden  ${
              showWalletActions ? "max-w-20 opacity-100" : "max-w-0 opacity-0"
            }`}
          >
            <div
              className="cursor-pointer p-1 rounded-full hover:bg-white/10 transition-all dark:hover:*:fill-accent-0 "
              title="Deposit"
              onClick={(e) => {
                e.stopPropagation();
                setWalletAction("deposit");
              }}
            >
              <PlusIcon className="size-4 dark:fill-primary" />
            </div>
            <div
              className="cursor-pointer p-1 rounded-full hover:bg-white/10 transition-all dark:hover:*:fill-accent-0 "
              title="Withdraw"
              onClick={(e) => {
                e.stopPropagation();
                setWalletAction("withdraw");
              }}
            >
              <MinusIcon className="size-4 dark:fill-primary" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <BankIcon className="size-6 dark:fill-accent-0 transition-all" />
          <h2 className="text-base font-medium dark:text-accent-0">
            {formatMoney(investMoney)}
          </h2>
        </div>
        <div className="flex flex-row gap-2 px-2 py-1">
          <MoneyIcon className="size-6 dark:fill-accent-0 transition-all" />
          <h2 className="text-base font-medium dark:text-accent-0">
            {formatMoney(totalMoney)}
          </h2>
        </div>
      </div>
      <div className="text-center grid grid-cols-4 gap-4">
        {saveDeposits.map((item) => (
          <Pack
            key={item.name}
            dueDate={item.dueDate}
            startDate={item.startDate}
            name={item.name}
            interestRate={item.interest}
            amount={item.deposit}
            currency={item.currency}
            penalty={item.interestPenalty}
            status={item.status}
          />
        ))}
        <div
          onClick={() => setIsCreating(true)}
          className="h-60 w-full dark:border-4 dark:border-tertiary-0 rounded-md items-center justify-center flex dark:hover:border-accent-0 dark:hover:border-6 cursor-pointer dark:hover:*:fill-accent-0 dark:hover:*:size-28 dark:hover:bg-surface-1 transition-all"
        >
          <PlusIcon className="size-24 dark:fill-tertiary-0 transition-all" />
        </div>
      </div>
      {isCreating && (
        <PackForm
          onClose={() => setIsCreating(false)}
          walletMoney={walletMoney}
        />
      )}
      {walletAction && (
        <WalletForm
          type={walletAction}
          onClose={() => setWalletAction(null)}
          walletMoney={personalFinanceAccount.walletMoney}
        />
      )}
    </div>
  );
}
