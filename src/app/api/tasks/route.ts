import { NextResponse } from 'next/server';
import { getActiveCompanyProjectByUserId } from '@/entities/company/api/company';
import { createTask, listTasks } from '@/entities/task/api/tasks';
import { createServerSupabaseClient } from '@/shared/lib/supabase/server';

async function requireUserId() {
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
  const userId = await requireUserId();
  const project = await getActiveCompanyProjectByUserId(userId);
  const tasks = await listTasks(project.doorayProjectId);
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const userId = await requireUserId();
  const project = await getActiveCompanyProjectByUserId(userId);
  const body = await request.json();
  const task = await createTask(project.doorayProjectId, body);
  return NextResponse.json(task, { status: 201 });
}
