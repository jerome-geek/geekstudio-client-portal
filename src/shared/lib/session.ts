import 'server-only';

import { cache } from 'react';
import { createServerSupabaseClient } from '@/shared/lib/supabase/server';
import { isSupabaseConfigured } from '@/shared/lib/supabase/config';
import { getActiveCompanyProjectByUserId } from '@/entities/company/api/company';

/** 요청 단위로 캐시되는 세션 사용자. Supabase 미설정(Phase 1 로컬)이면 null. */
export const getSessionUser = cache(async () => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
});

/** 요청 단위로 캐시되는 고객사-프로젝트 매핑. */
export const getCompanyMapping = cache(async () => {
  const user = await getSessionUser();

  if (!user) {
    return null;
  }

  return getActiveCompanyProjectByUserId(user.id);
});
