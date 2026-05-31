'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskKeys } from '@/hooks/queryKeys';
import { requestJson } from '@/shared/lib/fetcher';
import type { DoorayTaskAttachment } from '@/shared/models/task';

export function useUploadTaskAttachmentMutation(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      return requestJson<DoorayTaskAttachment>(`/api/tasks/${taskId}/attachments`, {
        method: 'POST',
        body: formData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
    }
  });
}
