import { NextResponse } from 'next/server';
import { getTaskSnapshots } from '@/entities/task/api/notifications';
import { toErrorResponse } from '@/shared/lib/api-error';
import { resolveProjectId } from '@/shared/lib/project';
import { getMockTaskStatuses, isMockDoorayMode, listMockTasks, listMockTaskComments } from '@/shared/lib/mock-dooray';

export async function GET() {
  try {
    if (isMockDoorayMode()) {
      void getMockTaskStatuses();
      const snapshots = listMockTasks().map((task) => ({
        id: task.id,
        title: task.title,
        taskNumber: task.taskNumber,
        statusId: task.status?.id,
        statusName: task.status?.name,
        commentCount: listMockTaskComments(task.id).length
      }));
      return NextResponse.json(snapshots);
    }

    const projectId = await resolveProjectId();
    const snapshots = await getTaskSnapshots(projectId);
    return NextResponse.json(snapshots);
  } catch (error) {
    return toErrorResponse(error);
  }
}
