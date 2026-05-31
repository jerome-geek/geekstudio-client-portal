import type { DoorayTaskBoardGroup } from '@/shared/models/task';
import { TaskCard } from '@/components/board/task-card';

export function KanbanBoard({ groups }: { groups: DoorayTaskBoardGroup[] }) {
  return (
    <section className="grid gap-3 xl:grid-cols-3">
      {groups.map((group) => (
        <div
          key={group.statusId}
          className="min-h-[720px] rounded-lg bg-[#ece9e9] p-4"
        >
          <div className="px-2 pb-2">
            <h2 className="text-[18px] font-bold text-[#7b7b7b]">
              <span
                className={
                  group.statusName === '접수'
                    ? 'text-[#27a745]'
                    : group.statusName === '진행중'
                      ? 'text-[#1e88ff]'
                      : 'text-[#8a8a8a]'
                }
              >
                {group.statusName}
              </span>{' '}
              <span className="font-semibold text-[#707070]">{group.tasks.length}</span>
            </h2>
          </div>
          <div className="space-y-3">
            {group.tasks.length ? (
              group.tasks.map((task) => <TaskCard key={task.id} task={task} />)
            ) : (
              <div className="rounded-md border border-dashed border-[#d4d4d4] bg-white p-4 text-sm text-[#777]">
                아직 업무가 없습니다.
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
