import type { DoorayTask, DoorayTaskBoardGroup } from '@/shared/models/task';

export function groupTasksByStatus(tasks: DoorayTask[]): DoorayTaskBoardGroup[] {
  const groups = new Map<string, DoorayTaskBoardGroup>();

  tasks.forEach((task) => {
    const statusId = task.status?.id ?? 'unassigned';
    const statusName = task.status?.name ?? '미분류';

    if (!groups.has(statusId)) {
      groups.set(statusId, {
        statusId,
        statusName,
        tasks: []
      });
    }

    groups.get(statusId)?.tasks.push(task);
  });

  return Array.from(groups.values());
}
