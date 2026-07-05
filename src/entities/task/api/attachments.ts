import { doorayDownloadFile, doorayRequest, doorayUploadFile } from '@/shared/lib/dooray';
import type { DoorayTaskAttachment } from '@/shared/models/task';
import { toAttachment, type DoorayFileRaw } from '@/entities/task/api/mappers';

export async function listTaskAttachments(
  projectId: string,
  taskId: string
): Promise<DoorayTaskAttachment[]> {
  const { result } = await doorayRequest<DoorayFileRaw[]>(
    `/project/v1/projects/${projectId}/posts/${taskId}/files`
  );

  return result.map(toAttachment);
}

export async function uploadTaskAttachment(
  projectId: string,
  taskId: string,
  file: File
): Promise<DoorayTaskAttachment> {
  const { result } = await doorayUploadFile<{ id: string }>(
    `/project/v1/projects/${projectId}/posts/${taskId}/files`,
    file
  );

  return { id: result.id, name: file.name, size: file.size, mimeType: file.type };
}

export async function downloadTaskAttachment(
  projectId: string,
  taskId: string,
  fileId: string
): Promise<Response> {
  return doorayDownloadFile(
    `/project/v1/projects/${projectId}/posts/${taskId}/files/${fileId}?media=raw`
  );
}
