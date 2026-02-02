import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import Link from 'next/link';
import TrafficChart from '@/app/components/TrafficChart';

interface TrafficDataRow {
  date: Date;
  count: bigint;
  referrer: string | null;
}

interface DeviceStatRow {
  device: string | null;
  _count: { device: number };
}

interface ReferrerStatRow {
  referrer: string | null;
  _count: { referrer: number };
}

interface BrowserStatRow {
  browser: string | null;
  _count: { browser: number };
}

interface CountryStatRow {
  country: string | null;
  _count: { country: number };
}

interface PageStatRow {
  page: string | null;
  _count: { page: number };
}

interface RecentActivityRow {
  page: string | null;
  device: string | null;
  country: string | null;
  referrer: string | null;
  ip: string | null;
  createdAt: Date;
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login?callbackUrl=/admin');
  }

  if (session.user.role !== 'admin') {
    redirect('/');
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Main stats queries
  const [
    totalPageViews,
    uniqueVisitors30d,
    lifetimeUniqueVisitors,
    resumeDownloads,
    memberCount,
    unreadContacts,
    totalSessions,
    bounceSessions,
    returningVisitors,
    contactPageViews,
    contactSubmissions,
  ] = await Promise.all([
    // Page views (30d)
    prisma.analyticsEvent.count({
      where: {
        event: 'page_view',
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
    // Unique visitors by IP (30d)
    prisma.analyticsEvent.groupBy({
      by: ['ip'],
      where: {
        event: 'page_view',
        createdAt: { gte: thirtyDaysAgo },
        ip: { not: null },
      },
    }),
    // Lifetime unique visitors by IP
    prisma.analyticsEvent.groupBy({
      by: ['ip'],
      where: {
        event: 'page_view',
        ip: { not: null },
      },
    }),
    // Resume downloads (30d)
    prisma.analyticsEvent.count({
      where: {
        event: 'resume_download',
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
    // Member count
    prisma.user.count(),
    // Unread contacts
    prisma.contactSubmission.count({
      where: { read: false },
    }),
    // Total sessions (30d)
    prisma.analyticsEvent.groupBy({
      by: ['sessionId'],
      where: {
        event: 'page_view',
        createdAt: { gte: thirtyDaysAgo },
        sessionId: { not: null },
      },
    }),
    // Bounce sessions (single page sessions)
    prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM (
        SELECT "sessionId"
        FROM "AnalyticsEvent"
        WHERE event = 'page_view'
        AND "sessionId" IS NOT NULL
        AND "createdAt" >= ${thirtyDaysAgo}
        GROUP BY "sessionId"
        HAVING COUNT(*) = 1
      ) as bounces
    `,
    // Returning visitors (30d)
    prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM (
        SELECT "visitorId"
        FROM "AnalyticsEvent"
        WHERE event = 'page_view'
        AND "createdAt" >= ${thirtyDaysAgo}
        GROUP BY "visitorId"
        HAVING MIN("createdAt") < ${thirtyDaysAgo}
      ) as repeat_visitors
    `,
    // Contact page views (30d)
    prisma.analyticsEvent.count({
      where: {
        event: 'page_view',
        page: '/contact',
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
    // Contact form submissions (30d)
    prisma.contactSubmission.count({
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
  ]);

  // Breakdown queries
  const [
    referrerStats,
    deviceStats,
    browserStats,
    countryStats,
    topPages,
    recentActivity,
    allTrafficData,
  ] = await Promise.all([
    // Referrer breakdown (30d)
    prisma.analyticsEvent.groupBy({
      by: ['referrer'],
      where: {
        event: 'page_view',
        createdAt: { gte: thirtyDaysAgo },
      },
      _count: { referrer: true },
      orderBy: { _count: { referrer: 'desc' } },
      take: 10,
    }),
    // Device breakdown (30d)
    prisma.analyticsEvent.groupBy({
      by: ['device'],
      where: {
        event: 'page_view',
        createdAt: { gte: thirtyDaysAgo },
        device: { not: null },
      },
      _count: { device: true },
      orderBy: { _count: { device: 'desc' } },
    }),
    // Browser breakdown (30d)
    prisma.analyticsEvent.groupBy({
      by: ['browser'],
      where: {
        event: 'page_view',
        createdAt: { gte: thirtyDaysAgo },
        browser: { not: null },
      },
      _count: { browser: true },
      orderBy: { _count: { browser: 'desc' } },
      take: 5,
    }),
    // Country breakdown (30d)
    prisma.analyticsEvent.groupBy({
      by: ['country'],
      where: {
        event: 'page_view',
        createdAt: { gte: thirtyDaysAgo },
        country: { not: null },
      },
      _count: { country: true },
      orderBy: { _count: { country: 'desc' } },
      take: 10,
    }),
    // Top pages (30d)
    prisma.analyticsEvent.groupBy({
      by: ['page'],
      where: {
        event: 'page_view',
        createdAt: { gte: thirtyDaysAgo },
        page: { not: null },
      },
      _count: { page: true },
      orderBy: { _count: { page: 'desc' } },
      take: 10,
    }),
    // Recent activity (last 10)
    prisma.analyticsEvent.findMany({
      where: { event: 'page_view' },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        page: true,
        device: true,
        country: true,
        referrer: true,
        ip: true,
        createdAt: true,
      },
    }),
    // All traffic data with referrer (for chart filtering)
    prisma.$queryRaw<TrafficDataRow[]>`
      SELECT DATE("createdAt") as date, COUNT(*) as count, referrer
      FROM "AnalyticsEvent"
      WHERE event = 'page_view'
      GROUP BY DATE("createdAt"), referrer
      ORDER BY date ASC
    `,
  ]);

  // Calculate derived stats
  const bounceRate =
    totalSessions.length > 0
      ? Math.round(
          (Number(bounceSessions[0]?.count || 0) / totalSessions.length) * 100
        )
      : 0;

  const returningRate =
    uniqueVisitors30d.length > 0
      ? Math.round(
          (Number(returningVisitors[0]?.count || 0) /
            uniqueVisitors30d.length) *
            100
        )
      : 0;

  const contactConversion =
    contactPageViews > 0
      ? Math.round((contactSubmissions / contactPageViews) * 100)
      : 0;

  // Calculate today's views from traffic data
  const todayViews = allTrafficData
    .filter(
      (d: TrafficDataRow) => d.date.toDateString() === today.toDateString()
    )
    .reduce((sum: number, d: TrafficDataRow) => sum + Number(d.count), 0);

  // Get unique referrers for filter dropdown
  const uniqueReferrers: string[] = Array.from(
    new Set(allTrafficData.map((d: TrafficDataRow) => d.referrer || 'direct'))
  ).sort() as string[];

  // Format traffic data for chart
  const trafficChartData = allTrafficData.map((d: TrafficDataRow) => ({
    date: d.date.toISOString(),
    count: Number(d.count),
    referrer: d.referrer,
  }));

  const stats = [
    { label: 'Page Views (30d)', value: totalPageViews },
    { label: 'Today', value: todayViews },
    { label: 'Unique Visitors (30d)', value: uniqueVisitors30d.length },
    { label: 'Lifetime Visitors', value: lifetimeUniqueVisitors.length },
    { label: 'Resume Downloads', value: resumeDownloads },
    { label: 'Members', value: memberCount },
    {
      label: 'Unread Messages',
      value: unreadContacts,
      highlight: unreadContacts > 0,
    },
  ];

  const engagementStats = [
    {
      label: 'Bounce Rate',
      value: `${bounceRate}%`,
      desc: 'Single page visits',
    },
    {
      label: 'Returning Visitors',
      value: `${returningRate}%`,
      desc: 'Came back within 30d',
    },
    {
      label: 'Contact Conversion',
      value: `${contactConversion}%`,
      desc: 'Form submissions / views',
    },
    {
      label: 'Sessions (30d)',
      value: totalSessions.length,
      desc: 'Unique browsing sessions',
    },
  ];

  const deviceTotal = (deviceStats as DeviceStatRow[]).reduce(
    (a: number, b: DeviceStatRow) => a + b._count.device,
    0
  );
  const referrerTotal = (referrerStats as ReferrerStatRow[]).reduce(
    (a: number, b: ReferrerStatRow) => a + b._count.referrer,
    0
  );

  return (
    <div className="min-h-screen bg-[var(--background)] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
            Admin Dashboard
          </h1>
          <Link
            href="/"
            className="text-[var(--text-muted)] transition-colors hover:text-yellow-500 dark:hover:text-yellow-300"
          >
            View Site
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
          <h2 className="mb-4 text-xl font-semibold text-[var(--text-primary)]">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:flex md:flex-wrap md:gap-4">
            <Link
              href="/admin/contacts"
              className="relative rounded-lg border border-[var(--card-border)] bg-[var(--input-bg)] px-4 py-3 text-center text-[var(--text-primary)] transition-colors hover:bg-[var(--nav-hover)] md:py-2 md:text-left"
            >
              Contact Submissions
              {unreadContacts > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-xs font-bold text-gray-900 dark:bg-yellow-300">
                  {unreadContacts}
                </span>
              )}
            </Link>
            <Link
              href="/admin/projects"
              className="rounded-lg border border-[var(--card-border)] bg-[var(--input-bg)] px-4 py-3 text-center text-[var(--text-primary)] transition-colors hover:bg-[var(--nav-hover)] md:py-2 md:text-left"
            >
              Manage Projects
            </Link>
            <Link
              href="/admin/members"
              className="rounded-lg border border-[var(--card-border)] bg-[var(--input-bg)] px-4 py-3 text-center text-[var(--text-primary)] transition-colors hover:bg-[var(--nav-hover)] md:py-2 md:text-left"
            >
              Manage Members
            </Link>
            <Link
              href="/admin/chat-sessions"
              className="rounded-lg border border-[var(--card-border)] bg-[var(--input-bg)] px-4 py-3 text-center text-[var(--text-primary)] transition-colors hover:bg-[var(--nav-hover)] md:py-2 md:text-left"
            >
              Chat Sessions
            </Link>
            <Link
              href="/admin/projects/new"
              className="rounded-lg bg-yellow-500 px-4 py-3 text-center font-semibold text-gray-900 transition-colors hover:bg-yellow-600 md:py-2 md:text-left dark:bg-yellow-300 dark:hover:bg-yellow-400"
            >
              New Project
            </Link>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-xl border border-[var(--card-border)] p-4 text-center ${
                stat.highlight
                  ? 'border-2 border-yellow-500/50 bg-yellow-500/10 dark:border-yellow-300/50 dark:bg-yellow-300/10'
                  : 'bg-[var(--card-bg)]'
              }`}
            >
              <div className="text-2xl font-bold text-yellow-500 md:text-3xl dark:text-yellow-300">
                {stat.value}
              </div>
              <div className="text-xs text-[var(--text-muted)] md:text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Engagement Stats */}
        <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {engagementStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4"
            >
              <div className="text-2xl font-bold text-yellow-500 dark:text-yellow-300">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-[var(--text-primary)]">
                {stat.label}
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                {stat.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Daily Traffic */}
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
            <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">
              Traffic
            </h2>
            <TrafficChart data={trafficChartData} referrers={uniqueReferrers} />
          </div>

          {/* Top Pages */}
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
            <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">
              Top Pages
            </h2>
            <div className="space-y-2">
              {(topPages as PageStatRow[])
                .slice(0, 5)
                .map((page: PageStatRow) => (
                  <div
                    key={page.page}
                    className="flex items-center justify-between"
                  >
                    <span className="truncate text-sm text-[var(--text-secondary)]">
                      {page.page || '/'}
                    </span>
                    <span className="ml-2 text-sm font-medium text-yellow-500 dark:text-yellow-300">
                      {page._count.page}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Breakdown Row */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Device Breakdown */}
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
            <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">
              Devices
            </h2>
            <div className="space-y-3">
              {(deviceStats as DeviceStatRow[]).map((d: DeviceStatRow) => {
                const pct =
                  deviceTotal > 0
                    ? Math.round((d._count.device / deviceTotal) * 100)
                    : 0;
                return (
                  <div key={d.device}>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--text-secondary)] capitalize">
                        {d.device}
                      </span>
                      <span className="text-[var(--text-muted)]">{pct}%</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-[var(--input-bg)]">
                      <div
                        className="h-2 rounded-full bg-yellow-500 dark:bg-yellow-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Browser Breakdown */}
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
            <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">
              Browsers
            </h2>
            <div className="space-y-2">
              {(browserStats as BrowserStatRow[]).map((b: BrowserStatRow) => (
                <div
                  key={b.browser}
                  className="flex items-center justify-between"
                >
                  <span className="text-[var(--text-secondary)] capitalize">
                    {b.browser}
                  </span>
                  <span className="text-sm text-yellow-500 dark:text-yellow-300">
                    {b._count.browser}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Referrer Sources */}
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
            <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">
              Traffic Sources
            </h2>
            <div className="space-y-2">
              {(referrerStats as ReferrerStatRow[])
                .slice(0, 5)
                .map((r: ReferrerStatRow) => {
                  const pct =
                    referrerTotal > 0
                      ? Math.round((r._count.referrer / referrerTotal) * 100)
                      : 0;
                  return (
                    <div
                      key={r.referrer}
                      className="flex items-center justify-between"
                    >
                      <span className="text-[var(--text-secondary)] capitalize">
                        {r.referrer || 'direct'}
                      </span>
                      <span className="text-sm text-[var(--text-muted)]">
                        {pct}%
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Countries */}
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
            <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">
              Countries
            </h2>
            <div className="space-y-2">
              {countryStats.length > 0 ? (
                (countryStats as CountryStatRow[])
                  .slice(0, 5)
                  .map((c: CountryStatRow) => (
                    <div
                      key={c.country}
                      className="flex items-center justify-between"
                    >
                      <span className="text-[var(--text-secondary)]">
                        {c.country || 'Unknown'}
                      </span>
                      <span className="text-sm text-yellow-500 dark:text-yellow-300">
                        {c._count.country}
                      </span>
                    </div>
                  ))
              ) : (
                <p className="text-sm text-[var(--text-muted)]">
                  No geo data yet (requires CDN headers)
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-8 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6">
          <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">
            Recent Activity
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--card-border)] text-left text-[var(--text-muted)]">
                  <th className="pb-2">Page</th>
                  <th className="pb-2">IP</th>
                  <th className="pb-2">Device</th>
                  <th className="pb-2">Source</th>
                  <th className="pb-2">Country</th>
                  <th className="pb-2">Time</th>
                </tr>
              </thead>
              <tbody className="text-[var(--text-secondary)]">
                {(recentActivity as RecentActivityRow[]).map(
                  (event: RecentActivityRow, i: number) => (
                    <tr
                      key={i}
                      className="border-b border-[var(--card-border)]/50"
                    >
                      <td className="py-2">{event.page || '/'}</td>
                      <td className="py-2 font-mono text-xs text-[var(--text-muted)]">
                        {event.ip || '-'}
                      </td>
                      <td className="py-2 capitalize">{event.device || '-'}</td>
                      <td className="py-2 capitalize">
                        {event.referrer || 'direct'}
                      </td>
                      <td className="py-2">{event.country || '-'}</td>
                      <td className="py-2 text-[var(--text-muted)]">
                        {event.createdAt.toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
