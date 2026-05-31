'use client';

import { useQuery } from '@tanstack/react-query';
import { taskCommentsOptions } from '@/entities/task/queries';

export function useTaskCommentsQuery(taskId: string) {
  return useQuery(taskCommentsOptions(taskId));
}
