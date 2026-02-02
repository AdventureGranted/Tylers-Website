'use client';

import { useState, useEffect } from 'react';
import { HiOutlineLockClosed } from 'react-icons/hi';

interface PrivateNotesProps {
  projectId: string;
  readOnly?: boolean;
}

export default function PrivateNotes({
  projectId,
  readOnly = false,
}: PrivateNotesProps) {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/metadata`);
        if (res.ok) {
          const data = await res.json();
          setNotes(data.privateNotes || '');
        }
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [projectId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/metadata`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ privateNotes: notes }),
      });
      if (res.ok) {
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error('Error saving notes:', error);
    } finally {
      setSaving(false);
    }
  };

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

  // Hide if readOnly and no notes
  if (readOnly && !notes.trim()) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-[var(--input-bg)] p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
        <HiOutlineLockClosed className="text-yellow-500 dark:text-yellow-300" />
        Private Notes
      </h3>

      {readOnly ? (
        <p className="text-sm whitespace-pre-wrap text-[var(--text-secondary)]">
          {notes}
        </p>
      ) : (
        <>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleSave}
            placeholder="Add private notes (only visible to admins)..."
            rows={4}
            className="w-full resize-none rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:ring-1 focus:ring-yellow-500 focus:outline-none dark:focus:ring-yellow-300"
          />

          <div className="mt-2 flex items-center justify-between text-xs">
            {lastSaved && (
              <span className="text-[var(--text-muted)]">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
            {saving && (
              <span className="text-yellow-500 dark:text-yellow-300">
                Saving...
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
