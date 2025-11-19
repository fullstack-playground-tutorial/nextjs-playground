import React from "react";
import TopicForm from "../../components/TopicForm";
import { getUser } from "@/app/dal";
import { getTopicService, getTopicTagService } from "@/app/core/server/context";
import { redirect } from "next/navigation";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tag_q?: string }>;
}) {
  const { id } = await params;
  const [userInfo, topic] = await Promise.all([
    getUser(),
    getTopicService().load(id),
  ]);
  if (!topic) {
    throw new Error("could find topic with id: " + id);
  }

  if (!userInfo) {
    redirect("/");
  }

  const { tag_q } = await searchParams;

  const list = tag_q
    ? await getTopicTagService()
        .search({ keyword: tag_q }, { tags: ["tag_suggestions"] })
        .then((res) => res.list)
    : undefined;
  return <TopicForm user={userInfo.user} topic={topic} />;
}
