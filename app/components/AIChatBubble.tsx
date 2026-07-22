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
const INFO_DISMISSED_KEY = 'ai-chat-info-dismissed';
const MAX_CONTEXT_MESSAGES = 20; // Only send last N messages to the AI

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
  const [showInfoForm, setShowInfoForm] = useState(false);
  const [infoDismissed, setInfoDismissed] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Visitors can always chat; sharing contact info is optional
  const isLoggedIn = status === 'authenticated' && session?.user;
  const userName = isLoggedIn
    ? session.user.name || session.user.email
    : visitorInfo?.name;
  const showInfoPrompt = !isLoggedIn && !visitorInfo && !infoDismissed;

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle visual viewport changes (keyboard show/hide on mobile)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;

    const viewport = window.visualViewport;
    const handleResize = () => {
      // Keyboard is likely visible if viewport height is significantly smaller than window height
      const heightDiff = window.innerHeight - viewport.height;
      setKeyboardVisible(heightDiff > 150);
    };

    viewport.addEventListener('resize', handleResize);
    return () => viewport.removeEventListener('resize', handleResize);
  }, []);

  // Load chat history and visitor info from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    const savedIsOpen = localStorage.getItem(CHAT_OPEN_KEY);
    const savedVisitor = localStorage.getItem(VISITOR_KEY);

    if (localStorage.getItem(INFO_DISMISSED_KEY) === 'true') {
      setInfoDismissed(true);
    }

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

  // Focus input when chat opens (skip on mobile to avoid keyboard popup)
  useEffect(() => {
    if (isOpen && !isMobile) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMobile]);

  // Listen for custom "openChat" event to open chat with optional pre-filled message
  useEffect(() => {
    const handleOpenChat = (e: CustomEvent<{ message?: string }>) => {
      setIsOpen(true);
      if (e.detail?.message) {
        setInput(e.detail.message);
      }
    };

    window.addEventListener('openChat', handleOpenChat as EventListener);
    return () =>
      window.removeEventListener('openChat', handleOpenChat as EventListener);
  }, []);

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
    setShowInfoForm(false);
    localStorage.setItem(VISITOR_KEY, JSON.stringify(info));

    // Attach the info to the current session, or start one with it
    if (sessionId) {
      try {
        await fetch('/api/chat/session', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            name: info.name,
            email: info.email,
          }),
        });
      } catch (error) {
        console.error('Failed to update chat session:', error);
      }
    } else {
      await startSession(info.name, info.email);
    }
  };

  const dismissInfoPrompt = () => {
    setInfoDismissed(true);
    setShowInfoForm(false);
    localStorage.setItem(INFO_DISMISSED_KEY, 'true');
  };

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    // Start session if not already started
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      if (isLoggedIn && session?.user) {
        currentSessionId = await startSession(
          session.user.name || 'User',
          session.user.email || '',
          session.user.id
        );
      } else {
        currentSessionId = await startSession(
          visitorInfo?.name ?? 'Anonymous',
          visitorInfo?.email ?? ''
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
      // Only send the last N messages as context to avoid overloading the model
      const allMessages = [...messages, { role: 'user', content: userMessage }];
      const contextMessages = allMessages
        .slice(-MAX_CONTEXT_MESSAGES)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: contextMessages,
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
    // Also clear visitor info so guests can re-identify or start fresh
    if (!isLoggedIn) {
      setVisitorInfo(null);
      setVisitorForm({ name: '', email: '' });
      localStorage.removeItem(VISITOR_KEY);
    }
  };

  // Mobile-specific styles when keyboard is visible
  const mobileKeyboardStyles =
    isMobile && keyboardVisible
      ? 'fixed inset-x-0 top-auto w-full max-h-[50vh] rounded-b-none rounded-t-2xl'
      : isMobile && isOpen
        ? 'fixed inset-x-2 w-auto max-h-[70vh] rounded-2xl'
        : '';

  // Compute bottom position with safe area support
  const getChatWindowBottom = () => {
    if (isMobile && keyboardVisible) {
      return '0px';
    }
    // 5rem = 80px for the button height + spacing
    return 'calc(5rem + env(safe-area-inset-bottom, 0px))';
  };

  return (
    <>
      {/* Chat Window */}
      <div
        ref={chatWindowRef}
        className={`z-[9998] flex flex-col overflow-hidden border border-gray-300 bg-white shadow-2xl transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 ${
          mobileKeyboardStyles || 'fixed right-4 w-80 rounded-2xl sm:w-96'
        } ${
          isOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none max-h-0 opacity-0'
        } ${isOpen && !keyboardVisible ? 'max-h-[500px]' : ''}`}
        style={{ bottom: getChatWindowBottom() }}
        role="dialog"
        aria-label="AI Chat Assistant"
        {...(!isOpen ? { inert: true } : {})}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-gray-700">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 dark:bg-yellow-300">
              <IoMdChatbubbles className="text-lg text-gray-900" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                Tyler&apos;s AI Assistant
              </h3>
              <p className="text-xs text-gray-500">
                {userName ? `Chatting as ${userName}` : 'Ask me anything!'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={clearChat}
              className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              aria-label="Clear chat history"
              title="Clear chat"
            >
              <IoMdTrash className="text-lg" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              aria-label="Close chat"
            >
              <IoMdClose className="text-xl" />
            </button>
          </div>
        </div>

        {/* Optional visitor info prompt */}
        {showInfoPrompt && (
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-600 dark:bg-gray-700/50">
            {!showInfoForm ? (
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Chatting anonymously —{' '}
                  <button
                    onClick={() => setShowInfoForm(true)}
                    className="font-medium text-teal-600 hover:underline dark:text-yellow-300"
                  >
                    share your info
                  </button>{' '}
                  so Tyler can follow up
                </p>
                <button
                  onClick={dismissInfoPrompt}
                  className="shrink-0 rounded p-0.5 text-gray-500 transition-colors hover:text-gray-900 dark:hover:text-gray-200"
                  aria-label="Dismiss"
                  title="Dismiss"
                >
                  <IoMdClose className="text-sm" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleVisitorSubmit} className="space-y-2 py-1">
                <input
                  type="text"
                  value={visitorForm.name}
                  onChange={(e) =>
                    setVisitorForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Your name"
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-base text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-yellow-300"
                />
                <input
                  type="email"
                  value={visitorForm.email}
                  onChange={(e) =>
                    setVisitorForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="Your email"
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-base text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-yellow-300"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 rounded-lg bg-yellow-500 px-3 py-1.5 text-xs font-medium text-gray-900 transition-colors hover:bg-yellow-600 dark:bg-yellow-300 dark:hover:bg-yellow-400"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={dismissInfoPrompt}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    No thanks
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 space-y-3 overflow-x-hidden overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] overflow-hidden rounded-2xl px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-yellow-500 text-gray-900 dark:bg-yellow-300'
                    : 'bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-200'
                }`}
              >
                {message.role === 'user' ? (
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none text-sm break-words [&_a]:text-yellow-500 [&_a]:underline dark:[&_a]:text-yellow-300 [&_a:hover]:text-yellow-600 dark:[&_a:hover]:text-yellow-400 [&_code]:break-all [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_strong]:text-yellow-500 dark:[&_strong]:text-yellow-300 [&>li]:mb-1 [&>ol]:mb-2 [&>ol]:list-decimal [&>ol]:pl-4 [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:mb-2 [&>ul]:list-disc [&>ul]:pl-4">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.content === '' && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-white px-4 py-2 dark:bg-gray-700">
                <div className="flex gap-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500" />
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-gray-500"
                    style={{ animationDelay: '0.1s' }}
                  />
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-gray-500"
                    style={{ animationDelay: '0.2s' }}
                  />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-300 p-3 dark:border-gray-700">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="max-h-24 min-h-[40px] flex-1 resize-none rounded-xl border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-yellow-300"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-500 text-gray-900 transition-all hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-yellow-300 dark:hover:bg-yellow-400"
              aria-label="Send message"
            >
              <IoMdSend className="text-lg" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Button - hide when keyboard is visible on mobile */}
      {!(isMobile && keyboardVisible && isOpen) && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`fixed right-4 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-yellow-500 shadow-lg transition-all hover:scale-110 hover:bg-yellow-600 dark:bg-yellow-300 dark:hover:bg-yellow-400 ${
            isOpen ? 'rotate-90' : ''
          }`}
          style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
          aria-label={isOpen ? 'Close chat' : 'Open AI chat assistant'}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <IoMdClose className="text-2xl text-gray-900" />
          ) : (
            <IoMdChatbubbles className="text-2xl text-gray-900" />
          )}
        </button>
      )}
    </>
  );
}
