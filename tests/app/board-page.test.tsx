import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KanbanBoard } from '@/components/board/kanban-board';

describe('KanbanBoard', () => {
  it('renders task columns from Dooray workflows', () => {
    render(
      <KanbanBoard
        groups={[
          { statusId: 'todo', statusName: '할 일', statusClass: 'registered', tasks: [] },
          { statusId: 'doing', statusName: '진행 중', statusClass: 'working', tasks: [] }
        ]}
        onMoveTask={vi.fn()}
      />
    );

    expect(screen.getByText('할 일')).toBeInTheDocument();
    expect(screen.getByText('진행 중')).toBeInTheDocument();
  });

  it('renders task cards inside their column', () => {
    render(
      <KanbanBoard
        groups={[
          {
            statusId: 'todo',
            statusName: '할 일',
            statusClass: 'registered',
            tasks: [
              {
                id: 'task-1',
                title: '메인 화면 문구 수정',
                taskNumber: '데모/1',
                priority: 'high'
              }
            ]
          }
        ]}
        onMoveTask={vi.fn()}
      />
    );

    expect(screen.getByText('메인 화면 문구 수정')).toBeInTheDocument();
    expect(screen.getByText('#데모/1')).toBeInTheDocument();
  });
});
