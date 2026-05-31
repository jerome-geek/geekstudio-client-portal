'use client';

import type { DoorayTaskStatus } from '@/shared/models/task';
import { useTaskDetailQuery } from '@/hooks/query/use-task-detail-query';
import { TaskStatusForm } from '@/components/tasks/task-status-form';
import { TaskComments } from '@/components/tasks/task-comments';
import { AttachmentUpload } from '@/components/tasks/attachment-upload';

export function TaskDetail({
  taskId,
  statuses
}: {
  taskId: string;
  statuses: DoorayTaskStatus[];
}) {
  const { data: task, isLoading } = useTaskDetailQuery(taskId);

  if (isLoading) {
    return <div className="rounded-3xl border border-black/10 bg-white p-6">업무 불러오는 중...</div>;
  }

  if (!task) {
    return <div className="rounded-3xl border border-black/10 bg-white p-6">업무를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
      <section className="space-y-6">
        <article className="rounded-[1.75rem] border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">
            {task.status?.name ?? '미분류'}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">{task.title}</h2>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-black/70">
            {task.body ?? '등록된 상세 설명이 없습니다.'}
          </p>
        </article>
        <TaskComments taskId={taskId} />
      </section>
      <aside className="space-y-6">
        <TaskStatusForm taskId={taskId} statuses={statuses} currentStatusId={task.status?.id} />
        <AttachmentUpload taskId={taskId} />
      </aside>
    </div>
  );
}
