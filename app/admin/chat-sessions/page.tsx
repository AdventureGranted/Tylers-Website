'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  HiOutlineMail,
  HiOutlineTrash,
  HiOutlineUser,
  HiChevronDown,
  HiChevronUp,
} from 'react-icons/hi';
import { IoChatbubblesOutline } from 'react-icons/io5';

interface ChatMessage {
  id: string;
  content: string;
  createdAt: string;
}

interface ChatSession {
  id: string;
  visitorName: string;
  visitorEmail: string;
  userId: string | null;
  user: { name: string | null; email: string } | null;
  messages: ChatMessage[];
  messageCount: number;
  lastActiveAt: string;
  createdAt: string;
}

export default function AdminChatSessionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(
    new Set()
  );

  const toggleExpanded = (id: string) => {
    setExpandedSessions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchChatSessions();
  }, [session, status, router]);

  const fetchChatSessions = async () => {
    try {
      const res = await fetch('/api/admin/chat-sessions');
      if (res.ok) {
        const data = await res.json();
        setChatSessions(data);
      }
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (id: string) => {
    if (!confirm('Are you sure you want to delete this chat session?')) return;

    try {
      const res = await fetch(`/api/admin/chat-sessions/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setChatSessions((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (error) {
      console.error('Error deleting chat session:', error);
    }
  };

  const totalMessages = chatSessions.reduce(
    (sum, s) => sum + s.messageCount,
    0
  );

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
        <div className="mb-8">
          <Link
            href="/admin"
            className="mb-2 inline-block text-sm text-gray-400 hover:text-yellow-300"
          >
            &larr; Back to Admin
          </Link>
          <h1 className="text-3xl font-bold text-white">AI Chat Sessions</h1>
          <p className="mt-2 text-gray-400">
            {chatSessions.length} sessions &middot; {totalMessages} total
            messages
          </p>
        </div>

        {chatSessions.length === 0 ? (
          <div className="rounded-2xl bg-gray-800 p-12 text-center">
            <IoChatbubblesOutline className="mx-auto mb-4 text-5xl text-gray-600" />
            <p className="text-gray-400">No chat sessions yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {chatSessions.map((chatSession) => {
              const isExpanded = expandedSessions.has(chatSession.id);
              return (
                <div
                  key={chatSession.id}
                  className="rounded-2xl border border-gray-700 bg-gray-800 p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold text-gray-200">
                          {chatSession.visitorName}
                        </h3>
                        {chatSession.userId && (
                          <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
                            Registered User
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        <a
                          href={`mailto:${chatSession.visitorEmail}`}
                          className="flex items-center gap-1 hover:text-yellow-300"
                        >
                          <HiOutlineMail />
                          {chatSession.visitorEmail}
                        </a>
                        {chatSession.user && (
                          <span className="flex items-center gap-1">
                            <HiOutlineUser />
                            {chatSession.user.name || chatSession.user.email}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-yellow-300">
                          <IoChatbubblesOutline />
                          <span className="font-medium">
                            {chatSession.messageCount}
                          </span>
                          <span className="text-gray-400">messages</span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          Last active:{' '}
                          {new Date(
                            chatSession.lastActiveAt
                          ).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteSession(chatSession.id)}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-500/20 hover:text-red-400"
                        title="Delete session"
                      >
                        <HiOutlineTrash className="text-lg" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>
                      Started:{' '}
                      {new Date(chatSession.createdAt).toLocaleDateString(
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
                    {chatSession.messages.length > 0 && (
                      <button
                        onClick={() => toggleExpanded(chatSession.id)}
                        className="flex items-center gap-1 text-gray-400 transition-colors hover:text-yellow-300"
                      >
                        {isExpanded ? (
                          <>
                            Hide questions <HiChevronUp />
                          </>
                        ) : (
                          <>
                            View questions ({chatSession.messages.length}){' '}
                            <HiChevronDown />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  {isExpanded && chatSession.messages.length > 0 && (
                    <div className="mt-4 space-y-2 border-t border-gray-700 pt-4">
                      {chatSession.messages.map((message) => (
                        <div
                          key={message.id}
                          className="rounded-lg bg-gray-700/50 p-3"
                        >
                          <p className="text-sm text-gray-300">
                            {message.content}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {new Date(message.createdAt).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
