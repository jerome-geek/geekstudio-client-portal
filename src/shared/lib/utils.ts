import type {
  DoorayTask,
  DoorayTaskBoardGroup,
  DoorayTaskStatus
} from '@/shared/models/task';

export function groupTasksByStatus(
  tasks: DoorayTask[],
  workflows: DoorayTaskStatus[]
): DoorayTaskBoardGroup[] {
  const groups: DoorayTaskBoardGroup[] = workflows.map((workflow) => ({
    statusId: workflow.id,
    statusName: workflow.name,
    statusClass: workflow.class,
    tasks: []
  }));

  const groupById = new Map(groups.map((group) => [group.statusId, group]));
  const fallback: DoorayTaskBoardGroup = {
    statusId: 'unassigned',
    statusName: '미분류',
    tasks: []
  };

  tasks.forEach((task) => {
    const group = task.status ? groupById.get(task.status.id) : undefined;
    (group ?? fallback).tasks.push(task);
  });

  return fallback.tasks.length ? [...groups, fallback] : groups;
}

export function formatDate(value?: string | null) {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}
