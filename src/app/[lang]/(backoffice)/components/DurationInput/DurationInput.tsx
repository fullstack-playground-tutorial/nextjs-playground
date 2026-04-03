"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  name: string;
  label: string;
  disabled: boolean;
  required?: boolean;
  duration?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, value: number) => void;
};

function DurationInput({
  onChange,
  duration = 0,
  label,
  name,
  disabled,
  required,
}: Props) {
  const [state, setState] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const isTypingRef = useRef(false);

  const hoursRef = useRef<HTMLInputElement>(null);
  const minutesRef = useRef<HTMLInputElement>(null);
  const secondsRef = useRef<HTMLInputElement>(null);

  const pad = (n: number | string) => {
    const str = n.toString();
    if (!str) return "00";
    return str.length === 1 ? "0" + str : str;
  };

  useEffect(() => {
    if (isTypingRef.current) return;

    const h = Math.floor(duration / 3600);
    const m = Math.floor((duration % 3600) / 60);
    const s = duration % 60;

    setState({
      hours: pad(h),
      minutes: pad(m),
      seconds: pad(s),
    });
  }, [duration]);

  const computeValue = (s: typeof state) =>
    (Number(s.hours) || 0) * 3600 +
    (Number(s.minutes) || 0) * 60 +
    (Number(s.seconds) || 0);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    isTypingRef.current = true;
    e.target.select();
  };

  const handleBlur = (type: keyof typeof state) => {
    setState((prev) => ({
      ...prev,
      [type]: pad(prev[type]),
    }));
    isTypingRef.current = false;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: keyof typeof state,
  ) => {
    let value = e.target.value;

    if (!/^\d*$/.test(value)) return;
    if (value.length > 2) return;

    let num = Number(value);
    if (type !== "hours" && num > 59) return;
    if (type === "hours" && num > 99) return;

    const newState = { ...state, [type]: value };
    setState(newState);

    onChange(e, computeValue(newState));

    // auto focus
    if (value.length === 2) {
      if (type === "hours") minutesRef.current?.focus();
      if (type === "minutes") secondsRef.current?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    type: keyof typeof state,
  ) => {
    if (e.key === "Backspace" && state[type] === "") {
      if (type === "minutes") hoursRef.current?.focus();
      if (type === "seconds") minutesRef.current?.focus();
    }

    // arrow to up/down value
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();

      let num = Number(state[type]) || 0;
      num += e.key === "ArrowUp" ? 1 : -1;

      if (type !== "hours") {
        num = Math.max(0, Math.min(59, num));
      } else {
        num = Math.max(0, Math.min(99, num));
      }

      const newState = { ...state, [type]: num.toString() };
      setState(newState);
    }
  };

  return (
    <div
      className={`group relative w-full h-full leading-5 rounded-md border dark:border-border dark:bg-surface-1 transition-all duration-200 shadow overflow-hidden
      ${
        disabled
          ? "opacity-60 cursor-not-allowed dark:bg-surface-0 text-secondary"
          : "focus-within:border-border-strong dark:focus-within:border-border-strong focus-within:ring focus-within:ring-accent-0 dark:focus-within:ring-accent-0"
      }`}
    >
      <label
        htmlFor={`${name}-hours`}
        className="absolute left-3 top-1.5 text-sm font-medium transition-all duration-200 text-secondary pointer-events-none group-focus-within:text-primary dark:group-focus-within:text-accent-0"
      >
        {label}
        {required && <span className="text-alert-0">*</span>}
      </label>

      <div className="flex items-center h-full w-full px-3 pt-6 pb-2 gap-1 text-sm dark:text-primary">
        <input
          ref={hoursRef}
          id={`${name}-hours`}
          disabled={disabled}
          value={state.hours}
          inputMode="numeric"
          placeholder="HH"
          onFocus={handleFocus}
          onBlur={() => handleBlur("hours")}
          onChange={(e) => handleChange(e, "hours")}
          onKeyDown={(e) => handleKeyDown(e, "hours")}
          className="w-6 text-center bg-transparent outline-none placeholder-transparent disabled:cursor-not-allowed"
        />

        <span className="text-secondary select-none font-medium mb-0.5">:</span>

        <input
          ref={minutesRef}
          disabled={disabled}
          value={state.minutes}
          inputMode="numeric"
          placeholder="MM"
          onFocus={handleFocus}
          onBlur={() => handleBlur("minutes")}
          onChange={(e) => handleChange(e, "minutes")}
          onKeyDown={(e) => handleKeyDown(e, "minutes")}
          className="w-6 text-center bg-transparent outline-none placeholder-transparent disabled:cursor-not-allowed"
        />

        <span className="text-secondary select-none font-medium mb-0.5">:</span>

        <input
          ref={secondsRef}
          disabled={disabled}
          value={state.seconds}
          inputMode="numeric"
          placeholder="SS"
          onFocus={handleFocus}
          onBlur={() => handleBlur("seconds")}
          onChange={(e) => handleChange(e, "seconds")}
          onKeyDown={(e) => handleKeyDown(e, "seconds")}
          className="w-6 text-center bg-transparent outline-none placeholder-transparent disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
}

export default DurationInput;
