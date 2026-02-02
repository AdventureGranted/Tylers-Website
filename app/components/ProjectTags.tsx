'use client';

import { useState, useEffect } from 'react';
import { HiOutlineTag, HiOutlineX, HiOutlinePlus } from 'react-icons/hi';

interface ProjectTagsProps {
  projectId: string;
  readOnly?: boolean;
}

const SUGGESTED_TAGS = [
  'Woodworking',
  'Metalwork',
  'Electronics',
  'Painting',
  '3D Printing',
  'Sewing',
  'Leatherwork',
  'Automotive',
  'Home Improvement',
  'Gardening',
];

export default function ProjectTags({
  projectId,
  readOnly = false,
}: ProjectTagsProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/metadata`);
        if (res.ok) {
          const data = await res.json();
          setTags(data.tags || []);
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, [projectId]);

  const saveTags = async (newTags: string[]) => {
    setSaving(true);
    try {
      await fetch(`/api/projects/${projectId}/metadata`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: newTags }),
      });
      setTags(newTags);
    } catch (error) {
      console.error('Error saving tags:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      saveTags([...tags, trimmedTag]);
    }
    setNewTag('');
    setShowInput(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    saveTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(newTag);
    } else if (e.key === 'Escape') {
      setShowInput(false);
      setNewTag('');
    }
  };

  const unusedSuggestions = SUGGESTED_TAGS.filter((t) => !tags.includes(t));

  if (loading) {
    return (
      <div className="rounded-2xl bg-[var(--input-bg)] p-4">
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--card-border)] border-t-yellow-500 dark:border-t-yellow-300" />
          Loading...
        </div>
      </div>
    );
  }

  // Don't show for read-only users if no tags are set
  if (readOnly && tags.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-[var(--input-bg)] p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
        <HiOutlineTag className="text-yellow-500 dark:text-yellow-300" />
        Skills / Tags
      </h3>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 rounded-full bg-yellow-500/20 px-2 py-1 text-xs font-medium text-yellow-600 dark:bg-yellow-300/20 dark:text-yellow-300"
          >
            {tag}
            {!readOnly && (
              <button
                onClick={() => handleRemoveTag(tag)}
                disabled={saving}
                className="hover:text-red-400"
              >
                <HiOutlineX />
              </button>
            )}
          </span>
        ))}

        {!readOnly &&
          (showInput ? (
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                if (newTag.trim()) handleAddTag(newTag);
                else setShowInput(false);
              }}
              placeholder="Add tag..."
              className="w-24 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] px-2 py-1 text-xs text-[var(--text-primary)] focus:ring-1 focus:ring-yellow-500 focus:outline-none dark:focus:ring-yellow-300"
              autoFocus
            />
          ) : (
            <button
              onClick={() => setShowInput(true)}
              className="flex items-center gap-1 rounded-full bg-[var(--card-border)] px-2 py-1 text-xs text-[var(--text-muted)] hover:bg-[var(--nav-hover)]"
            >
              <HiOutlinePlus /> Add
            </button>
          ))}
      </div>

      {!readOnly && unusedSuggestions.length > 0 && tags.length < 5 && (
        <div className="mt-3">
          <div className="mb-1 text-xs text-[var(--text-muted)]">
            Suggestions:
          </div>
          <div className="flex flex-wrap gap-1">
            {unusedSuggestions.slice(0, 5).map((tag) => (
              <button
                key={tag}
                onClick={() => handleAddTag(tag)}
                disabled={saving}
                className="rounded-full bg-[var(--card-border)] px-2 py-0.5 text-xs text-[var(--text-muted)] hover:bg-[var(--nav-hover)] hover:text-[var(--text-primary)]"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
