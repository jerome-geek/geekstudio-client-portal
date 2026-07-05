import { afterEach, describe, expect, it, vi } from 'vitest';
import { resolveProjectId } from '@/shared/lib/project';

describe('resolveProjectId', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns the configured Phase 1 project id', async () => {
    vi.stubEnv('DOORAY_PROJECT_ID', 'project-42');
    await expect(resolveProjectId()).resolves.toBe('project-42');
  });

  it('throws when the project id is not configured', async () => {
    vi.stubEnv('DOORAY_PROJECT_ID', '');
    await expect(resolveProjectId()).rejects.toThrow('DOORAY_PROJECT_ID');
  });
});
