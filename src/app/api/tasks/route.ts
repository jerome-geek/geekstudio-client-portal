import { NextResponse } from 'next/server';
import { createTask, listTasks } from '@/entities/task/api/tasks';
import { toErrorResponse } from '@/shared/lib/api-error';
import { prefixAuthor, resolveAuthorLabel } from '@/shared/lib/author';
import { resolveProjectId } from '@/shared/lib/project';
import { createMockTask, isMockDoorayMode, listMockTasks } from '@/shared/lib/mock-dooray';
import type { CreateTaskInput } from '@/entities/task/model/types';

export async function GET() {
  try {
    if (isMockDoorayMode()) {
      return NextResponse.json(listMockTasks());
    }

    const projectId = await resolveProjectId();
    const tasks = await listTasks(projectId);
    return NextResponse.json(tasks);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as CreateTaskInput;

    if (!input.title?.trim()) {
      return NextResponse.json({ message: '제목은 필수입니다.' }, { status: 400 });
    }

    if (isMockDoorayMode()) {
      return NextResponse.json(createMockTask(input), { status: 201 });
    }

    const projectId = await resolveProjectId();
    const authorLabel = await resolveAuthorLabel();
    const task = await createTask(projectId, {
      ...input,
      body: prefixAuthor(authorLabel, input.body ?? '')
    });
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
