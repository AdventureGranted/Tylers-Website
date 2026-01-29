'use client';

import { useState, useEffect } from 'react';
import { HiStar, HiOutlineStar } from 'react-icons/hi';

interface DifficultyRatingProps {
  projectId: string;
  readOnly?: boolean;
}

export default function DifficultyRating({
  projectId,
  readOnly = false,
}: DifficultyRatingProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/metadata`);
        if (res.ok) {
          const data = await res.json();
          setRating(data.difficulty);
        }
      } catch (error) {
        console.error('Error fetching rating:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRating();
  }, [projectId]);

  const handleRate = async (newRating: number) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/metadata`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty: newRating }),
      });
      if (res.ok) {
        setRating(newRating);
      }
    } catch (error) {
      console.error('Error saving rating:', error);
    } finally {
      setSaving(false);
    }
  };

  const getDifficultyLabel = (level: number) => {
    switch (level) {
      case 1:
        return 'Very Easy';
      case 2:
        return 'Easy';
      case 3:
        return 'Medium';
      case 4:
        return 'Hard';
      case 5:
        return 'Very Hard';
      default:
        return '';
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

  // Don't show for read-only users if no rating is set
  if (readOnly && !rating) {
    return null;
  }

  const displayRating = hoverRating || rating || 0;

  return (
    <div className="rounded-2xl bg-gray-800 p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-200">
        <HiStar className="text-yellow-300" />
        Difficulty
      </h3>

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) =>
          readOnly ? (
            <span key={star} className="text-xl">
              {star <= displayRating ? (
                <HiStar className="text-yellow-400" />
              ) : (
                <HiOutlineStar className="text-gray-600" />
              )}
            </span>
          ) : (
            <button
              key={star}
              onClick={() => handleRate(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
              disabled={saving}
              className="text-xl transition-colors disabled:opacity-50"
            >
              {star <= displayRating ? (
                <HiStar className="text-yellow-400" />
              ) : (
                <HiOutlineStar className="text-gray-600" />
              )}
            </button>
          )
        )}
        {displayRating > 0 && (
          <span className="ml-2 text-xs text-gray-400">
            {getDifficultyLabel(displayRating)}
          </span>
        )}
      </div>
    </div>
  );
}
