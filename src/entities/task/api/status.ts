import { getDoorayClient } from '@/shared/lib/dooray';
import { parseJsonResponse } from '@/shared/lib/fetcher';
import type { DoorayTask } from '@/shared/models/task';

export async function updateTaskStatus(taskId: string, statusId: string) {
  const response = await getDoorayClient().patch(`/tasks/${taskId}/status`, {
    statusId
  });
  return parseJsonResponse<DoorayTask>(response);
}
