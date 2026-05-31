import { NextResponse } from 'next/server';
import { getActiveCompanyProjectByUserId } from '@/entities/company/api/company';
import { createTask, listTasks } from '@/entities/task/api/tasks';
import { createMockTask, isMockDoorayMode, listMockTasks } from '@/shared/lib/mock-dooray';
import { createServerSupabaseClient } from '@/shared/lib/supabase/server';

async function requireUserId() {
  if (isMockDoorayMode()) {
    return 'demo-user';
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user.id;
}

export async function GET() {
  if (isMockDoorayMode()) {
    return NextResponse.json(listMockTasks());
  }

  const userId = await requireUserId();
  const project = await getActiveCompanyProjectByUserId(userId);
  const tasks = await listTasks(project.doorayProjectId);
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  if (isMockDoorayMode()) {
    const body = await request.json();
    return NextResponse.json(createMockTask(body), { status: 201 });
  }

  const userId = await requireUserId();
  const project = await getActiveCompanyProjectByUserId(userId);
  const body = await request.json();
  const task = await createTask(project.doorayProjectId, body);
  return NextResponse.json(task, { status: 201 });
}
