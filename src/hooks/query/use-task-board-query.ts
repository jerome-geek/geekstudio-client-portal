'use client';

import { useQuery } from '@tanstack/react-query';
import { taskBoardOptions } from '@/entities/task/queries';

export function useTaskBoardQuery() {
  return useQuery(taskBoardOptions());
}
