'use client';

import { useQuery } from '@tanstack/react-query';
import { taskAttachmentsOptions } from '@/entities/task/queries';

export function useTaskAttachmentsQuery(taskId: string) {
  return useQuery(taskAttachmentsOptions(taskId));
}
