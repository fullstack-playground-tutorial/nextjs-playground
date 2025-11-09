"use client";
import Pagination from "@/components/Pagination";
import {
  FilterDropdown,
  SearchComponent,
  type FilterDropdownItem,
} from "@/components/Search";
import { FilterBar } from "@/components/Search/Filter";
import { Suspense, use, useMemo, useState, useTransition } from "react";
import Card from "../../components/Card";
import {
  SkeletonElement,
  SkeletonWrapper,
} from "@/components/SkeletionLoading";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tag } from "@/app/feature/topic-tags";
import { SearchResult } from "@/app/utils/service";

type Props = {
  data: Promise<SearchResult<Tag>>;
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
  const { list, total } = use(data);
  const [state, setState] = useState(initialState);
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
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
    replace(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const handleCreateClick = () => {
    const params = new URLSearchParams(searchParams);
    params.set("showModal", "true");
    params.delete("id");
    params.set("action", "create");
    replace(`${pathname}?${params.toString()}`);
  };

  const handleTagEdit = (id: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("showModal", "true");
    params.set("id", id);
    params.set("action", "edit");
    replace(`${pathname}?${params.toString()}`);
  };

  const handleTagDelete = (id: string, title: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("showModal", "true");
    params.set("id", id);
    params.set("action", "delete");
    replace(`${pathname}?${params.toString()}`);
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
          <button
            hidden={!writeEnable}
            onClick={handleCreateClick}
            className="btn btn-sm dark:border dark:border-accent-0 dark:active:border-accent-1 dark:hover:bg-accent-1 dark:hover:text-primary dark:text-accent-0 transition"
          >
            + New Tag
          </button>
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
          <Suspense
            fallback={
              <>
                <SkeletonWrapper className="xl:w-70 xl:h-40 max-h-40 h-auto md:w-65 w-full rounded-xl">
                  <SkeletonElement
                    width={"100%"}
                    height={"100%"}
                  ></SkeletonElement>
                </SkeletonWrapper>
                <SkeletonWrapper className="xl:w-70 xl:h-40 max-h-40 h-auto md:w-65 w-full rounded-xl">
                  <SkeletonElement
                    width={"100%"}
                    height={"100%"}
                  ></SkeletonElement>
                </SkeletonWrapper>
                <SkeletonWrapper className="xl:w-70 xl:h-40 max-h-40 h-auto md:w-65 w-full rounded-xl">
                  <SkeletonElement
                    width={"100%"}
                    height={"100%"}
                  ></SkeletonElement>
                </SkeletonWrapper>
                <SkeletonWrapper className="xl:w-70 xl:h-40 max-h-40 h-auto md:w-65 w-full rounded-xl">
                  <SkeletonElement
                    width={"100%"}
                    height={"100%"}
                  ></SkeletonElement>
                </SkeletonWrapper>
                <SkeletonWrapper className="xl:w-70 xl:h-40 max-h-40 h-auto md:w-65 w-full rounded-xl">
                  <SkeletonElement
                    width={"100%"}
                    height={"100%"}
                  ></SkeletonElement>
                </SkeletonWrapper>
                <SkeletonWrapper className="xl:w-70 xl:h-40 max-h-40 h-auto md:w-65 w-full rounded-xl">
                  <SkeletonElement
                    width={"100%"}
                    height={"100%"}
                  ></SkeletonElement>
                </SkeletonWrapper>
                <SkeletonWrapper className="xl:w-70 xl:h-40 max-h-40 h-auto md:w-65 w-full rounded-xl">
                  <SkeletonElement
                    width={"100%"}
                    height={"100%"}
                  ></SkeletonElement>
                </SkeletonWrapper>
                <SkeletonWrapper className="xl:w-70 xl:h-40 max-h-40 h-auto md:w-65 w-full rounded-xl">
                  <SkeletonElement
                    width={"100%"}
                    height={"100%"}
                  ></SkeletonElement>
                </SkeletonWrapper>
                <SkeletonWrapper className="xl:w-70 xl:h-40 max-h-40 h-auto md:w-65 w-full rounded-xl">
                  <SkeletonElement
                    width={"100%"}
                    height={"100%"}
                  ></SkeletonElement>
                </SkeletonWrapper>
                <SkeletonWrapper className="xl:w-70 xl:h-40 max-h-40 h-auto md:w-65 w-full rounded-xl">
                  <SkeletonElement
                    width={"100%"}
                    height={"100%"}
                  ></SkeletonElement>
                </SkeletonWrapper>
                <SkeletonWrapper className="xl:w-70 xl:h-40 max-h-40 h-auto md:w-65 w-full rounded-xl">
                  <SkeletonElement
                    width={"100%"}
                    height={"100%"}
                  ></SkeletonElement>
                </SkeletonWrapper>
                <SkeletonWrapper className="xl:w-70 xl:h-40 max-h-40 h-auto md:w-65 w-full rounded-xl">
                  <SkeletonElement
                    width={"100%"}
                    height={"100%"}
                  ></SkeletonElement>
                </SkeletonWrapper>
              </>
            }
          >
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
          </Suspense>
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
