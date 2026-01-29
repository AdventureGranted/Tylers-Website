'use client';

import { useState, useEffect } from 'react';
import {
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineLightBulb,
} from 'react-icons/hi';

interface LessonsLearnedProps {
  projectId: string;
  readOnly?: boolean;
}

export default function LessonsLearned({
  projectId,
  readOnly = false,
}: LessonsLearnedProps) {
  const [lessons, setLessons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newLesson, setNewLesson] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/lessons`);
        if (res.ok) {
          const data = await res.json();
          setLessons(data.lessons || []);
        }
      } catch (error) {
        console.error('Error fetching lessons:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, [projectId]);

  const saveLessons = async (updatedLessons: string[]) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/lessons`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessons: updatedLessons }),
      });

      if (res.ok) {
        const data = await res.json();
        setLessons(data.lessons || []);
      }
    } catch (error) {
      console.error('Error saving lessons:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddLesson = async () => {
    if (!newLesson.trim()) return;
    const updatedLessons = [...lessons, newLesson.trim()];
    await saveLessons(updatedLessons);
    setNewLesson('');
  };

  const handleDeleteLesson = async (index: number) => {
    const updatedLessons = lessons.filter((_, i) => i !== index);
    await saveLessons(updatedLessons);
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditingText(lessons[index]);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingText('');
  };

  const handleSaveEdit = async () => {
    if (editingIndex === null || !editingText.trim()) return;
    const updatedLessons = [...lessons];
    updatedLessons[editingIndex] = editingText.trim();
    await saveLessons(updatedLessons);
    setEditingIndex(null);
    setEditingText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: 'add' | 'edit') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (action === 'add') {
        handleAddLesson();
      } else {
        handleSaveEdit();
      }
    } else if (e.key === 'Escape' && action === 'edit') {
      handleCancelEdit();
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

  // Hide if readOnly and no lessons
  if (readOnly && lessons.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-gray-800 p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-200">
        <HiOutlineLightBulb className="text-yellow-300" />
        Lessons Learned
      </h3>

      {/* Add new lesson */}
      {!readOnly && (
        <div className="mb-3 flex gap-2">
          <input
            type="text"
            value={newLesson}
            onChange={(e) => setNewLesson(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'add')}
            placeholder="Add lesson..."
            className="min-w-0 flex-1 rounded-lg bg-gray-700 px-3 py-1.5 text-sm text-gray-200 placeholder-gray-400 focus:ring-1 focus:ring-yellow-300 focus:outline-none"
            disabled={saving}
          />
          <button
            onClick={handleAddLesson}
            disabled={saving || !newLesson.trim()}
            className="shrink-0 rounded-lg bg-yellow-300 px-3 py-1.5 text-sm font-medium text-gray-900 transition-colors hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add
          </button>
        </div>
      )}

      {/* Lessons list */}
      {lessons.length === 0 ? (
        <p className="text-xs text-gray-500">No lessons recorded yet.</p>
      ) : (
        <ul className="space-y-1">
          {lessons.map((lesson, index) => (
            <li
              key={index}
              className="flex items-start gap-2 rounded-lg bg-gray-700 p-2"
            >
              {editingIndex === index ? (
                <>
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, 'edit')}
                    className="min-w-0 flex-1 rounded bg-gray-600 px-2 py-1 text-sm text-gray-200 focus:ring-1 focus:ring-yellow-300 focus:outline-none"
                    autoFocus
                    disabled={saving}
                  />
                  <button
                    onClick={handleSaveEdit}
                    disabled={saving || !editingText.trim()}
                    className="shrink-0 p-1 text-green-400 transition-colors hover:bg-green-500/20"
                    title="Save"
                  >
                    <HiOutlineCheck />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={saving}
                    className="shrink-0 p-1 text-gray-400 transition-colors hover:bg-gray-600"
                    title="Cancel"
                  >
                    <HiOutlineX />
                  </button>
                </>
              ) : (
                <>
                  <span className="text-yellow-300">•</span>
                  <span className="min-w-0 flex-1 text-sm break-words text-gray-200">
                    {lesson}
                  </span>
                  {!readOnly && (
                    <>
                      <button
                        onClick={() => handleStartEdit(index)}
                        disabled={saving}
                        className="shrink-0 p-1 text-gray-400 transition-colors hover:bg-gray-600 hover:text-yellow-300"
                        title="Edit"
                      >
                        <HiOutlinePencil className="text-sm" />
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(index)}
                        disabled={saving}
                        className="shrink-0 p-1 text-gray-400 transition-colors hover:bg-red-500/20 hover:text-red-400"
                        title="Delete"
                      >
                        <HiOutlineTrash className="text-sm" />
                      </button>
                    </>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {!readOnly && saving && (
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-yellow-300" />
          Saving...
        </div>
      )}
    </div>
  );
}
