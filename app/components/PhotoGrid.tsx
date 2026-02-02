'use client';

import { useState } from 'react';
import Image from 'next/image';
import ImageLightbox from './ImageLightbox';

interface PhotoGridImage {
  id: string;
  url: string;
  alt: string | null;
  type?: string;
}

interface PhotoGridProps {
  images: PhotoGridImage[];
}

// Generic blur placeholder for dynamic images
const blurDataURL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAKAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUG/8QAIhAAAQMEAQUBAAAAAAAAAAAAAQIDBAAFBhEhEjEyQWFx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAcEQACAgIDAAAAAAAAAAAAAAABAgADBBESITH/2gAMAwEAAhEDEQA/ANS7b2JAsmyaZbcN556PBbKfcv8AKlqJJUo8QByST116x1pdWk1t+p//2Q==';

export default function PhotoGrid({ images }: PhotoGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  const handleImageLoad = (imageId: string) => {
    setLoadedImages((prev) => new Set(prev).add(imageId));
  };

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => openLightbox(index)}
            className="relative aspect-square overflow-hidden rounded-lg border border-[var(--card-border)] transition-all hover:border-yellow-300/50 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
          >
            {image.type === 'video' ? (
              <>
                <video
                  src={image.url}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                  muted
                  preload="metadata"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="h-6 w-6 text-white"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Image
                  src={image.url}
                  alt={image.alt || `Photo ${index + 1}`}
                  fill
                  className={`object-cover transition-all duration-500 hover:scale-110 ${
                    loadedImages.has(image.id) ? 'blur-0' : 'blur-sm'
                  }`}
                  sizes="(max-width: 768px) 50vw, 25vw"
                  placeholder="blur"
                  blurDataURL={blurDataURL}
                  onLoad={() => handleImageLoad(image.id)}
                />
              </>
            )}
          </button>
        ))}
      </div>

      <ImageLightbox
        images={images}
        initialIndex={selectedIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
