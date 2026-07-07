import { doorayRequest } from '@/shared/lib/dooray';
import { listTasks } from '@/entities/task/api/tasks';
import type { TaskSnapshot } from '@/shared/lib/notifications';

/**
 * 알림 diff 계산용 스냅샷: 업무 목록 + 업무별 댓글 수.
 * 댓글 수는 logs 목록을 size=1로 호출해 totalCount만 사용한다.
 */
export async function getTaskSnapshots(projectId: string): Promise<TaskSnapshot[]> {
  const tasks = await listTasks(projectId);

  const counts = await Promise.all(
    tasks.map(async (task) => {
      try {
        const { totalCount } = await doorayRequest<unknown[]>(
          `/project/v1/projects/${projectId}/posts/${task.id}/logs?page=0&size=1`
        );
        return totalCount ?? 0;
      } catch {
        return 0;
      }
    })
  );

  return tasks.map((task, index) => ({
    id: task.id,
    title: task.title,
    taskNumber: task.taskNumber,
    statusId: task.status?.id,
    statusName: task.status?.name,
    commentCount: counts[index]
  }));
}
