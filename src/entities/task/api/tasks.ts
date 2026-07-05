import { doorayRequest } from '@/shared/lib/dooray';
import type { DoorayTask } from '@/shared/models/task';
import type { CreateTaskInput } from '@/entities/task/model/types';
import { toTask, type DoorayPostRaw } from '@/entities/task/api/mappers';

const PAGE_SIZE = 100;
const MAX_PAGES = 10;

export async function listTasks(projectId: string): Promise<DoorayTask[]> {
  const tasks: DoorayTask[] = [];

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const { result, totalCount } = await doorayRequest<DoorayPostRaw[]>(
      `/project/v1/projects/${projectId}/posts?page=${page}&size=${PAGE_SIZE}&order=-createdAt`
    );

    tasks.push(...result.map(toTask));

    if (tasks.length >= (totalCount ?? 0) || result.length < PAGE_SIZE) {
      break;
    }
  }

  return tasks;
}

export async function getTask(projectId: string, taskId: string): Promise<DoorayTask> {
  const { result } = await doorayRequest<DoorayPostRaw>(
    `/project/v1/projects/${projectId}/posts/${taskId}`
  );
  return toTask(result);
}

export async function createTask(projectId: string, input: CreateTaskInput): Promise<DoorayTask> {
  const { result } = await doorayRequest<{ id: string }>(
    `/project/v1/projects/${projectId}/posts`,
    {
      method: 'POST',
      body: {
        subject: input.title,
        body: { mimeType: 'text/x-markdown', content: input.body ?? '' },
        priority: input.priority ?? 'none',
        dueDateFlag: false,
        users: { to: [], cc: [] }
      }
    }
  );

  return getTask(projectId, result.id);
}
