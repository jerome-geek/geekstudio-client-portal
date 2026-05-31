import { NextResponse } from 'next/server';
import { updateTaskStatus } from '@/entities/task/api/status';
import { isMockDoorayMode, updateMockTaskStatus } from '@/shared/lib/mock-dooray';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;
  const body = (await request.json()) as { statusId: string };
  if (isMockDoorayMode()) {
    return NextResponse.json(updateMockTaskStatus(taskId, body.statusId));
  }
  const result = await updateTaskStatus(taskId, body.statusId);
  return NextResponse.json(result);
}
