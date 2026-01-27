'use client';

import { useRouter } from 'next/navigation';
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

  const handleCardClick = () => {
    router.push(`/hobbies/${slug}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group flex cursor-pointer flex-col rounded-3xl border border-gray-700 bg-gray-800 p-6 shadow-lg transition-all duration-300 hover:border-yellow-300/50 hover:shadow-2xl"
    >
      {images.length > 0 && (
        <div className="mb-4" onClick={(e) => e.stopPropagation()}>
          <ImageCarousel images={images} />
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
