import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

const DEDUPE_WINDOW_MINUTES = 30;

export async function POST(request: NextRequest) {
  try {
    const { event, page } = await request.json();

    if (!event) {
      return NextResponse.json({ error: 'Event is required' }, { status: 400 });
    }

    // Get or create visitor ID from cookie
    let visitorId = request.cookies.get('visitor_id')?.value;

    if (!visitorId) {
      visitorId = crypto.randomUUID();
    }

    // Check for recent duplicate (same visitor, same event, same page)
    const dedupeTime = new Date(
      Date.now() - DEDUPE_WINDOW_MINUTES * 60 * 1000
    );

    const recentEvent = await prisma.analyticsEvent.findFirst({
      where: {
        visitorId,
        event,
        page: page ?? null,
        createdAt: { gte: dedupeTime },
      },
    });

    // Only create if no recent duplicate
    if (!recentEvent) {
      await prisma.analyticsEvent.create({
        data: {
          event,
          page,
          visitorId,
        },
      });
    }

    const response = NextResponse.json({ success: true });

    // Set visitor cookie if new
    if (!request.cookies.get('visitor_id')) {
      response.cookies.set('visitor_id', visitorId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }

    return response;
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    );
  }
}
