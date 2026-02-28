"use client";

import { QuizAttempt } from "@/app/feature/quiz-attempt";
import { Quiz } from "@/app/feature/quiz";
import { useMemo } from "react";
import Link from "next/link";

interface HistoryItem extends QuizAttempt {
    quiz?: Quiz;
}

export default function QuizHistory({
    attempts,
    quiz
}: {
    attempts: QuizAttempt[];
    quiz: Quiz | undefined;
}) {
    const formatDate = (date: any) => {
        if (!date) return "-";
        return new Date(date).toLocaleTimeString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="overflow-hidden bg-white dark:bg-surface-1 rounded-3xl border border-border shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                        <tr className="bg-surface-2/50 border-b border-border">
                            <th className="px-6 py-5 text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Quiz</th>
                            <th className="px-6 py-5 text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Start Time</th>
                            <th className="px-6 py-5 text-[10px] font-black text-secondary uppercase tracking-[0.2em]">End Time</th>
                            <th className="px-6 py-5 text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Submit Time</th>
                            <th className="px-6 py-5 text-[10px] font-black text-secondary uppercase tracking-[0.2em] text-center">Score</th>
                            <th className="px-6 py-5 text-[10px] font-black text-secondary uppercase tracking-[0.2em] text-center">Status</th>
                            <th className="px-6 py-5 text-[10px] font-black text-secondary uppercase tracking-[0.2em] text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {attempts.length > 0 ? (
                            attempts.map((item, idx) => (
                                <tr key={item.id} className="hover:bg-accent-0/[0.02] transition-colors group">
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 bg-surface-2 rounded-xl flex items-center justify-center group-hover:bg-accent-0 group-hover:text-white transition-all ring-1 ring-border shadow-sm shrink-0">
                                                <span className="text-lg font-black">{attempts.length - idx}</span>
                                            </div>
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="font-bold text-primary group-hover:text-accent-0 transition-colors truncate">
                                                    {quiz?.title || "Unknown Quiz"}
                                                </span>
                                                <span className="text-[10px] text-secondary font-black uppercase tracking-widest opacity-40">
                                                    ATTEMPT • {item.id.slice(0, 8)}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-primary opacity-80">{formatDate(item.startAt)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-primary opacity-80">{formatDate(item.endAt)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-accent-0">{formatDate(item.submittedAt)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <div className="inline-flex items-center justify-center">
                                            <div className={`px-4 py-2 rounded-2xl font-black text-lg border-2 shadow-sm ${item.score >= (quiz?.questions?.reduce((acc, q) => acc + q.point, 0) || 100) * 0.8 ? 'bg-green-500/10 border-green-500/20 text-green-500 shadow-green-500/5' :
                                                item.score >= 5 ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500 shadow-yellow-500/5' :
                                                    'bg-red-500/10 border-red-500/20 text-red-500 shadow-red-500/5'
                                                }`}>
                                                {item.score || 0}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        {item.isSubmitted ? (
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-0/10 text-accent-0 rounded-full border border-accent-0/20">
                                                <div className="size-1.5 bg-accent-0 rounded-full animate-pulse"></div>
                                                <span className="text-[10px] font-black uppercase tracking-wider">Submitted</span>
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 text-yellow-500 rounded-full border border-yellow-500/20">
                                                <div className="size-1.5 bg-yellow-500 rounded-full"></div>
                                                <span className="text-[10px] font-black uppercase tracking-wider">Pending</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <Link
                                            href={`./histories/${item.id}`}
                                            className="inline-flex items-center gap-3 px-5 py-2.5 bg-surface-2 hover:bg-accent-0 hover:text-white dark:text-primary rounded-xl transition-all font-black text-[10px] uppercase tracking-widest border border-border shadow-sm group/btn"
                                        >
                                            {item.isSubmitted ? "Review" : "Resume"}
                                            <svg className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-24 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="size-20 bg-surface-2 rounded-full flex items-center justify-center text-4xl shadow-inner">📭</div>
                                        <div className="flex flex-col">
                                            <h3 className="text-xl font-black text-primary">No Attempts Found</h3>
                                            <p className="text-sm text-secondary opacity-60">You haven't started this quiz yet.</p>
                                        </div>
                                        <Link href="/quizzes" className="mt-4 px-8 py-3 bg-accent-0 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-accent-0/20 hover:scale-105 transition-transform active:scale-95">
                                            Start Learning
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
