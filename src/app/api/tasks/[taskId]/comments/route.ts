import { NextResponse } from 'next/server';
import { createTaskComment, listTaskComments } from '@/entities/task/api/comments';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;
  const comments = await listTaskComments(taskId);
  return NextResponse.json(comments);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;
  const body = await request.json();
  const comment = await createTaskComment(taskId, body);
  return NextResponse.json(comment, { status: 201 });
}
