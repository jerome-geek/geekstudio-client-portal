'use client';

import { useQuery } from '@tanstack/react-query';
import { workflowsOptions } from '@/entities/task/queries';

export function useWorkflowsQuery() {
  return useQuery(workflowsOptions());
}
