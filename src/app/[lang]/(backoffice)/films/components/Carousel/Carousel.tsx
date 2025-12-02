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

  const itemWidth = 100 / visibleCount;

  const prev = () => {
    setCurrentIndex((prev) => Math.max(prev - step, 0));
  };

  const next = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + step, items.length - visibleCount)
    );
  };

  if (!items) {
    return (
      <div
        className={`flex justify-center items-center min-h-[152px] ${className}`}
      >
        {Loading ? (
          Loading
        ) : (
          <div className="text-gray-400 animate-pulse">Loading...</div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center w-full overflow-hidden ${className}`}>
      <button onClick={prev} className="shrink-0">
        {prevButton ? prevButton : <span className="px-3 py-2">‹</span>}
      </button>
      <div className="overflow-hidden h-full flex-1">
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * itemWidth}%)`,
          }}
        >
          {items.map((item, i) => (
            <div key={i} style={{ flex: `0 0 ${itemWidth}%` }}>
              {<ItemElement item={item} />}
            </div>
          ))}
        </div>
      </div>
      <button onClick={next} className="shrink-0">
        {nextButton ? nextButton : <span className="px-3 py-2">›</span>}
      </button>
    </div>
  );
};

export default Carousel;
