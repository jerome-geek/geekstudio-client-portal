import { NextResponse } from 'next/server';
import { getTask } from '@/entities/task/api/tasks';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;
  const task = await getTask(taskId);
  return NextResponse.json(task);
}
