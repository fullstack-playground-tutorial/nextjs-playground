"use client"
import { useRef } from "react";

type Props = {
  name: string;
  value: string;
  label: string;
  disable: boolean;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

function FloatTextarea({ onChange, value, label, name, disable, required }: Props) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div
      className="relative w-full h-full rounded-md border dark:border-border dark:bg-surface-1 transition-all duration-200 shadow
    focus-within:dark:ring focus-within:dark:ring-accent-0
    has-[textarea:focus]:[&>label]:top-2 has-[textarea:focus]:[&>label]:text-sm has-[textarea:focus]:[&>label]:font-normal has-[textarea:focus]:[&>label]:text-accent-0
    has-[textarea:not(:placeholder-shown)]:[&>label]:top-2 has-[textarea:not(:placeholder-shown)]:[&>label]:text-sm has-[textarea:not(:placeholder-shown)]:[&>label]:font-medium
    cursor-text
  "
      onClick={() => inputRef.current?.focus()}
    >
      <label
        htmlFor={name}
        className="absolute left-2 top-2 text-base font-medium transition-all duration-200 dark:text-secondary px-1"
      >
        {label}{required && <span className="text-alert-0">*</span>}
      </label>
      <div className="pt-6 px-3 pb-2">
        <textarea
          ref={inputRef}
          id={name}
          name={name}
          value={value}
          disabled={disable}
          placeholder=" " // need " " for safariOS
          onChange={onChange}
          className="peer bg-transparent text-sm dark:text-primary placeholder-transparent outline-none resize-none h-full w-full overflow-y-auto"
        />
      </div>
    </div>

  );
}

export default FloatTextarea;
