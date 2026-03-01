import Link from "next/link";
import QuizCatalog from "./components/QuizCatalog";
import { getQuizService } from "@/app/core/server/context";

type SearchParams = {
  q?: string;
  page?: string;
  sort?: string;
  limit?: string;
};

type Props = {
  searchParams?: Promise<SearchParams>;
};

export default async function QuizzesPage(props: Props) {
  const searchParams = await props.searchParams;
  const q = searchParams?.q || "";
  const currentPage = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 25;
  const sort = searchParams?.sort || "created_at";

  // In a real application, you would fetch from a service:
  const data = await getQuizService().search({
    keyword: q,
    limit: limit,
    offset: 0,
    sort: sort,
  });

  return (
    <div className="p-6 min-h-screen dark:text-primary flex flex-col gap-8">
      {/* Hero / Welcome Section */}
      <div className="relative overflow-hidden bg-accent-0/10 rounded-3xl p-8 md:p-12 border dark:border-accent-0/20">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-black dark:text-accent-0 mb-4 tracking-tight">
            Knowledge Hub
          </h1>
          <p className="text-lg dark:text-secondary leading-relaxed">
            Challenge yourself with our curated selection of quizzes. Test your
            knowledge, track your progress, and master new topics.
          </p>
        </div>
        {/* Background Decorative Element */}
        <div className="absolute right-[-5%] top-[-20%] size-64 bg-accent-0/20 blur-3xl rounded-full"></div>
        <div className="absolute right-8 bottom-8 z-10">
          <Link
            href="/quizzes/history"
            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl transition-all font-bold text-sm dark:text-primary shadow-xl"
          >
            <span>📜</span>
            View History
          </Link>
        </div>
      </div>

      {/* Quiz Catalog Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 px-2">
          <div className="size-2 bg-accent-0 rounded-full animate-ping"></div>
          <h2 className="text-xl font-bold dark:text-primary uppercase tracking-widest">
            Available Quizzes
          </h2>
        </div>
        <QuizCatalog
          data={data}
          limit={limit}
          current={currentPage}
          keyword={q}
        />
      </div>
    </div>
  );
}
