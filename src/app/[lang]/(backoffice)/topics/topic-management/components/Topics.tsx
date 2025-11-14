"use client";
import { deleteTopic, Topic } from "@/app/feature/topic";
import TopicCard from "../../components/TopicCard";
import {
  SkeletonElement,
  SkeletonWrapper,
} from "@/app/components/SkeletionLoading";
import { use, useTransition } from "react";
import { SearchResult } from "@/app/utils/service";
import useToast from "@/app/components/Toast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  pageSize: number;
  searchResult: Promise<SearchResult<Topic>>;
  searchQ: string;
  currentPage: number;
};

export default function Topics({
  searchResult,
  searchQ,
  pageSize,
  currentPage,
}: Props) {
  const toast = useToast();
  const searchParams = useSearchParams();
  const { replace, back } = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const { total, list: topics } = use(searchResult);
  const handleDeleteTopic = (id: string) => {
    startTransition(async () => {
      try {
        const res = await deleteTopic(id);
        if (res > 0) {
          toast.addToast("success", `Successfully deleted topic ${id}`);
          back();
        } else {
          toast.addToast("error", "not found topic with id:" + id);
        }
      } catch (error: any) {
        toast.addToast("error", error.message);
      }
    });
  };

  const loadMore = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", currentPage + 1 + "");
    startTransition(() => {
      replace(pathname + "?" + params.toString());
    });
  };

  const filteredTopics =
    topics.filter(
      (t) =>
        t.title?.toLowerCase().includes(searchQ.toLowerCase()) ||
        t.authorName?.toLowerCase().includes(searchQ.toLowerCase())
    ) || [];

  return (
    <>
      {/* Grid */}
      {filteredTopics.length === 0 && (
        <div className="text-secondary text-center py-20 h-screen flex flex-col items-center justify-center">
          No topics found
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {filteredTopics.map(
          ({
            id,
            thumbnailUrl,
            title,
            summary,
            authorName,
            publishedAt,
            tags,
            status,
          }) => (
            <TopicCard
              key={id}
              id={id}
              thumbnail={
                thumbnailUrl ||
                "https://www.fivebranches.edu/wp-content/uploads/2021/08/default-image.jpg"
              }
              title={title || ""}
              summary={summary || ""}
              author={authorName || ""}
              publishedAt={publishedAt}
              tags={tags ?? []}
              status={status || "draft"}
              onDelete={handleDeleteTopic}
            />
          )
        )}
        {pending && (
          <>
            {Array.from({ length: pageSize }).map((_, i) => (
              <div key={i} className="w-full min-h-90 h-full">
                <SkeletonWrapper className="rounded-md ">
                  <SkeletonElement width="100%" height="100%" />
                </SkeletonWrapper>
              </div>
            ))}
          </>
        )}
      </div>
      {/* Load More */}
      {topics != undefined && total > topics.length && (
        <div className="flex justify-center mt-6">
          <button
            type="button"
            className="btn btn-md dark:bg-accent-0 dark:text-primary hover:dark:bg-accent-1 transition-colors rounded-md font-medium"
            disabled={pending}
            onClick={loadMore}
          >
            Load More
          </button>
        </div>
      )}
    </>
  );
}
