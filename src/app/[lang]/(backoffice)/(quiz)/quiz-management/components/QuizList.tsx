"use client";

import {
  FilterDropdown,
  FilterDropdownItem,
  SearchComponent,
} from "@/components/Search";
import { FilterBar } from "@/components/Search/Filter";
import { startTransition, use, useMemo, useState } from "react";

import GridIcon from "../../../components/Sidebar/icons/grid_menu.svg";
import ListIcon from "../../../components/Sidebar/icons/menu.svg";
import QuizIcon from "../../../components/Sidebar/icons/quiz.svg";
import { Quiz } from "@/app/feature/quiz";
import Pagination from "@/components/Pagination";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import BinIcon from "@/app/assets/images/icons/bin.svg";
import EditIcon from "@/app/assets/images/icons/edit.svg";
import PlayCircleIcon from "@/app/assets/images/icons/play_circle.svg";
import TopicIcon from "@/app/assets/images/icons/topic.svg";
import Link from "next/link";

export default function QuizList({
  data,
  limit,
  current,
  keyword,
}: {
  data: Promise<{
    list: Quiz[];
    total: number;
  }>;
  limit: number;
  current: number;
  keyword: string;
}) {
  const { list, total } = use(data);
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(keyword || "");
  const [filterVisibility, setFilterVisibility] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const { replace } = useRouter();
  const pathname = usePathname();

  const pageTotal = useMemo(() => {
    return Math.ceil(total / limit);
  }, [total, limit]);

  const filteredQuizzes = list.filter((quiz) =>
    quiz.title ? quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) : "".includes(searchTerm.toLowerCase()),
  );

  const handlePageChange = (n: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", n + "");
    const newPath = `${pathname}?${params.toString()}`;
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
    replace(newPath, { scroll: false });
  };

  const handleLimitChange = (n: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("limit", n + "");
    const newPath = `${pathname}?${params.toString()}`;
    replace(newPath, { scroll: false });
  };

  const sortOptions: FilterDropdownItem[] = [
    { value: "created_at", title: "Date Created" },
    { value: "-created_at", title: "Newest First" },
    { value: "title", title: "Title (A-Z)" },
    { value: "-title", title: "Title (Z-A)" },
  ];

  const handleSortChange = (val: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", val);
    const newPath = `${pathname}?${params.toString()}`;
    replace(newPath, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between items-center bg-surface-1 p-4 rounded-lg shadow-sm border dark:border-border">
          <div className="flex-1 max-w-2xl">
            <SearchComponent
              placeHolder="Search quizzes..."
              filterOn={filterVisibility}
              onFilterToggle={() => setFilterVisibility(!filterVisibility)}
              onSearch={handleSearch}
              onQueryChange={(q) => setSearchTerm(q)}
              keyword={searchTerm}
              pageSize={limit}
              onSelected={handleLimitChange}
            />
          </div>
          <div className="flex gap-2 items-center ml-4">
            {/* View Toggle */}
            <div className="flex bg-white dark:bg-surface-0 border dark:border-border rounded-md shadow-sm">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-l-md hover:bg-gray-50 dark:hover:bg-surface-1 ${viewMode === "list"
                  ? "bg-gray-100 dark:bg-surface-2 text-accent-0"
                  : "text-gray-500 dark:text-secondary"
                  }`}
                title="List View"
              >
                <ListIcon className="size-5 fill-current" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-r-md hover:bg-gray-50 dark:hover:bg-surface-1 ${viewMode === "grid"
                  ? "bg-gray-100 dark:bg-surface-2 text-accent-0"
                  : "text-gray-500 dark:text-secondary"
                  }`}
                title="Grid View"
              >
                <GridIcon className="size-5 fill-current" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div
          className={`transition-all overflow-hidden ${filterVisibility ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="bg-surface-1 p-4 rounded-lg border dark:border-border shadow-sm">
            <FilterBar visible={filterVisibility}>
              <FilterDropdown
                name="sort"
                selectedList={sortOptions}
                placeHolder="Sort by"
                onItemSelected={handleSortChange}
              />
            </FilterBar>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        {viewMode === "list" ? (
          <div className="overflow-x-auto rounded-lg border dark:border-border shadow">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-border">
              <thead className="bg-gray-50 dark:bg-surface-1">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-secondary uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-secondary uppercase tracking-wider"
                  >
                    Time (min)
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-secondary uppercase tracking-wider"
                  >
                    Questions
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-secondary uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-secondary uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-surface-0 divide-y divide-gray-200 dark:divide-border">
                {filteredQuizzes.map((quiz) => (
                  <tr
                    key={quiz.id}
                    className="hover:bg-gray-50 dark:hover:bg-surface-1 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium dark:text-primary">
                        {quiz.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-secondary">
                        ID: {quiz.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm dark:text-secondary">
                        {quiz.duration}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm dark:text-secondary">
                        {quiz.questionCount || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-xs px-2 py-1 rounded-full inline-block ${quiz.status === 'publish' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {quiz.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`${pathname}/${quiz.id}`}
                        className="text-accent-0 hover:text-accent-1 mr-4 cursor-pointer"
                      >
                        Preview
                      </Link>
                      <button className="text-accent-0 hover:text-accent-1 mr-4 cursor-pointer">
                        Edit
                      </button>
                      <Link href={`${pathname}/${quiz.id}/delete`} className="text-red-600 cursor-pointer hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        Delete
                      </Link>
                    </td>
                  </tr>
                ))}
                {filteredQuizzes.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-sm dark:text-secondary"
                    >
                      No quizzes found matching "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white dark:bg-surface-0 border dark:border-border rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col h-full"
              >
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-accent-0/10 rounded-lg">
                      <QuizIcon className="size-8 fill-accent-0" />
                    </div>
                    <div className="flex flex-col items-end">
                      <div className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${quiz.status === 'publish' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {quiz.status}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold dark:text-primary mb-2 line-clamp-1">
                    {quiz.title}
                  </h3>

                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-secondary">
                        Questions:
                      </span>
                      <span className="font-semibold dark:text-primary">
                        {quiz.questionCount}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-secondary">
                        Time Limit:
                      </span>
                      <span className="font-semibold dark:text-primary">
                        {quiz.duration}m
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 flex justify-between items-center gap-2">
                    <div className="flex gap-2">
                      <Link
                        href={`${pathname}/${quiz.id}`}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-surface-1 rounded-full transition-colors group"
                        title="Preview"
                      >
                        <TopicIcon className="size-5 fill-gray-400 dark:fill-secondary group-hover:fill-accent-0" />
                      </Link>
                      <Link
                        href={`${pathname}/${quiz.id}/edit`}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-surface-1 rounded-full transition-colors group"
                      >
                        <EditIcon className="size-5 fill-gray-400 dark:fill-secondary group-hover:fill-accent-0" />
                      </Link>
                      <Link
                        href={`${pathname}/${quiz.id}/delete`}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-surface-1 rounded-full transition-colors group"
                        title="Delete"
                      >
                        <BinIcon className="size-5 fill-gray-400 dark:fill-secondary group-hover:fill-red-500" />
                      </Link>
                    </div>
                    <Link
                      href={`${pathname}/${quiz.id}`}
                      className="flex items-center gap-2 px-4 py-2 -mr-7 bg-accent-0 hover:bg-accent-1 text-white rounded-l-lg rounded-r-sm transition-colors text-sm font-medium"
                    >
                      <PlayCircleIcon className="size-4 fill-current" />
                      Start <br /> Quiz
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredQuizzes.length === 0 && viewMode === "grid" && (
          <div className="p-10 text-center text-gray-500 dark:text-secondary">
            No quizzes found matching "{searchTerm}"
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4 border-t dark:border-border">
        <span className="text-sm dark:text-secondary">
          Showing {filteredQuizzes.length} of {total} entries
        </span>
        <Pagination
          total={pageTotal}
          currentPage={current}
          onPageChanged={handlePageChange}
        />
      </div>
    </div>
  );
}
