'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
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
  initialMode?: 'toggle' | 'slider' | 'single';
  onIndicesChange?: (beforeIndex: number, afterIndex: number) => void;
  onModeChange?: (mode: 'toggle' | 'slider' | 'single') => void;
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
  const [mode, setMode] = useState<'toggle' | 'slider' | 'single'>(
    initialMode ?? 'toggle'
  );
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isSliding, setIsSliding] = useState(false);
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
  const handleModeChange = (newMode: 'toggle' | 'slider' | 'single') => {
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

  // Handle keyboard navigation for slider
  const handleSliderKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (mode !== 'slider') return;

      const step = e.shiftKey ? 10 : 1;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        setSliderPosition((prev) => Math.max(0, prev - step));
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        setSliderPosition((prev) => Math.min(100, prev + step));
      } else if (e.key === 'Home') {
        e.preventDefault();
        setSliderPosition(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setSliderPosition(100);
      }
    },
    [mode]
  );

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
      setIsSliding(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsSliding(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
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
      <div className="rounded-2xl bg-[var(--input-bg)] p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
          <HiOutlinePhotograph className="text-yellow-500 dark:text-yellow-300" />
          Before / After
        </h3>
        <p className="text-xs text-[var(--text-muted)]">
          Need at least 2 images for comparison
        </p>
      </div>
    );
  }

  const beforeImage = images[beforeIndex];
  const afterImage = images[afterIndex];

  return (
    <div
      className="rounded-2xl bg-[var(--input-bg)] p-4"
      role="region"
      aria-label="Before and after image comparison"
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
          <HiOutlinePhotograph
            className="text-yellow-500 dark:text-yellow-300"
            aria-hidden="true"
          />
          Before / After
        </h3>

        {/* Mode toggle for toggle mode, or labels for slider mode */}
        {mode === 'toggle' ? (
          <div
            className="flex overflow-hidden rounded-lg bg-[var(--card-border)]"
            role="tablist"
            aria-label="Image view selection"
          >
            <button
              type="button"
              role="tab"
              aria-selected={!showAfter}
              aria-controls="comparison-image"
              onClick={() => setShowAfter(false)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                !showAfter
                  ? 'bg-yellow-500 text-gray-900 dark:bg-yellow-300'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Before
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={showAfter}
              aria-controls="comparison-image"
              onClick={() => setShowAfter(true)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                showAfter
                  ? 'bg-yellow-500 text-gray-900 dark:bg-yellow-300'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              After
            </button>
          </div>
        ) : (
          <span className="text-xs text-[var(--text-muted)]" aria-live="polite">
            Drag to compare
          </span>
        )}
      </div>

      {/* Toggle Mode - Fade transition */}
      {mode === 'toggle' && (
        <div
          id="comparison-image"
          role="tabpanel"
          className="relative aspect-video overflow-hidden rounded-lg bg-[var(--card-border)]"
        >
          {/* Before image (base layer) */}
          <Image
            src={beforeImage.url}
            alt={beforeImage.alt || 'Before image'}
            fill
            className="object-cover"
          />
          {/* After image (overlay with fade) */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{ opacity: showAfter ? 1 : 0 }}
            aria-hidden={!showAfter}
          >
            <Image
              src={afterImage.url}
              alt={afterImage.alt || 'After image'}
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
          role="slider"
          aria-label="Image comparison slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(sliderPosition)}
          aria-valuetext={`Showing ${Math.round(sliderPosition)}% before image, ${Math.round(100 - sliderPosition)}% after image`}
          tabIndex={0}
          onKeyDown={handleSliderKeyDown}
          className="relative aspect-video cursor-ew-resize touch-none overflow-hidden rounded-lg bg-[var(--card-border)] select-none focus:ring-2 focus:ring-yellow-500 focus:outline-none dark:focus:ring-yellow-300"
          onMouseDown={() => {
            isDragging.current = true;
            setIsSliding(true);
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={() => setIsSliding(false)}
          onTouchMove={handleTouchMove}
        >
          {/* After image (full width, background) */}
          <Image
            src={afterImage.url}
            alt={afterImage.alt || 'After image'}
            fill
            className="object-cover"
            draggable={false}
          />

          {/* Before image (clipped by slider position) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            aria-hidden="true"
          >
            <Image
              src={beforeImage.url}
              alt={beforeImage.alt || 'Before image'}
              fill
              className="object-cover"
              draggable={false}
            />
          </div>

          {/* Slider handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
            style={{
              left: `${sliderPosition}%`,
              transform: 'translateX(-50%)',
            }}
            aria-hidden="true"
          >
            {/* Handle grip */}
            <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg">
              <div className="flex gap-0.5">
                <div className="h-4 w-0.5 rounded bg-gray-400" />
                <div className="h-4 w-0.5 rounded bg-gray-400" />
              </div>
            </div>
          </div>

          {/* Labels - hide when sliding */}
          <div
            className={`pointer-events-none absolute top-3 right-3 left-3 flex justify-between transition-opacity duration-200 ${
              isSliding ? 'opacity-0' : 'opacity-100'
            }`}
            aria-hidden="true"
          >
            <span className="rounded bg-black/50 px-2 py-1 text-center text-xs text-white">
              Before
            </span>
            <span className="rounded bg-black/50 px-2 py-1 text-center text-xs text-white">
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
            <label
              className="mb-1 block text-xs text-[var(--text-muted)]"
              id="mode-label"
            >
              Display Mode
            </label>
            <div
              className="flex overflow-hidden rounded-lg bg-[var(--card-border)]"
              role="radiogroup"
              aria-labelledby="mode-label"
            >
              <button
                type="button"
                role="radio"
                aria-checked={mode === 'toggle'}
                onClick={() => handleModeChange('toggle')}
                className={`flex-1 px-3 py-1.5 text-xs font-medium transition-colors ${
                  mode === 'toggle'
                    ? 'bg-yellow-500 text-gray-900 dark:bg-yellow-300'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                Toggle
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={mode === 'slider'}
                onClick={() => handleModeChange('slider')}
                className={`flex-1 px-3 py-1.5 text-xs font-medium transition-colors ${
                  mode === 'slider'
                    ? 'bg-yellow-500 text-gray-900 dark:bg-yellow-300'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                Slider
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={mode === 'single'}
                onClick={() => handleModeChange('single')}
                className={`flex-1 px-3 py-1.5 text-xs font-medium transition-colors ${
                  mode === 'single'
                    ? 'bg-yellow-500 text-gray-900 dark:bg-yellow-300'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                Single
              </button>
            </div>
          </div>

          {/* Image selection */}
          {mode === 'single' ? (
            <div>
              <label
                htmlFor="display-image-select"
                className="mb-1 block text-xs text-[var(--text-muted)]"
              >
                Display Image
              </label>
              <select
                id="display-image-select"
                value={afterIndex}
                onChange={(e) =>
                  handleAfterIndexChange(parseInt(e.target.value))
                }
                className="w-full rounded border border-[var(--card-border)] bg-[var(--card-bg)] px-2 py-1 text-xs text-[var(--text-primary)] focus:ring-1 focus:ring-yellow-500 focus:outline-none dark:focus:ring-yellow-300"
              >
                {images.map((img, i) => (
                  <option key={img.id} value={i}>
                    {img.alt ? `${i + 1}. ${img.alt}` : `Image ${i + 1}`}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label
                  htmlFor="before-image-select"
                  className="mb-1 block text-xs text-[var(--text-muted)]"
                >
                  Before Image
                </label>
                <select
                  id="before-image-select"
                  value={beforeIndex}
                  onChange={(e) =>
                    handleBeforeIndexChange(parseInt(e.target.value))
                  }
                  className="w-full rounded border border-[var(--card-border)] bg-[var(--card-bg)] px-2 py-1 text-xs text-[var(--text-primary)] focus:ring-1 focus:ring-yellow-500 focus:outline-none dark:focus:ring-yellow-300"
                >
                  {images.map((img, i) => (
                    <option key={img.id} value={i}>
                      {img.alt ? `${i + 1}. ${img.alt}` : `Image ${i + 1}`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="after-image-select"
                  className="mb-1 block text-xs text-[var(--text-muted)]"
                >
                  After Image
                </label>
                <select
                  id="after-image-select"
                  value={afterIndex}
                  onChange={(e) =>
                    handleAfterIndexChange(parseInt(e.target.value))
                  }
                  className="w-full rounded border border-[var(--card-border)] bg-[var(--card-bg)] px-2 py-1 text-xs text-[var(--text-primary)] focus:ring-1 focus:ring-yellow-500 focus:outline-none dark:focus:ring-yellow-300"
                >
                  {images.map((img, i) => (
                    <option key={img.id} value={i}>
                      {img.alt ? `${i + 1}. ${img.alt}` : `Image ${i + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
