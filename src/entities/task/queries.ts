import { queryOptions } from '@tanstack/react-query';
import { taskKeys } from '@/hooks/queryKeys';
import { requestJson } from '@/shared/lib/fetcher';
import type { DoorayTask, DoorayTaskComment } from '@/shared/models/task';

export function taskBoardOptions() {
  return queryOptions({
    queryKey: taskKeys.board(),
    queryFn: () => requestJson<DoorayTask[]>('/api/tasks')
  });
}

export function taskDetailOptions(taskId: string) {
  return queryOptions({
    queryKey: taskKeys.detail(taskId),
    queryFn: () => requestJson<DoorayTask>(`/api/tasks/${taskId}`)
  });
}

export function taskCommentsOptions(taskId: string) {
  return queryOptions({
    queryKey: taskKeys.comments(taskId),
    queryFn: () => requestJson<DoorayTaskComment[]>(`/api/tasks/${taskId}/comments`)
  });
}
