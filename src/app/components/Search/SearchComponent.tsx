"use client"
import { SearchBar } from ".";
import { FilterButton } from "./Filter";
type Props = {
  placeHolder: string;
  onQueryChange: (q: string) => void;
  filterOn: boolean;
  onFilterToggle: () => void;
  pageSize?: number;
  onSelected?: (n: number) => void;
  onSearch: (term:string) => void;
};
function SearchComponent({
  placeHolder,
  onQueryChange,
  filterOn,
  onFilterToggle,
  onSelected,
  onSearch,
  pageSize,
}: Props) {
  return (
    <div className="flex flex-row gap-2">
      <SearchBar
        placeHolder={placeHolder}
        onQueryChange={onQueryChange}
        onSelected={onSelected}
        pageSize={pageSize}
        onSearch={onSearch}
      />
      <FilterButton onFilterToggle={onFilterToggle} active={filterOn} />
    </div>
  );
}

export default SearchComponent;
