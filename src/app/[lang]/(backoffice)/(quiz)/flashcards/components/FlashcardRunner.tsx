"use client";

import { useState } from "react";
import { FlashcardSet } from "@/app/feature/flashcard";
import { useRouter } from "next/navigation";
import BackArrow from "@/app/assets/images/icons/back_arrow.svg";

export default function FlashcardRunner({ set }: { set: FlashcardSet }) {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const cards = set.cards || [];
    const currentCard = cards[currentIndex];

    const handleFlip = () => setIsFlipped(!isFlipped);

    const handleNext = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % cards.length);
        }, 150);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
        }, 150);
    };

    if (cards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-surface-1 rounded-3xl border border-border">
                <div className="text-6xl mb-6">📭</div>
                <h1 className="text-2xl font-black text-primary mb-4">No Cards in this Set</h1>
                <p className="text-secondary mb-8">Add some cards to this set before you start studying.</p>
                <button
                    onClick={() => router.back()}
                    className="px-8 py-3 bg-accent-0 text-white rounded-xl font-bold transition-all hover:bg-accent-1 shadow-lg"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col min-h-[80vh]">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="size-10 bg-surface-2 hover:bg-surface-3 rounded-xl flex items-center justify-center transition-all border border-border group"
                    >
                        <BackArrow className="size-4 fill-primary group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-primary line-clamp-1">{set.name}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-accent-0 font-black uppercase tracking-widest bg-accent-0/10 px-2 py-0.5 rounded-md border border-accent-0/20">
                                Study Mode
                            </span>
                            <span className="text-[10px] text-secondary font-bold uppercase tracking-widest">
                                {currentIndex + 1} / {cards.length} Cards
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-surface-2 h-2 rounded-full mb-12 overflow-hidden border border-border/50">
                <div
                    className="h-full bg-accent-0 transition-all duration-500 ease-out"
                    style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
                />
            </div>

            {/* Flashcard Area */}
            <div className="flex-grow flex flex-col items-center justify-center gap-12">
                <div
                    className="relative w-full max-w-2xl aspect-[3/2] cursor-pointer perspective-1000 group"
                    onClick={handleFlip}
                >
                    <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                        {/* Front Side */}
                        <div className="absolute inset-0 backface-hidden bg-surface-1 border-2 border-border-strong rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center p-12 text-center hover:border-accent-0/30 transition-all">
                            <span className="absolute top-8 px-4 py-1 bg-surface-2 rounded-full text-[10px] font-black uppercase tracking-widest text-secondary border border-border">Front</span>
                            <h2 className="text-3xl md:text-5xl font-black text-primary leading-tight">
                                {currentCard.front}
                            </h2>
                            <div className="absolute bottom-10 opacity-40 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] font-black uppercase tracking-widest text-accent-0">Click to reveal back</span>
                            </div>
                        </div>

                        {/* Back Side */}
                        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-accent-0 border-4 border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center p-12 text-center text-white overflow-y-auto">
                            <span className="absolute top-8 px-4 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/30">Back</span>
                            <div className="space-y-6">
                                <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">
                                    {currentCard.back}
                                </h2>
                                {currentCard.example && (
                                    <div className="max-w-md mx-auto pt-6 border-t border-white/20">
                                        <p className="text-lg opacity-90 font-medium italic leading-relaxed">
                                            "{currentCard.example}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row items-center gap-6 w-full justify-center">
                    <button
                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                        className="w-full sm:w-auto px-10 py-4 bg-surface-1 hover:bg-surface-2 text-primary rounded-2xl font-black text-xs uppercase tracking-widest border border-border transition-all active:scale-95 group flex items-center gap-3"
                    >
                        <svg className="size-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M15 19l-7-7 7-7" /></svg>
                        Prev
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); handleFlip(); }}
                        className="w-full sm:w-auto px-16 py-4 bg-accent-0 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:shadow-accent-0/30 hover:bg-accent-1 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3"
                    >
                        <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        Flip
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                        className="w-full sm:w-auto px-10 py-4 bg-surface-1 hover:bg-surface-2 text-primary rounded-2xl font-black text-xs uppercase tracking-widest border border-border transition-all active:scale-95 group flex items-center gap-3"
                    >
                        Next
                        <svg className="size-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
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
            `}</style>
        </div>
    );
}
