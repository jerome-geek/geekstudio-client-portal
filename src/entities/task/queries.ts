import { queryOptions } from '@tanstack/react-query';
import { taskKeys, workflowKeys } from '@/hooks/queryKeys';
import { requestJson } from '@/shared/lib/fetcher';
import type {
  DoorayTask,
  DoorayTaskAttachment,
  DoorayTaskComment,
  DoorayTaskStatus
} from '@/shared/models/task';

export function workflowsOptions() {
  return queryOptions({
    queryKey: workflowKeys.list(),
    queryFn: () => requestJson<DoorayTaskStatus[]>('/api/workflows'),
    staleTime: 5 * 60 * 1000
  });
}

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

export function taskAttachmentsOptions(taskId: string) {
  return queryOptions({
    queryKey: taskKeys.attachments(taskId),
    queryFn: () => requestJson<DoorayTaskAttachment[]>(`/api/tasks/${taskId}/attachments`)
  });
}
