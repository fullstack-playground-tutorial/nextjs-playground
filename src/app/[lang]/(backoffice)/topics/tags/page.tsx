import { hasPermission } from "@/app/dal";
import TagManagement from "./components/TagManagement";
import { redirect } from "next/navigation";
import { deleteTag, loadTag, searchTags } from "@/app/feature/topic-tags";
import TagForm from "./components/TagForm";
import { Tag } from "@/app/feature/topic-tags";
import Modal from "@/components/Modal";
import { Suspense } from "react";
import {
  SkeletonElement,
  SkeletonWrapper,
} from "@/components/SkeletionLoading";
import EditIcon from "@/assets/images/icons/edit.svg";
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
  const id = searchParams?.id;

  const data = searchTags({
    keyword: q,
    sort: sort,
    offset: (currentPage - 1) * limit,
    limit: limit,
  });

  const tagDetail: Promise<Tag | undefined> = id
    ? loadTag(id)
    : Promise.resolve(undefined);

  return (
    <>
      <TagManagement
        hasPermission={accepted}
        data={data}
        limit={limit}
        sort={sort}
        currentPage={currentPage}
      />
      <Modal
        open={showModal && (action === "create" || action === "edit")}
        title={id ? "Edit Tag" : "Create Tag"}
        body={
          <Suspense
            fallback={
              <SkeletonWrapper className="w-full h-full">
                <SkeletonElement width={"100%"} height={"100%"} />
              </SkeletonWrapper>
            }
          >
            <TagForm tag={tagDetail} />
          </Suspense>
        }
      />
      <DeleteForm showModal={showModal} id={id} action={action}/>
    </>
  );
}
