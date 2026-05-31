'use client';

type FilterOption = {
  label: string;
  value: string;
};

const FILTER_OPTIONS: FilterOption[] = [
  { label: '담당자: 전체', value: 'assignee' },
  { label: '태그: 전체', value: 'tag' },
  { label: '우선 순위: 전체', value: 'priority' }
];

export function BoardToolbar({
  query,
  onQueryChange,
  onToggleNewTask
}: {
  query: string;
  onQueryChange: (value: string) => void;
  onToggleNewTask: () => void;
}) {
  return (
    <div className="border-b border-[#dedede] bg-white">
      <div className="flex flex-col gap-3 px-4 py-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex w-full max-w-[350px] items-center gap-3 rounded-md bg-[#f4f4f4] px-4 py-3 text-sm text-[#888]">
          <span className="text-lg">⌕</span>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="제목 검색"
            className="w-full bg-transparent text-[15px] text-[#333] outline-none placeholder:text-[#9b9b9b]"
          />
        </div>
        <div className="flex flex-wrap items-center gap-6 text-[15px] font-medium text-[#444]">
          {FILTER_OPTIONS.map((filter) => (
            <button key={filter.value} type="button" className="flex items-center gap-1 hover:text-black">
              <span>{filter.label}</span>
              <span className="text-xs text-[#666]">▾</span>
            </button>
          ))}
          <button
            type="button"
            onClick={onToggleNewTask}
            className="rounded-md border border-[#d8d8d8] bg-white px-3 py-2 text-sm font-semibold text-[#2f6fff]"
          >
            + 새 업무
          </button>
        </div>
      </div>
    </div>
  );
}
