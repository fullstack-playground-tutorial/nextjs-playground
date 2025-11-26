"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Props = {
  dueDate: Date;
  depositDate: Date;
  title: string;
  interestRate: number;
  amount: number;
  packType: "1 week" | "1 month" | "3 month" | "6 month" | "1 year";
};

export default function Pack({
  dueDate,
  depositDate,
  title,
  amount,
  packType,
  interestRate,
}: Props) {
  const params = useParams();
  const lang = (params?.lang as string) || "en-US";
  const totalTime = dueDate.getTime() - depositDate.getTime();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

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
      ? Math.min(100, Math.max(0, (1 - timeLeft / totalTime) * 100))
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
    <div className="relative overflow-hidden rounded-lg p-4 text-white dark:bg-surface-1 dark:border dark:border-border">
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
        <p>Deposit: {depositDate.toLocaleDateString(lang)}</p>
        <p>Due: {dueDate.toLocaleDateString(lang)}</p>
        <p>Duration: {packType}</p>
        <p>Interest: {interestRate}%</p>

        <p className="mt-2 text-sm opacity-90">
          {timeLeft !== null ? (
            <>
              {time.days}d {time.hours}h {time.minutes}m {time.seconds}s
            </>
          ) : (
            "Loading..."
          )}
        </p>
      </div>
    </div>
  );
}
