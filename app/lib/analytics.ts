'use client';

interface AnalyticsEvent {
  event: string;
  page?: string;
  timestamp: number;
}

// Event queue for batching
let eventQueue: AnalyticsEvent[] = [];
let flushTimeout: NodeJS.Timeout | null = null;

const BATCH_SIZE = 10;
const FLUSH_INTERVAL = 5000; // 5 seconds

async function flushEvents() {
  if (eventQueue.length === 0) return;

  const eventsToSend = [...eventQueue];
  eventQueue = [];

  if (flushTimeout) {
    clearTimeout(flushTimeout);
    flushTimeout = null;
  }

  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ events: eventsToSend }),
    });
  } catch (error) {
    // Silently fail - analytics shouldn't break the app
    console.error('Analytics tracking failed:', error);
  }
}

function scheduleFlush() {
  if (flushTimeout) return;

  flushTimeout = setTimeout(() => {
    flushEvents();
  }, FLUSH_INTERVAL);
}

export async function trackEvent(event: string, page?: string) {
  eventQueue.push({
    event,
    page,
    timestamp: Date.now(),
  });

  // Flush immediately if batch size reached
  if (eventQueue.length >= BATCH_SIZE) {
    flushEvents();
  } else {
    scheduleFlush();
  }
}

export function trackPageView(page: string) {
  trackEvent('page_view', page);
}

export function trackResumeDownload() {
  trackEvent('resume_download');
}

// Flush remaining events when page is about to unload
if (typeof window !== 'undefined') {
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      // Use sendBeacon for reliability when page is closing
      if (eventQueue.length > 0 && navigator.sendBeacon) {
        const data = JSON.stringify({ events: eventQueue });
        navigator.sendBeacon('/api/analytics', data);
        eventQueue = [];
      }
    }
  });

  window.addEventListener('pagehide', () => {
    if (eventQueue.length > 0 && navigator.sendBeacon) {
      const data = JSON.stringify({ events: eventQueue });
      navigator.sendBeacon('/api/analytics', data);
      eventQueue = [];
    }
  });
}
