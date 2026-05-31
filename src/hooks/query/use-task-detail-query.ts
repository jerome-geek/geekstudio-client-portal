'use client';

import { useQuery } from '@tanstack/react-query';
import { taskDetailOptions } from '@/entities/task/queries';

export function useTaskDetailQuery(taskId: string) {
  return useQuery(taskDetailOptions(taskId));
}
