import { getQuizAttemptService, getQuizService } from "@/app/core/server/context";
import QuizHistory from "./components/QuizHistory";
import Link from "next/link";

type Props = {
    params: Promise<{ slugWithId: string }>;
};

export default async function QuizHistoryPage(props: Props) {
    const { slugWithId } = await props.params;
    const lastDash = slugWithId.lastIndexOf("-");
    const quizId = slugWithId.slice(lastDash + 1);

    if (!quizId) return null;
    const quizSvc = getQuizService();
    const attemptSvc = getQuizAttemptService();

    // Fetch quiz history for user
    const attempts = await attemptSvc.all(quizId);
    const quiz = await quizSvc.load(quizId);

    const sortedAttempts = [...attempts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const highestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.score || 0)) : 0;
    const latestScore = sortedAttempts.length > 0 ? sortedAttempts[0].score : 0;

    return (
        <div className="p-6 md:p-12 min-h-screen dark:text-primary flex flex-col gap-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/quizzes"
                            className="size-10 bg-surface-2 hover:bg-accent-0 text-secondary hover:text-white rounded-2xl flex items-center justify-center transition-all shadow-sm group"
                        >
                            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-black dark:text-accent-0 tracking-tight">
                            {quiz?.title || "Quiz"} History
                        </h1>
                    </div>
                    <p className="text-lg dark:text-secondary leading-relaxed ml-14">
                        Review your past attempts and track your mastery of this quiz.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="bg-accent-0/10 p-4 rounded-3xl border border-accent-0/20 flex flex-col min-w-[120px]">
                        <span className="text-[10px] font-black uppercase tracking-widest text-accent-0 opacity-80">Attempts</span>
                        <span className="text-2xl font-black text-primary">{attempts.length}</span>
                    </div>
                    <div className="bg-green-500/10 p-4 rounded-3xl border border-green-500/20 flex flex-col min-w-[120px]">
                        <span className="text-[10px] font-black uppercase tracking-widest text-green-500 opacity-80">Best Score</span>
                        <span className="text-2xl font-black text-primary">{highestScore}</span>
                    </div>
                    <div className="bg-blue-500/10 p-4 rounded-3xl border border-blue-500/20 flex flex-col min-w-[120px]">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 opacity-80">Latest Score</span>
                        <span className="text-2xl font-black text-primary">{latestScore}</span>
                    </div>
                </div>
            </div>

            {/* History Table Section */}
            <div className="flex flex-col gap-4">
                <QuizHistory attempts={sortedAttempts} quiz={quiz || undefined} />
            </div>
        </div>
    );
}
