import { getDoorayClient } from '@/shared/lib/dooray';
import { parseJsonResponse } from '@/shared/lib/fetcher';
import type { DoorayTask } from '@/shared/models/task';
import type { CreateTaskInput } from '@/entities/task/model/types';

export async function listTasks(projectId: string) {
  const response = await getDoorayClient().get(`/projects/${projectId}/tasks`);
  return parseJsonResponse<DoorayTask[]>(response);
}

export async function getTask(taskId: string) {
  const response = await getDoorayClient().get(`/tasks/${taskId}`);
  return parseJsonResponse<DoorayTask>(response);
}

export async function createTask(projectId: string, input: CreateTaskInput) {
  const response = await getDoorayClient().post(`/projects/${projectId}/tasks`, input);
  return parseJsonResponse<DoorayTask>(response);
}
