'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TrafficChartProps {
  data: { date: string; count: number }[];
}

export default function TrafficChart({ data }: TrafficChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-gray-500">
        No data yet
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
    views: d.count,
  }));

  return (
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
  );
}
