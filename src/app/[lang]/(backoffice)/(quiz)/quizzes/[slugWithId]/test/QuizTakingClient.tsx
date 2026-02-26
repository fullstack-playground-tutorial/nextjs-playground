"use client";

import { useState, useEffect, useMemo } from "react";
import { Quiz } from "@/app/feature/quiz";

interface QuizTakingClientProps {
    quiz: Quiz;
}

export default function QuizTakingClient({ quiz }: QuizTakingClientProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<string, string[]>>({});
    const [timeLeft, setTimeLeft] = useState(quiz.duration * 60); // Convert minutes to seconds
    const [isFinished, setIsFinished] = useState(false);

    const questions = quiz.questions || [];
    const currentQuestion = questions[currentQuestionIndex];

    // Timer logic
    useEffect(() => {
        if (timeLeft <= 0 || isFinished) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
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
            if (isMultiple) {
                if (currentSelected.includes(answerId)) {
                    return { ...prev, [questionId]: currentSelected.filter((id) => id !== answerId) };
                } else {
                    return { ...prev, [questionId]: [...currentSelected, answerId] };
                }
            } else {
                return { ...prev, [questionId]: [answerId] };
            }
        });
    };

    const isQuestionAnswered = (questionId: string) => {
        return userAnswers[questionId] && userAnswers[questionId].length > 0;
    };

    const currentProgress = useMemo(() => {
        const answeredCount = questions.filter((q) => isQuestionAnswered(q.id!)).length;
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
        if (window.confirm("Bạn có chắc chắn muốn nộp bài?")) {
            setIsFinished(true);
            alert("Bài làm đã được ghi nhận!");
        }
    };

    if (isFinished) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center bg-surface-0">
                <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-primary mb-2">Chúc mừng!</h1>
                <p className="text-secondary mb-8">Bạn đã hoàn thành bài thi.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-accent-0 text-white rounded-xl font-semibold shadow-lg hover:bg-accent-1 transition-all"
                >
                    Làm lại
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative items-start">
            {/* Main Quiz Area */}
            <div className="lg:col-span-8 space-y-6">
                {/* Header with Title and Timer (Mobile) */}
                <div className="lg:hidden flex justify-between items-center bg-surface-1 p-4 rounded-2xl shadow-sm border border-border">
                    <h2 className="font-bold text-primary line-clamp-1">{quiz.title}</h2>
                    <div className={`px-4 py-2 rounded-full font-mono text-lg font-bold flex items-center gap-2 ${timeLeft < 60 ? 'bg-alert-0/20 text-alert-0' : 'bg-accent-0/20 text-accent-0'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {formatTime(timeLeft)}
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-surface-1 rounded-3xl shadow-xl border border-border overflow-hidden transition-all duration-300">
                    <div className="h-2 bg-surface-2 w-full">
                        <div
                            className="h-full bg-accent-0 transition-all duration-500 ease-out"
                            style={{ width: `${currentProgress}%` }}
                        />
                    </div>

                    <div className="p-8 md:p-12">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-3 py-1 bg-accent-0/10 text-accent-0 rounded-lg font-bold text-sm">
                                Câu {currentQuestionIndex + 1}
                            </span>
                            <span className="text-secondary text-sm font-medium">/ {questions.length}</span>
                        </div>

                        <h3 className="text-xl md:text-2xl font-semibold text-primary leading-relaxed mb-8">
                            {currentQuestion?.content}
                        </h3>

                        <div className="space-y-4">
                            {currentQuestion?.answers.map((answer, idx) => {
                                const isSelected = (userAnswers[currentQuestion.id!] || []).includes(answer.id!);
                                return (
                                    <button
                                        key={answer.id || idx}
                                        onClick={() => handleSelectAnswer(currentQuestion.id!, answer.id!, currentQuestion.type === "multiple_choice")}
                                        className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 group ${isSelected
                                            ? 'border-accent-0 bg-accent-0/5 shadow-md'
                                            : 'border-border-subtle hover:border-accent-0/50 hover:bg-surface-2'
                                            }`}
                                    >
                                        <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${isSelected ? 'bg-accent-0 border-accent-0 text-white' : 'border-border-strong group-hover:border-accent-0/50'
                                            }`}>
                                            {isSelected && (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className={`text-lg font-medium ${isSelected ? 'text-primary' : 'text-secondary font-normal'}`}>
                                            {answer.content}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-surface-0/50 p-6 flex justify-between items-center border-t border-border">
                        <button
                            onClick={goToPrev}
                            disabled={currentQuestionIndex === 0}
                            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${currentQuestionIndex === 0
                                ? 'text-tertiary-1'
                                : 'text-secondary hover:bg-surface-2 hover:text-accent-0 shadow-sm'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                            Quay lại
                        </button>

                        {currentQuestionIndex === questions.length - 1 ? (
                            <button
                                onClick={handleSubmit}
                                className="px-8 py-2 bg-accent-0 text-white rounded-xl font-bold shadow-lg shadow-accent-0/20 hover:bg-accent-1 hover:-translate-y-0.5 transition-all"
                            >
                                Nộp bài
                            </button>
                        ) : (
                            <button
                                onClick={goToNext}
                                className="flex items-center gap-2 px-8 py-2 bg-surface-2 text-accent-0 rounded-xl font-bold border border-border-strong shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                            >
                                Tiếp theo
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Sidebar Navigation */}
            <div className="lg:col-span-4 sticky top-8 space-y-6">
                {/* Timer Card (Desktop) */}
                <div className="hidden lg:block bg-surface-1 p-8 rounded-3xl shadow-xl border border-border text-center">
                    <div className="text-secondary text-sm font-bold uppercase tracking-wider mb-2">Thời gian còn lại</div>
                    <div className={`text-4xl font-mono font-black mb-4 ${timeLeft < 60 ? 'text-alert-0 animate-pulse' : 'text-accent-0'}`}>
                        {formatTime(timeLeft)}
                    </div>
                    <div className="w-full bg-surface-2 h-1.5 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-1000 ${timeLeft < 60 ? 'bg-alert-0' : 'bg-accent-0'}`}
                            style={{ width: `${(timeLeft / (quiz.duration * 60)) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Question Grid Card */}
                <div className="bg-surface-1 p-8 rounded-3xl shadow-xl border border-border">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="font-bold text-primary">Danh sách câu hỏi</h4>
                        <span className="text-xs bg-surface-2 px-2 py-1 rounded text-secondary font-bold">
                            {Object.keys(userAnswers).filter(k => userAnswers[k].length > 0).length}/{questions.length}
                        </span>
                    </div>

                    <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-5 gap-3">
                        {questions.map((q, idx) => {
                            const isAnswered = isQuestionAnswered(q.id!);
                            const isCurrent = idx === currentQuestionIndex;

                            return (
                                <button
                                    key={q.id || idx}
                                    onClick={() => setCurrentQuestionIndex(idx)}
                                    className={`aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all ${isCurrent
                                        ? 'bg-accent-0 text-white shadow-lg ring-4 ring-accent-0/20'
                                        : isAnswered
                                            ? 'bg-success/10 text-success border-2 border-success/30'
                                            : 'bg-surface-2 text-tertiary-1 border-2 border-border hover:border-border-strong'
                                        }`}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-8 pt-6 border-t border-border space-y-3">
                        <div className="flex items-center gap-3 text-xs font-bold text-secondary uppercase tracking-tight">
                            <div className="w-3 h-3 rounded-sm bg-success" /> Đã trả lời
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-secondary uppercase tracking-tight">
                            <div className="w-3 h-3 rounded-sm bg-surface-2" /> Chưa trả lời
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-secondary uppercase tracking-tight">
                            <div className="w-3 h-3 rounded-sm bg-accent-0" /> Đang xem
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full mt-8 py-4 bg-accent-0 text-white rounded-2xl font-bold hover:bg-accent-1 transition-colors shadow-lg shadow-accent-0/20"
                    >
                        Nộp bài thi
                    </button>
                </div>
            </div>
        </div>
    );
}
