'use client';

import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { TaskDetail } from '@/components/tasks/task-detail';
import { getMockTaskStatuses } from '@/shared/lib/mock-dooray';

export default function TaskDetailPage({
  params
}: {
  params: Promise<{ taskId: string }>;
}) {
  const [taskId, setTaskId] = React.useState('');

  React.useEffect(() => {
    params.then((value) => setTaskId(value.taskId));
  }, [params]);

  if (!taskId) {
    return <AppShell title="업무 상세">로딩 중...</AppShell>;
  }

  return (
    <AppShell title="업무 상세">
      <TaskDetail taskId={taskId} statuses={getMockTaskStatuses()} />
    </AppShell>
  );
}
