'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  HiOutlineLink,
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineExternalLink,
} from 'react-icons/hi';

interface ProjectLink {
  id: string;
  title: string;
  url: string;
}

interface RelatedLinksProps {
  projectId: string;
  readOnly?: boolean;
}

export default function RelatedLinks({
  projectId,
  readOnly = false,
}: RelatedLinksProps) {
  const [links, setLinks] = useState<ProjectLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchLinks = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/links`);
      if (res.ok) {
        const data = await res.json();
        setLinks(data.links);
      }
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleAdd = async () => {
    if (!title.trim() || !url.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, url }),
      });
      if (res.ok) {
        setTitle('');
        setUrl('');
        setShowForm(false);
        fetchLinks();
      }
    } catch (error) {
      console.error('Error adding link:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/links/${id}`, { method: 'DELETE' });
      setLinks(links.filter((l) => l.id !== id));
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-gray-800 p-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-yellow-300" />
          Loading...
        </div>
      </div>
    );
  }

  // Hide if readOnly and no links
  if (readOnly && links.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-gray-800 p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-200">
        <HiOutlineLink className="text-yellow-300" />
        Related Links
      </h3>

      {!readOnly && (
        <>
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="mb-3 flex w-full items-center justify-center gap-1 rounded-lg bg-gray-700 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-600"
            >
              <HiOutlinePlus /> Add Link
            </button>
          ) : (
            <div className="mb-3 space-y-2 rounded-lg bg-gray-700 p-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Link title"
                className="w-full rounded bg-gray-600 px-2 py-1 text-sm text-gray-200 focus:ring-1 focus:ring-yellow-300 focus:outline-none"
                autoFocus
              />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded bg-gray-600 px-2 py-1 text-sm text-gray-200 focus:ring-1 focus:ring-yellow-300 focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  disabled={saving || !title.trim() || !url.trim()}
                  className="flex-1 rounded bg-yellow-300 py-1 text-sm font-medium text-gray-900 hover:bg-yellow-400 disabled:opacity-50"
                >
                  {saving ? 'Adding...' : 'Add'}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="rounded bg-gray-600 px-3 py-1 text-sm text-gray-300 hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {links.length > 0 && (
        <div className="space-y-1">
          {links.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between rounded bg-gray-700 px-2 py-1.5"
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
              >
                {link.title}
                <HiOutlineExternalLink className="text-xs" />
              </a>
              {!readOnly && (
                <button
                  onClick={() => handleDelete(link.id)}
                  className="text-gray-500 hover:text-red-400"
                >
                  <HiOutlineTrash className="text-sm" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
