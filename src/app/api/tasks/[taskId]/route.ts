import { NextResponse } from 'next/server';
import { getTask } from '@/entities/task/api/tasks';
import { getMockTask, isMockDoorayMode } from '@/shared/lib/mock-dooray';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;
  if (isMockDoorayMode()) {
    return NextResponse.json(getMockTask(taskId));
  }
  const task = await getTask(taskId);
  return NextResponse.json(task);
}
