import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

const DEDUPE_WINDOW_MINUTES = 30;
const SESSION_TIMEOUT_MINUTES = 30;

interface AnalyticsEvent {
  event: string;
  page?: string;
  timestamp?: number;
}

function parseUserAgent(userAgent: string | null): {
  device: string;
  browser: string;
} {
  if (!userAgent) return { device: 'unknown', browser: 'unknown' };

  // Detect device
  let device = 'desktop';
  if (
    /Mobile|Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    )
  ) {
    if (/iPad|Tablet/i.test(userAgent)) {
      device = 'tablet';
    } else {
      device = 'mobile';
    }
  }

  // Detect browser
  let browser = 'other';
  if (/Chrome/i.test(userAgent) && !/Chromium|Edge/i.test(userAgent)) {
    browser = 'chrome';
  } else if (/Safari/i.test(userAgent) && !/Chrome|Chromium/i.test(userAgent)) {
    browser = 'safari';
  } else if (/Firefox/i.test(userAgent)) {
    browser = 'firefox';
  } else if (/Edge/i.test(userAgent)) {
    browser = 'edge';
  } else if (/Opera|OPR/i.test(userAgent)) {
    browser = 'opera';
  }

  return { device, browser };
}

function parseReferrer(referrer: string | null): string | null {
  if (!referrer) return 'direct';

  try {
    const url = new URL(referrer);
    const hostname = url.hostname.toLowerCase();

    // Categorize common referrers
    if (hostname.includes('google')) return 'google';
    if (hostname.includes('bing')) return 'bing';
    if (hostname.includes('yahoo')) return 'yahoo';
    if (hostname.includes('duckduckgo')) return 'duckduckgo';
    if (hostname.includes('linkedin')) return 'linkedin';
    if (hostname.includes('github')) return 'github';
    if (hostname.includes('twitter') || hostname.includes('x.com'))
      return 'twitter';
    if (hostname.includes('facebook')) return 'facebook';
    if (hostname.includes('reddit')) return 'reddit';

    // Return the hostname for other referrers
    return hostname;
  } catch {
    return 'direct';
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Support both single event and batched events
    const events: AnalyticsEvent[] = body.events || [
      { event: body.event, page: body.page },
    ];

    if (events.length === 0 || !events[0].event) {
      return NextResponse.json({ error: 'Event is required' }, { status: 400 });
    }

    // Get or create visitor ID from cookie
    let visitorId = request.cookies.get('visitor_id')?.value;
    let sessionId = request.cookies.get('session_id')?.value;

    if (!visitorId) {
      visitorId = crypto.randomUUID();
    }

    // Create new session if none exists or expired (handled by cookie expiry)
    if (!sessionId) {
      sessionId = crypto.randomUUID();
    }

    // Parse user agent and referrer
    const userAgent = request.headers.get('user-agent');
    const referrer = request.headers.get('referer');
    const { device, browser } = parseUserAgent(userAgent);
    const parsedReferrer = parseReferrer(referrer);

    // Get country from header (set by Cloudflare, Vercel, or similar)
    const country =
      request.headers.get('cf-ipcountry') ||
      request.headers.get('x-vercel-ip-country') ||
      request.headers.get('x-country') ||
      null;

    // Get IP address (Cloudflare, forwarded, or direct)
    const ip =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      null;

    // Process all events
    const dedupeTime = new Date(Date.now() - DEDUPE_WINDOW_MINUTES * 60 * 1000);

    // Get existing events for deduplication in a single query
    const existingEvents = await prisma.analyticsEvent.findMany({
      where: {
        visitorId,
        createdAt: { gte: dedupeTime },
        OR: events.map((e) => ({
          event: e.event,
          page: e.page ?? null,
        })),
      },
      select: { event: true, page: true },
    });

    const existingSet = new Set(
      existingEvents.map((e) => `${e.event}:${e.page ?? ''}`)
    );

    // Filter out duplicates
    const newEvents = events.filter(
      (e) => !existingSet.has(`${e.event}:${e.page ?? ''}`)
    );

    // Batch insert new events
    if (newEvents.length > 0) {
      await prisma.analyticsEvent.createMany({
        data: newEvents.map((e) => ({
          event: e.event,
          page: e.page,
          visitorId,
          sessionId,
          ip,
          referrer: parsedReferrer,
          userAgent,
          device,
          browser,
          country,
          createdAt: e.timestamp ? new Date(e.timestamp) : new Date(),
        })),
      });
    }

    const response = NextResponse.json({
      success: true,
      processed: newEvents.length,
    });

    // Set visitor cookie if new (1 year)
    if (!request.cookies.get('visitor_id')) {
      response.cookies.set('visitor_id', visitorId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365,
      });
    }

    // Set/refresh session cookie (30 min rolling)
    response.cookies.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * SESSION_TIMEOUT_MINUTES,
    });

    return response;
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}
