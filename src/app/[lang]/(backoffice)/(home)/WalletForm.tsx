"use client";
import {
  depositAction,
  withdrawAction,
} from "@/app/feature/personal-finance/action";
import CloseIcon from "@/assets/images/icons/close.svg";
import useToast from "@/components/Toast";
import { useTransition, useState, useEffect } from "react";

type Props = {
  type: "deposit" | "withdraw";
  onClose: () => void;
  walletMoney: number;
};

export default function WalletForm({ type, onClose, walletMoney }: Props) {
  const [amount, setAmount] = useState<number>(0);
  const [amountInput, setAmountInput] = useState<string>("");
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const action = type === "deposit" ? depositAction : withdrawAction;
    startTransition(async () => {
      try {
        let res = 0;
        res = await action(amount);
        if (res > 0) {
          onClose();
          toast.addToast("success", "Money deposited successfully");
        }
      } catch (error) {
        console.log(error);
        toast.addToast("error", "Money deposited failed");
        onClose();
      }
    });
  };
  const formatMoney = (money: number) => {
    const n = Intl.NumberFormat("vi-VN", {
      style: "decimal",
    }).format(money);
    return n;
  };

  const onChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valStr = e.target.value;
    valStr = valStr.replace(/[,.]/g, "");

    // clear space
    valStr = valStr.replace(/\s+/g, "");

    // Delete all leading 0s except the first one
    valStr = valStr.replace(/^0+(?=\d)/, "");
    console.log("valStr:", valStr);

    if (valStr === "") {
      setAmount(0);
      setAmountInput("0");
      return;
    }

    const val = Number(valStr);
    if (Number.isNaN(val)) {
      return;
    }

    if (val < 0) return;

    if (type === "withdraw" && val > walletMoney) {
      setAmount(walletMoney);
      setAmountInput(formatMoney(walletMoney));
      return;
    }

    setAmount(val);
    setAmountInput(formatMoney(val));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl border dark:border-border dark:bg-surface-1 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white capitalize">
            {type} Money
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <CloseIcon />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-primary block text-left">
              Amount
            </label>
            <input
              type="text"
              value={amountInput}
              onChange={onChangeAmount}
              placeholder="Enter amount"
              className="w-full rounded-lg border dark:border-border dark:bg-surface-0 px-4 py-2.5 dark:text-primary placeholder:dark:text-secondary focus:border-accent-0 focus:outline-none focus:ring-1 focus:ring-accent-0 transition-all"
              autoFocus
            />
            <span
              className="text-sm font-medium text-secondary italic"
              hidden={type === "deposit"}
            >
              Withdraw maximum: {formatMoney(walletMoney)}
            </span>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              disabled={pending}
              onClick={onClose}
              className="flex-1 btn btn-lg border border-white/10 bg-transparent text-sm font-semibold dark:text-primary hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className={`flex-1 btn btn-lg text-sm font-semibold dark:text-primary shadow-lg transition-all ${
                type === "deposit"
                  ? "bg-success hover:shadow-success/20 hover:bg-success/90"
                  : "dark:bg-alert-1 dark:hover:shadow-alert-1/20 dark:hover:bg-alert-1/90"
              }`}
            >
              {pending
                ? "Processing..."
                : type === "deposit"
                ? "Deposit"
                : "Withdraw"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
