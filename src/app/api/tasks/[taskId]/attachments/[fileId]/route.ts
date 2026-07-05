import { NextResponse } from 'next/server';
import { downloadTaskAttachment } from '@/entities/task/api/attachments';
import { toErrorResponse } from '@/shared/lib/api-error';
import { resolveProjectId } from '@/shared/lib/project';
import { isMockDoorayMode } from '@/shared/lib/mock-dooray';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ taskId: string; fileId: string }> }
) {
  try {
    const { taskId, fileId } = await params;

    if (isMockDoorayMode()) {
      return NextResponse.json({ message: '목 모드에서는 다운로드를 지원하지 않습니다.' }, { status: 404 });
    }

    const projectId = await resolveProjectId();
    const upstream = await downloadTaskAttachment(projectId, taskId, fileId);

    return new NextResponse(upstream.body, {
      headers: {
        'Content-Type': upstream.headers.get('content-type') ?? 'application/octet-stream',
        'Content-Disposition': upstream.headers.get('content-disposition') ?? 'attachment'
      }
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
