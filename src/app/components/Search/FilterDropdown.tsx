"use client"
import { useState } from "react";
import DropdownIcon from "./arrow_down.svg";

export type FilterDropdownProps = {
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
  placeHolder,
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
      <div className="relative inline-block min-w-50">
        <div
          className={`flex items-center justify-between gap-2 h-10 px-4 py-2 rounded-xl transition-all duration-300 cursor-pointer border group
            ${collapsed
              ? 'dark:bg-surface-2 dark:border-accent-0 dark:shadow-[0_0_15px_rgba(255,183,77,0.15)] border-accent-0 ring-1 ring-accent-0/20'
              : 'dark:bg-surface-1 dark:hover:bg-surface-2 dark:border-border border-gray-200 hover:border-accent-0/50 dark:hover:border-accent-0/50 shadow-sm'
            }
          `}
          onClick={handleToggleCollapsed}
        >
          <div className="text-sm font-medium truncate dark:text-primary text-gray-700">
            {selectedItem ? selectedItem.title : (placeHolder || "Select...")}
          </div>
          <div className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}>
            <DropdownIcon
              className={`size-5 transition-colors duration-300 ${collapsed ? "fill-accent-0" : "dark:fill-secondary fill-gray-400 group-hover:fill-accent-0"
                }`}
            />
          </div>
        </div>

        {/* Dropdown Menu */}
        <div
          className={`absolute z-50 top-[calc(100%+8px)] left-0 w-full overflow-hidden transition-all duration-300 origin-top
            ${collapsed
              ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
              : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
            }
          `}
        >
          <div className="flex flex-col py-1.5 rounded-xl border dark:border-border border-gray-200 dark:bg-surface-1/90 bg-white/90 backdrop-blur-xl shadow-2xl overflow-y-auto max-h-64 custom-scrollbar">
            {selectedList.length > 0 ? (
              selectedList.map((item) => {
                const isSelected = selectedItem?.value === item.value;
                return (
                  <div
                    key={`${item.title}-${item.value}`}
                    onClick={(e) => handleItemSelected(e, item)}
                    className={`px-4 py-2.5 text-sm transition-all duration-200 cursor-pointer flex items-center justify-between
                      ${isSelected
                        ? "dark:bg-accent-0/10 bg-accent-0/5 dark:text-accent-0 text-accent-1 font-semibold"
                        : "dark:text-secondary text-gray-600 dark:hover:bg-surface-2 dark:hover:text-primary hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    <span>{item.title}</span>
                    {isSelected && (
                      <div className="size-1.5 rounded-full bg-accent-0 shadow-[0_0_8px_rgba(255,183,77,0.5)]" />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-3 text-sm italic dark:text-tertiary-1 text-gray-400 text-center">
                No options available
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
