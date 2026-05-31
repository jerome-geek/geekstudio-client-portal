'use client';

import { AppShell } from '@/components/layout/app-shell';
import { BoardToolbar } from '@/components/board/board-toolbar';
import { KanbanBoard } from '@/components/board/kanban-board';
import { NewTaskForm } from '@/components/tasks/new-task-form';
import { useTaskBoardQuery } from '@/hooks/query/use-task-board-query';
import { groupTasksByStatus } from '@/shared/lib/utils';
import { useMemo, useState } from 'react';

export default function BoardPage() {
  const { data: tasks = [], isLoading } = useTaskBoardQuery();
  const [query, setQuery] = useState('');
  const [showComposer, setShowComposer] = useState(false);

  const filteredTasks = useMemo(() => {
    if (!query.trim()) {
      return tasks;
    }

    return tasks.filter((task) => task.title.toLowerCase().includes(query.toLowerCase()));
  }, [query, tasks]);

  const groups = groupTasksByStatus(filteredTasks);

  return (
    <AppShell title="고객 요청 보드">
      <div className="overflow-hidden rounded-lg border border-[#dcdcdc] bg-[#f7f7f7]">
        <BoardToolbar
          query={query}
          onQueryChange={setQuery}
          onToggleNewTask={() => setShowComposer((current) => !current)}
        />
        <div className="p-3">
          {showComposer ? (
            <div className="mb-3">
              <NewTaskForm />
            </div>
          ) : null}
          {isLoading ? (
            <div className="rounded-md bg-white p-6 text-sm text-[#666]">보드를 불러오는 중...</div>
          ) : (
            <KanbanBoard groups={groups} />
          )}
        </div>
      </div>
    </AppShell>
  );
}
