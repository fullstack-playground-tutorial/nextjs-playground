import BackButton from "../../components/BackButton";
import QuizForm from "../../components/QuizForm";
import { getQuizService } from "@/app/core/server/context";
import { CACHE_TAG } from "@/app/utils/cache/tag";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const quizPromise = getQuizService().load(id, { tags: [CACHE_TAG.QUIZ + "-" + id] })
    return (
        <div className="flex flex-col min-h-screen items-start mx-auto max-w-5xl p-6">
            <div className="flex flex-row mt-8 mb-6 items-center gap-4 group">
                <BackButton />
                <div className="text-2xl font-semibold dark:text-accent-0">
                    Edit Quiz
                </div>
            </div>

            <QuizForm mode="edit" fetchedQuizPromise={quizPromise} />
        </div>
    );
}