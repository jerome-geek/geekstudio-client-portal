import { doorayRequest } from '@/shared/lib/dooray';
import type { DoorayTaskStatus } from '@/shared/models/task';
import { toTaskStatus, type DoorayWorkflowRaw } from '@/entities/task/api/mappers';

export async function listWorkflows(projectId: string): Promise<DoorayTaskStatus[]> {
  const { result } = await doorayRequest<DoorayWorkflowRaw[]>(
    `/project/v1/projects/${projectId}/workflows`
  );

  return result
    .map(toTaskStatus)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}
