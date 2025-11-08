import { hasPermission } from "@/app/dal";
import TagManagement from "./components/TagManagement";
import { redirect } from "next/navigation";
import { getTopicTagService } from "@/app/core/server/context";
import { searchTags } from "@/app/feature/topic-tags";
import { Suspense } from "react";
import Loading from "./loading";

async function Page(props: {
  searchParams?: Promise<{
    q?: string;
    page?: string;
    sort?: string;
    limit?: string;
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
  const data = searchTags({
    keyword: q,
    sort: sort,
    offset: (currentPage - 1) * limit,
    limit: limit,
  });

  return (
    <Suspense fallback={<Loading/>}>
      <TagManagement
        hasPermission={accepted}
        data={data}
        limit={limit}
        sort={sort}
        currentPage={currentPage}
      />
    </Suspense>
  );
}

export default Page;
