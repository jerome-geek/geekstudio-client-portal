import { getDoorayClient } from '@/shared/lib/dooray';
import { parseJsonResponse } from '@/shared/lib/fetcher';
import type { DoorayTaskAttachment } from '@/shared/models/task';

export async function uploadTaskAttachment(taskId: string, file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await getDoorayClient().postForm(`/tasks/${taskId}/attachments`, formData);
  return parseJsonResponse<DoorayTaskAttachment>(response);
}
