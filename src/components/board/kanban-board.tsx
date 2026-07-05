'use client';

import {
  DndContext,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core';
import type { DoorayTaskBoardGroup, DoorayTaskStatus } from '@/shared/models/task';
import { TaskCard } from '@/components/board/task-card';

function DraggableCard({ task }: { task: DoorayTaskBoardGroup['tasks'][number] }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={isDragging ? 'scale-[1.02] opacity-90 shadow-lg' : undefined}
      style={
        transform
          ? { transform: `translate(${transform.x}px, ${transform.y}px)`, zIndex: 10, position: 'relative' }
          : undefined
      }
    >
      <TaskCard task={task} />
    </div>
  );
}

function BoardColumn({ group }: { group: DoorayTaskBoardGroup }) {
  const { setNodeRef, isOver } = useDroppable({ id: group.statusId });

  const classColor =
    group.statusClass === 'registered'
      ? 'text-[#34C759]'
      : group.statusClass === 'working'
        ? 'text-[#0071E3]'
        : group.statusClass === 'closed'
          ? 'text-[#6E6E73]'
          : 'text-[#1D1D1F]';

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[600px] w-72 shrink-0 flex-col rounded-xl bg-[#ECECEE] p-3 transition-colors ${
        isOver ? 'bg-[#E2E2E6]' : ''
      }`}
    >
      <div className="flex items-center gap-2 px-1 pb-3">
        <h2 className={`text-[15px] font-semibold ${classColor}`}>{group.statusName}</h2>
        <span className="rounded-full bg-black/[0.06] px-2 py-0.5 text-xs font-medium text-[#6E6E73]">
          {group.tasks.length}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        {group.tasks.length ? (
          group.tasks.map((task) => <DraggableCard key={task.id} task={task} />)
        ) : (
          <div className="rounded-xl border border-dashed border-black/10 p-4 text-center text-[13px] text-[#6E6E73]">
            업무 없음
          </div>
        )}
      </div>
    </div>
  );
}

export function KanbanBoard({
  groups,
  onMoveTask
}: {
  groups: DoorayTaskBoardGroup[];
  onMoveTask: (taskId: string, status: DoorayTaskStatus) => void;
}) {
  // 클릭(카드 링크 이동)과 드래그를 구분: 8px 이상 움직여야 드래그 시작
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      return;
    }

    const target = groups.find((group) => group.statusId === String(over.id));
    const source = groups.find((group) =>
      group.tasks.some((task) => task.id === String(active.id))
    );

    if (!target || target.statusId === 'unassigned' || target.statusId === source?.statusId) {
      return;
    }

    onMoveTask(String(active.id), {
      id: target.statusId,
      name: target.statusName,
      class: target.statusClass
    });
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <section className="flex gap-3 overflow-x-auto pb-2">
        {groups.map((group) => (
          <BoardColumn key={group.statusId} group={group} />
        ))}
      </section>
    </DndContext>
  );
}
