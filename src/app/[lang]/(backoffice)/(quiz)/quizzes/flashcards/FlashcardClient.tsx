"use client";

import { useState } from "react";
import { Quiz } from "@/app/feature/quiz";
import { useRouter } from "next/navigation";
import BackArrow from "@/app/assets/images/icons/back_arrow.svg";

export default function FlashcardClient({ quiz }: { quiz: Quiz }) {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const questions = quiz.questions || [];
    const currentQuestion = questions[currentIndex];

    const handleFlip = () => setIsFlipped(!isFlipped);

    const handleNext = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % questions.length);
        }, 150);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + questions.length) % questions.length);
        }, 150);
    };

    if (questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
                <div className="text-6xl mb-6">📭</div>
                <h1 className="text-2xl font-black text-primary mb-4">No Cards Available</h1>
                <p className="text-secondary mb-8">This quiz doesn't have any questions to display as cards.</p>
                <button
                    onClick={() => router.back()}
                    className="px-8 py-3 bg-accent-0 text-white rounded-xl font-bold transition-all hover:bg-accent-1"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const correctAnswers = currentQuestion.answers.filter(a => a.isCorrect);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 min-h-screen flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 md:mb-12">
                <div className="flex items-center gap-4 lg:gap-6">
                    <button
                        onClick={() => router.back()}
                        className="size-12 bg-surface-1 hover:bg-surface-2 rounded-2xl border border-border flex items-center justify-center transition-all shadow-sm group"
                    >
                        <BackArrow className="size-5 fill-primary group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-xl md:text-3xl font-black text-primary line-clamp-1">{quiz.title}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-secondary font-black uppercase tracking-widest bg-surface-2 px-2 py-0.5 rounded-md border border-border">
                                Flashcard Mode
                            </span>
                            <span className="text-[10px] text-secondary font-bold uppercase tracking-widest">
                                Card {currentIndex + 1} of {questions.length}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-surface-2 h-2.5 rounded-full mb-12 overflow-hidden border border-border shadow-inner">
                <div
                    className="h-full bg-accent-0 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(var(--accent-0-rgb),0.5)]"
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
            </div>

            {/* Flashcard Area */}
            <div className="flex-grow flex flex-col items-center justify-center gap-8 md:gap-16">
                <div
                    className="relative w-full max-w-2xl aspect-[4/3] md:aspect-[3/2] cursor-pointer group perspective-1000"
                    onClick={handleFlip}
                >
                    <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                        {/* Front Side */}
                        <div className="absolute inset-0 backface-hidden bg-surface-1 border-2 border-border-strong rounded-[2rem] md:rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-8 md:p-16 text-center group-hover:border-accent-0/40 transition-all duration-500">
                            <div className="absolute top-8 left-1/2 -translate-x-1/2">
                                <span className="px-4 py-1 bg-surface-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-secondary border border-border">Front</span>
                            </div>
                            <h2 className="text-2xl md:text-5xl font-black text-primary leading-tight tracking-tight">
                                {currentQuestion.content}
                            </h2>
                            <div className="absolute bottom-12 flex flex-col items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="text-[10px] font-black uppercase tracking-widest text-accent-0">Click to Flip</div>
                            </div>
                        </div>

                        {/* Back Side */}
                        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-accent-0 border-4 border-white/20 rounded-[2rem] md:rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-8 md:p-16 text-center text-white overflow-y-auto">
                            <div className="absolute top-8 left-1/2 -translate-x-1/2">
                                <span className="px-4 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white border border-white/40">Back</span>
                            </div>
                            <div className="space-y-6 md:space-y-10 py-12">
                                <div className="space-y-4">
                                    {correctAnswers.map((answer, i) => (
                                        <h2 key={i} className="text-2xl md:text-5xl font-black leading-tight tracking-tight drop-shadow-lg">
                                            {answer.content}
                                        </h2>
                                    ))}
                                </div>
                                {currentQuestion.explanation && (
                                    <div className="max-w-md mx-auto pt-8 border-t border-white/20">
                                        <p className="text-base md:text-lg opacity-90 font-medium leading-relaxed italic">
                                            {currentQuestion.explanation}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-8 w-full justify-center">
                    <button
                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                        className="w-full sm:w-auto px-10 py-5 bg-surface-1 hover:bg-surface-2 text-primary rounded-2xl font-black text-xs uppercase tracking-widest border border-border shadow-lg transition-all active:scale-95 group flex items-center justify-center gap-3"
                    >
                        <svg className="size-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M15 19l-7-7 7-7" /></svg>
                        Prev
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); handleFlip(); }}
                        className="w-full sm:w-auto px-16 py-5 bg-accent-0 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-accent-0/30 hover:bg-accent-1 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                        <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        Flip
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                        className="w-full sm:w-auto px-10 py-5 bg-surface-1 hover:bg-surface-2 text-primary rounded-2xl font-black text-xs uppercase tracking-widest border border-border shadow-lg transition-all active:scale-95 group flex items-center justify-center gap-3"
                    >
                        Next
                        <svg className="size-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>

            {/* Hint / Instructions */}
            <div className="mt-12 text-center">
                <p className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.4em]">Use these cards to master the content before taking the quiz</p>
            </div>

            <style jsx global>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .transform-style-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
                .rotate-y-180 {
                    transform: rotateY(180deg);
                }
                :root {
                    --accent-0-rgb: 99, 102, 241; /* Default indigo-500, adjust if needed */
                }
            `}</style>
        </div>
    );
}
