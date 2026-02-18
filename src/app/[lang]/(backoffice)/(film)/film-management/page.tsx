"use server";
import Link from "next/link";
import FilmList from "./components/FilmList";
import { getFilmService } from "@/app/core/server/context";

export default async function Page(props: {
  searchParams?: Promise<{
    q?: string;
    page?: string;
    sort?: string;
    limit?: string;
    showModal?: boolean;
    id?: string;
    action?: "create" | "edit" | "delete";
  }>;
}) {
  const searchParams = await props.searchParams;

  const q = searchParams?.q || "";
  const currentPage = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 25;
  const sort = searchParams?.sort || "created_at";
  const offset = (currentPage - 1) * limit;
  const data = await getFilmService().search({
    keyword: q,
    limit: limit,
    offset: offset,
    sort: sort,
  });

  return (
    <div className="p-6 min-h-screen dark:text-primary flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-row justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold dark:text-accent-0 text-shadow-lg">
            Film Management
          </h1>
          <p className="text-sm dark:text-secondary mt-1">
            Manage your film catalog
          </p>
        </div>
        <Link href="film-management/create">
          <button className="bg-accent-0 hover:bg-accent-1 text-white font-semibold py-2 px-4 rounded shadow transition-colors">
            + Create New
          </button>
        </Link>
      </div>
      <FilmList data={data} limit={limit} current={currentPage} />
    </div>
  );
}
