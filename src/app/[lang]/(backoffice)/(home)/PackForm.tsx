"use client";
import { createPassbook } from "@/app/feature/personal-finance/action";
import CloseIcon from "@/assets/images/icons/close.svg";
import useToast from "@/components/Toast";
import { startTransition, useEffect, useState, useTransition } from "react";
type Props = {
  onClose: () => void;
  walletMoney: number;
};

type InternalState = {
  name: string;
  deposit: number;
  currency: string;
  interest: number;
  interestPenalty: number;
  estimateMoney: number;
  startDate: string;
  dueDate: string;
  isCompoundInterest: boolean;
  depositInputVal: string;
  interestInputVal: string;
  interestPenaltyInputVal: string;
  fieldErrors: Record<string, string>;
};

export default function PackForm({ onClose, walletMoney }: Props) {
  const [state, setState] = useState<InternalState>({
    name: "",
    deposit: 0,
    currency: "VND",
    interest: 0,
    interestPenalty: 0,
    estimateMoney: 0,
    startDate: new Date().toISOString(),
    dueDate: new Date().toISOString(),
    isCompoundInterest: false,
    depositInputVal: "0",
    interestInputVal: "0",
    interestPenaltyInputVal: "0",
    fieldErrors: {},
  });
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  const formatMoney = (money: number, currency?: string) => {
    const n = Intl.NumberFormat("vi-VN", {
      style: currency ? "currency" : "decimal",
      maximumFractionDigits: 4,
      currency: currency,
    })
      .format(money)
      .replaceAll(".", " ");

    return n;
  };

  const handleDepositInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    // Allow empty string, or a string matching a float pattern (e.g., '123', '12.3', '.5')
    if (input === "" || input.match(/^-?\d*\.?\d*$/)) {
      setState((prev) => ({
        ...prev,
        depositInputVal: input,
      }));
    }
  };

  const handleDepositBlur = () => {
    const parsedValue = parseFloat(state.depositInputVal);
    console.log(parsedValue);

    if (Number.isNaN(parsedValue)) {
      setState((prev) => ({
        ...prev,
        deposit: 0,
        depositInputVal: "",
      }));
    } else {
      if (parsedValue > walletMoney) {
        setState((prev) => ({
          ...prev,
          deposit: walletMoney,
          depositInputVal: walletMoney.toString(),
        }));
        return;
      }
      setState((prev) => ({
        ...prev,
        deposit: parsedValue,
        depositInputVal: parsedValue.toString(),
      }));
    }
  };

  const handleInterestInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = e.target.value;
    // Allow empty string, or a string matching a float pattern (e.g., '123', '12.3', '.5')
    if (input === "" || input.match(/^-?\d*\.?\d*$/)) {
      setState((prev) => ({
        ...prev,
        interestInputVal: input,
      }));
    }
  };

  const handleInterestPenaltyInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = e.target.value;
    // Allow empty string, or a string matching a float pattern (e.g., '123', '12.3', '.5')
    if (input === "" || input.match(/^-?\d*\.?\d*$/)) {
      setState((prev) => ({
        ...prev,
        interestPenaltyInputVal: input,
      }));
    }
  };

  const handleInterestBlur = () => {
    const parsedValue = parseFloat(state.interestInputVal);
    if (Number.isNaN(parsedValue)) {
      setState((prev) => ({
        ...prev,
        interest: 0,
        interestInputVal: "",
      }));
    } else {
      setState((prev) => ({
        ...prev,
        interest: parsedValue,
        interestInputVal: parsedValue.toString(),
      }));
    }
  };

  const handleInterestPenaltyBlur = () => {
    const parsedValue = parseFloat(state.interestPenaltyInputVal);
    if (Number.isNaN(parsedValue)) {
      setState((prev) => ({
        ...prev,
        interestPenalty: 0,
        interestPenaltyInputVal: "",
      }));
    } else {
      setState((prev) => ({
        ...prev,
        interestPenalty: parsedValue,
        interestPenaltyInputVal: parsedValue.toString(),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const res = await createPassbook(
          state.name,
          state.deposit,
          state.currency,
          state.interest,
          state.interestPenalty,
          state.estimateMoney,
          new Date(state.startDate),
          new Date(state.dueDate)
        );
        if (res.fieldErrors) {
          setState((prev) => ({
            ...prev,
            fieldErrors: res.fieldErrors,
          }));
          return;
        }

        toast.addToast("success", "Pack created successfully");
        onClose();
      } catch (error) {
        toast.addToast("error", "Pack created failed");
        onClose();
      }
    });
  };

  useEffect(() => {
    const startDate = new Date(state.startDate);
    const dueDate = new Date(state.dueDate);
    const interest = state.interest;
    const deposit = state.deposit;
    const savingDatesNo =
      (dueDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24;
    let estimateMoney = 0;
    if (state.isCompoundInterest) {
      estimateMoney =
        deposit * Math.pow(1 + interest / 100 / 365, savingDatesNo);
    } else {
      estimateMoney = (deposit * (interest / 100) * savingDatesNo) / 365;
    }

    setState((prev) => ({
      ...prev,
      estimateMoney: estimateMoney,
    }));
  }, [state.startDate, state.dueDate, state.interest, state.deposit]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-xl border dark:border-border dark:bg-surface-1 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Create New Pack</h2>
          <button
            onClick={onClose}
            disabled={pending}
            className="rounded-full p-1 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <CloseIcon />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium dark:text-primary block text-left">
              Title
            </label>
            <input
              type="text"
              placeholder="e.g. Summer Vacation"
              value={state.name}
              className="w-full mt-2 rounded-lg border dark:border-border dark:bg-surface-0 px-4 py-2.5 dark:text-primary placeholder:dark:text-secondary focus:border-accent-0 focus:outline-none focus:ring-1 focus:ring-accent-0 transition-all"
              onChange={(e) =>
                setState((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <span
              className={
                "dark:text-alert-1 text-xs mt-2 transition-all" +
                (state.fieldErrors.name
                  ? "opacity-100 h-full"
                  : " opacity-0 h-0")
              }
            >
              {state.fieldErrors.name}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium dark:text-primary block text-left">
                Amount
              </label>
              <input
                type="text"
                placeholder="0"
                value={state.depositInputVal}
                onChange={handleDepositInputChange}
                onBlur={handleDepositBlur}
                className="w-full mt-2 rounded-lg border dark:border-border dark:bg-surface-0 px-4 py-2.5 dark:text-primary placeholder:dark:text-secondary focus:border-accent-0 focus:outline-none focus:ring-1 focus:ring-accent-0 transition-all"
              />
              <span
                className={
                  "dark:text-secondary text-xs mt-2 transition-all italic"
                }
              >
                Maximun deposit: {formatMoney(walletMoney)}
              </span>
              <span
                className={
                  "dark:text-alert-1 text-xs mt-2 transition-all" +
                  (state.fieldErrors.deposit
                    ? "opacity-100 h-full"
                    : "opacity-0 h-0")
                }
              >
                {state.fieldErrors.deposit}
              </span>
            </div>
            <div>
              <label className="text-sm font-medium dark:text-primary block text-left">
                Currency
              </label>
              <select className="w-full mt-2 rounded-lg border dark:border-border dark:bg-surface-0 px-4 py-2.5 dark:text-primary focus:border-accent-0 focus:outline-none focus:ring-1 focus:ring-accent-0 transition-all appearance-none cursor-pointer">
                <option value="VND">VND</option>
                {/* <option value="USD">USD</option> */}
              </select>
              <span
                className={
                  "dark:text-alert-1 text-xs mt-2 transition-all" +
                  (state.fieldErrors.currency
                    ? "opacity-100 h-full"
                    : "opacity-0 h-0")
                }
              >
                {state.fieldErrors.currency}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium dark:text-primary block text-left">
                Start Date
              </label>
              <input
                type="date"
                value={state.startDate}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className="w-full mt-2 rounded-lg border dark:border-border dark:bg-surface-0 px-4 py-2.5 dark:text-primary placeholder:dark:text-secondary focus:border-accent-0 focus:outline-none focus:ring-1 focus:ring-accent-0 transition-all"
              />
              <span
                className={
                  "dark:text-alert-1 text-xs mt-2 transition-all" +
                  (state.fieldErrors.startDate
                    ? "opacity-100 h-full"
                    : "opacity-0 h-0")
                }
              >
                {state.fieldErrors.startDate}
              </span>
            </div>
            <div>
              <label className="text-sm font-medium dark:text-primary block text-left">
                Due Date
              </label>
              <input
                type="date"
                value={state.dueDate}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    dueDate: e.target.value,
                  }))
                }
                className="w-full mt-2 rounded-lg border dark:border-border dark:bg-surface-0 px-4 py-2.5 dark:text-primary placeholder:dark:text-secondary focus:border-accent-0 focus:outline-none focus:ring-1 focus:ring-accent-0 transition-all"
              />
              <span
                className={
                  "dark:text-alert-1 text-xs mt-2 transition-all" +
                  (state.fieldErrors.dueDate
                    ? "opacity-100 h-full"
                    : "opacity-0 h-0")
                }
              >
                {state.fieldErrors.dueDate}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium dark:text-primary block text-left">
                Interest Rate (%)
              </label>
              <input
                type="text"
                placeholder="5"
                value={state.interestInputVal}
                onChange={handleInterestInputChange}
                onBlur={handleInterestBlur}
                className="w-full mt-2 rounded-lg border dark:border-border dark:bg-surface-0 px-4 py-2.5 dark:text-primary placeholder:dark:text-secondary focus:border-accent-0 focus:outline-none focus:ring-1 focus:ring-accent-0 transition-all"
              />
              <span
                className={
                  "dark:text-alert-1 text-xs mt-2 transition-all" +
                  (state.fieldErrors.interest
                    ? "opacity-100 h-full"
                    : "opacity-0 h-0")
                }
              >
                {state.fieldErrors.interest}
              </span>
            </div>
            <div>
              <label className="text-sm font-medium dark:text-primary block text-left">
                Penalty Rate (%)
              </label>
              <input
                type="text"
                placeholder="0"
                value={state.interestPenaltyInputVal}
                onChange={handleInterestPenaltyInputChange}
                onBlur={handleInterestPenaltyBlur}
                className="w-full mt-2 rounded-lg border dark:border-border dark:bg-surface-0 px-4 py-2.5 dark:text-primary placeholder:dark:text-secondary focus:border-accent-0 focus:outline-none focus:ring-1 focus:ring-accent-0 transition-all"
              />
              <span
                className={
                  "dark:text-alert-1 text-xs mt-2 transition-all " +
                  (state.fieldErrors.interestPenalty
                    ? "opacity-100 h-full"
                    : "opacity-0 h-0")
                }
              >
                {state.fieldErrors.interestPenalty}
              </span>
            </div>
          </div>

          <div className="flex flex-row items-center justify-start gap-2">
            <label className="text-sm font-medium dark:text-primary text-left text-nowrap">
              Compound Interest
            </label>
            <input
              type="checkbox"
              checked={state.isCompoundInterest}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  isCompoundInterest: e.target.checked,
                }))
              }
              className="accent-accent-1 rounded-lg border dark:border-border dark:bg-surface-0 px-4 py-2.5 dark:text-primary placeholder:dark:text-secondary focus:border-accent-0 focus:outline-none focus:ring-1 focus:ring-accent-0 transition-all"
            />
          </div>
          <div className="flex flex-row items-center justify-start gap-2">
            <label className="text-sm font-medium dark:text-primary text-left text-nowrap">
              Estimated Profit:
            </label>
            <span className="text-sm font-medium dark:text-primary text-left text-nowrap">
              {formatMoney(state.estimateMoney, state.currency)}
            </span>
          </div>
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={pending}
              className="flex-1 btn btn-lg border border-white/10 bg-transparent text-sm font-semibold dark:text-primary hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="flex-1 btn btn-lg bg-accent-0 text-sm font-semibold dark:text-primary shadow-lg shadow-accent-0/20 hover:bg-accent-0/90 transition-all"
            >
              {pending ? "Creating..." : "Create Pack"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
