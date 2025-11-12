// file src/app/[lang]/(backoffice)/topics/tags/page.tsx
import { hasPermission } from "@/app/dal";
import TagManagement from "./components/TagManagement";
import { redirect } from "next/navigation";
import { searchTags } from "@/app/feature/topic-tags";
import Loading from "./loading";

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
  const accepted = await hasPermission(["topic.write"]);
  if (!accepted) {
    redirect("/");
  }

  const searchParams = await props.searchParams;

  const q = searchParams?.q || "";
  const currentPage = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 25;
  const sort = searchParams?.sort || "created_at";
  
  const data = await searchTags({
    keyword: q,
    sort: sort,
    offset: (currentPage - 1) * limit,
    limit: limit,
  }).catch((e) => {
    throw e;
  });

  return (
    <>
      <TagManagement
        hasPermission={accepted}
        data={data}
        limit={limit}
        sort={sort}
        currentPage={currentPage}
      />
    </>
  );
}
