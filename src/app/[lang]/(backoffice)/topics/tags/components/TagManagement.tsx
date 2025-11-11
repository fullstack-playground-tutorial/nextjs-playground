//src/app/[lang]/(backoffice)/topics/tags/components/TagManagement.tsx
"use client";
import Pagination from "@/components/Pagination";
import {
  FilterDropdown,
  SearchComponent,
  type FilterDropdownItem,
} from "@/components/Search";
import { FilterBar } from "@/components/Search/Filter";
import { useMemo, useState } from "react";
import Card from "../../components/Card";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tag } from "@/app/feature/topic-tags";
import { SearchResult } from "@/app/utils/service";
import Link from "next/link";

type Props = {
  data: SearchResult<Tag>;
  hasPermission: boolean;
  limit: number;
  currentPage: number;
  sort?: string;
};

type InternalState = {
  filterVisible: boolean;
  currentPage: number;
};

const initialState: InternalState = {
  filterVisible: false,
  currentPage: 1,
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
  {
    value: "usageCount",
    title: "Most used",
  },
  {
    value: "-usageCount",
    title: "Least used",
  },
];

function TagManagement({ hasPermission, limit, currentPage, data }: Props) {
  const { list, total } = data;
  const [state, setState] = useState(initialState);
  const { replace, push } = useRouter();
  const basePath = "/topics/tags";
  const searchParams = useSearchParams();
  const handleQueryChange = (q: string) => {
    setState((prev) => ({ ...prev, q: q }));
  };

  const writeEnable = hasPermission;

  const handleSelected = (k: string) => {
    setState((prev) => ({ ...prev, sort: k }));
  };

  const handlePageSizeSelected = (pageSize: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("limit", pageSize.toString());
    replace(`${basePath}?${params.toString()}`);
  };

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }

    replace(`${basePath}?${params.toString()}`);
  };

  const handleTagEdit = (id: string) => {
    push(`${basePath}/${id}/edit`, {scroll: false});
  };

  const handleTagDelete = (id: string, title: string) => {

    push(`${basePath}/${id}/delete`, {scroll: false});
  };

  const pageTotal = useMemo(() => {
    if (total) return 0;
    return Math.ceil(total / limit);
  }, [total, limit]);

  const { filterVisible } = state;
  return (
    <>
      <div className="h-screen flex flex-col items-start max-w-300 mx-auto p-4 mt-2">
        <div className="flex flex-row mb-6 gap-4 w-full">
          <h1 className="font-semibold dark:text-accent-0">Tag Managment</h1>
        </div>
        <div className="flex flex-row justify-between items-center gap-4 w-full">
          <SearchComponent
            onFilterToggle={() =>
              setState((prev) => ({
                ...prev,
                filterVisible: !prev.filterVisible,
              }))
            }
            pageSize={limit}
            filterOn={filterVisible}
            placeHolder="Filter by tag name ..."
            onQueryChange={handleQueryChange}
            onSelected={(n) => handlePageSizeSelected(n)}
            onSearch={(term) => handleSearch(term)}
          />
          <Link
            href={`${basePath}/create`}
            hidden={!writeEnable}
            scroll={false}
            className="btn btn-sm dark:border dark:border-accent-0 dark:active:border-accent-1 dark:hover:bg-accent-1 dark:hover:text-primary dark:text-accent-0 transition"
          >
            + New Tag
          </Link>
        </div>
        <div className={`transition-all ${filterVisible ? "mt-2" : "h-0"}`}>
          <FilterBar visible={filterVisible}>
            <FilterDropdown
              name={"sort"}
              selectedList={selectedList}
              placeHolder="Sort by"
              onItemSelected={(val) => handleSelected(val)}
            />
          </FilterBar>
        </div>
        <div className="grid mt-4 md:mt-6 lg:mt-8 xl:mt-10 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 mx-auto">
          {list.map((item) => (
            <Card
              key={item.id}
              id={item.id}
              title={item.title}
              slug={item.slug}
              description={item.description || ""}
              count={item.usageCount || 0}
              tagColor={item.color}
              onDelete={() => handleTagDelete(item.id, item.title)}
              onEdit={() => handleTagEdit(item.id)}
            />
          ))}
        </div>
        <div className="mt-6 md:mt-8 lg:mt-10 self-center">
          <Pagination
            pageTotal={pageTotal}
            currentPage={currentPage}
            onPageChanged={(n) =>
              setState((prev) => ({ ...prev, currentPage: n }))
            }
          />
        </div>
      </div>
    </>
  );
}

export default TagManagement;
