'use client';

import type { SpikeCategory } from '@/shared/models/trend';
import { formatPercent, formatScore } from '@/shared/lib/format';

export function SpikeCards({
  spikes,
  selectedId,
  onSelect
}: {
  spikes: SpikeCategory[];
  selectedId: string | null;
  onSelect: (categoryId: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {spikes.map((spike) => {
        const isUp = spike.spikeRate >= 0;
        const isSelected = spike.categoryId === selectedId;
        return (
          <button
            key={spike.categoryId}
            type="button"
            onClick={() => onSelect(spike.categoryId)}
            className={`rounded-xl border bg-white p-5 text-left shadow-sm transition-all hover:shadow-md ${
              isSelected ? 'border-[#3C50E0] ring-1 ring-[#3C50E0]/30' : 'border-[#E2E8F0]'
            }`}
          >
            <p className="text-xs text-[#8A99AD]">{spike.fullPath ?? spike.categoryName}</p>
            <p className="mt-1 text-lg font-bold text-[#1C2434]">{spike.categoryName}</p>
            <div className="mt-3 flex items-end justify-between">
              <span className="text-2xl font-bold text-[#1C2434]">
                {formatScore(spike.latestScore)}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-sm font-bold ${
                  isUp ? 'bg-[#EBFDF5] text-[#10B981]' : 'bg-[#FFEBEB] text-[#E11D48]'
                }`}
              >
                {formatPercent(spike.spikeRate)}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-[#8A99AD]">최근 3일 vs 이전 7일 평균</p>
          </button>
        );
      })}
    </div>
  );
}
