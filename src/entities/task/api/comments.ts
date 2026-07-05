import { doorayRequest } from '@/shared/lib/dooray';
import type { DoorayTaskComment } from '@/shared/models/task';
import type { CreateTaskCommentInput } from '@/entities/task/model/types';
import { toComment, type DoorayLogRaw } from '@/entities/task/api/mappers';

export async function listTaskComments(
  projectId: string,
  taskId: string
): Promise<DoorayTaskComment[]> {
  const { result } = await doorayRequest<DoorayLogRaw[]>(
    `/project/v1/projects/${projectId}/posts/${taskId}/logs?page=0&size=100&order=createdAt`
  );

  return result.filter((log) => log.type === 'comment' || !log.type).map(toComment);
}

export async function createTaskComment(
  projectId: string,
  taskId: string,
  input: CreateTaskCommentInput
): Promise<DoorayTaskComment> {
  const { result } = await doorayRequest<{ id: string }>(
    `/project/v1/projects/${projectId}/posts/${taskId}/logs`,
    {
      method: 'POST',
      body: { body: { mimeType: 'text/x-markdown', content: input.body } }
    }
  );

  return { id: result.id, body: input.body, createdAt: new Date().toISOString() };
}
