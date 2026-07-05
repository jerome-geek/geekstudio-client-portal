'use client';

import { Search, RotateCw, Plus } from 'lucide-react';

export function BoardToolbar({
  query,
  onQueryChange,
  onToggleNewTask,
  onRefresh,
  isRefreshing
}: {
  query: string;
  onQueryChange: (value: string) => void;
  onToggleNewTask: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}) {
  return (
    <div className="border-b border-[#E2E8F0] bg-white px-6 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex w-full max-w-[320px] items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-gray-400" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="업무 제목 검색..."
            className="w-full rounded-md border border-[#E2E8F0] bg-[#F9FBFD] py-2.5 pl-10 pr-4 text-sm text-[#1C2434] outline-none transition-colors placeholder:text-gray-400 focus:border-[#3C50E0] focus:bg-white"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex h-10 items-center gap-2 rounded-md border border-[#E2E8F0] bg-white px-4 text-sm font-medium text-[#1C2434] shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            <RotateCw className={`h-4 w-4 text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>새로고침</span>
          </button>
          <button
            type="button"
            onClick={onToggleNewTask}
            className="flex h-10 items-center gap-2 rounded-md bg-[#3C50E0] px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-opacity-90"
          >
            <Plus className="h-4 w-4" />
            <span>새 업무 추가</span>
          </button>
        </div>
      </div>
    </div>
  );
}
