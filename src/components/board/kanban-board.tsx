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
import { useEffect, useRef } from 'react';
import type { DoorayTaskBoardGroup, DoorayTaskStatus } from '@/shared/models/task';
import { TaskCard } from '@/components/board/task-card';

function DraggableCard({ task }: { task: DoorayTaskBoardGroup['tasks'][number] }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id
  });

  // 드래그 후 mouseup 시 카드 내부 Link의 click이 발화해 상세로 이동하는 것 방지
  const wasDragged = useRef(false);
  useEffect(() => {
    if (isDragging) {
      wasDragged.current = true;
    }
  }, [isDragging]);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClickCapture={(event) => {
        if (wasDragged.current) {
          event.preventDefault();
          event.stopPropagation();
          wasDragged.current = false;
        }
      }}
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

  // TailAdmin-style subtle colors for columns based on status class
  const statusThemes = {
    registered: {
      text: 'text-[#D08770]',
      bg: 'bg-[#FAF6F0]',
      border: 'border-[#EBCB8B]/40',
      badge: 'bg-[#D08770]/10 text-[#D08770]'
    },
    working: {
      text: 'text-[#3C50E0]',
      bg: 'bg-[#F3F5FF]',
      border: 'border-[#3C50E0]/20',
      badge: 'bg-[#3C50E0]/10 text-[#3C50E0]'
    },
    closed: {
      text: 'text-[#10B981]',
      bg: 'bg-[#EBFDF5]',
      border: 'border-[#10B981]/20',
      badge: 'bg-[#10B981]/10 text-[#10B981]'
    }
  };

  const currentTheme = statusThemes[group.statusClass as keyof typeof statusThemes] || {
    text: 'text-gray-700',
    bg: 'bg-[#F9FBFD]',
    border: 'border-gray-200',
    badge: 'bg-gray-100 text-gray-600'
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[650px] w-[310px] shrink-0 flex-col rounded-lg border bg-[#F8FAFC] p-4 transition-colors ${
        isOver ? 'bg-slate-100 border-[#3C50E0]' : 'border-gray-200/60'
      }`}
    >
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${
            group.statusClass === 'registered' ? 'bg-[#D08770]' :
            group.statusClass === 'working' ? 'bg-[#3C50E0]' :
            group.statusClass === 'closed' ? 'bg-[#10B981]' : 'bg-gray-400'
          }`} />
          <h2 className="text-sm font-bold text-[#1C2434]">{group.statusName}</h2>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${currentTheme.badge}`}>
          {group.tasks.length}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3">
        {group.tasks.length ? (
          group.tasks.map((task) => <DraggableCard key={task.id} task={task} />)
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-gray-200 bg-white p-6 text-center text-xs text-gray-400">
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
      <section className="flex gap-5 overflow-x-auto pb-4">
        {groups.map((group) => (
          <BoardColumn key={group.statusId} group={group} />
        ))}
      </section>
    </DndContext>
  );
}
