"use client";

import { useState, useEffect, useMemo, use, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitQuizAttempt } from "@/app/feature/quiz-attempt/action";
import type { UserAnswer, QuizAttempt, AttemptQuestion } from "@/app/feature/quiz-attempt";
import useToast from "@/app/components/Toast";
import BackArrow from "@/app/assets/images/icons/back_arrow.svg";

export default function QuizTestClient({ attemptPromise }: { attemptPromise: Promise<QuizAttempt | null> }) {
    const router = useRouter();
    const attemptData = use(attemptPromise);
    const toast = useToast();
    const [isPending, startTransition] = useTransition();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    // Map existing answers to a Record for easier UI manipulation: { questionId: [choiceIds] }
    const [userAnswers, setUserAnswers] = useState<Record<string, string[]>>({});
    const [isFinished, setIsFinished] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    const questions = attemptData?.questionsSnapshot || [];
    const currentQuestion = questions[currentQuestionIndex] as AttemptQuestion | undefined;

    // Total duration in seconds for progress bar
    const totalDurationSeconds = useMemo(() => {
        if (!attemptData?.startAt || !attemptData?.endAt) return 60 * 15; // default 15 mins
        const start = new Date(attemptData.startAt).getTime();
        const end = new Date(attemptData.endAt).getTime();
        return Math.floor((end - start) / 1000);
    }, [attemptData]);

    // Initialize state from attempt data
    useEffect(() => {
        if (attemptData) {
            if (attemptData.isSubmitted) {
                setIsFinished(true);
            }

            if (attemptData.endAt) {
                const end = new Date(attemptData.endAt).getTime();
                const now = new Date().getTime();
                setTimeLeft(Math.max(0, Math.floor((end - now) / 1000)));
            }
        }
    }, [attemptData]);

    // Timer logic
    useEffect(() => {
        if (timeLeft <= 0 || isFinished) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // auto-submit would go here
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, isFinished]);

    const formatTime = (seconds: number) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
    };

    const handleSelectAnswer = (questionId: string, answerId: string, isMultiple: boolean) => {
        setUserAnswers((prev) => {
            const currentSelected = prev[questionId] || [];
            let next: string[];
            if (isMultiple) {
                if (currentSelected.includes(answerId)) {
                    next = currentSelected.filter((id) => id !== answerId);
                } else {
                    next = [...currentSelected, answerId];
                }
            } else {
                next = [answerId];
            }
            return { ...prev, [questionId]: next };
        });
    };

    const isQuestionAnswered = (questionId: string) => {
        return userAnswers[questionId] && userAnswers[questionId].length > 0;
    };

    const currentProgress = useMemo(() => {
        if (questions.length === 0) return 0;
        const answeredCount = questions.filter((q) => isQuestionAnswered(q.id)).length;
        return (answeredCount / questions.length) * 100;
    }, [userAnswers, questions]);

    const goToNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    const goToPrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    const handleSubmit = () => {
        if (!attemptData) return;

        const answeredCount = questions.filter((q) => isQuestionAnswered(q.id)).length;
        const message = answeredCount < questions.length
            ? `You have only answered ${answeredCount}/${questions.length} questions. Are you sure you want to submit?`
            : "Are you sure you want to submit your answers?";

        if (window.confirm(message)) {
            startTransition(async () => {
                try {
                    const finalAnswers: UserAnswer[] = Object.entries(userAnswers).map(([qId, choices]) => ({
                        id: "",
                        attemptId: attemptData.id,
                        questionId: qId,
                        userAnswerChoices: choices.map((choiceId) => ({
                            choiceId,
                        })),
                    }));

                    const status = await submitQuizAttempt(attemptData.quizId, attemptData.id, finalAnswers);
                    if (status > 0) {
                        toast.addToast("success", "Quiz submitted successfully!");
                        setIsFinished(true);
                        router.push("/quizzes");
                    } else if (status === -3 || status === -5) {
                        toast.addToast("error", "Time limit exceeded!");
                    } else {
                        toast.addToast("error", "Failed to submit quiz.");
                    }
                } catch (error) {
                    toast.addToast("error", "An error occurred during submission.");
                }
            });
        }
    };

    if (!attemptData) return null;

    if (isFinished) {
        const score = attemptData?.point || 0;
        const totalPossible = questions.reduce((acc, q) => acc + (q.point || 0), 0);
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center bg-surface-0/30 backdrop-blur-sm rounded-3xl border border-border mt-8 mx-auto max-w-2xl shadow-2xl">
                <div className="w-32 h-32 bg-accent-0/20 rounded-full flex items-center justify-center mb-8 animate-bounce shadow-xl shadow-accent-0/10 border-4 border-accent-0/40 relative">
                    <svg className="w-16 h-16 text-accent-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                    <div className="absolute -top-2 -right-2 bg-accent-0 text-white size-12 rounded-full flex items-center justify-center font-black text-xs border-4 border-white dark:border-surface-1 shadow-lg">
                        100%
                    </div>
                </div>
                <h1 className="text-5xl font-black dark:text-accent-0 mb-2 tracking-tight">Well Done!</h1>
                <p className="text-xl dark:text-secondary mb-10 max-w-md">Your quiz results are in. Great effort!</p>
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-12">
                    <div className="bg-surface-1 p-6 rounded-2xl border border-border shadow-sm">
                        <span className="text-[10px] font-black uppercase tracking-widest text-secondary block mb-1">Your Score</span>
                        <span className="text-4xl font-black text-accent-0">{score}</span>
                    </div>
                    <div className="bg-surface-1 p-6 rounded-2xl border border-border shadow-sm">
                        <span className="text-[10px] font-black uppercase tracking-widest text-secondary block mb-1">Max Points</span>
                        <span className="text-4xl font-black text-primary">{totalPossible}</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => router.push(`/quizzes/${attemptData.quizId}/histories`)}
                        className="px-10 py-4 bg-surface-2 hover:bg-surface-3 dark:text-primary rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95"
                    >
                        View History
                    </button>
                    <button
                        onClick={() => router.push("/quizzes")}
                        className="px-10 py-4 bg-accent-0 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-accent-0/20 hover:bg-accent-1 hover:-translate-y-1 transition-all active:scale-95"
                    >
                        New Quiz
                    </button>
                </div>
            </div>
        );
    }

    const totalPoints = questions.reduce((acc, q) => acc + (q.point || 0), 0);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative items-start">
            {/* Main Quiz Area */}
            <div className="lg:col-span-8 space-y-6">
                {/* Header (Mobile) */}
                <div className="lg:hidden flex justify-between items-center bg-surface-1 p-5 rounded-2xl shadow-sm border border-border">
                    <div className="flex items-center gap-3">
                        <div
                            className="rounded-full shadow size-8 flex items-center justify-center p-2 dark:bg-surface-2 transition cursor-pointer hover:dark:bg-accent-0 group"
                            onClick={() => router.back()}
                        >
                            <BackArrow className="dark:fill-accent-0 group-hover:dark:fill-primary" />
                        </div>
                        <h2 className="font-bold text-primary text-sm uppercase tracking-tight">Attempt #{attemptData.id.slice(0, 8)}</h2>
                    </div>
                    <div className={`px-4 py-2 rounded-full font-mono text-lg font-black flex items-center gap-2 ${timeLeft < 60 ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-accent-0/20 text-accent-0'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {formatTime(timeLeft)}
                    </div>
                </div>

                {/* Question Area */}
                <div className="bg-surface-1 rounded-3xl shadow-2xl border border-border overflow-hidden transition-all duration-300">
                    <div className="h-3 bg-surface-2 w-full">
                        <div
                            className="h-full bg-accent-0 transition-all duration-700 ease-in-out shadow-[0_0_15px_rgba(var(--accent-0-rgb),0.5)]"
                            style={{ width: `${currentProgress}%` }}
                        />
                    </div>

                    <div className="p-8 md:p-14 min-h-[450px]">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                                <span className="px-4 py-1.5 bg-accent-0/10 text-accent-0 rounded-xl font-black text-xs uppercase tracking-widest border border-accent-0/20">
                                    Question {currentQuestionIndex + 1}
                                </span>
                                <span className="px-3 py-1 bg-surface-2 rounded-lg text-[10px] font-black text-secondary uppercase tracking-[0.15em] border border-border">
                                    {currentQuestion?.type === "multiple_choice" ? "Multiple Choice" : "Single Choice"}
                                </span>
                                <span className="text-secondary text-sm font-bold opacity-60">/ {questions.length}</span>
                            </div>
                            <div className="px-3 py-1 bg-surface-2 rounded-lg text-[10px] font-black text-secondary uppercase tracking-[0.2em]">
                                {currentQuestion?.point || 0} POINTS
                            </div>
                        </div>

                        <h3 className="text-2xl md:text-4xl font-black text-primary leading-[1.15] mb-4 tracking-tight">
                            {currentQuestion?.content}
                        </h3>
                        {currentQuestion?.type === "multiple_choice" && (
                            <p className="text-sm font-bold text-accent-0 uppercase tracking-widest mb-12 opacity-80 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Select all that apply
                            </p>
                        )}
                        {currentQuestion?.type !== "multiple_choice" && <div className="mb-12" />}

                        <div className="grid grid-cols-1 gap-4">
                            {currentQuestion?.answers?.map((answer, idx) => {
                                const isSelected = (userAnswers[currentQuestion.id] || []).includes(answer.id);
                                return (
                                    <button
                                        key={answer.id || idx}
                                        onClick={() => handleSelectAnswer(currentQuestion.id, answer.id, currentQuestion.type === "multiple_choice")}
                                        className={`w-full text-left p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 flex items-center gap-6 group transform hover:translate-x-1 ${isSelected
                                            ? 'border-accent-0 bg-accent-0/5 dark:bg-accent-0/10 shadow-lg shadow-accent-0/5 ring-1 ring-accent-0'
                                            : 'border-border-strong hover:border-accent-0/40 dark:bg-surface-0/40 hover:bg-surface-2'
                                            }`}
                                    >
                                        <div className={`w-8 h-8 md:w-10 md:h-10 border-2 flex-shrink-0 flex items-center justify-center transition-all duration-300 ${currentQuestion.type === "multiple_choice" ? "rounded-lg" : "rounded-full"} ${isSelected
                                            ? 'bg-accent-0 border-accent-0 text-white rotate-[360deg]'
                                            : 'border-border-strong group-hover:border-accent-0/50'
                                            }`}>
                                            {isSelected && (
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className={`text-lg md:text-xl font-black transition-colors ${isSelected ? 'text-accent-0' : 'text-primary opacity-80 group-hover:opacity-100'}`}>
                                            {answer.content}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-surface-0/60 p-8 flex justify-between items-center border-t border-border">
                        <button
                            onClick={goToPrev}
                            disabled={currentQuestionIndex === 0}
                            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${currentQuestionIndex === 0
                                ? 'text-gray-600 opacity-20 cursor-not-allowed'
                                : 'text-secondary hover:bg-surface-2 hover:text-accent-0 active:scale-95'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M15 19l-7-7 7-7" /></svg>
                            Back
                        </button>

                        {currentQuestionIndex === questions.length - 1 ? (
                            <button
                                onClick={handleSubmit}
                                disabled={isPending}
                                className="px-14 py-4 bg-accent-0 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-accent-0/30 hover:bg-accent-1 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isPending ? "Finalizing..." : "Submit Test"}
                            </button>
                        ) : (
                            <button
                                onClick={goToNext}
                                className="flex items-center gap-3 px-14 py-4 bg-surface-2 text-accent-0 rounded-2xl font-black text-xs uppercase tracking-widest border border-border-strong shadow-sm hover:shadow-md hover:-translate-y-1 transition-all active:scale-95"
                            >
                                Next
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7" /></svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Sidebar Navigation */}
            <div className="lg:col-span-4 sticky top-8 space-y-6">
                {/* Timer Card */}
                <div className="hidden lg:block bg-surface-1 p-10 rounded-3xl shadow-xl border border-border text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-0/5 rounded-bl-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                    <div className="relative z-10 text-secondary text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-70">Remaining Time</div>
                    <div className={`relative z-10 text-6xl font-mono font-black mb-8 tracking-tighter ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-accent-0'}`}>
                        {formatTime(timeLeft)}
                    </div>
                    <div className="relative z-10 w-full bg-surface-2 h-2.5 rounded-full overflow-hidden shadow-inner translate-z-0">
                        <div
                            className={`h-full transition-all duration-1000 ease-linear ${timeLeft < 60 ? 'bg-red-500' : 'bg-accent-0 shadow-[0_0_15px_rgba(var(--accent-0-rgb),0.5)]'}`}
                            style={{ width: `${(timeLeft / totalDurationSeconds) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Map Navigation */}
                <div className="bg-surface-1 p-8 rounded-3xl shadow-xl border border-border">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex flex-col">
                            <h4 className="font-black text-primary text-xs uppercase tracking-widest">Question Map</h4>
                            <span className="text-[10px] text-secondary font-bold opacity-60">Total Points: {totalPoints}</span>
                        </div>
                        <span className="text-[10px] bg-accent-0 text-white px-3 py-1.5 rounded-xl font-black shadow-lg shadow-accent-0/20">
                            {Object.keys(userAnswers).filter(k => userAnswers[k].length > 0).length} / {questions.length}
                        </span>
                    </div>

                    <div className="grid grid-cols-5 gap-3">
                        {questions.map((q, idx) => {
                            const isAnswered = isQuestionAnswered(q.id);
                            const isCurrent = idx === currentQuestionIndex;

                            return (
                                <button
                                    key={q.id || idx}
                                    onClick={() => setCurrentQuestionIndex(idx)}
                                    className={`aspect-square rounded-2xl flex items-center justify-center text-sm font-black transition-all transform hover:scale-110 active:scale-90 ${isCurrent
                                        ? 'bg-accent-0 text-white shadow-2xl shadow-accent-0/40 ring-[6px] ring-accent-0/20 scale-110'
                                        : isAnswered
                                            ? 'bg-accent-0/20 text-accent-0 border-2 border-accent-0/40'
                                            : 'bg-surface-2 text-secondary border-2 border-transparent hover:border-accent-0/40 hover:text-accent-0'
                                        }`}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-12 pt-8 border-t border-border space-y-4">
                        <div className="flex items-center gap-4 text-[10px] font-black text-secondary uppercase tracking-widest opacity-80">
                            <div className="w-5 h-5 rounded-lg bg-accent-0/20 border-2 border-accent-0/40" /> Answered
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-black text-secondary uppercase tracking-widest opacity-80">
                            <div className="w-5 h-5 rounded-lg bg-surface-2 border-2 border-transparent" /> Pending
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-black text-secondary uppercase tracking-widest opacity-80">
                            <div className="w-5 h-5 rounded-lg bg-accent-0 shadow-lg shadow-accent-0/30" /> In View
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="w-full mt-10 py-5 bg-accent-0 hover:bg-accent-1 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl shadow-accent-0/30 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                    >
                        {isPending ? "Submitting..." : "Submit All Responses"}
                    </button>
                </div>
            </div>
        </div>
    );
}
