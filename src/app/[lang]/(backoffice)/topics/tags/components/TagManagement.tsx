//src/app/[lang]/(backoffice)/topics/tags/components/TagManagement.tsx
"use client";
import Pagination from "@/components/Pagination";
import {
  FilterDropdown,
  SearchComponent,
  type FilterDropdownItem,
} from "@/components/Search";
import { FilterBar } from "@/components/Search/Filter";
import { useMemo, useState, useTransition } from "react";
import Card from "../../components/Card";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tag } from "@/app/feature/topic-tags";
import { SearchResult } from "@/app/utils/service";
import Link from "next/link";
import {
  SkeletonElement,
  SkeletonWrapper,
} from "@/components/SkeletionLoading";

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
    value: "created_at",
    title: "Last used",
  },
  {
    value: "-created_at",
    title: "Newest",
  },
  {
    value: "usage_count",
    title: "Most used",
  },
  {
    value: "-usage_count",
    title: "Least used",
  },
];

function TagManagement({ hasPermission, limit, currentPage, data }: Props) {
  const { list, total } = data;
  const [state, setState] = useState(initialState);
  const [pending, startTransition] = useTransition();
  const { replace, push } = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();

  const writeEnable = hasPermission;

  const handleSortSelected = (k: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", k);
    const newPath = `${pathname}?${params.toString()}`;
    startTransition(() => {
      replace(newPath, { scroll: false });
    });
  };

  const handlePageChange = (n: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", n + "");
    const newPath = `${pathname}?${params.toString()}`; // topics/tags?page=2
    startTransition(() => {
      replace(newPath, { scroll: false });
    });
  };

  const handlePageSizeSelected = (pageSize: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("limit", pageSize + "");
    const newPath = `${pathname}?${params.toString()}`; // .../topics/tags?limit=10
    startTransition(() => {
      replace(newPath, { scroll: false });
    });
  };

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    const newPath = `${pathname}?${params.toString()}`;
    startTransition(() => {
      replace(newPath, { scroll: false });
    });
  };

  const handleTagEdit = (id: string) => {
    push(`${pathname}/${id}/edit`, { scroll: false, });
  };

  const handleTagDelete = (id: string) => {
    push(`${pathname}/${id}/delete`, { scroll: false });
  };

  const pageTotal = useMemo(() => {
    return Math.ceil(total / limit);
  }, [total, limit]);  

  const { filterVisible } = state;
  return (
    <>
      <div className="h-screen flex flex-col items-start max-w-300 mx-auto p-4 mt-2">
        <div className="flex flex-row mb-6 gap-4 w-full">
          <h1 className="font-semibold dark:text-accent-0 text-4xl">Tag Managment</h1>
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
            onSelected={(n) => handlePageSizeSelected(n)}
            onSearch={(term) => handleSearch(term)}
          />
          <Link
            href={`topics/tags/create`}
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
              onItemSelected={(val) => handleSortSelected(val)}
            />
          </FilterBar>
        </div>
        <div className="grid mt-4 md:mt-6 lg:mt-8 xl:mt-10 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 mx-auto">
          {pending
            ? Array.from({ length: limit }).map((_, i) => {
                return (
                  <div className="xl:w-70 xl:h-42 max-h-42 h-auto md:w-65 rounded-xl overflow-hidden">
                    <SkeletonWrapper key={i}>
                      <SkeletonElement
                        width={"100%"}
                        height={"100%"}
                      ></SkeletonElement>
                    </SkeletonWrapper>
                  </div>
                );
              })
            : list.map((item) => (
                <Card
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  slug={item.slug}
                  description={item.description || ""}
                  count={item.usageCount || 0}
                  tagColor={item.color}
                  onDelete={() => handleTagDelete(item.id)}
                  onEdit={() => handleTagEdit(item.id)}
                />
              ))}
        </div>
        <div className="mt-6 md:mt-8 lg:mt-10 self-center">
          <Pagination
            pageTotal={pageTotal}
            currentPage={currentPage}
            onPageChanged={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}

export default TagManagement;
