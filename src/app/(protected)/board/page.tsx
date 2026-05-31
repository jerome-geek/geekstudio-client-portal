'use client';

import { AppShell } from '@/components/layout/app-shell';
import { KanbanBoard } from '@/components/board/kanban-board';
import { NewTaskForm } from '@/components/tasks/new-task-form';
import { useTaskBoardQuery } from '@/hooks/query/use-task-board-query';
import { groupTasksByStatus } from '@/shared/lib/utils';

export default function BoardPage() {
  const { data: tasks = [], isLoading } = useTaskBoardQuery();
  const groups = groupTasksByStatus(tasks);

  return (
    <AppShell title="고객 요청 보드">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.8fr]">
        <NewTaskForm />
        <section className="space-y-4">
          {isLoading ? <div className="rounded-3xl border border-black/10 bg-white p-6">보드를 불러오는 중...</div> : null}
          {!isLoading ? <KanbanBoard groups={groups} /> : null}
        </section>
      </div>
    </AppShell>
  );
}
