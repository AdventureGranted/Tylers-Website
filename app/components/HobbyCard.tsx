'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ImageCarousel from './ImageCarousel';
import BeforeAfterToggle from './BeforeAfterToggle';
import { HiOutlinePhotograph } from 'react-icons/hi';

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
  const hasBeforeAfter = imageOnlyMedia.length >= 2 && compareMode !== 'single';

  // For single mode, use the afterImageIndex as the display image (or first image)
  // Must use imageOnlyMedia to match BeforeAfterToggle's filtered array
  const singleImageIndex = afterImageIndex ?? 0;
  const singleImage = imageOnlyMedia[singleImageIndex] || imageOnlyMedia[0];

  return (
    <div
      onClick={handleCardClick}
      className="group flex cursor-pointer flex-col rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 transition-all duration-300 hover:border-yellow-500/50 hover:shadow-xl dark:hover:border-yellow-300/50"
      style={{ boxShadow: 'var(--card-shadow)' }}
    >
      {images.length > 0 && (
        <div
          className="mb-4"
          onClick={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
        >
          {compareMode === 'single' && singleImage ? (
            <div className="rounded-2xl bg-[var(--input-bg)] p-4">
              <div className="mb-3 flex items-center">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                  <HiOutlinePhotograph className="text-yellow-500 dark:text-yellow-300" />
                  Featured Photo
                </h3>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-lg border border-[var(--card-border)] bg-[var(--input-bg)]">
                {singleImage.type === 'video' ? (
                  <video
                    src={singleImage.url}
                    className="h-full w-full object-cover"
                    controls
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <Image
                    src={singleImage.url}
                    alt={singleImage.alt || title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            </div>
          ) : hasBeforeAfter ? (
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
      <h2 className="mb-1 text-2xl font-semibold text-yellow-500 transition-colors group-hover:text-yellow-600 dark:text-yellow-300 dark:group-hover:text-yellow-200">
        {title}
      </h2>
      {description && (
        <p className="mb-3 line-clamp-2 text-[var(--text-secondary)]">
          {description}
        </p>
      )}
      <span className="mt-auto text-sm text-[var(--text-muted)] transition-colors group-hover:text-yellow-500 dark:group-hover:text-yellow-300">
        View details →
      </span>
    </div>
  );
}
