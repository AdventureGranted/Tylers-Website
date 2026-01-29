'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { HiOutlinePhotograph } from 'react-icons/hi';

interface ProjectImage {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
  type?: string;
}

interface BeforeAfterToggleProps {
  images: ProjectImage[];
  readOnly?: boolean;
  initialBeforeIndex?: number;
  initialAfterIndex?: number;
  initialMode?: 'toggle' | 'slider';
  onIndicesChange?: (beforeIndex: number, afterIndex: number) => void;
  onModeChange?: (mode: 'toggle' | 'slider') => void;
}

export default function BeforeAfterToggle({
  images: allMedia,
  readOnly = false,
  initialBeforeIndex,
  initialAfterIndex,
  initialMode,
  onIndicesChange,
  onModeChange,
}: BeforeAfterToggleProps) {
  // Filter to only images - videos don't work well for before/after comparison
  const images = allMedia.filter((img) => img.type !== 'video');

  const [showAfter, setShowAfter] = useState(true);
  const [beforeIndex, setBeforeIndex] = useState(initialBeforeIndex ?? 0);
  const [afterIndex, setAfterIndex] = useState(
    initialAfterIndex ?? (images.length > 1 ? images.length - 1 : 0)
  );
  const [mode, setMode] = useState<'toggle' | 'slider'>(
    initialMode ?? 'toggle'
  );
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Sync with initial values when they change
  useEffect(() => {
    if (initialBeforeIndex !== undefined) {
      setBeforeIndex(initialBeforeIndex);
    }
  }, [initialBeforeIndex]);

  useEffect(() => {
    if (initialAfterIndex !== undefined) {
      setAfterIndex(initialAfterIndex);
    }
  }, [initialAfterIndex]);

  useEffect(() => {
    if (initialMode !== undefined) {
      setMode(initialMode);
    }
  }, [initialMode]);

  // Handle mode change
  const handleModeChange = (newMode: 'toggle' | 'slider') => {
    setMode(newMode);
    onModeChange?.(newMode);
  };

  // Notify parent when indices change
  const handleBeforeIndexChange = (index: number) => {
    setBeforeIndex(index);
    onIndicesChange?.(index, afterIndex);
  };

  const handleAfterIndexChange = (index: number) => {
    setAfterIndex(index);
    onIndicesChange?.(beforeIndex, index);
  };

  // Handle slider drag
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      setSliderPosition((x / rect.width) * 100);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Handle touch events for mobile
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(
      0,
      Math.min(e.touches[0].clientX - rect.left, rect.width)
    );
    setSliderPosition((x / rect.width) * 100);
  };

  if (images.length < 2) {
    return (
      <div className="rounded-2xl bg-gray-800 p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-200">
          <HiOutlinePhotograph className="text-yellow-300" />
          Before / After
        </h3>
        <p className="text-xs text-gray-500">
          Need at least 2 images for comparison
        </p>
      </div>
    );
  }

  const beforeImage = images[beforeIndex];
  const afterImage = images[afterIndex];

  return (
    <div className="rounded-2xl bg-gray-800 p-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-200">
          <HiOutlinePhotograph className="text-yellow-300" />
          Before / After
        </h3>

        {/* Mode toggle for toggle mode, or labels for slider mode */}
        {mode === 'toggle' ? (
          <div className="flex overflow-hidden rounded-lg bg-gray-700">
            <button
              type="button"
              onClick={() => setShowAfter(false)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                !showAfter
                  ? 'bg-yellow-300 text-gray-900'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Before
            </button>
            <button
              type="button"
              onClick={() => setShowAfter(true)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                showAfter
                  ? 'bg-yellow-300 text-gray-900'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              After
            </button>
          </div>
        ) : (
          <span className="text-xs text-gray-400">Drag to compare</span>
        )}
      </div>

      {/* Toggle Mode - Fade transition */}
      {mode === 'toggle' && (
        <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-700">
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

      {/* Slider Mode */}
      {mode === 'slider' && (
        <div
          ref={sliderRef}
          className="relative aspect-video cursor-ew-resize overflow-hidden rounded-lg bg-gray-700 select-none"
          onMouseDown={() => {
            isDragging.current = true;
          }}
          onTouchMove={handleTouchMove}
        >
          {/* After image (full width, background) */}
          <Image
            src={afterImage.url}
            alt={afterImage.alt || 'After'}
            fill
            className="object-cover"
            draggable={false}
          />

          {/* Before image (clipped by slider position) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <div
              className="relative h-full"
              style={{
                width: sliderRef.current
                  ? `${sliderRef.current.offsetWidth}px`
                  : '100vw',
              }}
            >
              <Image
                src={beforeImage.url}
                alt={beforeImage.alt || 'Before'}
                fill
                className="object-cover"
                draggable={false}
              />
            </div>
          </div>

          {/* Slider handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
            style={{
              left: `${sliderPosition}%`,
              transform: 'translateX(-50%)',
            }}
          >
            {/* Handle grip */}
            <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg">
              <div className="flex gap-0.5">
                <div className="h-4 w-0.5 rounded bg-gray-400" />
                <div className="h-4 w-0.5 rounded bg-gray-400" />
              </div>
            </div>
          </div>

          {/* Labels */}
          <div className="pointer-events-none absolute inset-0 flex justify-between p-3">
            <span className="rounded bg-black/50 px-2 py-1 text-xs text-white">
              Before
            </span>
            <span className="rounded bg-black/50 px-2 py-1 text-xs text-white">
              After
            </span>
          </div>
        </div>
      )}

      {/* Admin controls */}
      {!readOnly && (
        <div className="mt-3 space-y-3">
          {/* Mode selector */}
          <div>
            <label className="mb-1 block text-xs text-gray-400">
              Comparison Mode
            </label>
            <div className="flex overflow-hidden rounded-lg bg-gray-700">
              <button
                type="button"
                onClick={() => handleModeChange('toggle')}
                className={`flex-1 px-3 py-1.5 text-xs font-medium transition-colors ${
                  mode === 'toggle'
                    ? 'bg-yellow-300 text-gray-900'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Toggle
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('slider')}
                className={`flex-1 px-3 py-1.5 text-xs font-medium transition-colors ${
                  mode === 'slider'
                    ? 'bg-yellow-300 text-gray-900'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Slider
              </button>
            </div>
          </div>

          {/* Image selection */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-xs text-gray-400">
                Before Image
              </label>
              <select
                value={beforeIndex}
                onChange={(e) =>
                  handleBeforeIndexChange(parseInt(e.target.value))
                }
                className="w-full rounded bg-gray-700 px-2 py-1 text-xs text-gray-200 focus:ring-1 focus:ring-yellow-300 focus:outline-none"
              >
                {images.map((img, i) => (
                  <option key={img.id} value={i}>
                    {img.alt ? `${i + 1}. ${img.alt}` : `Image ${i + 1}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">
                After Image
              </label>
              <select
                value={afterIndex}
                onChange={(e) =>
                  handleAfterIndexChange(parseInt(e.target.value))
                }
                className="w-full rounded bg-gray-700 px-2 py-1 text-xs text-gray-200 focus:ring-1 focus:ring-yellow-300 focus:outline-none"
              >
                {images.map((img, i) => (
                  <option key={img.id} value={i}>
                    {img.alt ? `${i + 1}. ${img.alt}` : `Image ${i + 1}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
