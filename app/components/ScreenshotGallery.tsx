'use client';

import { useEffect, useRef, useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import ImageLightbox from '@/app/components/ImageLightbox';
import ThemedScreenshot from '@/app/components/ThemedScreenshot';
import { useTheme } from '@/app/components/ThemeProvider';

export interface Screenshot {
  file: string;
  title: string;
  caption: string;
  alt: string;
}

interface ScreenshotGalleryProps {
  screenshots: Screenshot[];
  // Folder holding dark/ and light/ subfolders of <file>-<480|960>.<avif|webp>
  basePath: string;
  label: string;
}

// Matches the card width below: 62vw on phones, 240px from the sm breakpoint
const SIZES = '(min-width: 640px) 240px, 62vw';
const SM_UP = '(min-width: 640px)';

const FRAME_CLASS =
  'block w-full overflow-hidden rounded-[2.25rem] border-[6px] border-gray-900 bg-gray-900 shadow-lg dark:border-gray-700';

export default function ScreenshotGallery({
  screenshots,
  basePath,
  label,
}: ScreenshotGalleryProps) {
  const { theme } = useTheme();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  // On phones the card is already near full screen width, so enlarging
  // would only shrink it; screens only open in the lightbox from sm up
  const [canEnlarge, setCanEnlarge] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(SM_UP);
    const update = () => {
      setCanEnlarge(query.matches);
      if (!query.matches) setLightboxIndex(null);
    };
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const scroll = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="text-sm text-gray-700 dark:text-gray-400">
          <span className="sm:hidden">Swipe to browse.</span>
          <span className="hidden sm:inline">
            Scroll sideways or use the arrows. Click a screen to enlarge it.
          </span>
        </p>
        <div className="hidden shrink-0 gap-2 sm:flex">
          <button
            onClick={() => scroll(-1)}
            className="hover:border-accent rounded-full border border-gray-300 p-2 text-gray-900 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            aria-label="Scroll screenshots left"
          >
            <HiChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll(1)}
            className="hover:border-accent rounded-full border border-gray-300 p-2 text-gray-900 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            aria-label="Scroll screenshots right"
          >
            <HiChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="scrollbar-hide -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-5 overflow-x-auto px-6 pt-2 pb-4"
      >
        {screenshots.map((shot, idx) => (
          <figure
            key={shot.file}
            className="w-[62vw] shrink-0 snap-start sm:w-[240px]"
          >
            {canEnlarge ? (
              <button
                onClick={() => setLightboxIndex(idx)}
                className={`${FRAME_CLASS} focus-visible:ring-accent cursor-zoom-in transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:ring-4 focus-visible:outline-none`}
                aria-label={`Enlarge screenshot: ${shot.title}`}
              >
                <ThemedScreenshot
                  basePath={basePath}
                  file={shot.file}
                  alt={shot.alt}
                  sizes={SIZES}
                />
              </button>
            ) : (
              <div className={FRAME_CLASS}>
                <ThemedScreenshot
                  basePath={basePath}
                  file={shot.file}
                  alt={shot.alt}
                  sizes={SIZES}
                />
              </div>
            )}
            <figcaption className="mt-3 px-1">
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                {shot.title}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-400">
                {shot.caption}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={screenshots.map((shot) => ({
            url: `${basePath}/${theme}/${shot.file}-960.webp`,
            alt: shot.alt,
            width: 1320,
            height: 2868,
          }))}
          initialIndex={lightboxIndex}
          isOpen
          frame="phone"
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
