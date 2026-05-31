import type { DoorayTaskBoardGroup } from '@/shared/models/task';
import { TaskCard } from '@/components/board/task-card';

export function KanbanBoard({ groups }: { groups: DoorayTaskBoardGroup[] }) {
  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {groups.map((group) => (
        <div
          key={group.statusId}
          className="rounded-[1.75rem] border border-black/10 bg-[#fffdf9] p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">{group.statusName}</h2>
            <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-black/60">
              {group.tasks.length}
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {group.tasks.length ? (
              group.tasks.map((task) => <TaskCard key={task.id} task={task} />)
            ) : (
              <div className="rounded-2xl border border-dashed border-black/10 p-4 text-sm text-black/45">
                아직 업무가 없습니다.
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
