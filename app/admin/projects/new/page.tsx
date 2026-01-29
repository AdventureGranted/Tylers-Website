'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface UploadedImage {
  url: string;
  alt: string;
  type?: string;
}

export default function NewProject() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('hobby');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(newTitle));
    }
  };

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
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          category,
          description,
          content,
          published,
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
        throw new Error(data.error || 'Failed to create project');
      }

      router.push('/admin/projects');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-200">New Project</h1>
          <Link
            href="/admin/projects"
            className="text-gray-400 transition-colors hover:text-yellow-300"
          >
            Cancel
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-red-500/20 p-3 text-red-400">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className="mb-1 block text-sm text-gray-400">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 focus:border-yellow-300 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="slug" className="mb-1 block text-sm text-gray-400">
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
                        onChange={(e) => updateImageAlt(index, e.target.value)}
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
              Publish immediately
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full rounded-lg bg-yellow-300 py-2 font-semibold text-gray-900 transition-colors hover:bg-yellow-400 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </form>
      </div>
    </div>
  );
}
