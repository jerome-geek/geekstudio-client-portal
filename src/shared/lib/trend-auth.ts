import 'server-only';

import { HttpError } from '@/shared/lib/api-error';
import { isSupabaseConfigured } from '@/shared/lib/supabase/config';
import { getSessionUser } from '@/shared/lib/session';

/**
 * 트렌드 기능 접근 가드. 트렌드는 전사 공용 데이터라 고객사 매핑은 불필요하고
 * 로그인 여부만 확인한다. Supabase 미설정(로컬)이면 통과.
 */
export async function requireTrendAccess(): Promise<void> {
  if (!isSupabaseConfigured()) {
    return;
  }

  const user = await getSessionUser();
  if (!user) {
    throw new HttpError(401, '로그인이 필요합니다.');
  }
}
