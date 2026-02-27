import { redirect } from "next/navigation";
import { loadQuizAttempt } from "@/app/feature/quiz-attempt/action";
import QuizTestClient from "./QuizTestClient";

type Props = {
  searchParams: Promise<{ attemptId?: string }>;
};

export default async function QuizTestPage({ searchParams }: Props) {
  const { attemptId } = await searchParams;
  if (!attemptId) {
    redirect("/quizzes");
  }

  const attemptPromise = loadQuizAttempt(attemptId);

  return <QuizTestClient attemptPromise={attemptPromise} />;
}
