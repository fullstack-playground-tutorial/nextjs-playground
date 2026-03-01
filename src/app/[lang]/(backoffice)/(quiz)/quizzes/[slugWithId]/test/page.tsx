import { redirect } from "next/navigation";
import QuizTestClient from "./QuizTestClient";
import { getQuizAttemptService } from "@/app/core/server/context";

type Props = {
  searchParams: Promise<{ attemptId?: string }>;
  params: Promise<{ slugWithId: string }>;
};

export default async function QuizTestPage({ searchParams, params }: Props) {
  const { attemptId } = await searchParams;
  const { slugWithId } = await params;


  if (!attemptId || !slugWithId) {
    redirect("/quizzes");
  }

  const quizId = slugWithId.split("-").pop();

  if (!quizId) {
    redirect("/quizzes");
  }

  const attemptPromise = getQuizAttemptService().load(quizId, attemptId);

  return <QuizTestClient attemptPromise={attemptPromise} />;
}
