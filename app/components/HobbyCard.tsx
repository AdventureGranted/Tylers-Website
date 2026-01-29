'use client';

import { useRouter } from 'next/navigation';
import ImageCarousel from './ImageCarousel';
import BeforeAfterToggle from './BeforeAfterToggle';

interface HobbyCardProps {
  slug: string;
  title: string;
  description: string | null;
  images: { url: string; alt: string | null; type?: string }[];
  beforeImageIndex?: number | null;
  afterImageIndex?: number | null;
  compareMode?: string | null;
}

export default function HobbyCard({
  slug,
  title,
  description,
  images,
  beforeImageIndex,
  afterImageIndex,
  compareMode,
}: HobbyCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/hobbies/${slug}`);
  };

  // Filter to only images for before/after comparison (videos don't work well)
  const imageOnlyMedia = images.filter((img) => img.type !== 'video');
  const hasBeforeAfter = imageOnlyMedia.length >= 2;

  return (
    <div
      onClick={handleCardClick}
      className="group flex cursor-pointer flex-col rounded-3xl border border-gray-700 bg-gray-800 p-6 shadow-lg transition-all duration-300 hover:border-yellow-300/50 hover:shadow-2xl"
    >
      {images.length > 0 && (
        <div
          className="mb-4"
          onClick={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
        >
          {hasBeforeAfter ? (
            <BeforeAfterToggle
              images={images.map((img, i) => ({
                id: img.url,
                url: img.url,
                alt: img.alt,
                sortOrder: i,
                type: img.type,
              }))}
              readOnly
              initialBeforeIndex={beforeImageIndex ?? undefined}
              initialAfterIndex={afterImageIndex ?? undefined}
              initialMode={(compareMode as 'toggle' | 'slider') ?? undefined}
            />
          ) : (
            <ImageCarousel images={images} />
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
