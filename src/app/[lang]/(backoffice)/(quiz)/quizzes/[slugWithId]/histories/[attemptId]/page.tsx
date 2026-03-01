import { getQuizAttemptService, getQuizService } from "@/app/core/server/context";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{ slugWithId: string; attemptId: string }>;
};

export default async function QuizAttemptDetailPage(props: Props) {
    const { slugWithId, attemptId } = await props.params;
    const quizId = slugWithId.slice(-36);

    const attemptSvc = getQuizAttemptService();
    const quizSvc = getQuizService();

    const attempt = await attemptSvc.getReview(quizId, attemptId);
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {(() => {
                    const totalPossible = attempt.questionsSnapshot.reduce((acc, q) => acc + (q.point || 0), 0);
                    const correctCount = attempt.questionsSnapshot.filter(q => q.isUserCorrect).length;
                    const accuracy = totalPossible > 0 ? Math.round((attempt.point / totalPossible) * 100) : 0;
                    const skippedCount = attempt.questionsSnapshot.filter(q => {
                        const userAns = attempt.userAnswers?.find(ua => ua.questionId === q.id);
                        return !userAns || !userAns.userAnswerChoices || userAns.userAnswerChoices.length === 0;
                    }).length;

                    return (
                        <>
                            <div className="bg-surface-1 rounded-3xl border border-border p-6 shadow-lg flex flex-col items-center justify-center text-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2">Total Score</span>
                                <span className="text-4xl font-black text-accent-0">{attempt.point}</span>
                                <span className="text-[10px] font-bold text-secondary mt-1">out of {totalPossible}</span>
                            </div>

                            <div className="bg-surface-1 rounded-3xl border border-border p-6 shadow-lg flex flex-col items-center justify-center text-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2">Accuracy</span>
                                <span className="text-4xl font-black text-primary">{accuracy}%</span>
                                <span className="text-[10px] font-bold text-secondary mt-1">Success rate</span>
                            </div>

                            <div className="bg-surface-1 rounded-3xl border border-border p-6 shadow-lg flex flex-col items-center justify-center text-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2">Correct</span>
                                <span className="text-4xl font-black text-green-500">{correctCount}</span>
                                <span className="text-[10px] font-bold text-secondary mt-1">questions</span>
                            </div>

                            <div className="bg-surface-1 rounded-3xl border border-border p-6 shadow-lg flex flex-col items-center justify-center text-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2">Skipped</span>
                                <span className="text-4xl font-black text-yellow-500">{skippedCount}</span>
                                <span className="text-[10px] font-bold text-secondary mt-1">no answer</span>
                            </div>
                        </>
                    );
                })()}
            </div>

            <div className="bg-surface-1 rounded-3xl border border-border p-8 shadow-xl">
                <div className="flex flex-col gap-8">
                    {attempt.questionsSnapshot.map((question, qIdx) => {
                        const originalQuestion = quiz?.questions.find(q => q.id === question.id);

                        const selectedChoiceIds = question.answers?.map(uac => uac.id) || [];
                        const isSkipped = selectedChoiceIds.length === 0;

                        return (
                            <div key={question.id} className={`flex flex-col gap-4 p-6 bg-surface-2/30 rounded-2xl border ${question.isUserCorrect ? 'border-green-500/20' : isSkipped ? 'border-yellow-500/20' : 'border-red-500/20'}`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-2 items-center">
                                        <span className="px-3 py-1 bg-accent-0/10 text-accent-0 rounded-lg font-black text-xs uppercase tracking-widest">
                                            Question {qIdx + 1}
                                        </span>
                                        {question.isUserCorrect ? (
                                            <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-lg font-black text-[10px] uppercase tracking-widest border border-green-500/20 flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                Correct
                                            </span>
                                        ) : isSkipped ? (
                                            <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded-lg font-black text-[10px] uppercase tracking-widest border border-yellow-500/20 flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                Skipped
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded-lg font-black text-[10px] uppercase tracking-widest border border-red-500/20 flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                                Incorrect
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs font-black text-secondary uppercase tracking-[0.2em]">{question.point} Points</span>
                                </div>
                                <h3 className="text-xl font-bold text-primary">{question.content}</h3>

                                <div className="grid grid-cols-1 gap-3 mt-2">
                                    {question.answers?.map(({ isCorrect, isSelected, content, id }) => {

                                        return (
                                            <div
                                                key={id}
                                                className={`p-4 rounded-xl border-2 flex items-center justify-between gap-4 transition-all ${isSelected && isCorrect
                                                    ? "border-green-500 bg-green-500/5 dark:bg-green-500/10"
                                                    : isSelected && !isCorrect
                                                        ? "border-red-500 bg-red-500/5 dark:bg-red-500/10"
                                                        : isCorrect
                                                            ? "border-green-500/50 bg-green-500/5 dark:bg-green-500/5"
                                                            : "border-border-subtle bg-surface-1"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`size-5 rounded-full border-2 shrink-0 flex items-center justify-center ${isSelected ? "bg-accent-0 border-accent-0" : "border-border-strong"
                                                        }`}>
                                                        {isSelected && <div className="size-2 bg-white rounded-full" />}
                                                    </div>
                                                    <span className={`font-medium ${isCorrect ? "text-green-600 dark:text-green-400" :
                                                        isSelected && !isCorrect ? "text-red-600 dark:text-red-400" :
                                                            "text-primary"
                                                        }`}>
                                                        {content}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {isCorrect && (
                                                        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-1 rounded-md">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                            Correct Choice
                                                        </span>
                                                    )}
                                                    {isSelected && !isCorrect && (
                                                        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter text-red-600 dark:text-red-400 bg-red-500/10 px-2 py-1 rounded-md">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                                            Your Answer
                                                        </span>
                                                    )}
                                                    {isSelected && isCorrect && (
                                                        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-1 rounded-md">
                                                            Correct Selection
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {isSkipped && (
                                    <div className="mt-2 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl flex items-center gap-3">
                                        <div className="p-2 bg-yellow-500/20 rounded-full">
                                            <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-yellow-600 dark:text-yellow-400 uppercase tracking-widest">Notice</p>
                                            <p className="text-xs text-secondary font-medium">You didn't select any answer for this question.</p>
                                        </div>
                                    </div>
                                )}

                                {originalQuestion?.explanation && (
                                    <div className="mt-4 p-5 bg-accent-0/5 border-l-4 border-accent-0 rounded-r-2xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <svg className="w-4 h-4 text-accent-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-xs font-black text-accent-0 uppercase tracking-[0.2em]">Explanation</p>
                                        </div>
                                        <p className="text-primary/90 text-sm leading-relaxed italic">
                                            {originalQuestion.explanation}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
