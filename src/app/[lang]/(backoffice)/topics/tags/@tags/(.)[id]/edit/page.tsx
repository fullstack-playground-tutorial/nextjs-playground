import TagForm from "../../../components/TagForm";
import { getTopicTagService } from "@/app/core/server/context";
import { Suspense } from "react";
import TagFormLoading from "../../../components/TagFormLoading";
import Modal from "@/components/Modal";
import { CACHE_TAG } from "@/app/utils/cache/tag";

export default async function Page({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;
  const tag = getTopicTagService().load(id, { tags: [CACHE_TAG.TOPIC_TAGS], revalidate: 3600 });
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

}
