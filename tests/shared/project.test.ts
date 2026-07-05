import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { getSessionUser, getCompanyMapping } = vi.hoisted(() => ({
  getSessionUser: vi.fn(),
  getCompanyMapping: vi.fn()
}));

vi.mock('@/shared/lib/session', () => ({
  getSessionUser,
  getCompanyMapping
}));

import { resolveProjectId } from '@/shared/lib/project';
import { resolveAuthorLabel } from '@/shared/lib/author';
import { HttpError } from '@/shared/lib/api-error';

beforeEach(() => {
  getSessionUser.mockReset();
  getCompanyMapping.mockReset();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('resolveProjectId (Phase 1: Supabase 미설정)', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '');
  });

  it('env 프로젝트 ID를 반환한다', async () => {
    vi.stubEnv('DOORAY_PROJECT_ID', 'project-42');
    await expect(resolveProjectId()).resolves.toBe('project-42');
  });

  it('env 미설정이면 오류', async () => {
    vi.stubEnv('DOORAY_PROJECT_ID', '');
    await expect(resolveProjectId()).rejects.toThrow('DOORAY_PROJECT_ID');
  });
});

describe('resolveProjectId (Phase 2: Supabase 설정)', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'anon-key');
    vi.stubEnv('DOORAY_PROJECT_ID', 'env-project-should-not-be-used');
  });

  it('미인증 사용자는 401', async () => {
    getSessionUser.mockResolvedValue(null);
    await expect(resolveProjectId()).rejects.toMatchObject({ status: 401 });
    await expect(resolveProjectId()).rejects.toBeInstanceOf(HttpError);
  });

  it('고객사 매핑 없는 계정은 403', async () => {
    getSessionUser.mockResolvedValue({ id: 'user-1' });
    getCompanyMapping.mockResolvedValue(null);
    await expect(resolveProjectId()).rejects.toMatchObject({ status: 403 });
  });

  it('매핑된 사용자는 자기 고객사 프로젝트 ID를 받는다 (env 무시)', async () => {
    getSessionUser.mockResolvedValue({ id: 'user-1' });
    getCompanyMapping.mockResolvedValue({
      companyId: 'company-1',
      doorayProjectId: 'mapped-project-7'
    });
    await expect(resolveProjectId()).resolves.toBe('mapped-project-7');
  });
});

describe('resolveAuthorLabel', () => {
  it('Supabase 미설정이면 env 라벨', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', '');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', '');
    vi.stubEnv('PORTAL_AUTHOR_LABEL', '고객포털');
    await expect(resolveAuthorLabel()).resolves.toBe('고객포털');
  });

  it('로그인 사용자는 "이름 @ 고객사" 형식', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'anon-key');
    getSessionUser.mockResolvedValue({
      id: 'user-1',
      email: 'hong@acme.com',
      user_metadata: { name: '홍길동' }
    });
    getCompanyMapping.mockResolvedValue({
      companyId: 'company-1',
      companyName: 'ACME',
      doorayProjectId: 'p-1'
    });
    await expect(resolveAuthorLabel()).resolves.toBe('홍길동 @ ACME');
  });
});
