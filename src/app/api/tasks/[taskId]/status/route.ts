import { NextResponse } from 'next/server';
import { updateTaskStatus } from '@/entities/task/api/status';
import { toErrorResponse } from '@/shared/lib/api-error';
import { resolveProjectId } from '@/shared/lib/project';
import { isMockDoorayMode, updateMockTaskStatus } from '@/shared/lib/mock-dooray';
import type { UpdateTaskStatusInput } from '@/entities/task/model/types';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;
    const input = (await request.json()) as UpdateTaskStatusInput;

    if (!input.workflowId) {
      return NextResponse.json({ message: 'workflowId는 필수입니다.' }, { status: 400 });
    }

    if (isMockDoorayMode()) {
      return NextResponse.json(updateMockTaskStatus(taskId, input.workflowId));
    }

    const projectId = await resolveProjectId();
    const task = await updateTaskStatus(projectId, taskId, input.workflowId);
    return NextResponse.json(task);
  } catch (error) {
    return toErrorResponse(error);
  }
}
