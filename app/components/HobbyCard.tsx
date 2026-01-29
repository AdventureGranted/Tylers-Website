'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ImageCarousel from './ImageCarousel';

interface HobbyCardProps {
  slug: string;
  title: string;
  description: string | null;
  images: { url: string; alt: string | null }[];
}

export default function HobbyCard({
  slug,
  title,
  description,
  images,
}: HobbyCardProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'carousel' | 'beforeAfter'>(
    'beforeAfter'
  );
  const [showAfter, setShowAfter] = useState(true);

  const handleCardClick = () => {
    router.push(`/hobbies/${slug}`);
  };

  const hasBeforeAfter = images.length >= 2;
  const beforeImage = images[0];
  const afterImage = images[images.length - 1];

  return (
    <div
      onClick={handleCardClick}
      className="group flex cursor-pointer flex-col rounded-3xl border border-gray-700 bg-gray-800 p-6 shadow-lg transition-all duration-300 hover:border-yellow-300/50 hover:shadow-2xl"
    >
      {images.length > 0 && (
        <div className="mb-4" onClick={(e) => e.stopPropagation()}>
          {/* View mode toggle - only show if there are 2+ images */}
          {hasBeforeAfter && (
            <div className="mb-2 flex items-center justify-between">
              <div className="flex overflow-hidden rounded-lg bg-gray-700 text-xs">
                <button
                  onClick={() => setViewMode('carousel')}
                  className={`px-2 py-1 transition-colors ${
                    viewMode === 'carousel'
                      ? 'bg-yellow-300 text-gray-900'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Gallery
                </button>
                <button
                  onClick={() => setViewMode('beforeAfter')}
                  className={`px-2 py-1 transition-colors ${
                    viewMode === 'beforeAfter'
                      ? 'bg-yellow-300 text-gray-900'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Before/After
                </button>
              </div>

              {/* Before/After toggle when in that mode */}
              {viewMode === 'beforeAfter' && (
                <div className="flex overflow-hidden rounded-lg bg-gray-700 text-xs">
                  <button
                    onClick={() => setShowAfter(false)}
                    className={`px-2 py-1 transition-colors ${
                      !showAfter
                        ? 'bg-yellow-300 text-gray-900'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    Before
                  </button>
                  <button
                    onClick={() => setShowAfter(true)}
                    className={`px-2 py-1 transition-colors ${
                      showAfter
                        ? 'bg-yellow-300 text-gray-900'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    After
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Image display */}
          {viewMode === 'carousel' || !hasBeforeAfter ? (
            <ImageCarousel images={images} />
          ) : (
            <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-700">
              {/* Before image (base layer) */}
              <Image
                src={beforeImage.url}
                alt={beforeImage.alt || 'Before'}
                fill
                className="object-cover"
              />
              {/* After image (overlay with fade) */}
              <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{ opacity: showAfter ? 1 : 0 }}
              >
                <Image
                  src={afterImage.url}
                  alt={afterImage.alt || 'After'}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>
      )}
      <h2 className="mb-1 text-2xl font-semibold text-yellow-300 transition-colors group-hover:text-yellow-200">
        {title}
      </h2>
      {description && (
        <p className="mb-3 line-clamp-2 text-gray-400">{description}</p>
      )}
      <span className="mt-auto text-sm text-gray-500 transition-colors group-hover:text-yellow-300">
        View details →
      </span>
    </div>
  );
}
