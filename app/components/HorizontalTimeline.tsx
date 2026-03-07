'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

interface TimelineItem {
  year: string;
  month?: string;
  title: string;
  desc: string;
  color: string;
}

interface HorizontalTimelineProps {
  items: TimelineItem[];
}

export default function HorizontalTimeline({ items }: HorizontalTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6;
    el.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative">
      {/* Left fade + arrow */}
      <div
        className={`pointer-events-none absolute top-0 left-0 z-10 flex h-full w-12 items-center justify-start bg-gradient-to-r from-white via-white/80 to-transparent transition-opacity dark:from-gray-800 dark:via-gray-800/80 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`}
      >
        <button
          onClick={() => scroll('left')}
          className="pointer-events-auto rounded-full bg-gray-200 p-1.5 shadow-md transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          aria-label="Scroll left"
        >
          <HiChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* Right fade + arrow */}
      <div
        className={`pointer-events-none absolute top-0 right-0 z-10 flex h-full w-12 items-center justify-end bg-gradient-to-l from-white via-white/80 to-transparent transition-opacity dark:from-gray-800 dark:via-gray-800/80 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`}
      >
        <button
          onClick={() => scroll('right')}
          className="pointer-events-auto rounded-full bg-gray-200 p-1.5 shadow-md transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          aria-label="Scroll right"
        >
          <HiChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="scrollbar-hide overflow-x-auto"
        style={{ cursor: 'grab' }}
        onMouseDown={(e) => {
          const el = scrollRef.current;
          if (!el) return;
          el.style.cursor = 'grabbing';
          const startX = e.pageX;
          const startScroll = el.scrollLeft;

          const onMove = (ev: MouseEvent) => {
            el.scrollLeft = startScroll - (ev.pageX - startX);
          };
          const onUp = () => {
            el.style.cursor = 'grab';
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
          };
          window.addEventListener('mousemove', onMove);
          window.addEventListener('mouseup', onUp);
        }}
      >
        <div
          className="relative px-8"
          style={{
            width: `${items.length * 200 + 16}px`,
            minWidth: '100%',
          }}
        >
          {/* Top row cards (even indices) */}
          <div className="flex" style={{ height: '160px' }}>
            {items.map((item, i) =>
              i % 2 === 0 ? (
                <div
                  key={i}
                  className="flex flex-shrink-0 flex-col justify-end pb-3"
                  style={{ width: '200px' }}
                >
                  <div className="mx-2 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-700/50">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  key={i}
                  className="flex-shrink-0"
                  style={{ width: '200px' }}
                />
              )
            )}
          </div>

          {/* Timeline line + dots row */}
          <div className="relative" style={{ height: '48px' }}>
            {/* Gradient line */}
            <div className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 bg-gradient-to-r from-purple-500 via-yellow-300 to-purple-500" />

            {/* Connector lines + dots */}
            {items.map((item, i) => (
              <div
                key={i}
                className="absolute flex flex-col items-center"
                style={{
                  left: `${i * 200 + 100}px`,
                  transform: 'translateX(-50%)',
                  top: 0,
                  height: '48px',
                }}
              >
                {/* Vertical connector line */}
                <div
                  className={`w-px bg-gray-400/50 dark:bg-gray-500/50 ${
                    i % 2 === 0
                      ? 'absolute -top-3 h-3'
                      : 'absolute -bottom-3 h-3'
                  }`}
                  style={i % 2 === 0 ? { top: '-12px' } : { bottom: '-12px' }}
                />

                {/* Dot */}
                <div className="absolute top-1/2 -translate-y-1/2">
                  <div
                    className={`h-4 w-4 rounded-full ${item.color} ring-4 ring-white dark:ring-gray-800`}
                  />
                </div>

                {/* Date label */}
                <div
                  className={`absolute flex flex-col items-center ${
                    i % 2 === 0 ? 'top-full mt-0.5' : 'bottom-full mb-0.5'
                  }`}
                >
                  {item.month && (
                    <span className="text-[9px] font-medium text-gray-400 dark:text-gray-500">
                      {item.month}
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                    {item.year}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom row cards (odd indices) */}
          <div className="flex" style={{ height: '160px' }}>
            {items.map((item, i) =>
              i % 2 === 1 ? (
                <div
                  key={i}
                  className="flex flex-shrink-0 flex-col justify-start pt-3"
                  style={{ width: '200px' }}
                >
                  <div className="mx-2 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-700/50">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  key={i}
                  className="flex-shrink-0"
                  style={{ width: '200px' }}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
