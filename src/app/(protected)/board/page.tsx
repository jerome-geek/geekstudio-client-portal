'use client';

import { AppShell } from '@/components/layout/app-shell';
import { BoardToolbar } from '@/components/board/board-toolbar';
import { KanbanBoard } from '@/components/board/kanban-board';
import { NewTaskForm } from '@/components/tasks/new-task-form';
import { useTaskBoardQuery } from '@/hooks/query/use-task-board-query';
import { useWorkflowsQuery } from '@/hooks/query/use-workflows-query';
import { useUpdateTaskStatusMutation } from '@/hooks/mutation/use-update-task-status-mutation';
import { groupTasksByStatus } from '@/shared/lib/utils';
import { useMemo, useState } from 'react';

export default function BoardPage() {
  const tasksQuery = useTaskBoardQuery();
  const workflowsQuery = useWorkflowsQuery();
  const statusMutation = useUpdateTaskStatusMutation();
  const [query, setQuery] = useState('');
  const [showComposer, setShowComposer] = useState(false);

  const workflows = workflowsQuery.data ?? [];
  const isLoading = tasksQuery.isLoading || workflowsQuery.isLoading;
  const error = tasksQuery.error ?? workflowsQuery.error ?? statusMutation.error;

  const filteredTasks = useMemo(() => {
    const tasks = tasksQuery.data ?? [];
    if (!query.trim()) {
      return tasks;
    }

    return tasks.filter((task) => task.title.toLowerCase().includes(query.toLowerCase()));
  }, [query, tasksQuery.data]);

  const groups = groupTasksByStatus(filteredTasks, workflows);

  return (
    <AppShell title="고객 요청 보드">
      <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-[#F5F5F7]">
        <BoardToolbar
          query={query}
          onQueryChange={setQuery}
          onToggleNewTask={() => setShowComposer((current) => !current)}
          onRefresh={() => {
            tasksQuery.refetch();
            workflowsQuery.refetch();
          }}
          isRefreshing={tasksQuery.isRefetching || workflowsQuery.isRefetching}
        />
        <div className="p-3">
          {error ? (
            <div className="mb-3 rounded-lg border border-[#FF3B30]/30 bg-[#FF3B30]/5 px-4 py-3 text-sm text-[#FF3B30]">
              {error instanceof Error ? error.message : '요청 처리에 실패했습니다.'}
            </div>
          ) : null}
          {showComposer ? (
            <div className="mb-3">
              <NewTaskForm onCreated={() => setShowComposer(false)} />
            </div>
          ) : null}
          {isLoading ? (
            <div className="rounded-lg bg-white p-6 text-sm text-[#6E6E73]">보드를 불러오는 중…</div>
          ) : (
            <KanbanBoard
              groups={groups}
              onMoveTask={(taskId, status) => statusMutation.mutate({ taskId, status })}
            />
          )}
        </div>
      </div>
    </AppShell>
  );
}
