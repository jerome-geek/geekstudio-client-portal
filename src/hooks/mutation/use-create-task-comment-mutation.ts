'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskKeys } from '@/hooks/queryKeys';
import { requestJson } from '@/shared/lib/fetcher';
import { bumpSnapshot } from '@/shared/lib/notifications';
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
      // 자기 댓글이 알림으로 뜨지 않도록 기준선 선반영
      bumpSnapshot({ taskId, comment: true });
    }
  });
}
