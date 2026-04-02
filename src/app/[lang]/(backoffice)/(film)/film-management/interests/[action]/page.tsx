import { getFilmInterestService } from "@/app/core/server/context";
import { CACHE_TAG } from "@/app/utils/cache/tag";
import InterestForm from "../components/InterestForm";
import { Suspense } from "react";
import FormLoading from "../components/FormLoading";

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
    const tag = getFilmInterestService().load(id, {
      tags: [CACHE_TAG.FILM_INTERESTS],
      revalidate: 3600,
    });
    return (
      <Suspense fallback={<FormLoading />}>
        <InterestForm interestPromise={tag} />
      </Suspense>
    );
  } else if (action == "delete") {
    // return <DeleteForm id={id} />;
  }
  return null;
}
