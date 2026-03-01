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
      <div className="rounded-2xl bg-white p-4 dark:bg-gray-700">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-yellow-500 dark:border-gray-700 dark:border-t-yellow-300" />
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
    <div className="rounded-2xl bg-white p-4 dark:bg-gray-700">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-200">
        <HiOutlineLockClosed className="text-yellow-500 dark:text-yellow-300" />
        Private Notes
      </h3>

      {readOnly ? (
        <p className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-400">
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
            className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:ring-1 focus:ring-yellow-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-yellow-300"
          />

          <div className="mt-2 flex items-center justify-between text-xs">
            {lastSaved && (
              <span className="text-gray-500">
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
