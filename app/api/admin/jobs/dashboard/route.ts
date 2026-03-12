import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

const COMPLETED_STATUSES = ['ACCEPTED', 'REJECTED', 'WITHDRAWN'] as const;
const OFFER_STATUSES = ['OFFER', 'NEGOTIATING', 'ACCEPTED'] as const;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();

    // Current week boundaries (Mon-Sun)
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const weekStart = new Date(now);
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(weekStart.getDate() + mondayOffset);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    // 12 weeks ago boundary
    const twelveWeeksAgo = new Date(now);
    twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84);
    // Align to the Monday of that week
    const twelveWeeksAgoDow = twelveWeeksAgo.getDay();
    const twelveWeeksAgoMonOffset =
      twelveWeeksAgoDow === 0 ? -6 : 1 - twelveWeeksAgoDow;
    twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() + twelveWeeksAgoMonOffset);
    twelveWeeksAgo.setHours(0, 0, 0, 0);

    const [
      total,
      active,
      offers,
      rejectedCount,
      completedApps,
      pipelineFunnel,
      bySource,
      allAppsBySource,
      recentApps,
      overdueFollowUps,
      interviewsThisWeek,
      awaitingResponse,
    ] = await Promise.all([
      // total
      prisma.jobApplication.count(),

      // active
      prisma.jobApplication.count({
        where: { status: { notIn: [...COMPLETED_STATUSES] } },
      }),

      // offers
      prisma.jobApplication.count({
        where: { status: { in: [...OFFER_STATUSES] } },
      }),

      // rejected count
      prisma.jobApplication.count({
        where: { status: 'REJECTED' },
      }),

      // completed apps for avgDaysInPipeline
      prisma.jobApplication.findMany({
        where: { status: { in: [...COMPLETED_STATUSES] } },
        select: { applicationDate: true, updatedAt: true },
      }),

      // pipelineFunnel - group by status
      prisma.jobApplication.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),

      // bySource - group by source
      prisma.jobApplication.groupBy({
        by: ['source'],
        _count: { _all: true },
      }),

      // responseRateBySource - all apps grouped by source with status
      prisma.jobApplication.findMany({
        select: { source: true, status: true },
      }),

      // applicationsOverTime - last 12 weeks
      prisma.jobApplication.findMany({
        where: { applicationDate: { gte: twelveWeeksAgo } },
        select: { applicationDate: true },
      }),

      // overdueFollowUps
      prisma.jobApplication.findMany({
        where: {
          followUpDate: { lt: now },
          status: { notIn: [...COMPLETED_STATUSES] },
        },
        select: {
          id: true,
          company: true,
          position: true,
          followUpDate: true,
        },
      }),

      // interviewsThisWeek
      prisma.interview.findMany({
        where: {
          scheduledDate: { gte: weekStart, lt: weekEnd },
        },
        select: {
          id: true,
          type: true,
          scheduledDate: true,
          jobApplication: {
            select: { company: true, position: true },
          },
        },
        orderBy: { scheduledDate: 'asc' },
      }),

      // awaitingResponse
      prisma.interview.findMany({
        where: {
          expectedResponseDate: { lt: now },
          responseReceivedAt: null,
        },
        select: {
          id: true,
          type: true,
          expectedResponseDate: true,
          jobApplication: {
            select: { company: true, position: true },
          },
        },
      }),
    ]);

    // Calculate avgDaysInPipeline
    let avgDaysInPipeline = 0;
    if (completedApps.length > 0) {
      const totalDays = completedApps.reduce((sum, app) => {
        const days =
          (app.updatedAt.getTime() - app.applicationDate.getTime()) /
          (1000 * 60 * 60 * 24);
        return sum + days;
      }, 0);
      avgDaysInPipeline =
        Math.round((totalDays / completedApps.length) * 10) / 10;
    }

    // Build applicationsOverTime (last 12 weeks by ISO week)
    const weekCounts = new Map<string, number>();
    for (const app of recentApps) {
      const d = new Date(app.applicationDate);
      const isoWeek = getISOWeek(d);
      weekCounts.set(isoWeek, (weekCounts.get(isoWeek) || 0) + 1);
    }

    // Generate all 12 week keys to ensure continuous data
    const applicationsOverTime: { period: string; count: number }[] = [];
    const cursor = new Date(twelveWeeksAgo);
    for (let i = 0; i < 12; i++) {
      const key = getISOWeek(cursor);
      applicationsOverTime.push({
        period: key,
        count: weekCounts.get(key) || 0,
      });
      cursor.setDate(cursor.getDate() + 7);
    }

    // Build responseRateBySource
    const sourceMap = new Map<string, { responded: number; total: number }>();
    for (const app of allAppsBySource) {
      const entry = sourceMap.get(app.source) || { responded: 0, total: 0 };
      entry.total++;
      if (app.status !== 'APPLIED') {
        entry.responded++;
      }
      sourceMap.set(app.source, entry);
    }
    const responseRateBySource = Array.from(sourceMap.entries()).map(
      ([source, data]) => ({
        source,
        responded: data.responded,
        total: data.total,
      })
    );

    return NextResponse.json({
      stats: {
        total,
        active,
        offers,
        rejectionRate:
          total > 0 ? Math.round((rejectedCount / total) * 1000) / 1000 : 0,
        avgDaysInPipeline,
      },
      applicationsOverTime,
      pipelineFunnel: pipelineFunnel.map((g) => ({
        status: g.status,
        count: g._count._all,
      })),
      bySource: bySource.map((g) => ({
        source: g.source,
        count: g._count._all,
      })),
      responseRateBySource,
      needsAttention: {
        overdueFollowUps,
        interviewsThisWeek,
        awaitingResponse,
      },
    });
  } catch (error) {
    console.error('Error fetching job dashboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}

/** Returns ISO week string like "2026-W10" */
function getISOWeek(date: Date): string {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  // Set to nearest Thursday (ISO week date algorithm)
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}
