'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-yellow-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-yellow-300';

function NewJobForm() {
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [postingUrl, setPostingUrl] = useState('');
  const [location, setLocation] = useState('');
  const [locationType, setLocationType] = useState('');
  const [notes, setNotes] = useState('');
  const [coverLetterUrl, setCoverLetterUrl] = useState('');
  const [customResumeUrl, setCustomResumeUrl] = useState('');
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const uploadFile = async (
    file: File,
    setUrl: (url: string) => void,
    setUploading: (v: boolean) => void
  ) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const { url } = await res.json();
      setUrl(url);
    } catch {
      setError('File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company,
          position,
          applicationDate: new Date().toISOString(),
          postingUrl: postingUrl || null,
          location: location || null,
          locationType: locationType || null,
          coverLetterUrl: coverLetterUrl || null,
          customResumeUrl: customResumeUrl || null,
          notes: notes || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create application');
      }

      const job = await res.json();
      router.push(`/admin/jobs/${job.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-lg">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">
            New Application
          </h1>
          <Link
            href="/admin/jobs"
            className="text-gray-500 transition-colors hover:text-yellow-500 dark:hover:text-yellow-300"
          >
            Cancel
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-500/20 p-3 text-red-400">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="company"
              className="mb-1 block text-sm text-gray-500"
            >
              Company
            </label>
            <input
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className={inputClass}
              required
              autoFocus
            />
          </div>

          <div>
            <label
              htmlFor="position"
              className="mb-1 block text-sm text-gray-500"
            >
              Position
            </label>
            <input
              type="text"
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label
              htmlFor="postingUrl"
              className="mb-1 block text-sm text-gray-500"
            >
              Link
            </label>
            <input
              type="url"
              id="postingUrl"
              value={postingUrl}
              onChange={(e) => setPostingUrl(e.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="location"
                className="mb-1 block text-sm text-gray-500"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, State"
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="locationType"
                className="mb-1 block text-sm text-gray-500"
              >
                Type
              </label>
              <select
                id="locationType"
                value={locationType}
                onChange={(e) => setLocationType(e.target.value)}
                className={inputClass}
              >
                <option value="">--</option>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ONSITE">Onsite</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-gray-500">
                Cover Letter (optional)
              </label>
              {coverLetterUrl ? (
                <div className="flex items-center gap-2">
                  <a
                    href={coverLetterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-sm text-yellow-500 hover:underline dark:text-yellow-300"
                  >
                    Uploaded
                  </a>
                  <button
                    type="button"
                    onClick={() => setCoverLetterUrl('')}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label
                  className={`flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 transition-colors hover:border-yellow-500 dark:border-gray-700 dark:hover:border-yellow-300 ${uploadingCover ? 'opacity-50' : ''}`}
                >
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    disabled={uploadingCover}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f)
                        uploadFile(f, setCoverLetterUrl, setUploadingCover);
                      e.target.value = '';
                    }}
                  />
                  {uploadingCover ? 'Uploading...' : 'Upload file'}
                </label>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-500">
                Custom Resume (optional)
              </label>
              {customResumeUrl ? (
                <div className="flex items-center gap-2">
                  <a
                    href={customResumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-sm text-yellow-500 hover:underline dark:text-yellow-300"
                  >
                    Uploaded
                  </a>
                  <button
                    type="button"
                    onClick={() => setCustomResumeUrl('')}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label
                  className={`flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 transition-colors hover:border-yellow-500 dark:border-gray-700 dark:hover:border-yellow-300 ${uploadingResume ? 'opacity-50' : ''}`}
                >
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    disabled={uploadingResume}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f)
                        uploadFile(f, setCustomResumeUrl, setUploadingResume);
                      e.target.value = '';
                    }}
                  />
                  {uploadingResume ? 'Uploading...' : 'Upload file'}
                </label>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="mb-1 block text-sm text-gray-500">
              Notes (optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading || uploadingCover || uploadingResume}
            className="w-full rounded-lg bg-yellow-500 py-2 font-semibold text-gray-900 transition-colors hover:bg-yellow-600 disabled:opacity-50 dark:bg-yellow-300 dark:hover:bg-yellow-400"
          >
            {loading ? 'Creating...' : 'Create Application'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function NewJob() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="text-gray-500">Loading...</div>
        </div>
      }
    >
      <NewJobForm />
    </Suspense>
  );
}
