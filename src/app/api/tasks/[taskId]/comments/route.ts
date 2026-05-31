import { NextResponse } from 'next/server';
import { createTaskComment, listTaskComments } from '@/entities/task/api/comments';
import {
  createMockTaskComment,
  isMockDoorayMode,
  listMockTaskComments
} from '@/shared/lib/mock-dooray';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;
  if (isMockDoorayMode()) {
    return NextResponse.json(listMockTaskComments(taskId));
  }
  const comments = await listTaskComments(taskId);
  return NextResponse.json(comments);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;
  const body = await request.json();
  if (isMockDoorayMode()) {
    return NextResponse.json(createMockTaskComment(taskId, body), { status: 201 });
  }
  const comment = await createTaskComment(taskId, body);
  return NextResponse.json(comment, { status: 201 });
}
