import { NextResponse } from 'next/server';
import { listTaskAttachments, uploadTaskAttachment } from '@/entities/task/api/attachments';
import { toErrorResponse } from '@/shared/lib/api-error';
import { resolveProjectId } from '@/shared/lib/project';
import {
  isMockDoorayMode,
  listMockTaskAttachments,
  uploadMockTaskAttachment
} from '@/shared/lib/mock-dooray';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;

    if (isMockDoorayMode()) {
      return NextResponse.json(listMockTaskAttachments(taskId));
    }

    const projectId = await resolveProjectId();
    const attachments = await listTaskAttachments(projectId, taskId);
    return NextResponse.json(attachments);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ message: '파일이 필요합니다.' }, { status: 400 });
    }

    if (isMockDoorayMode()) {
      return NextResponse.json(uploadMockTaskAttachment(taskId, file), { status: 201 });
    }

    const projectId = await resolveProjectId();
    const attachment = await uploadTaskAttachment(projectId, taskId, file);
    return NextResponse.json(attachment, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
