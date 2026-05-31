'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskKeys } from '@/hooks/queryKeys';
import { requestJson } from '@/shared/lib/fetcher';
import type { DoorayTaskComment } from '@/shared/models/task';
import type { CreateTaskCommentInput } from '@/entities/task/model/types';

export function useCreateTaskCommentMutation(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTaskCommentInput) =>
      requestJson<DoorayTaskComment>(`/api/tasks/${taskId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(input)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.comments(taskId) });
    }
  });
}
