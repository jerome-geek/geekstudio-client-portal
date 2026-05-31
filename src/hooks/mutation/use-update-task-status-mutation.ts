'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskKeys } from '@/hooks/queryKeys';
import { requestJson } from '@/shared/lib/fetcher';
import type { DoorayTask } from '@/shared/models/task';

export function useUpdateTaskStatusMutation(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (statusId: string) =>
      requestJson<DoorayTask>(`/api/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ statusId })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.board() });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
    }
  });
}
