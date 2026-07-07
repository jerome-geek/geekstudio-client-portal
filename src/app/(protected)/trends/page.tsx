'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Settings } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { SpikeCards } from '@/components/trends/spike-cards';
import { TrendChart } from '@/components/trends/trend-chart';
import { BestSellersGrid } from '@/components/trends/best-sellers-grid';
import { spikesOptions } from '@/entities/trend/queries';

export default function TrendsPage() {
  const { data: spikes = [], isLoading, error } = useQuery(spikesOptions());
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedId && spikes.length) {
      setSelectedId(spikes[0].categoryId);
    }
  }, [spikes, selectedId]);

  const selected = spikes.find((spike) => spike.categoryId === selectedId) ?? null;

  return (
    <AppShell title="네이버 카테고리 트렌드">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1C2434]">카테고리 급상승 트렌드</h1>
            <p className="text-sm text-[#8A99AD]">
              데이터랩 상대 비율을 검색광고 절대 검색량으로 보정한 점수 기준
            </p>
          </div>
          <Link
            href="/trends/settings"
            className="flex h-10 items-center gap-2 rounded-md border border-[#E2E8F0] bg-white px-4 text-sm font-medium text-[#1C2434] shadow-sm hover:bg-gray-50"
          >
            <Settings className="h-4 w-4 text-gray-500" />
            수집 카테고리 관리
          </Link>
        </div>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error instanceof Error ? error.message : '트렌드를 불러오지 못했습니다.'}
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-8 text-center text-sm text-gray-500">
            트렌드를 불러오는 중…
          </div>
        ) : (
          <>
            <SpikeCards spikes={spikes} selectedId={selectedId} onSelect={setSelectedId} />
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <TrendChart categoryId={selectedId} categoryName={selected?.categoryName ?? null} />
              <BestSellersGrid categoryId={selectedId} categoryName={selected?.categoryName ?? null} />
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
