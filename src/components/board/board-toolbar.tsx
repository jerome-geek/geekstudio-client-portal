'use client';

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
    <div className="border-b border-black/[0.08] bg-white">
      <div className="flex flex-col gap-3 px-4 py-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex w-full max-w-[350px] items-center gap-2 rounded-lg bg-[#F5F5F7] px-3 py-2.5 text-sm">
          <span className="text-[#6E6E73]">⌕</span>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="제목 검색"
            className="w-full bg-transparent text-[15px] text-[#1D1D1F] outline-none placeholder:text-[#6E6E73]"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="h-11 rounded-lg bg-[#F5F5F7] px-4 text-sm font-medium text-[#1D1D1F] transition-colors hover:bg-[#ECECEE] disabled:opacity-50"
          >
            {isRefreshing ? '새로고침 중…' : '새로고침'}
          </button>
          <button
            type="button"
            onClick={onToggleNewTask}
            className="h-11 rounded-lg bg-[#0071E3] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0077ED]"
          >
            + 새 업무
          </button>
        </div>
      </div>
    </div>
  );
}
