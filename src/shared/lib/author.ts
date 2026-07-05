import 'server-only';

import { isSupabaseConfigured } from '@/shared/lib/supabase/config';
import { getCompanyMapping, getSessionUser } from '@/shared/lib/session';

/**
 * 포털 경유 작성물(업무 본문·댓글)에 붙는 작성자 라벨.
 * Dooray 개인 API 토큰은 발급 계정 명의로만 기록되므로,
 * 실제 요청자를 구분하기 위해 서버가 본문 앞에 접두어를 삽입한다.
 *
 * - Supabase 설정 시(Phase 2): "사용자명 @ 고객사명"
 * - Supabase 미설정 시(Phase 1 로컬): env(PORTAL_AUTHOR_LABEL) 고정 라벨
 */
export async function resolveAuthorLabel(): Promise<string> {
  if (isSupabaseConfigured()) {
    const user = await getSessionUser();

    if (user) {
      const mapping = await getCompanyMapping();
      const name =
        (user.user_metadata?.name as string | undefined) ?? user.email ?? '고객';

      return mapping?.companyName ? `${name} @ ${mapping.companyName}` : name;
    }
  }

  return process.env.PORTAL_AUTHOR_LABEL || '고객포털';
}

export function prefixAuthor(label: string, content: string): string {
  return `[${label}] ${content}`;
}
