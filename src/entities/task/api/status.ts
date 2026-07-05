import { doorayRequest } from '@/shared/lib/dooray';
import type { DoorayTask } from '@/shared/models/task';
import { getTask } from '@/entities/task/api/tasks';

export async function updateTaskStatus(
  projectId: string,
  taskId: string,
  workflowId: string
): Promise<DoorayTask> {
  await doorayRequest(`/project/v1/projects/${projectId}/posts/${taskId}/set-workflow`, {
    method: 'POST',
    body: { workflowId }
  });

  return getTask(projectId, taskId);
}
