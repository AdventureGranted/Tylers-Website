'use client';

import { useState } from 'react';
import Image from 'next/image';

interface CarouselImage {
  url: string;
  alt: string | null;
  type?: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
  aspectRatio?: 'video' | 'square';
}

export default function ImageCarousel({
  images,
  aspectRatio = 'video',
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  if (images.length === 0) return null;

  const isCurrentLoaded = loadedImages.has(currentIndex);

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }

    setTouchStart(null);
  };

  const aspectClass =
    aspectRatio === 'square' ? 'aspect-square' : 'aspect-video';

  return (
    <div className="relative w-full">
      <div
        className={`relative ${aspectClass} w-full overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--input-bg)]`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Loading skeleton */}
        {!isCurrentLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--input-bg)]">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--card-border)] border-t-yellow-500 dark:border-t-yellow-300" />
          </div>
        )}

        {images[currentIndex].type === 'video' ? (
          <video
            key={images[currentIndex].url}
            src={images[currentIndex].url}
            className={`h-full w-full object-cover transition-opacity duration-300 ${isCurrentLoaded ? 'opacity-100' : 'opacity-0'}`}
            controls
            playsInline
            preload="metadata"
            onLoadedData={() => handleImageLoad(currentIndex)}
          />
        ) : (
          <Image
            src={images[currentIndex].url}
            alt={images[currentIndex].alt || 'Image'}
            fill
            className={`object-cover transition-opacity duration-300 ${isCurrentLoaded ? 'opacity-100' : 'opacity-0'}`}
            sizes="(max-width: 768px) 100vw, 50vw"
            onLoad={() => handleImageLoad(currentIndex)}
          />
        )}

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              aria-label="Previous image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              aria-label="Next image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Dots indicator */}
      {images.length > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentIndex
                  ? 'bg-yellow-500 dark:bg-yellow-300'
                  : 'bg-[var(--card-border)]'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
