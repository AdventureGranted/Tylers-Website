'use client';

import { useState, useEffect, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ProjectStatus from '@/app/components/ProjectStatus';
import ProjectTimeline from '@/app/components/ProjectTimeline';
import BudgetTracker from '@/app/components/BudgetTracker';
import TimeTracker from '@/app/components/TimeTracker';
import ReceiptManager from '@/app/components/ReceiptManager';
import MaterialsChecklist from '@/app/components/MaterialsChecklist';
import DifficultyRating from '@/app/components/DifficultyRating';
import ProjectTags from '@/app/components/ProjectTags';
import RelatedLinks from '@/app/components/RelatedLinks';
import LessonsLearned from '@/app/components/LessonsLearned';
import PrivateNotes from '@/app/components/PrivateNotes';
import BeforeAfterToggle from '@/app/components/BeforeAfterToggle';

interface UploadedImage {
  url: string;
  alt: string;
  type?: string;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string | null;
  content: string | null;
  published: boolean;
  status: string;
  images: {
    id: string;
    url: string;
    alt: string | null;
    sortOrder: number;
    type?: string;
  }[];
  beforeImageIndex: number | null;
  afterImageIndex: number | null;
  compareMode: string | null;
}

export default function EditProject({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('hobby');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [status, setStatus] = useState('planning');
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [actualCost, setActualCost] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [beforeImageIndex, setBeforeImageIndex] = useState<number | null>(null);
  const [afterImageIndex, setAfterImageIndex] = useState<number | null>(null);
  const [compareMode, setCompareMode] = useState<
    'toggle' | 'slider' | 'single'
  >('toggle');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('from') || '/admin/projects';

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) throw new Error('Failed to fetch project');

        const project: Project = await res.json();
        setTitle(project.title);
        setSlug(project.slug);
        setCategory(project.category);
        setDescription(project.description || '');
        setContent(project.content || '');
        setPublished(project.published);
        setStatus(project.status || 'planning');
        setImages(
          project.images.map((img) => ({
            url: img.url,
            alt: img.alt || '',
            type: img.type || 'image',
          }))
        );
        setBeforeImageIndex(project.beforeImageIndex);
        setAfterImageIndex(project.afterImageIndex);
        setCompareMode(
          (project.compareMode as 'toggle' | 'slider') || 'toggle'
        );

        // Fetch receipts to calculate actual cost
        const receiptsRes = await fetch(`/api/projects/${id}/receipts`);
        if (receiptsRes.ok) {
          const receiptsData = await receiptsRes.json();
          setActualCost(receiptsData.total || 0);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setFetching(false);
      }
    }

    fetchProject();
  }, [id]);

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Upload failed');
        }

        const { url, type } = await res.json();
        setImages((prev) => [...prev, { url, alt: '', type: type || 'image' }]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await uploadFiles(Array.from(files));
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    await uploadFiles(files);
  };

  const updateImageAlt = (index: number, alt: string) => {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, alt } : img))
    );
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    setImages((prev) => {
      const newImages = [...prev];
      [newImages[index], newImages[newIndex]] = [
        newImages[newIndex],
        newImages[index],
      ];
      return newImages;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          category,
          description,
          content,
          published,
          beforeImageIndex,
          afterImageIndex,
          compareMode,
          images: images.map((img, i) => ({
            url: img.url,
            alt: img.alt,
            sortOrder: i,
            type: img.type || 'image',
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update project');
      }

      router.push(returnUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete project');
      router.push('/admin/projects');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-200">Edit Project</h1>
          <div className="flex gap-4">
            <button
              onClick={handleDelete}
              className="text-red-400 transition-colors hover:text-red-300"
            >
              Delete
            </button>
            <Link
              href={returnUrl}
              className="text-gray-400 transition-colors hover:text-yellow-300"
            >
              Cancel
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-500/20 p-3 text-red-400">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-8 xl:flex-row xl:items-start">
          {/* Left column - Project Info */}
          <div className="hidden w-72 shrink-0 space-y-4 xl:block">
            <h2 className="text-lg font-semibold text-gray-200">
              Project Info
            </h2>
            <ProjectStatus projectId={id} initialStatus={status} />
            <ProjectTimeline projectId={id} />
            <DifficultyRating projectId={id} />
            <ProjectTags projectId={id} />
            <RelatedLinks projectId={id} />
            <PrivateNotes projectId={id} />
          </div>

          {/* Center column - Basic form */}
          <div className="min-w-0 flex-1 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="mb-1 block text-sm text-gray-400"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 focus:border-yellow-300 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="slug"
                  className="mb-1 block text-sm text-gray-400"
                >
                  Slug
                </label>
                <input
                  type="text"
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 focus:border-yellow-300 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-1 block text-sm text-gray-400"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 focus:border-yellow-300 focus:outline-none"
                >
                  <option value="hobby">Hobby</option>
                  <option value="work">Work / CS Project</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-1 block text-sm text-gray-400"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 focus:border-yellow-300 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="mb-1 block text-sm text-gray-400"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 focus:border-yellow-300 focus:outline-none"
                />
              </div>

              {/* Image/Video Upload */}
              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  Media (Images & Videos)
                </label>

                <label
                  className={`flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
                    isDragging
                      ? 'border-yellow-300 bg-yellow-300/10'
                      : 'border-gray-700 hover:border-yellow-300'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/*,.heic,.heif,video/mp4,video/webm,video/quicktime,.mov"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  <span className="text-center text-gray-400">
                    {uploading
                      ? 'Uploading...'
                      : isDragging
                        ? 'Drop files here'
                        : 'Click or drag files to upload'}
                  </span>
                </label>

                {images.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {images.map((img, index) => (
                      <div
                        key={img.url}
                        className="flex items-center gap-4 rounded-lg bg-gray-800 p-3"
                      >
                        {img.type === 'video' ? (
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded bg-gray-700">
                            <video
                              src={img.url}
                              className="h-full w-full object-cover"
                              muted
                              preload="metadata"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                className="h-8 w-8 text-white"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        ) : (
                          <Image
                            src={img.url}
                            alt={img.alt || 'Project image'}
                            width={80}
                            height={80}
                            className="h-20 w-20 shrink-0 rounded object-cover"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <input
                            type="text"
                            placeholder="Alt text / description"
                            value={img.alt}
                            onChange={(e) =>
                              updateImageAlt(index, e.target.value)
                            }
                            className="w-full rounded border border-gray-700 bg-gray-900 px-3 py-1 text-sm text-gray-200 focus:border-yellow-300 focus:outline-none"
                          />
                          {img.type === 'video' && (
                            <span className="mt-1 inline-block rounded bg-blue-500/20 px-2 py-0.5 text-xs text-blue-400">
                              Video
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => moveImage(index, 'up')}
                            disabled={index === 0}
                            className="rounded bg-gray-700 px-2 py-1 text-gray-400 hover:bg-gray-600 disabled:opacity-30"
                          >
                            &uarr;
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImage(index, 'down')}
                            disabled={index === images.length - 1}
                            className="rounded bg-gray-700 px-2 py-1 text-gray-400 hover:bg-gray-600 disabled:opacity-30"
                          >
                            &darr;
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="rounded bg-red-500/20 px-2 py-1 text-red-400 hover:bg-red-500/30"
                          >
                            &times;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-700 bg-gray-800"
                />
                <label htmlFor="published" className="text-sm text-gray-400">
                  Published
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || uploading}
                className="w-full rounded-lg bg-yellow-300 py-2 font-semibold text-gray-900 transition-colors hover:bg-yellow-400 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>

            {/* Before/After Preview - outside form to avoid form interactions */}
            {images.filter((img) => img.type !== 'video').length >= 2 && (
              <BeforeAfterToggle
                images={images
                  .filter((img) => img.type !== 'video')
                  .map((img, i) => ({
                    id: img.url,
                    url: img.url,
                    alt: img.alt || null,
                    sortOrder: i,
                    type: img.type,
                  }))}
                initialBeforeIndex={beforeImageIndex ?? undefined}
                initialAfterIndex={afterImageIndex ?? undefined}
                initialMode={compareMode}
                onIndicesChange={(before, after) => {
                  setBeforeImageIndex(before);
                  setAfterImageIndex(after);
                }}
                onModeChange={setCompareMode}
              />
            )}
          </div>

          {/* Right column - Costs & Tracking */}
          <div className="hidden w-72 shrink-0 space-y-4 xl:block">
            <h2 className="text-lg font-semibold text-gray-200">
              Costs & Tracking
            </h2>
            <BudgetTracker projectId={id} actualCost={actualCost} />
            <TimeTracker projectId={id} />
            <ReceiptManager projectId={id} />
            <MaterialsChecklist projectId={id} />
            <LessonsLearned projectId={id} />
          </div>

          {/* Mobile: All management components */}
          <div className="space-y-4 xl:hidden">
            <h2 className="text-lg font-semibold text-gray-200">
              Project Management
            </h2>
            <ProjectStatus projectId={id} initialStatus={status} />
            <ProjectTimeline projectId={id} />
            <DifficultyRating projectId={id} />
            <ProjectTags projectId={id} />
            <BudgetTracker projectId={id} actualCost={actualCost} />
            <TimeTracker projectId={id} />
            <ReceiptManager projectId={id} />
            <MaterialsChecklist projectId={id} />
            <RelatedLinks projectId={id} />
            <LessonsLearned projectId={id} />
            <PrivateNotes projectId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
