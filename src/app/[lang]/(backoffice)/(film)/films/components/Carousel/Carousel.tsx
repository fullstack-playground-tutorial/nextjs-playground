"use client";
import React, { useState, type JSX } from "react";

type CarouselProps<T> = {
  items: T[];
  ItemElement: React.ComponentType<{ item: T }>;
  visibleCount?: number;
  Loading?: React.ReactNode;
  className?: string;
  prevButton?: React.ReactNode;
  nextButton?: React.ReactNode;
  step?: number;
};

const Carousel = <T,>({
  items,
  ItemElement,
  visibleCount = 3,
  step = 1,
  Loading,
  className = "",
  prevButton,
  nextButton,
}: CarouselProps<T>) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responsiveVisibleCount, setResponsiveVisibleCount] = useState(visibleCount);

  // Responsive logic
  React.useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth < 640) setResponsiveVisibleCount(1);
      else if (window.innerWidth < 1024) setResponsiveVisibleCount(2);
      else if (window.innerWidth < 1280) setResponsiveVisibleCount(3);
      else setResponsiveVisibleCount(visibleCount);
    };
    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, [visibleCount]);

  const itemWidth = 100 / responsiveVisibleCount;

  const prev = () => {
    setCurrentIndex((prev) => Math.max(prev - step, 0));
  };

  const next = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + step, items.length - responsiveVisibleCount)
    );
  };

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < items.length - responsiveVisibleCount;

  if (!items || items.length === 0) {
    return (
      <div
        className={`flex justify-center items-center min-h-[152px] ${className}`}
      >
        {Loading ? (
          Loading
        ) : (
          <div className="text-gray-400 animate-pulse uppercase tracking-widest font-bold">Loading...</div>
        )}
      </div>
    );
  }

  const ArrowButton = ({ direction, onClick, disabled, children }: { direction: 'left' | 'right', onClick: () => void, disabled: boolean, children: React.ReactNode }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`absolute top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 text-white transition-all duration-300 hover:bg-black/60 hover:scale-110 active:scale-95 disabled:opacity-0 disabled:pointer-events-none group shadow-2xl ${direction === 'left' ? '-left-6 md:-left-8' : '-right-6 md:-right-8'
        }`}
    >
      <div className="group-hover:scale-110 transition-transform">
        {children}
      </div>
    </button>
  );

  return (
    <div className={`relative px-4 w-full group/carousel ${className}`}>
      {/* Navigation Buttons */}
      <ArrowButton direction="left" onClick={prev} disabled={!canGoPrev}>
        {prevButton ? prevButton : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        )}
      </ArrowButton>

      <div className="overflow-visible h-full flex-1">
        <div
          className="flex h-full transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1)"
          style={{
            transform: `translateX(-${currentIndex * itemWidth}%)`,
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              style={{ flex: `0 0 ${itemWidth}%` }}
              className="px-3 md:px-4"
            >
              <ItemElement item={item} />
            </div>
          ))}
        </div>
      </div>

      <ArrowButton direction="right" onClick={next} disabled={!canGoNext}>
        {nextButton ? nextButton : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        )}
      </ArrowButton>

      {/* Pagination Indicator (Subtle) */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-2 overflow-hidden px-2 py-1">
        {Array.from({ length: Math.max(0, items.length - responsiveVisibleCount + 1) }).map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-500 ${i === currentIndex ? "w-8 bg-accent-0" : "w-2 bg-white/20"
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;

