'use client';

import Link from 'next/link';
import type { DoorayTask } from '@/shared/models/task';
import { formatDate } from '@/shared/lib/utils';
import { openTaskDetailModal } from '@/components/tasks/task-detail-modal';

const PRIORITY_STYLES: Record<string, { label: string; dot: string; text: string }> = {
  highest: { label: '최상', dot: 'bg-[#FF3B30]', text: 'text-[#FF3B30]' },
  high: { label: '높음', dot: 'bg-[#FF9500]', text: 'text-[#FF9500]' },
  normal: { label: '보통', dot: 'bg-[#0071E3]', text: 'text-[#0071E3]' },
  low: { label: '낮음', dot: 'bg-[#6E6E73]', text: 'text-[#6E6E73]' },
  lowest: { label: '최하', dot: 'bg-[#AEAEB2]', text: 'text-[#AEAEB2]' }
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
      className="block rounded-xl border border-black/[0.08] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-shadow duration-150 ease-out hover:shadow-md"
    >
      <p className="text-[15px] font-semibold leading-snug text-[#1D1D1F]">{task.title}</p>
      <div className="mt-3 flex items-center gap-2 text-[13px] text-[#6E6E73]">
        <span className="font-medium text-[#0071E3]">{task.taskNumber ?? task.id}</span>
        {priority ? (
          <span className={`flex items-center gap-1 ${priority.text}`}>
            <span className={`h-2 w-2 rounded-full ${priority.dot}`} />
            {priority.label}
          </span>
        ) : null}
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-[#6E6E73]">
        <span>등록 {formatDate(task.createdAt)}</span>
        {task.updatedAt && task.updatedAt !== task.createdAt ? (
          <span>수정 {formatDate(task.updatedAt)}</span>
        ) : null}
      </div>
    </Link>
  );
}
