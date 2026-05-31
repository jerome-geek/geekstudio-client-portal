import { NextResponse } from 'next/server';
import { updateTaskStatus } from '@/entities/task/api/status';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;
  const body = (await request.json()) as { statusId: string };
  const result = await updateTaskStatus(taskId, body.statusId);
  return NextResponse.json(result);
}
