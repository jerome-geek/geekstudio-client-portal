import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KanbanBoard } from '@/components/board/kanban-board';

describe('KanbanBoard', () => {
  it('renders task columns from Dooray statuses', () => {
    render(
      <KanbanBoard
        groups={[
          { statusId: 'todo', statusName: '접수', tasks: [] },
          { statusId: 'doing', statusName: '진행중', tasks: [] }
        ]}
      />
    );

    expect(screen.getByText('접수')).toBeInTheDocument();
    expect(screen.getByText('진행중')).toBeInTheDocument();
  });
});
