'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface UploadedImage {
  url: string;
  alt: string;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string | null;
  content: string | null;
  published: boolean;
  images: { url: string; alt: string | null; sortOrder: number }[];
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
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

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
        setImages(
          project.images.map((img) => ({ url: img.url, alt: img.alt || '' }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setFetching(false);
      }
    }

    fetchProject();
  }, [id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      for (const file of Array.from(files)) {
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

        const { url } = await res.json();
        setImages((prev) => [...prev, { url, alt: '' }]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
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
          images: images.map((img, i) => ({ ...img, sortOrder: i })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update project');
      }

      router.push('/admin/projects');
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
      <div className="mx-auto max-w-2xl">
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
              href="/admin/projects"
              className="text-gray-400 transition-colors hover:text-yellow-300"
            >
              Cancel
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-red-500/20 p-3 text-red-400">
              {error}
            </div>
          )}

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

          {/* Image Upload */}
          <div>
            <label className="mb-2 block text-sm text-gray-400">Images</label>

            <label className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-700 p-6 transition-colors hover:border-yellow-300">
              <input
                type="file"
                accept="image/*,.heic,.heif"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
              <span className="text-gray-400">
                {uploading ? 'Uploading...' : 'Click to upload images'}
              </span>
            </label>

            {images.length > 0 && (
              <div className="mt-4 space-y-3">
                {images.map((img, index) => (
                  <div
                    key={img.url}
                    className="flex items-center gap-4 rounded-lg bg-gray-800 p-3"
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || 'Project image'}
                      width={80}
                      height={80}
                      className="h-20 w-20 rounded object-cover"
                    />
                    <input
                      type="text"
                      placeholder="Alt text"
                      value={img.alt}
                      onChange={(e) => updateImageAlt(index, e.target.value)}
                      className="flex-1 rounded border border-gray-700 bg-gray-900 px-3 py-1 text-sm text-gray-200 focus:border-yellow-300 focus:outline-none"
                    />
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
      </div>
    </div>
  );
}
