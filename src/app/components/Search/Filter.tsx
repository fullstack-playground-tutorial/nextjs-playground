"use client"
import React from "react";
import FilterOnIcon from "./filter.svg";
import FilterOffIcon from "./filter_off.svg";
import {
  FilterDropdown,
  type FilterDropdownProps,
} from "./FilterDropdown";

interface FilterButtonProps {
  onFilterToggle: () => void;
  active: boolean;
}
export const FilterButton = ({ onFilterToggle, active }: FilterButtonProps) => {
  const handleClick = () => {
    onFilterToggle();
  };
  return (
    <>
      <button
        className="flex justify-center items-center h-10 aspect-square cursor-pointer rounded-md transition-colors outline-none hover:shadow-md dark:bg-surface-1 dark:hover:bg-surface-0 border dark:border-border group"
        type="button"
        onClick={handleClick}
      >
        {!active ? (
          <FilterOnIcon
            className={`size-6 dark:fill-primary dark:group-hover:fill-accent-0`}
          />
        ) : (
          <FilterOffIcon
            className={`size-6 dark:fill-primary dark:group-hover:fill-accent-0`}
          />
        )}
      </button>
    </>
  );
};

type FilterChildren = React.ReactElement<FilterDropdownProps>;
interface Props {
  visible: boolean;
  children: FilterChildren | FilterChildren[];
}

export const FilterBar = ({ visible, children }: Props) => {
  const clonedChildren = React.Children.map(children, (child) => {
    const props = child.props as FilterDropdownProps;

    return <FilterDropdown key={props.name} {...props} />;
  });
  return (
    <div className={`transition-all ${visible ? "" : "opacity-0 pointer-events-none"}`}>
      {clonedChildren}
    </div>
  );
};
