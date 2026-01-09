"use client";
import React, { useEffect, useState, useTransition } from "react";
import { useParams } from "next/navigation";
import { withdrawPassbook } from "@/app/feature/personal-finance/action";
import useToast from "@/components/Toast";

type Props = {
  id: string;
  dueDate: Date;
  startDate: Date;
  name: string;
  interestRate: number;
  amount: number;
  currency: string;
  penalty: number;
  status: string;
  estimateMoneyAfterTax: number;
};

export default function Pack({
  id,
  dueDate,
  startDate: depositDate,
  name: title,
  amount,
  interestRate,
  status,
  estimateMoneyAfterTax,
  penalty,
}: Props) {
  const params = useParams();
  const lang = (params?.lang as string) || "en-US";
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const handleWithdraw = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      startTransition(async () => {
        const res = await withdrawPassbook(id);
        if (res > 0) {
          toast.addToast("success", `withdraw ${title} successfully`);
        }
      });
    } catch (error) {
      toast.addToast("error", `withdraw ${title} failed`);
    }
  };

  const formatMoney = (money: number, currency?: string) => {
    const n = Intl.NumberFormat("vi-VN", {
      style: currency ? "currency" : "decimal",
      currency: currency,
    })
      .format(money)
      .replaceAll(".", " ");

    return n;
  };

  useEffect(() => {
    setTimeLeft(dueDate.getTime() - Date.now());
    const timer = setInterval(() => {
      const newTimeLeft = dueDate.getTime() - Date.now();
      if (newTimeLeft > 0) {
        setTimeLeft(newTimeLeft);
      } else {
        setTimeLeft(0);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [dueDate]);

  const percentPassed =
    timeLeft !== null
      ? Math.min(
          100,
          Math.max(
            0,
            (1 - timeLeft / (dueDate.getTime() - depositDate.getTime())) * 100
          )
        )
      : 0;

  const time =
    timeLeft !== null
      ? {
          seconds: Math.floor((timeLeft / 1000) % 60),
          minutes: Math.floor((timeLeft / (1000 * 60)) % 60),
          hours: Math.floor((timeLeft / (1000 * 60 * 60)) % 24),
          days: Math.floor(timeLeft / (1000 * 60 * 60 * 24)),
        }
      : { seconds: 0, minutes: 0, hours: 0, days: 0 };

  return (
    <div className="relative overflow-hidden rounded-lg p-4 text-white dark:bg-surface-1 dark:border dark:border-border  size-full min-h-70">
      <div
        className="absolute bottom-0 left-0 w-full z-0"
        style={{
          height: `${percentPassed}%`,
          background: "linear-gradient(to top, #7c3aed, #06b6d4)",
          transition: "height 0.5s ease",
          opacity: 0.3,
        }}
      />

      <div className="relative z-10 flex flex-col gap-1">
        <h2 className="font-semibold text-lg">{title}</h2>
        <p>
          Amount:{" "}
          {Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 4,
          }).format(amount)}
        </p>
        <p>Deposit: {depositDate?.toLocaleDateString(lang)}</p>
        <p>Due: {dueDate?.toLocaleDateString(lang)}</p>
        <p>Interest: {interestRate}% / year</p>
        <p>Penalty: {penalty}% / year</p>
        <p>Estmate After Tax: {formatMoney(estimateMoneyAfterTax)}</p>
        <p className="mt-2 text-sm opacity-90">
          {timeLeft !== null &&
            timeLeft > 0 &&
            dueDate.getTime() > Date.now() && (
              <>
                {time.days}d {time.hours}h {time.minutes}m {time.seconds}s
              </>
            )}
        </p>
        {status === "progress" ? (
          dueDate.getTime() < Date.now() && (
            <button
              disabled={pending}
              type="button"
              className={
                "btn btn-sm bg-accent-0 hover:bg-accent-1 shadow transition-all opacity-0 hover:opacity-100"
              }
              onClick={handleWithdraw}
            >
              {pending ? "Processing..." : "Withdraw"}
            </button>
          )
        ) : (
          <p className="mx-auto dark:border-success dark:text-success font-semibold dark:border-2 px-2 text-sm py-1">
            Completed
          </p>
        )}
      </div>
    </div>
  );
}
