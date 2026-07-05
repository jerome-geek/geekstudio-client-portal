'use client';

import Link from 'next/link';
import { useTaskDetailQuery } from '@/hooks/query/use-task-detail-query';
import { useWorkflowsQuery } from '@/hooks/query/use-workflows-query';
import { TaskStatusForm } from '@/components/tasks/task-status-form';
import { TaskComments } from '@/components/tasks/task-comments';
import { AttachmentUpload } from '@/components/tasks/attachment-upload';
import { formatDate } from '@/shared/lib/utils';

const PRIORITY_LABELS: Record<string, string> = {
  highest: '최상',
  high: '높음',
  normal: '보통',
  low: '낮음',
  lowest: '최하',
  none: '없음'
};

export function TaskDetail({ taskId }: { taskId: string }) {
  const { data: task, isLoading, error } = useTaskDetailQuery(taskId);
  const { data: workflows = [] } = useWorkflowsQuery();

  if (isLoading) {
    return (
      <div className="rounded-xl border border-black/[0.08] bg-white p-6 text-sm text-[#6E6E73]">
        업무 불러오는 중…
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="rounded-xl border border-black/[0.08] bg-white p-6">
        <p className="text-sm text-[#FF3B30]">
          업무를 찾을 수 없거나 접근할 수 없습니다.
        </p>
        <Link href="/board" className="mt-3 inline-block text-sm font-medium text-[#0071E3]">
          보드로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
      <section className="space-y-6">
        <article className="rounded-2xl border border-black/[0.08] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <div className="flex items-center gap-2 text-[13px] text-[#6E6E73]">
            <span className="font-medium text-[#0071E3]">{task.taskNumber}</span>
            <span className="rounded-full bg-[#F5F5F7] px-2.5 py-0.5 font-medium text-[#1D1D1F]">
              {task.status?.name ?? '미분류'}
            </span>
            {task.priority && task.priority !== 'none' ? (
              <span>우선순위 {PRIORITY_LABELS[task.priority] ?? task.priority}</span>
            ) : null}
          </div>
          <h2 className="mt-3 text-[28px] font-bold leading-tight text-[#1D1D1F]">{task.title}</h2>
          <div className="mt-2 flex gap-4 text-[13px] text-[#6E6E73]">
            <span>등록 {formatDate(task.createdAt)}</span>
            {task.updatedAt ? <span>수정 {formatDate(task.updatedAt)}</span> : null}
            {task.dueDate ? <span>만기 {formatDate(task.dueDate)}</span> : null}
          </div>
          <p className="mt-5 whitespace-pre-wrap text-[15px] leading-relaxed text-[#1D1D1F]/80">
            {task.body?.trim() ? task.body : '등록된 상세 설명이 없습니다.'}
          </p>
        </article>
        <TaskComments taskId={taskId} />
      </section>
      <aside className="space-y-6">
        <TaskStatusForm taskId={taskId} statuses={workflows} currentStatusId={task.status?.id} />
        <AttachmentUpload taskId={taskId} />
      </aside>
    </div>
  );
}
