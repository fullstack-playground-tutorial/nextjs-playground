import { getQuizService } from "@/app/core/server/context";
import { notFound } from "next/navigation";
import FlashcardClient from "../flashcards/FlashcardClient";

type Props = {
    params: Promise<{ slugWithId: string }>;
};

export default async function FlashcardPage(props: Props) {
    const { slugWithId } = await props.params;
    const lastDash = slugWithId.lastIndexOf("-");
    const quizId = slugWithId.slice(lastDash + 1);

    if (!quizId) return notFound();

    const quizSvc = getQuizService();
    const quiz = await quizSvc.load(quizId);

    if (!quiz) return notFound();

    return (
        <FlashcardClient quiz={quiz} />
    );
}
