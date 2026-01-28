import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import Link from 'next/link';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login?callbackUrl=/admin');
  }

  if (session.user.role !== 'admin') {
    redirect('/');
  }

  // Get analytics data
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalPageViews,
    uniqueVisitors,
    resumeDownloads,
    memberCount,
    unreadContacts,
  ] = await Promise.all([
    prisma.analyticsEvent.count({
      where: {
        event: 'page_view',
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
    prisma.analyticsEvent.groupBy({
      by: ['visitorId'],
      where: {
        event: 'page_view',
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
    prisma.analyticsEvent.count({
      where: {
        event: 'resume_download',
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
    prisma.project.count(),
    prisma.user.count(),
    prisma.contactSubmission.count({
      where: { read: false },
    }),
  ]);

  const stats = [
    { label: 'Page Views (30d)', value: totalPageViews },
    { label: 'Unique Visitors (30d)', value: uniqueVisitors.length },
    { label: 'Resume Downloads (30d)', value: resumeDownloads },
    { label: 'Members', value: memberCount },
    {
      label: 'Unread Messages',
      value: unreadContacts,
      highlight: unreadContacts > 0,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-200">Admin Dashboard</h1>
          <Link
            href="/"
            className="text-gray-400 transition-colors hover:text-yellow-300"
          >
            View Site
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-xl p-4 text-center ${
                stat.highlight
                  ? 'border-2 border-yellow-300/50 bg-yellow-300/10'
                  : 'bg-gray-800'
              }`}
            >
              <div
                className={`text-3xl font-bold ${stat.highlight ? 'text-yellow-300' : 'text-yellow-300'}`}
              >
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-200">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/admin/contacts"
              className="relative rounded-lg bg-gray-700 px-4 py-2 text-gray-200 transition-colors hover:bg-gray-600"
            >
              Contact Submissions
              {unreadContacts > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-300 text-xs font-bold text-gray-900">
                  {unreadContacts}
                </span>
              )}
            </Link>
            <Link
              href="/admin/projects"
              className="rounded-lg bg-gray-700 px-4 py-2 text-gray-200 transition-colors hover:bg-gray-600"
            >
              Manage Projects
            </Link>
            <Link
              href="/admin/members"
              className="rounded-lg bg-gray-700 px-4 py-2 text-gray-200 transition-colors hover:bg-gray-600"
            >
              Manage Members
            </Link>
            <Link
              href="/admin/projects/new"
              className="rounded-lg bg-yellow-300 px-4 py-2 font-semibold text-gray-900 transition-colors hover:bg-yellow-400"
            >
              New Project
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
