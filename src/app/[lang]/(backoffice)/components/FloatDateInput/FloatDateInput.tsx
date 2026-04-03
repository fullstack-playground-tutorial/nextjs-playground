"use client";

import { useState } from "react";

type Props = {
  name: string;
  value: string | undefined;
  label: string;
  disabled: boolean;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function FloatDateInput({
  onChange,
  value,
  label,
  name,
  disabled,
  required,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);

  // Use text type when empty and unfocused so the placeholder-shown hack works to center the label.
  // Switch to date type when focused or when there's a value to show the native date picker.
  const showDateType = isFocused || !!value;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
  };

  return (
    <div className="relative w-full h-full">
      <input
        disabled={disabled}
        type={showDateType ? "datetime-local" : "text"}
        id={name}
        name={name}
        value={value || ""}
        placeholder=" "
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="peer w-full h-full leading-5 rounded-md border dark:border-border dark:bg-surface-1
        px-3 pt-6 pb-2 text-sm dark:text-primary placeholder-transparent
        dark:focus:border-border-strong dark:focus:ring dark:focus:ring-accent-0 outline-none transition-all duration-200 shadow
        cursor-text [&::-webkit-calendar-picker-indicator]:dark:filter [&::-webkit-calendar-picker-indicator]:dark:invert"
      />
      <label
        htmlFor={name}
        className="absolute left-3 top-1.5 text-sm font-medium transition-all duration-200
        peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
        peer-placeholder-shown:text-base peer-placeholder-shown:text-secondary
        text-secondary pointer-events-none
        peer-focus:top-1.5 peer-focus:-translate-y-0 peer-focus:text-sm peer-focus:font-normal dark:peer-focus:text-accent-0"
      >
        {label}
        {required && <span className="text-alert-0 ml-1">*</span>}
      </label>
    </div>
  );
}

export default FloatDateInput;
