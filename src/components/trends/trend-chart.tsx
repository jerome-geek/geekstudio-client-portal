'use client';

import { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { seriesOptions } from '@/entities/trend/queries';
import { formatScore } from '@/shared/lib/format';

const PERIODS = [
  { label: '7일', days: 7 },
  { label: '30일', days: 30 },
  { label: '90일', days: 90 }
] as const;

export function TrendChart({
  categoryId,
  categoryName
}: {
  categoryId: string | null;
  categoryName: string | null;
}) {
  const [days, setDays] = useState<number>(30);
  const { data: series = [], isLoading } = useQuery({
    ...seriesOptions(categoryId ?? '', days),
    enabled: Boolean(categoryId)
  });

  const chartData = series.map((point) => ({
    date: point.date.slice(5), // MM-DD
    score: point.calibratedScore
  }));

  return (
    <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#1C2434]">보정 점수 추이</h2>
          <p className="text-sm text-[#8A99AD]">{categoryName ?? '카테고리를 선택하세요'}</p>
        </div>
        <div className="flex gap-1 rounded-lg bg-[#F1F5F9] p-1">
          {PERIODS.map((period) => (
            <button
              key={period.days}
              type="button"
              onClick={() => setDays(period.days)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                days === period.days ? 'bg-white text-[#3C50E0] shadow-sm' : 'text-[#64748B]'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 h-72">
        {!categoryId ? (
          <div className="flex h-full items-center justify-center text-sm text-[#8A99AD]">
            급상승 카테고리를 선택하면 추이가 표시됩니다.
          </div>
        ) : isLoading ? (
          <div className="flex h-full items-center justify-center text-sm text-[#8A99AD]">
            불러오는 중…
          </div>
        ) : !chartData.length ? (
          <div className="flex h-full items-center justify-center text-sm text-[#8A99AD]">
            수집된 데이터가 없습니다.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3C50E0" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3C50E0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#8A99AD' }} tickLine={false} />
              <YAxis
                tick={{ fontSize: 12, fill: '#8A99AD' }}
                tickLine={false}
                axisLine={false}
                width={56}
                tickFormatter={(value) => formatScore(value)}
              />
              <Tooltip
                formatter={(value) => [formatScore(Number(value)), '보정 점수']}
                contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#3C50E0"
                strokeWidth={2}
                fill="url(#scoreFill)"
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
