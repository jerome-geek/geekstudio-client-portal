export const taskKeys = {
  all: ['tasks'] as const,
  board: () => [...taskKeys.all, 'board'] as const,
  detail: (taskId: string) => [...taskKeys.all, 'detail', taskId] as const,
  comments: (taskId: string) => [...taskKeys.all, 'comments', taskId] as const
};
