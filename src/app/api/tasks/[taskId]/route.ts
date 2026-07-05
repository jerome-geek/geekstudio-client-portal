import { NextResponse } from 'next/server';
import { getTask } from '@/entities/task/api/tasks';
import { toErrorResponse } from '@/shared/lib/api-error';
import { resolveProjectId } from '@/shared/lib/project';
import { getMockTask, isMockDoorayMode } from '@/shared/lib/mock-dooray';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;

    if (isMockDoorayMode()) {
      return NextResponse.json(getMockTask(taskId));
    }

    const projectId = await resolveProjectId();
    const task = await getTask(projectId, taskId);
    return NextResponse.json(task);
  } catch (error) {
    return toErrorResponse(error);
  }
}
