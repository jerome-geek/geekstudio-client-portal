'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskKeys } from '@/hooks/queryKeys';
import { requestJson } from '@/shared/lib/fetcher';
import type { DoorayTask } from '@/shared/models/task';
import type { CreateTaskInput } from '@/entities/task/model/types';

export interface CreateTaskVariables extends CreateTaskInput {
  files?: File[];
}

export function useCreateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ files, ...input }: CreateTaskVariables) => {
      const task = await requestJson<DoorayTask>('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(input)
      });

      // Dooray는 업무 생성과 첨부 등록이 분리되어 있어 생성 후 순차 업로드한다.
      for (const file of files ?? []) {
        const formData = new FormData();
        formData.append('file', file);
        await requestJson(`/api/tasks/${task.id}/attachments`, {
          method: 'POST',
          body: formData
        });
      }

      return task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.board() });
    }
  });
}
