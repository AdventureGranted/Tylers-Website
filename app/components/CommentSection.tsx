'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    email: string;
    name: string | null;
  };
}

interface CommentSectionProps {
  projectId: string;
}

export default function CommentSection({ projectId }: CommentSectionProps) {
  const { data: session, status } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComments();
  }, [projectId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/projects/${projectId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to post comment');
      }

      const comment = await res.json();
      setComments((prev) => [comment, ...prev]);
      setNewComment('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      }
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canDelete = (comment: Comment) => {
    if (!session) return false;
    return (
      comment.author.id === session.user.id || session.user.role === 'admin'
    );
  };

  return (
    <div className="mt-12 border-t border-gray-700 pt-8">
      <h2 className="mb-6 text-2xl font-bold text-gray-200">Comments</h2>

      {/* Comment Form */}
      {status === 'loading' ? (
        <div className="mb-6 rounded-lg bg-gray-800 p-4">
          <p className="text-gray-400">Loading...</p>
        </div>
      ) : session ? (
        <form onSubmit={handleSubmit} className="mb-6">
          {error && (
            <div className="mb-3 rounded-lg bg-red-500/20 p-3 text-red-400">
              {error}
            </div>
          )}
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-gray-200 placeholder-gray-500 focus:border-yellow-300 focus:outline-none"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="rounded-lg bg-yellow-300 px-4 py-2 font-semibold text-gray-900 transition-colors hover:bg-yellow-400 disabled:opacity-50"
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-6 rounded-lg bg-gray-800 p-4 text-center">
          <p className="text-gray-400">
            <Link href="/login" className="text-yellow-300 hover:underline">
              Sign in
            </Link>{' '}
            to leave a comment
          </p>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <p className="text-gray-400">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-lg bg-gray-800 p-4">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <span className="font-semibold text-gray-200">
                    {comment.author.name || comment.author.email}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                {canDelete(comment) && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-sm text-red-400 transition-colors hover:text-red-300"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="whitespace-pre-wrap text-gray-300">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
