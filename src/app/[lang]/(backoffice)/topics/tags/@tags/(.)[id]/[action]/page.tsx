import TagForm from "../../../components/TagForm";
import DeleteForm from "../../../components/DeleteForm";
import { getTopicTagService } from "@/app/core/server/context";
import { Suspense } from "react";
import TagFormLoading from "../../../components/TagFormLoading";
import Modal from "@/components/Modal";

export default async function Page({
  params,
}: {
  params: Promise<{
    action: string;
    id: string;
  }>;
}) {
  const { action, id } = await params;
  if (action == "edit") {
    const tag = getTopicTagService().load(id, {tags:["topics-tag"], revalidate: 3600});
    return (
      <Suspense
        fallback={
          <Modal>
            <TagFormLoading />
          </Modal>
        }
      >
        <Modal>
          <TagForm tagPromise={tag} />
        </Modal>
      </Suspense>
    );
  } else if (action == "delete") {
    return (
      <Modal>
        <DeleteForm id={id} />
      </Modal>
    );
  }
  return null;
}
