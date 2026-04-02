"use client";
import { useState, useEffect } from "react";

interface CountdownProps {
  targetDate: string;
}

export default function CountdownTimer({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-2 mt-2">
      <TimeUnit value={timeLeft.days} label="Ngày" />
      <TimeUnit value={timeLeft.hours} label="Giờ" />
      <TimeUnit value={timeLeft.minutes} label="Phút" />
      <TimeUnit value={timeLeft.seconds} label="Giây" />
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center bg-black/40 backdrop-blur-sm px-2 py-1 rounded min-w-[45px] border border-white/10">
      <span className="text-accent-0 font-bold text-sm leading-none">{value.toString().padStart(2, '0')}</span>
      <span className="text-xs text-white/60 uppercase font-bold tracking-tighter mt-1">{label}</span>
    </div>
  );
}
