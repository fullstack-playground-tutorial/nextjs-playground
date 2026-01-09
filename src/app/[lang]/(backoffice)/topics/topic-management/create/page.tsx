import { redirect } from "next/navigation";
import TopicForm from "../components/TopicForm";
import { getUser } from "@/app/dal";
import { getTopicTagService } from "@/app/core/server/context";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tag_q?: string }>;
}) {
  const user = await getUser();
  if (!user) {
    redirect("/");
  }

  const { tag_q } = await searchParams;

  const list = tag_q
    ? await getTopicTagService()
        .search({ keyword: tag_q }, { tags: ["tag_suggestions"] })
        .then((res) => res.list)
    : undefined;

  return (
    <>
      <TopicForm
        user={user.user}
        tagSuggestions={list || undefined}
      />
    </>
  );
}
