import { NextResponse } from 'next/server';
import { listWorkflows } from '@/entities/task/api/workflows';
import { toErrorResponse } from '@/shared/lib/api-error';
import { resolveProjectId } from '@/shared/lib/project';
import { getMockTaskStatuses, isMockDoorayMode } from '@/shared/lib/mock-dooray';

export async function GET() {
  try {
    if (isMockDoorayMode()) {
      return NextResponse.json(getMockTaskStatuses());
    }

    const projectId = await resolveProjectId();
    const workflows = await listWorkflows(projectId);
    return NextResponse.json(workflows);
  } catch (error) {
    return toErrorResponse(error);
  }
}
