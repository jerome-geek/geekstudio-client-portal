export const taskKeys = {
  all: ['tasks'] as const,
  board: () => [...taskKeys.all, 'board'] as const,
  detail: (taskId: string) => [...taskKeys.all, 'detail', taskId] as const,
  comments: (taskId: string) => [...taskKeys.all, 'comments', taskId] as const,
  attachments: (taskId: string) => [...taskKeys.all, 'attachments', taskId] as const
};

export const workflowKeys = {
  all: ['workflows'] as const,
  list: () => [...workflowKeys.all, 'list'] as const
};
