'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
  IoMdChatbubbles,
  IoMdClose,
  IoMdSend,
  IoMdTrash,
} from 'react-icons/io';
import ReactMarkdown from 'react-markdown';
import { AI_WELCOME_MESSAGE } from '@/app/lib/ai-context';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface VisitorInfo {
  name: string;
  email: string;
}

const STORAGE_KEY = 'ai-chat-history';
const CHAT_OPEN_KEY = 'ai-chat-open';
const VISITOR_KEY = 'ai-chat-visitor';

export default function AIChatBubble() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: AI_WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [visitorInfo, setVisitorInfo] = useState<VisitorInfo | null>(null);
  const [visitorForm, setVisitorForm] = useState({ name: '', email: '' });
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Determine if user can chat (logged in or has provided info)
  const isLoggedIn = status === 'authenticated' && session?.user;
  const canChat = isLoggedIn || visitorInfo !== null;
  const userName = isLoggedIn
    ? session.user.name || session.user.email
    : visitorInfo?.name;

  // Load chat history and visitor info from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    const savedIsOpen = localStorage.getItem(CHAT_OPEN_KEY);
    const savedVisitor = localStorage.getItem(VISITOR_KEY);

    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch (e) {
        console.error('Failed to parse chat history:', e);
      }
    }

    if (savedIsOpen === 'true') {
      setIsOpen(true);
    }

    if (savedVisitor) {
      try {
        const parsed = JSON.parse(savedVisitor);
        if (parsed.name && parsed.email) {
          setVisitorInfo(parsed);
        }
      } catch (e) {
        console.error('Failed to parse visitor info:', e);
      }
    }

    setIsHydrated(true);
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (isHydrated && messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages, isHydrated]);

  // Save isOpen state to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CHAT_OPEN_KEY, String(isOpen));
    }
  }, [isOpen, isHydrated]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens and user can chat
  useEffect(() => {
    if (isOpen && canChat) {
      inputRef.current?.focus();
    }
  }, [isOpen, canChat]);

  const startSession = async (name: string, email: string, userId?: string) => {
    try {
      const response = await fetch('/api/chat/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, userId }),
      });
      if (response.ok) {
        const data = await response.json();
        setSessionId(data.sessionId);
        return data.sessionId;
      }
    } catch (error) {
      console.error('Failed to start chat session:', error);
    }
    return null;
  };

  const handleVisitorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorForm.name.trim() || !visitorForm.email.trim()) return;

    const info = {
      name: visitorForm.name.trim(),
      email: visitorForm.email.trim(),
    };
    setVisitorInfo(info);
    localStorage.setItem(VISITOR_KEY, JSON.stringify(info));

    // Start a chat session
    await startSession(info.name, info.email);
  };

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading || !canChat) return;

    // Start session if not already started
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      if (isLoggedIn && session?.user) {
        currentSessionId = await startSession(
          session.user.name || 'User',
          session.user.email || '',
          session.user.id
        );
      } else if (visitorInfo) {
        currentSessionId = await startSession(
          visitorInfo.name,
          visitorInfo.email
        );
      }
    }

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // Add placeholder for assistant response
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }].map(
            (m) => ({ role: m.role, content: m.content })
          ),
          userName,
          sessionId: currentSessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      // Stream the response
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();
      let assistantMessage = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantMessage += chunk;

        // Update the last message with streamed content
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'assistant',
            content: assistantMessage,
          };
          return updated;
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content:
            "Sorry, I'm having trouble connecting right now. Please try again later or reach out via the contact page.",
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    input,
    isLoading,
    messages,
    canChat,
    sessionId,
    isLoggedIn,
    session,
    visitorInfo,
    userName,
  ]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: AI_WELCOME_MESSAGE }]);
    localStorage.removeItem(STORAGE_KEY);
    setSessionId(null);
  };

  return (
    <>
      {/* Chat Window */}
      <div
        className={`fixed right-4 bottom-20 z-[9998] flex w-80 flex-col overflow-hidden rounded-2xl bg-gray-800 shadow-2xl transition-all duration-300 sm:w-96 ${
          isOpen
            ? 'pointer-events-auto max-h-[500px] opacity-100'
            : 'pointer-events-none max-h-0 opacity-0'
        }`}
        role="dialog"
        aria-label="AI Chat Assistant"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-gray-700 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-300">
              <IoMdChatbubbles className="text-lg text-gray-900" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-200">
                Tyler&apos;s AI Assistant
              </h3>
              <p className="text-xs text-gray-400">
                {canChat && userName
                  ? `Chatting as ${userName}`
                  : 'Ask me anything!'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={clearChat}
              className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-600 hover:text-gray-200"
              aria-label="Clear chat history"
              title="Clear chat"
            >
              <IoMdTrash className="text-lg" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-600 hover:text-gray-200"
              aria-label="Close chat"
            >
              <IoMdClose className="text-xl" />
            </button>
          </div>
        </div>

        {/* Visitor Info Form (if not logged in and no info provided) */}
        {!canChat && status !== 'loading' && (
          <div className="flex-1 p-4">
            <p className="mb-4 text-sm text-gray-300">
              Please enter your info to start chatting:
            </p>
            <form onSubmit={handleVisitorSubmit} className="space-y-3">
              <input
                type="text"
                value={visitorForm.name}
                onChange={(e) =>
                  setVisitorForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Your name"
                required
                className="w-full rounded-xl bg-gray-700 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
              />
              <input
                type="email"
                value={visitorForm.email}
                onChange={(e) =>
                  setVisitorForm((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Your email"
                required
                className="w-full rounded-xl bg-gray-700 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-yellow-300 px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-yellow-400"
              >
                Start Chatting
              </button>
            </form>
          </div>
        )}

        {/* Messages */}
        {canChat && (
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-yellow-300 text-gray-900'
                      : 'bg-gray-700 text-gray-200'
                  }`}
                >
                  {message.role === 'user' ? (
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                  ) : (
                    <div className="prose prose-sm prose-invert max-w-none text-sm [&_a]:text-yellow-300 [&_a]:underline [&_a:hover]:text-yellow-400 [&_strong]:text-yellow-300 [&>li]:mb-1 [&>ol]:mb-2 [&>ol]:list-decimal [&>ol]:pl-4 [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:mb-2 [&>ul]:list-disc [&>ul]:pl-4">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.content === '' && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-gray-700 px-4 py-2">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                      style={{ animationDelay: '0.1s' }}
                    />
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                      style={{ animationDelay: '0.2s' }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input */}
        {canChat && (
          <div className="border-t border-gray-700 p-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                rows={1}
                className="max-h-24 min-h-[40px] flex-1 resize-none rounded-xl bg-gray-700 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-300 text-gray-900 transition-all hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Send message"
              >
                <IoMdSend className="text-lg" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed right-4 bottom-4 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-yellow-300 shadow-lg transition-all hover:scale-110 hover:bg-yellow-400 ${
          isOpen ? 'rotate-90' : ''
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open AI chat assistant'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <IoMdClose className="text-2xl text-gray-900" />
        ) : (
          <IoMdChatbubbles className="text-2xl text-gray-900" />
        )}
      </button>
    </>
  );
}
