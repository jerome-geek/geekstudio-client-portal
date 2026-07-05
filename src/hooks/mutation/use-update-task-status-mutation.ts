'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskKeys } from '@/hooks/queryKeys';
import { requestJson } from '@/shared/lib/fetcher';
import type { DoorayTask, DoorayTaskStatus } from '@/shared/models/task';

export interface UpdateTaskStatusVariables {
  taskId: string;
  status: DoorayTaskStatus;
}

export function useUpdateTaskStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status }: UpdateTaskStatusVariables) =>
      requestJson<DoorayTask>(`/api/tasks/${taskId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ workflowId: status.id })
      }),
    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.board() });
      const previousBoard = queryClient.getQueryData<DoorayTask[]>(taskKeys.board());

      queryClient.setQueryData<DoorayTask[]>(taskKeys.board(), (tasks) =>
        tasks?.map((task) => (task.id === taskId ? { ...task, status } : task))
      );

      return { previousBoard };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousBoard) {
        queryClient.setQueryData(taskKeys.board(), context.previousBoard);
      }
    },
    onSettled: (_data, _error, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.board() });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
    }
  });
}
