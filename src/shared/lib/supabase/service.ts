import 'server-only';

import { createClient } from '@supabase/supabase-js';

/**
 * service role 키를 쓰는 관리자 클라이언트. RLS를 우회하므로
 * 서버의 신뢰된 쓰기 경로(카테고리 관리, 수집 적재)에서만 사용한다.
 */
export function createServiceSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    { auth: { persistSession: false } }
  );
}
