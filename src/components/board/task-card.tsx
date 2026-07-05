'use client';

import Link from 'next/link';
import type { DoorayTask } from '@/shared/models/task';
import { formatDate } from '@/shared/lib/utils';
import { openTaskDetailModal } from '@/components/tasks/task-detail-modal';

const PRIORITY_STYLES: Record<string, { label: string; bg: string; text: string; border: string }> = {
  highest: { label: '최상', bg: 'bg-[#FFEBEB]', text: 'text-[#E11D48]', border: 'border-[#FCA5A5]/30' },
  high: { label: '높음', bg: 'bg-[#FFF3E0]', text: 'text-[#EA580C]', border: 'border-[#FDBA74]/30' },
  normal: { label: '보통', bg: 'bg-[#EFF6FF]', text: 'text-[#2563EB]', border: 'border-[#93C5FD]/30' },
  low: { label: '낮음', bg: 'bg-[#F8FAFC]', text: 'text-[#475569]', border: 'border-[#CBD5E1]/30' },
  lowest: { label: '최하', bg: 'bg-[#F3F4F6]', text: 'text-[#9CA3AF]', border: 'border-[#E5E7EB]/30' }
};

export function TaskCard({ task }: { task: DoorayTask }) {
  const priority = task.priority ? PRIORITY_STYLES[task.priority] : undefined;

  return (
    <Link
      href={`/tasks/${task.id}`}
      onClick={(event) => {
        // cmd/ctrl+클릭은 새 탭 그대로, 일반 클릭은 모달로
        if (event.metaKey || event.ctrlKey || event.shiftKey) {
          return;
        }
        event.preventDefault();
        openTaskDetailModal(task.id);
      }}
      className="block rounded-lg border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-200 hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
    >
      <p className="text-sm font-semibold leading-snug text-[#1C2434] line-clamp-2 hover:text-[#3C50E0] transition-colors">{task.title}</p>
      
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold font-mono text-slate-600">
          #{task.taskNumber ?? task.id}
        </span>
        {priority ? (
          <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-bold ${priority.bg} ${priority.text} ${priority.border}`}>
            {priority.label}
          </span>
        ) : null}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#8A99AD]">
        <span>등록 {formatDate(task.createdAt)}</span>
        {task.updatedAt && task.updatedAt !== task.createdAt ? (
          <span className="font-medium text-slate-400">수정됨</span>
        ) : null}
      </div>
    </Link>
  );
}
