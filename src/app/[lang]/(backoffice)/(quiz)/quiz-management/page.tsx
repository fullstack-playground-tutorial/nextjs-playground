import Link from "next/link";
import QuizList from "./components/QuizList";
import { getQuizService } from "@/app/core/server/context";

type SearchParams = {
  q?: string;
  page?: string;
  sort?: string;
  limit?: string;
  id?: string;
};

type Props = {
  searchParams?: Promise<SearchParams>;
};

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  const q = searchParams?.q || "";
  const currentPage = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 25;
  const sort = searchParams?.sort || "created_at";
  const offset = (currentPage - 1) * limit;

  const data = getQuizService().search({
    keyword: q,
    limit: limit,
    offset: offset,
    sort: sort,
  });



  return (
    <>
      <div className="p-6 min-h-screen dark:text-primary flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold dark:text-accent-0 text-shadow-lg">
              Quiz Management
            </h1>
            <p className="text-sm dark:text-secondary mt-1">
              Manage your quiz catalog
            </p>
          </div>
          <Link href="quiz-management/create">
            <button className="bg-accent-0 hover:bg-accent-1 text-white font-semibold py-2 px-4 rounded shadow transition-colors">
              + Create New
            </button>
          </Link>
        </div>
        <QuizList data={data} limit={limit} current={currentPage} keyword={q} />
      </div>
    </>
  );
}
