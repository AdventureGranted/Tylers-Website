'use client';

import { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TrafficDataPoint {
  date: string;
  count: number;
  referrer: string | null;
}

interface TrafficChartProps {
  data: TrafficDataPoint[];
  referrers: string[];
}

type TimeRange = '7d' | '30d' | 'all';

export default function TrafficChart({ data, referrers }: TrafficChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [selectedReferrer, setSelectedReferrer] = useState<string>('all');

  const filteredData = useMemo(() => {
    const now = new Date();
    let cutoffDate: Date | null = null;

    if (timeRange === '7d') {
      cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (timeRange === '30d') {
      cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    return data.filter((d) => {
      const dateMatch = !cutoffDate || new Date(d.date) >= cutoffDate;
      const referrerMatch =
        selectedReferrer === 'all' ||
        (d.referrer || 'direct') === selectedReferrer;
      return dateMatch && referrerMatch;
    });
  }, [data, timeRange, selectedReferrer]);

  const chartData = useMemo(() => {
    // Group by date
    const grouped = filteredData.reduce(
      (acc, d) => {
        const dateKey = new Date(d.date).toISOString().split('T')[0];
        acc[dateKey] = (acc[dateKey] || 0) + d.count;
        return acc;
      },
      {} as Record<string, number>
    );

    // Convert to array and sort
    const result = Object.entries(grouped)
      .map(([date, views]) => ({
        date,
        name: new Date(date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        views,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Limit data points for readability
    if (result.length > 30) {
      // For lifetime/large datasets, aggregate by week
      const weekly: Record<string, { views: number; startDate: string }> = {};
      result.forEach((d) => {
        const date = new Date(d.date);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];
        if (!weekly[weekKey]) {
          weekly[weekKey] = { views: 0, startDate: weekKey };
        }
        weekly[weekKey].views += d.views;
      });
      return Object.values(weekly)
        .sort((a, b) => a.startDate.localeCompare(b.startDate))
        .map((w) => ({
          date: w.startDate,
          name: new Date(w.startDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
          views: w.views,
        }));
    }

    return result;
  }, [filteredData]);

  const totalViews = chartData.reduce((sum, d) => sum + d.views, 0);

  return (
    <div>
      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1">
          {(['7d', '30d', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-yellow-300 text-gray-900'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {range === '7d'
                ? '7 Days'
                : range === '30d'
                  ? '30 Days'
                  : 'All Time'}
            </button>
          ))}
        </div>
        <select
          value={selectedReferrer}
          onChange={(e) => setSelectedReferrer(e.target.value)}
          className="rounded-lg bg-gray-700 px-3 py-1 text-sm text-gray-300 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
        >
          <option value="all">All Sources</option>
          {referrers.map((ref) => (
            <option key={ref} value={ref}>
              {ref.charAt(0).toUpperCase() + ref.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Total */}
      <div className="mb-2 text-sm text-gray-400">
        Total:{' '}
        <span className="font-semibold text-yellow-300">{totalViews}</span>{' '}
        views
      </div>

      {/* Chart */}
      {chartData.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-gray-500">
          No data for selected filters
        </div>
      ) : (
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fde047" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#fde047" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f3f4f6',
                }}
                labelStyle={{ color: '#fde047' }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#fde047"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorViews)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
