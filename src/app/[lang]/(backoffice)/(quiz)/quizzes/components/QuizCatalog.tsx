"use client";

import { SearchComponent } from "@/components/Search";
import { useMemo, useState } from "react";

import { Quiz } from "@/app/feature/quiz";
import Pagination from "@/components/Pagination";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import PlayCircleIcon from "@/app/assets/images/icons/play_circle.svg";
import Link from "next/link";

export default function QuizCatalog({
  data,
  limit,
  current,
  keyword,
}: {
  data: {
    list: Quiz[];
    total: number;
  };
  limit: number;
  current: number;
  keyword: string;
}) {
  const { list, total } = data;
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(keyword || "");
  const { replace } = useRouter();
  const pathname = usePathname();

  const pageTotal = useMemo(() => {
    return Math.ceil(total / limit);
  }, [total, limit]);

  const filteredQuizzes = list.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handlePageChange = (n: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", n + "");
    const newPath = `${pathname}?${params.toString()}`;
    replace(newPath, { scroll: false });
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

  return (
    <div className="flex flex-col gap-6">
      {/* Search Bar */}
      <div className="bg-surface-1 p-4 rounded-xl border dark:border-border shadow-sm">
        <div className="max-w-2xl">
          <SearchComponent
            placeHolder="Search available quizzes..."
            filterOn={false}
            onFilterToggle={() => {}}
            onSearch={handleSearch}
            onQueryChange={(q) => setSearchTerm(q)}
            keyword={searchTerm}
            pageSize={limit}
            onSelected={handleLimitChange}
          />
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[500px]">
        {filteredQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="group relative bg-white dark:bg-surface-0 border dark:border-border rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden"
          >
            {/* Visual Header */}
            <div className="h-2 bg-accent-0 w-full opacity-50 group-hover:opacity-100 transition-opacity"></div>

            <div className="p-6 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-accent-0/10 rounded-xl group-hover:bg-accent-0 transition-colors duration-300">
                  <PlayCircleIcon className="size-6 fill-accent-0 group-hover:fill-white transition-colors" />
                </div>
                <div className="text-right">
                  <span className="block text-2xl font-black text-accent-0 leading-none">
                    {quiz.point}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-secondary tracking-tighter">
                    Max Points
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold dark:text-primary mb-2 line-clamp-2">
                {quiz.title}
              </h3>

              {quiz.description && (
                <p className="text-sm dark:text-secondary line-clamp-2 mb-4">
                  {quiz.description}
                </p>
              )}

              <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t dark:border-border">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-secondary">
                    Questions
                  </span>
                  <span className="font-bold text-sm dark:text-primary">
                    {quiz.questions.length}
                  </span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[10px] uppercase font-bold text-secondary">
                    Duration
                  </span>
                  <span className="font-bold text-sm dark:text-primary">
                    {~~(quiz.timeout / 60)} min
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-2">
                <Link
                  href={`/quizzes/test/${quiz.id}`}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent-0 hover:bg-accent-1 text-white rounded-xl transition-all font-bold text-sm shadow-lg shadow-accent-0/20 active:scale-95"
                >
                  Start Quiz
                </Link>
              </div>
            </div>
          </div>
        ))}

        {filteredQuizzes.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-20 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold dark:text-primary">
              No Quizzes Found
            </h3>
            <p className="text-secondary mt-2">
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center py-6 border-t dark:border-border">
        <span className="text-sm dark:text-secondary font-medium">
          Showing {filteredQuizzes.length} of {total} quizzes
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
