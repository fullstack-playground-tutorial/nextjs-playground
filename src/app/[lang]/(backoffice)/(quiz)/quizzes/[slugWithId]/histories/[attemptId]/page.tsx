import { getQuizAttemptService, getQuizService } from "@/app/core/server/context";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{ slugWithId: string; attemptId: string }>;
};

export default async function QuizAttemptDetailPage(props: Props) {
    const { slugWithId, attemptId } = await props.params;
    const lastDash = slugWithId.lastIndexOf("-");
    const quizId = slugWithId.slice(lastDash + 1);

    const attemptSvc = getQuizAttemptService();
    const quizSvc = getQuizService();

    const attempt = await attemptSvc.load(quizId, attemptId);
    if (!attempt) notFound();

    const quiz = await quizSvc.load(quizId);

    // This would be the QuizReviewClient
    return (
        <div className="p-6 md:p-12 min-h-screen dark:text-primary flex flex-col gap-10">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <Link
                        href={`/quizzes/${slugWithId}/histories`}
                        className="size-10 bg-surface-2 hover:bg-accent-0 text-secondary hover:text-white rounded-2xl flex items-center justify-center transition-all shadow-sm group"
                    >
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black dark:text-accent-0 tracking-tight">
                        Attempt Detail
                    </h1>
                </div>
                <p className="text-lg dark:text-secondary leading-relaxed ml-14">
                    Review your answers for {quiz?.title || "Quiz"}.
                </p>
            </div>

            <div className="bg-surface-1 rounded-3xl border border-border p-8 shadow-xl">
                <div className="flex flex-col gap-8">
                    {attempt.questionsSnapshot.map((question, qIdx) => (
                        <div key={question.id} className="flex flex-col gap-4 p-6 bg-surface-2/30 rounded-2xl border border-border">
                            <div className="flex justify-between items-start">
                                <span className="px-3 py-1 bg-accent-0/10 text-accent-0 rounded-lg font-black text-xs uppercase tracking-widest">
                                    Question {qIdx + 1}
                                </span>
                                <span className="text-xs font-black text-secondary uppercase tracking-[0.2em]">{question.point} Points</span>
                            </div>
                            <h3 className="text-xl font-bold text-primary">{question.content}</h3>

                            <div className="grid grid-cols-1 gap-3 mt-2">
                                {question.answers?.map((answer) => (
                                    <div
                                        key={answer.id}
                                        className={`p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                                            // Mocking visual state for now since types don't have isCorrect/isSelected
                                            "border-border-subtle bg-surface-1"
                                            }`}
                                    >
                                        <div className="size-5 rounded-full border-2 border-border-strong shrink-0" />
                                        <span className="text-primary font-medium">{answer.content}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
