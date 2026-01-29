'use client';

import { useState } from 'react';
import { HiOutlineFlag } from 'react-icons/hi';

interface ProjectStatusProps {
  projectId: string;
  initialStatus: string;
  readOnly?: boolean;
}

const STATUS_OPTIONS = [
  { value: 'planning', label: 'Planning', color: 'bg-gray-500' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-blue-500' },
  { value: 'on_hold', label: 'On Hold', color: 'bg-yellow-500' },
  { value: 'completed', label: 'Completed', color: 'bg-green-500' },
];

export default function ProjectStatus({
  projectId,
  initialStatus,
  readOnly = false,
}: ProjectStatusProps) {
  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState(false);

  const handleChange = async (newStatus: string) => {
    if (readOnly) return;
    setSaving(true);
    try {
      // If setting to completed, check if completion date needs to be set
      const updateData: Record<string, unknown> = { status: newStatus };

      if (newStatus === 'completed') {
        // Fetch current metadata to check completion date
        const metaRes = await fetch(`/api/projects/${projectId}/metadata`);
        if (metaRes.ok) {
          const meta = await metaRes.json();
          if (!meta.completionDate) {
            // Set completion date to today
            updateData.completionDate = new Date().toISOString().split('T')[0];
          }
        }
      }

      const res = await fetch(`/api/projects/${projectId}/metadata`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (res.ok) {
        setStatus(newStatus);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setSaving(false);
    }
  };

  const currentStatus =
    STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];

  return (
    <div className="rounded-2xl bg-gray-800 p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-200">
        <HiOutlineFlag className="text-yellow-300" />
        Project Status
      </h3>
      {readOnly ? (
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${currentStatus.color} text-white`}
        >
          {currentStatus.label}
        </span>
      ) : (
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleChange(option.value)}
              disabled={saving}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                status === option.value
                  ? `${option.color} text-white`
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
