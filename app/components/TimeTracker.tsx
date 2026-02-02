'use client';

import { useState, useEffect, useCallback } from 'react';
import { HiOutlineClock, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';

interface TimeEntry {
  id: string;
  hours: number;
  description: string | null;
  date: string;
}

interface TimeTrackerProps {
  projectId: string;
  readOnly?: boolean;
}

export default function TimeTracker({
  projectId,
  readOnly = false,
}: TimeTrackerProps) {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [hours, setHours] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/time-entries`);
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries);
        setTotalHours(data.totalHours);
      }
    } catch (error) {
      console.error('Error fetching time entries:', error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleAdd = async () => {
    if (!hours) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/time-entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hours: parseFloat(hours), description, date }),
      });
      if (res.ok) {
        setHours('');
        setDescription('');
        setDate(new Date().toISOString().split('T')[0]);
        setShowForm(false);
        fetchEntries();
      }
    } catch (error) {
      console.error('Error adding time entry:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/time-entries/${id}`, { method: 'DELETE' });
      if (res.ok) fetchEntries();
    } catch (error) {
      console.error('Error deleting time entry:', error);
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

  // Hide if readOnly and no entries
  if (readOnly && entries.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-[var(--input-bg)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
          <HiOutlineClock className="text-yellow-500 dark:text-yellow-300" />
          Time Tracked
        </h3>
        <div className="text-lg font-bold text-yellow-500 dark:text-yellow-300">
          {totalHours.toFixed(1)}h
        </div>
      </div>

      {!readOnly && (
        <>
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="mb-3 flex w-full items-center justify-center gap-1 rounded-lg bg-[var(--card-border)] py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--nav-hover)]"
            >
              <HiOutlinePlus /> Log Time
            </button>
          ) : (
            <div className="mb-3 space-y-2 rounded-lg bg-[var(--card-border)] p-3">
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="Hours"
                  className="w-20 rounded border border-[var(--card-border)] bg-[var(--card-bg)] px-2 py-1 text-sm text-[var(--text-primary)] focus:ring-1 focus:ring-yellow-500 focus:outline-none dark:focus:ring-yellow-300"
                />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="flex-1 rounded border border-[var(--card-border)] bg-[var(--card-bg)] px-2 py-1 text-sm text-[var(--text-primary)] focus:ring-1 focus:ring-yellow-500 focus:outline-none dark:focus:ring-yellow-300"
                />
              </div>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What did you work on?"
                className="w-full rounded border border-[var(--card-border)] bg-[var(--card-bg)] px-2 py-1 text-sm text-[var(--text-primary)] focus:ring-1 focus:ring-yellow-500 focus:outline-none dark:focus:ring-yellow-300"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  disabled={saving || !hours}
                  className="flex-1 rounded bg-yellow-500 py-1 text-sm font-medium text-gray-900 hover:bg-yellow-600 disabled:opacity-50 dark:bg-yellow-300 dark:hover:bg-yellow-400"
                >
                  {saving ? 'Saving...' : 'Add'}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="rounded bg-[var(--nav-hover)] px-3 py-1 text-sm text-[var(--text-secondary)] hover:bg-[var(--card-border)]"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {entries.length > 0 && (
        <div className="max-h-40 space-y-1 overflow-y-auto">
          {entries.slice(0, 5).map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between rounded bg-[var(--card-border)] px-2 py-1 text-xs"
            >
              <div className="flex-1">
                <span className="font-medium text-yellow-500 dark:text-yellow-300">
                  {entry.hours}h
                </span>
                {entry.description && (
                  <span className="ml-2 text-[var(--text-muted)]">
                    {entry.description}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[var(--text-muted)]">
                  {new Date(entry.date).toLocaleDateString()}
                </span>
                {!readOnly && (
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-[var(--text-muted)] hover:text-red-400"
                  >
                    <HiOutlineTrash />
                  </button>
                )}
              </div>
            </div>
          ))}
          {entries.length > 5 && (
            <div className="text-center text-xs text-[var(--text-muted)]">
              +{entries.length - 5} more entries
            </div>
          )}
        </div>
      )}
    </div>
  );
}
