'use client';

export async function trackEvent(event: string, page?: string) {
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, page }),
    });
  } catch (error) {
    // Silently fail - analytics shouldn't break the app
    console.error('Analytics tracking failed:', error);
  }
}

export function trackPageView(page: string) {
  trackEvent('page_view', page);
}

export function trackResumeDownload() {
  trackEvent('resume_download');
}
