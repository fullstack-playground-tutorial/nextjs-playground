"use client";
import React, { useState } from "react";
import ThreeDot from "@/assets/images/icons/three_dot.svg";

type Props = {
  id: string;
  title: string;
};

export default function Thead({ id, title }: Props) {
  const [tooltipShow, settooltipShow] = useState<boolean>(false);
  return (
    <th className="px-3 py-2 border border-border dark:text-primary" key={id}>
      <div className="flex flex-col">
        <div className="flex flex-row justify-between">
          <div className="dark:text-secondary font-medium text-sm">Role</div>
          <div className="relative">
            <ThreeDot className="size-6 dark:fill-secondary cursor-pointer hover:dark:fill-primary transition" />
            <div
              className={`absolute flex flex-col top-full right-0 min-w-16 z-1 dark:bg-surface-1 rounded transition-opacity ${
                !tooltipShow ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <div className="text-sm px-1.5 py-1 dark:border-border dark:border rounded dark:hover:bg-surface-2 cursor-pointer">
                Delete
              </div>
            </div>
          </div>
        </div>

        <div className="dark:text-primary font-medium text-base text-left">
          {title}
        </div>
      </div>
    </th>
  );
}
