// file src/app/[lang]/(backoffice)/topics/tags/page.tsx
import { hasPermission } from "@/app/dal";
import TagManagement from "./components/TagManagement";
import { redirect } from "next/navigation";
import { loadTag, searchTags } from "@/app/feature/topic-tags";
import TagForm from "./components/TagForm";
import DeleteForm from "./components/DeleteForm";

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

  const showModal = Boolean(searchParams?.showModal) || false;
  const action = searchParams?.action || "create";
  const id = searchParams?.id || "";

  const [data, tagDetail] = await Promise.all([
    searchTags({
      keyword: q,
      sort: sort,
      offset: (currentPage - 1) * limit,
      limit: limit,
    }),
    loadTag(id),
  ]).catch((e) => {
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

      {showModal && id && <DeleteForm id={id} action={action} />}
      {showModal  && (
        <TagForm id={id} tag={tagDetail} action={action} />
      )}
    </>
  );
}
