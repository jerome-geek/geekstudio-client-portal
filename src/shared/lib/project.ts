import 'server-only';

import { HttpError } from '@/shared/lib/api-error';
import { isSupabaseConfigured } from '@/shared/lib/supabase/config';
import { getCompanyMapping, getSessionUser } from '@/shared/lib/session';

/**
 * 현재 요청이 사용할 Dooray 프로젝트 ID를 서버에서 결정한다.
 * 클라이언트가 보낸 프로젝트 ID는 절대 신뢰하지 않는다.
 *
 * - Supabase 설정 시(Phase 2): 세션 사용자 → company_members → company_dooray_projects
 * - Supabase 미설정 시(Phase 1 로컬): env(DOORAY_PROJECT_ID) 고정
 */
export async function resolveProjectId(): Promise<string> {
  if (isSupabaseConfigured()) {
    const user = await getSessionUser();

    if (!user) {
      throw new HttpError(401, '로그인이 필요합니다.');
    }

    const mapping = await getCompanyMapping();

    if (!mapping) {
      throw new HttpError(403, '고객사 매핑이 없는 계정입니다. 관리자에게 문의해 주세요.');
    }

    return mapping.doorayProjectId;
  }

  const projectId = process.env.DOORAY_PROJECT_ID;

  if (!projectId) {
    throw new Error('DOORAY_PROJECT_ID is not configured');
  }

  return projectId;
}
