"use client";
import {
  FilterDropdown,
  FilterDropdownItem,
  SearchComponent,
} from "@/components/Search";
import { FilterBar } from "@/components/Search/Filter";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
type Props = {
  size?: number;
  keyword: string;
};
const selectedList: FilterDropdownItem[] = [
  {
    value: "createdAt",
    title: "Last used",
  },
  {
    value: "-createdAt",
    title: "Newest",
  },
];

export default function Search({ size, keyword }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [visibility, setVisibility] = useState(false);
  const { replace } = useRouter();
  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    const newPath = `${pathname}?${params.toString()}`;
    replace(newPath, { scroll: false });
  };

  const handleSelected = (k: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("sort", k);
    const newPath = `${pathname}?${params.toString()}`;
    replace(newPath, { scroll: false });
  };

  return (
    <>
      <div className="flex flex-row justify-between gap-2 sm:gap-4 items-start mb-2">
        <SearchComponent
          placeHolder={"Search Role"}
          filterOn={visibility}
          onFilterToggle={() => setVisibility((prev) => !prev)}
          onSearch={handleSearch}
          pageSize={size}
          keyword={keyword}
        />
        <Link
          href={pathname + "/create"}
          className="btn btn-md dark:bg-accent-0 dark:text-primary cursor-pointer transition dark:hover:bg-accent-1 dark:active:bg-accent-1"
        >
          + New Role
        </Link>
      </div>
      <div
        className={`transition-all self-start ${visibility ? "mt-2" : "h-0"}`}
      >
        <FilterBar visible={visibility}>
          <FilterDropdown
            name={"sort"}
            selectedList={selectedList}
            placeHolder="Sort by"
            onItemSelected={(val) => handleSelected(val)}
          />
        </FilterBar>
      </div>
    </>
  );
}
