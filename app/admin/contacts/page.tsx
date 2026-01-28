'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HiOutlineMail, HiOutlinePhone, HiOutlineTrash } from 'react-icons/hi';
import { BsCheckCircle, BsCircle } from 'react-icons/bs';
import { dispatchUnreadCountChange } from '@/app/lib/events';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminContactsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchSubmissions();
  }, [session, status, router]);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/contact');
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: !currentRead }),
      });

      if (res.ok) {
        setSubmissions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, read: !currentRead } : s))
        );
        dispatchUnreadCountChange();
      }
    } catch (error) {
      console.error('Error updating submission:', error);
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;

    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        const wasUnread = submissions.find((s) => s.id === id)?.read === false;
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
        if (wasUnread) {
          dispatchUnreadCountChange();
        }
      }
    } catch (error) {
      console.error('Error deleting submission:', error);
    }
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (filter === 'unread') return !s.read;
    if (filter === 'read') return s.read;
    return true;
  });

  const unreadCount = submissions.filter((s) => !s.read).length;

  if (status === 'loading' || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-600 border-t-yellow-300" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="mb-2 inline-block text-sm text-gray-400 hover:text-yellow-300"
            >
              ← Back to Admin
            </Link>
            <h1 className="text-3xl font-bold text-white">
              Contact Submissions
              {unreadCount > 0 && (
                <span className="ml-3 rounded-full bg-yellow-300 px-3 py-1 text-sm font-medium text-gray-900">
                  {unreadCount} new
                </span>
              )}
            </h1>
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            {(['all', 'unread', 'read'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-yellow-300 text-gray-900'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filteredSubmissions.length === 0 ? (
          <div className="rounded-2xl bg-gray-800 p-12 text-center">
            <p className="text-gray-400">No submissions found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSubmissions.map((submission) => (
              <div
                key={submission.id}
                className={`rounded-2xl border bg-gray-800 p-6 transition-colors ${
                  submission.read
                    ? 'border-gray-700'
                    : 'border-yellow-300/50 bg-gray-800/80'
                }`}
              >
                <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-200">
                      {submission.name}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      <a
                        href={`mailto:${submission.email}`}
                        className="flex items-center gap-1 hover:text-yellow-300"
                      >
                        <HiOutlineMail />
                        {submission.email}
                      </a>
                      {submission.phone && (
                        <a
                          href={`tel:${submission.phone}`}
                          className="flex items-center gap-1 hover:text-yellow-300"
                        >
                          <HiOutlinePhone />
                          {submission.phone}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {new Date(submission.createdAt).toLocaleDateString(
                        'en-US',
                        {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </span>
                    <button
                      onClick={() => toggleRead(submission.id, submission.read)}
                      className={`rounded-lg p-2 transition-colors ${
                        submission.read
                          ? 'text-green-400 hover:bg-gray-700'
                          : 'text-gray-400 hover:bg-gray-700 hover:text-yellow-300'
                      }`}
                      title={
                        submission.read ? 'Mark as unread' : 'Mark as read'
                      }
                    >
                      {submission.read ? (
                        <BsCheckCircle className="text-lg" />
                      ) : (
                        <BsCircle className="text-lg" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteSubmission(submission.id)}
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-500/20 hover:text-red-400"
                      title="Delete"
                    >
                      <HiOutlineTrash className="text-lg" />
                    </button>
                  </div>
                </div>
                <p className="whitespace-pre-wrap text-gray-300">
                  {submission.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
