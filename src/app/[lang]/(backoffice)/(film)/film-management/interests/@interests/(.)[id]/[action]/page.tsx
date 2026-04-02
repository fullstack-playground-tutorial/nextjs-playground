import { getFilmInterestService } from "@/app/core/server/context";
import { Suspense } from "react";
import Modal from "@/components/Modal";
import FormLoading from "../../../components/FormLoading";
import InterestForm from "../../../components/InterestForm";
import DeleteForm from "../../../components/DeleteForm";
import { CACHE_TAG } from "@/app/utils/cache/tag";

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
    const interest = getFilmInterestService().load(id, { tags: [CACHE_TAG.FILM_INTEREST], revalidate: 3600 });
    return (
      <Suspense
        fallback={
          <Modal>
            <FormLoading />
          </Modal>
        }
      >
        <Modal>
          <InterestForm interestPromise={interest} />
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
