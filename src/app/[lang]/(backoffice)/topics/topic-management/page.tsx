"use server";
import Topics from "./components/Topics";
import Search from "./components/Search";
import { getTopicService } from "@/app/core/server/context";

type InternalState = {
  loadCount: number;
  searchQuery: string;
  filterVisibility: boolean;
  sort?: string;
};

export default async function TopicManagement(props: {
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

  const searchResult = getTopicService().search({
    keyword: q,
    limit: limit,
    offset: 0,
    sort: sort
  })
  return (
    <div className="p-4 h-screen dark:text-primary max-w-300 mx-auto flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 mt-2">
        <h1 className="font-semibold text-accent-0 text-4xl">Topic Management</h1>
      </div>
      <Search size={limit} keyword={q} />
      <Topics
        pageSize={limit}
        searchResult={searchResult}
        searchQ={q}
        currentPage={currentPage}
      />
    </div>
  );
}
