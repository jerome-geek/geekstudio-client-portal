import { getDoorayClient } from '@/shared/lib/dooray';
import { parseJsonResponse } from '@/shared/lib/fetcher';
import type { DoorayTaskComment } from '@/shared/models/task';
import type { CreateTaskCommentInput } from '@/entities/task/model/types';

export async function listTaskComments(taskId: string) {
  const response = await getDoorayClient().get(`/tasks/${taskId}/comments`);
  return parseJsonResponse<DoorayTaskComment[]>(response);
}

export async function createTaskComment(taskId: string, input: CreateTaskCommentInput) {
  const response = await getDoorayClient().post(`/tasks/${taskId}/comments`, input);
  return parseJsonResponse<DoorayTaskComment>(response);
}
