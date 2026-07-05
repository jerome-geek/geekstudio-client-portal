import { NextResponse } from 'next/server';
import { createTaskComment, listTaskComments } from '@/entities/task/api/comments';
import { toErrorResponse } from '@/shared/lib/api-error';
import { prefixAuthor, resolveAuthorLabel } from '@/shared/lib/author';
import { resolveProjectId } from '@/shared/lib/project';
import {
  createMockTaskComment,
  isMockDoorayMode,
  listMockTaskComments
} from '@/shared/lib/mock-dooray';
import type { CreateTaskCommentInput } from '@/entities/task/model/types';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;

    if (isMockDoorayMode()) {
      return NextResponse.json(listMockTaskComments(taskId));
    }

    const projectId = await resolveProjectId();
    const comments = await listTaskComments(projectId, taskId);
    return NextResponse.json(comments);
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
    const input = (await request.json()) as CreateTaskCommentInput;

    if (!input.body?.trim()) {
      return NextResponse.json({ message: '댓글 내용은 필수입니다.' }, { status: 400 });
    }

    if (isMockDoorayMode()) {
      return NextResponse.json(createMockTaskComment(taskId, input), { status: 201 });
    }

    const projectId = await resolveProjectId();
    const authorLabel = await resolveAuthorLabel();
    const comment = await createTaskComment(projectId, taskId, {
      body: prefixAuthor(authorLabel, input.body)
    });
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
