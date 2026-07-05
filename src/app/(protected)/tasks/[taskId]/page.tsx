'use client';

import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { TaskDetail } from '@/components/tasks/task-detail';

export default function TaskDetailPage({
  params
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = React.use(params);

  return (
    <AppShell title="업무 상세">
      <TaskDetail taskId={taskId} />
    </AppShell>
  );
}
