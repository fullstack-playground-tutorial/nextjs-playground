"use client"
import { useState } from "react";
import DropdownIcon from "./arrow_down.svg";

export type FilterDropdownProps = {
  name: string;
  placeHolder?: string; // not use placeHolder if not passing value.
  selectedList: FilterDropdownItem[];
  onItemSelected: (val: any) => void;
};

export type FilterDropdownItem = {
  value: any;
  title: string;
};

export type FilterDropdownMap = {
  [key: string]: FilterDropdownItem;
};

type InternalState = {
  collapsed: boolean;
  selectedItem?: FilterDropdownItem;
};

const initialState: InternalState = {
  collapsed: false,
};

export const FilterDropdown = ({
  placeHolder: label,
  selectedList,
  onItemSelected,
}: FilterDropdownProps) => {
  const [state, setState] = useState(initialState);
  const handleItemSelected = (
    e: React.MouseEvent,
    item: FilterDropdownItem
  ) => {
    e.stopPropagation();
    onItemSelected(item.value);
    setState((prev) => ({ ...prev, collapsed: false, selectedItem: item }));
  };
  const handleToggleCollapsed = () => {
    setState((prev) => ({ ...prev, collapsed: !prev.collapsed }));
  };

  const { selectedItem, collapsed } = state;
  return (
    <>
      <div className={`flex flex-col`}>
        <div
          className="relative flex flex-row items-center justify-between group cursor-pointer gap-2 h-10 dark:bg-surface-1 dark:hover:bg-surface-0 shadow dark:hover:shadow-md dark:border-border border rounded-md px-3 py-2"
          onClick={handleToggleCollapsed}
        >
          <div className="text-primary text-sm font-semibold w-40 dark:group-hover:text-accent-0">
            {selectedItem ? selectedItem.title : label}
          </div>
          <DropdownIcon
            className={`size-6 transition-transform dark:group-hover:fill-accent-0 ${
              collapsed ? "rotate-180 fill-accent-0" : ""
            }`}
          />
          <div
            className={`absolute transition-colors z-1 shadow dark:bg-surface-1 overflow-hidden text-sm min-h-40 ${
              collapsed ? "" : "opacity-0 pointer-events-none"
            } flex flex-col items-center justify-center rounded-md border dark:border-border shadow top-[calc(100%+8px)] left-0 w-full`}
          >
            {selectedList.map((item) => (
              <div
                key={item.title}
                onClick={(e) => handleItemSelected(e, item)}
                className="dark:hover:text-accent-0 w-full cursor-pointer px-3 py-2 dark:hover:bg-surface-0 dark:active:bg-surface-2"
              >
                {item.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
