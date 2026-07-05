import { describe, expect, it, vi } from 'vitest';

const updateTaskStatus = vi.fn();

vi.mock('@/entities/task/api/status', () => ({
  updateTaskStatus
}));

vi.mock('@/shared/lib/project', () => ({
  resolveProjectId: vi.fn().mockResolvedValue('project-1')
}));

vi.mock('@/shared/lib/mock-dooray', () => ({
  isMockDoorayMode: () => false,
  updateMockTaskStatus: vi.fn()
}));

describe('PUT /api/tasks/[taskId]/status', () => {
  it('resolves the project server-side and calls set-workflow', async () => {
    updateTaskStatus.mockResolvedValue({
      id: 'task-1',
      status: { id: 'wf-done', name: '완료' }
    });

    const { PUT } = await import('@/app/api/tasks/[taskId]/status/route');
    const request = new Request('http://localhost/api/tasks/task-1/status', {
      method: 'PUT',
      body: JSON.stringify({ workflowId: 'wf-done' }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const response = await PUT(request, {
      params: Promise.resolve({ taskId: 'task-1' })
    });

    expect(updateTaskStatus).toHaveBeenCalledWith('project-1', 'task-1', 'wf-done');
    expect(await response.json()).toEqual({
      id: 'task-1',
      status: { id: 'wf-done', name: '완료' }
    });
  });

  it('rejects a request without workflowId', async () => {
    const { PUT } = await import('@/app/api/tasks/[taskId]/status/route');
    const request = new Request('http://localhost/api/tasks/task-1/status', {
      method: 'PUT',
      body: JSON.stringify({}),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const response = await PUT(request, {
      params: Promise.resolve({ taskId: 'task-1' })
    });

    expect(response.status).toBe(400);
  });
});
