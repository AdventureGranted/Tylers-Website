'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface DashboardData {
  stats: {
    total: number;
    active: number;
    offers: number;
    rejectionRate: number;
    avgDaysInPipeline: number;
  };
  applicationsOverTime: { period: string; count: number }[];
  pipelineFunnel: { status: string; count: number }[];
  bySource: { source: string; count: number }[];
  responseRateBySource: {
    source: string;
    responded: number;
    total: number;
  }[];
  needsAttention: {
    overdueFollowUps: {
      id: string;
      company: string;
      position: string;
      followUpDate: string;
    }[];
    interviewsThisWeek: {
      id: string;
      company: string;
      position: string;
      scheduledDate: string;
      jobApplicationId: string;
    }[];
    awaitingResponse: {
      id: string;
      company: string;
      position: string;
      expectedResponseDate: string;
      jobApplicationId: string;
    }[];
  };
}

const PIE_COLORS = [
  '#fde047',
  '#facc15',
  '#eab308',
  '#ca8a04',
  '#a16207',
  '#854d0e',
  '#713f12',
  '#78716c',
];

export default function JobsDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/jobs/dashboard')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch dashboard data');
        return res.json();
      })
      .then((d) => setData(d))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-red-500">{error || 'Failed to load data'}</div>
      </div>
    );
  }

  const { stats, needsAttention } = data;

  const statCards = [
    { label: 'Total Applications', value: stats.total },
    { label: 'Active', value: stats.active },
    { label: 'Offers', value: stats.offers },
    {
      label: 'Rejection Rate',
      value: `${Math.round(stats.rejectionRate * 100)}%`,
    },
    { label: 'Avg Days in Pipeline', value: stats.avgDaysInPipeline },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/jobs"
              className="text-gray-500 transition-colors hover:text-yellow-500 dark:hover:text-yellow-300"
            >
              &larr; Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-gray-200">
              Job Search Dashboard
            </h1>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-300 bg-white p-4 text-center dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="text-2xl font-bold text-yellow-500 dark:text-yellow-300">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 md:text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Applications Over Time */}
          <div className="rounded-xl border border-gray-300 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-200">
              Applications Over Time
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.applicationsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="period"
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <YAxis
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    color: '#e5e7eb',
                  }}
                />
                <Bar dataKey="count" fill="#fde047" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pipeline Funnel */}
          <div className="rounded-xl border border-gray-300 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-200">
              Pipeline Funnel
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.pipelineFunnel} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  type="number"
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  allowDecimals={false}
                />
                <YAxis
                  dataKey="status"
                  type="category"
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    color: '#e5e7eb',
                  }}
                />
                <Bar dataKey="count" fill="#facc15" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Applications by Source */}
          <div className="rounded-xl border border-gray-300 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-200">
              Applications by Source
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.bySource}
                  dataKey="count"
                  nameKey="source"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  label={({ name, value }: { name?: string; value?: number }) =>
                    `${name || ''} (${value || 0})`
                  }
                >
                  {data.bySource.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    color: '#e5e7eb',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Response Rate by Source */}
          <div className="rounded-xl border border-gray-300 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-200">
              Response Rate by Source
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.responseRateBySource}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="source"
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <YAxis
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    color: '#e5e7eb',
                  }}
                />
                <Bar
                  dataKey="total"
                  fill="#fde047"
                  radius={[4, 4, 0, 0]}
                  name="Total"
                />
                <Bar
                  dataKey="responded"
                  fill="#facc15"
                  radius={[4, 4, 0, 0]}
                  name="Responded"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Needs Attention Section */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Overdue Follow-ups */}
          <div className="rounded-xl border border-gray-300 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-red-500 dark:text-red-400">
              Overdue Follow-ups
            </h2>
            {needsAttention.overdueFollowUps.length === 0 ? (
              <p className="text-sm text-gray-500">None</p>
            ) : (
              <div className="space-y-3">
                {needsAttention.overdueFollowUps.map((item) => (
                  <Link
                    key={item.id}
                    href={`/admin/jobs/${item.id}`}
                    className="block rounded-lg border border-red-500/20 bg-red-500/5 p-3 transition-colors hover:bg-red-500/10 dark:border-red-400/20 dark:bg-red-400/5 dark:hover:bg-red-400/10"
                  >
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                      {item.company} - {item.position}
                    </div>
                    <div className="text-xs text-red-500 dark:text-red-400">
                      Overdue:{' '}
                      {new Date(item.followUpDate).toLocaleDateString()}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Interviews This Week */}
          <div className="rounded-xl border border-gray-300 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-yellow-500 dark:text-yellow-300">
              Interviews This Week
            </h2>
            {needsAttention.interviewsThisWeek.length === 0 ? (
              <p className="text-sm text-gray-500">None</p>
            ) : (
              <div className="space-y-3">
                {needsAttention.interviewsThisWeek.map((item) => (
                  <Link
                    key={item.id}
                    href={`/admin/jobs/${item.jobApplicationId}`}
                    className="block rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3 transition-colors hover:bg-yellow-500/10 dark:border-yellow-300/20 dark:bg-yellow-300/5 dark:hover:bg-yellow-300/10"
                  >
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                      {item.company} - {item.position}
                    </div>
                    <div className="text-xs text-yellow-600 dark:text-yellow-300">
                      {new Date(item.scheduledDate).toLocaleDateString()}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Awaiting Response */}
          <div className="rounded-xl border border-gray-300 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-orange-500 dark:text-orange-400">
              Awaiting Response
            </h2>
            {needsAttention.awaitingResponse.length === 0 ? (
              <p className="text-sm text-gray-500">None</p>
            ) : (
              <div className="space-y-3">
                {needsAttention.awaitingResponse.map((item) => (
                  <Link
                    key={item.id}
                    href={`/admin/jobs/${item.jobApplicationId}`}
                    className="block rounded-lg border border-orange-500/20 bg-orange-500/5 p-3 transition-colors hover:bg-orange-500/10 dark:border-orange-400/20 dark:bg-orange-400/5 dark:hover:bg-orange-400/10"
                  >
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                      {item.company} - {item.position}
                    </div>
                    <div className="text-xs text-orange-500 dark:text-orange-400">
                      Expected:{' '}
                      {new Date(item.expectedResponseDate).toLocaleDateString()}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
