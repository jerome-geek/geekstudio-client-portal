import { describe, expect, it, vi } from 'vitest';

const updateTaskStatus = vi.fn();

vi.mock('@/entities/task/api/status', () => ({
  updateTaskStatus
}));

describe('PATCH /api/tasks/[taskId]/status', () => {
  it('updates the task status and returns the payload', async () => {
    updateTaskStatus.mockResolvedValue({
      id: 'task-1',
      statusId: 'done'
    });

    const { PATCH } = await import('@/app/api/tasks/[taskId]/status/route');
    const request = new Request('http://localhost/api/tasks/task-1/status', {
      method: 'PATCH',
      body: JSON.stringify({ statusId: 'done' }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const response = await PATCH(request, {
      params: Promise.resolve({ taskId: 'task-1' })
    });

    expect(updateTaskStatus).toHaveBeenCalledWith('task-1', 'done');
    expect(await response.json()).toEqual({
      id: 'task-1',
      statusId: 'done'
    });
  });
});
