"use client"
import { useEffect, useRef, useState } from "react";
import SearchIcon from "./search.svg";
import PageList from "./PageList";
import CloseIcon from "./close.svg";
import { useRouter } from "next/navigation";
type Props = {
  placeHolder: string;
  onQueryChange?: (q: string) => void;
  pageSize?: number; // If pageSize equal undefined => turn off page size filter
  onSelected?: (n: number) => void;
  onSearch: (term: string) => void;
};

const DEBOUNCE_TIME = 500;

function Search({
  placeHolder,
  onQueryChange,
  pageSize,
  onSelected,
  onSearch,
}: Props) {
  const [q, setQ] = useState("");
  const ref = useRef<NodeJS.Timeout>(undefined);

  const handleChangeQ = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQ(e.target.value);
  };

  const handleClear = () => {
    setQ("");
  };

  const handleSelected = (n: number) => {
    onSelected?.(n);
  };

  const handleSearchClick = () => {
    onSearch(q)
  };

  useEffect(() => {
    ref.current = setTimeout(() => {
      onQueryChange?.(q);
    }, DEBOUNCE_TIME);
    return () => {
      clearTimeout(ref.current);
    };
  }, [q]);
  return (
    <div className="flex flex-row">
      <div
        className={`flex flex-row w-full px-3 py-2 h-10 gap-3 items-center  dark:border-border dark:bg-surface-1 dark:focus-within:bg-surface-0 transition shadow ${
          pageSize ? " border-y border-l rounded-l-md" : "border rounded-md"
        }`}
      >
        <button className="rounded-full w-auto shadow cursor-pointer items-center justify-center group">
          <SearchIcon
            className="size-6 dark:fill-primary dark:active:fill-accent-0 dark:group-hover:fill-accent-0"
            onClick={handleSearchClick}
          />
        </button>
        <input
          type="text"
          name="keyword"
          id="keyword"
          className="w-full caret-accent-0 h-full text-sm font-medium dark:focus:outline-none dark:placeholder-secondary"
          placeholder={placeHolder}
          onChange={(e) => handleChangeQ(e)}
          value={q}
        />
        <button
          className={`rounded-full ${
            q.length > 0 ? "opacity-100" : "opacity-0"
          }  dark:bg-surface-0 flex items-center text-xs font-stretch-expanded justify-center cursor-pointer shadow`}
          onClick={handleClear}
        >
          <CloseIcon className="dark:fill-primary dark:hover:fill-accent-0 size-4 line-3" />
        </button>
      </div>
      {pageSize && <PageList value={pageSize} onSelected={handleSelected} />}
    </div>
  );
}

export default Search;
