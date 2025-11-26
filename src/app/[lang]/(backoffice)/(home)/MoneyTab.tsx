"use client";
import React, { useState } from "react";
import Pack from "./Pack";
import PlusIcon from "@/assets/images/icons/plus.svg";
import PackForm from "./PackForm";
import MoneyIcon from "@/assets/images/icons/money_pack.svg";
type SaveDeposit = {
  title: string;
  amount: number;
  interestRate: number;
  dueDate: Date;
  depositDate: Date;
  packType: "1 week" | "1 month" | "3 month" | "6 month" | "1 year";
};

export default function MoneyTab() {
  const [isCreating, setIsCreating] = useState(false);
  const saveDeposits: SaveDeposit[] = [
    {
      title: "Save",
      amount: 1000000,
      interestRate: 5,
      dueDate: new Date(2025, 10, 26, 10, 8, 0),
      depositDate: new Date(2025, 10, 24),
      packType: "1 week",
    },
    {
      title: "Deposit",
      amount: 1000000,
      interestRate: 5,
      dueDate: new Date(2025, 12, 24),
      depositDate: new Date(2025, 12, 24),
      packType: "1 week",
    },
  ];
  const totalMoney = Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 4,
  }).format(saveDeposits.reduce((acc, item) => acc + item.amount, 0));
  return (
    <div className="dark:bg-surface-0 flex flex-col h-full p-4 gap-2">
      <div className="flex items-center">
        <MoneyIcon className="size-6 dark:fill-accent-0 transition-all" />
        <h2 className="text-xl font-medium dark:text-accent-0">{totalMoney}</h2>
      </div>
      <div className="text-center grid grid-cols-4 gap-2 size-full h-60">
        {saveDeposits.map((item) => (
          <Pack
            key={item.title}
            dueDate={item.dueDate}
            depositDate={item.depositDate}
            title={item.title}
            interestRate={item.interestRate}
            amount={item.amount}
            packType={item.packType}
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
