import { getTopicTagService } from "@/app/core/server/context";
import TagFormLoading from "../../components/TagFormLoading";
import { Suspense } from "react";
import TagForm from "../../components/TagForm";
import DeleteForm from "../../components/DeleteForm";
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
    const tag = getTopicTagService().load(id, {
      tags: ["topic-tag"],
      revalidate: 3600,
    });
    return (
      <Suspense fallback={<TagFormLoading />}>
        <TagForm tagPromise={tag} />
      </Suspense>
    );
  } else if (action == "delete") {
    return <DeleteForm id={id} />;
  }
  return null;
}
