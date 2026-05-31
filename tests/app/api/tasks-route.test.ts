import { describe, expect, it, vi } from 'vitest';
import { resolveCompanyDoorayProject } from '@/shared/lib/auth';

describe('resolveCompanyDoorayProject', () => {
  it('returns the single active project for the signed-in user', async () => {
    const getProject = vi.fn().mockResolvedValue({
      companyId: 'company-1',
      doorayProjectId: 'project-123'
    });

    const result = await resolveCompanyDoorayProject({
      userId: 'user-1',
      getProject
    });

    expect(result.doorayProjectId).toBe('project-123');
    expect(getProject).toHaveBeenCalledWith('user-1');
  });
});
