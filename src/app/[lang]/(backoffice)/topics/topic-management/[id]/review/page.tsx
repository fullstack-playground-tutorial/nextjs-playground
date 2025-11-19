import { getUser } from "@/app/dal";
import { getTopicService } from "@/app/core/server/context";
import { redirect } from "next/navigation";
import TopicForm from "../../components/TopicForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
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
  return <TopicForm user={userInfo.user} topic={topic} />;
}
