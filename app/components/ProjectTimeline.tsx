'use client';

import { useState, useEffect } from 'react';
import { HiOutlineCalendar } from 'react-icons/hi';
import DatePicker from './DatePicker';

interface ProjectTimelineProps {
  projectId: string;
  readOnly?: boolean;
}

export default function ProjectTimeline({
  projectId,
  readOnly = false,
}: ProjectTimelineProps) {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [completionDate, setCompletionDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/metadata`);
        if (res.ok) {
          const data = await res.json();
          setStartDate(data.startDate ? data.startDate.split('T')[0] : null);
          setCompletionDate(
            data.completionDate ? data.completionDate.split('T')[0] : null
          );
        }
      } catch (error) {
        console.error('Error fetching dates:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDates();
  }, [projectId]);

  const handleSave = async (
    field: 'startDate' | 'completionDate',
    value: string | null
  ) => {
    setSaving(true);
    try {
      await fetch(`/api/projects/${projectId}/metadata`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
    } catch (error) {
      console.error('Error saving date:', error);
    } finally {
      setSaving(false);
    }
  };

  const getDuration = () => {
    if (!startDate) return null;
    const start = new Date(startDate);
    const end = completionDate ? new Date(completionDate) : new Date();
    const days = Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (days < 7) return `${days} days`;
    if (days < 30) return `${Math.floor(days / 7)} weeks`;
    return `${Math.floor(days / 30)} months`;
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

  // Don't show for read-only users if no dates are set
  if (readOnly && !startDate && !completionDate) {
    return null;
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="rounded-2xl bg-[var(--input-bg)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
          <HiOutlineCalendar className="text-yellow-500 dark:text-yellow-300" />
          Timeline
        </h3>
        {getDuration() && (
          <span className="text-xs text-[var(--text-muted)]">
            {getDuration()}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--text-muted)]">Started</span>
          {readOnly ? (
            <span className="text-xs text-[var(--text-primary)]">
              {startDate ? formatDate(startDate) : '—'}
            </span>
          ) : (
            <DatePicker
              value={startDate}
              onChange={(date) => {
                setStartDate(date);
                handleSave('startDate', date);
              }}
              disabled={saving}
              placeholder="Select date"
            />
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--text-muted)]">Completed</span>
          {readOnly ? (
            <span className="text-xs text-[var(--text-primary)]">
              {completionDate ? formatDate(completionDate) : '—'}
            </span>
          ) : (
            <DatePicker
              value={completionDate}
              onChange={(date) => {
                setCompletionDate(date);
                handleSave('completionDate', date);
              }}
              disabled={saving}
              placeholder="Select date"
            />
          )}
        </div>
      </div>
    </div>
  );
}
