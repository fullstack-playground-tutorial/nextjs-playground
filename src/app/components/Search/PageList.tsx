"use client"
import { useState } from "react";
import DropdownIcon from "./arrow_down.svg";
interface Props {
  value: number;
  onSelected: (n: number) => void;
}

function PageList({ value, onSelected }: Props) {
  const [showOption, setShowOption] = useState(false);
  const handleSelected = (n: number) => {
    onSelected(n);
    setShowOption(false);
  };
  
  const toggleOption = () => {
    setShowOption((prev) => !prev)
  }

  return (
    <div className="relative">
      <div
        className="flex flex-row items-center justify-between group cursor-pointer gap-2 h-10 dark:bg-surface-1 transition-colors dark:hover:bg-surface-0 dark:border-border border-r border-y rounded-r-md px-3 py-2"
        onClick={toggleOption}
      >
        <div className="text-primary text-sm font-semibold transition-colors min-w-8 dark:group-hover:text-accent-0">{value}</div>
        <DropdownIcon
          className={`size-6 transition-all dark:group-hover:fill-accent-0 ${showOption ? "rotate-180 fill-accent-0" : ""}`}
        />
      </div>
      <div
        className={`absolute transition z-1 dark:bg-surface-1 overflow-hidden text-sm ${showOption ? "opacity-100": "opacity-0 pointer-events-none"} flex flex-col items-center justify-center rounded-md border dark:border-border shadow top-[calc(100%+8px)] left-0 w-full`}
      >
        <div
          onClick={() => handleSelected(10)}
          className="dark:hover:text-accent-0 w-full cursor-pointer px-3 py-2 dark:hover:bg-surface-0 dark:active:bg-surface-2"
        >
          10
        </div>
        <div
          onClick={() => handleSelected(25)}
          className="dark:hover:text-accent-0 w-full cursor-pointer px-3 py-2 dark:hover:bg-surface-0 dark:active:bg-surface-2"
        >
          25
        </div>
        <div
          onClick={() => handleSelected(50)}
          className="dark:hover:text-accent-0 w-full cursor-pointer px-3 py-2 dark:hover:bg-surface-0 dark:active:bg-surface-2"
        >
          50
        </div>
        <div
          onClick={() => handleSelected(75)}
          className="dark:hover:text-accent-0 w-full cursor-pointer px-3 py-2 dark:hover:bg-surface-0 dark:active:bg-surface-2"
        >
          75
        </div>
        <div
          onClick={() => handleSelected(100)}
          className="dark:hover:text-accent-0 w-full cursor-pointer px-3 py-2 dark:hover:bg-surface-0 dark:active:bg-surface-2"
        >
          100
        </div>
      </div>
    </div>
  );
}

export default PageList;
