import type { CompanyProjectMapping } from '@/shared/models/company';
import { createServerSupabaseClient } from '@/shared/lib/supabase/server';

type CompanyProjectQueryRow = {
  company_id: string;
  companies: { name: string } | null;
};

type DoorayProjectRow = {
  dooray_project_id: string;
  dooray_project_name: string;
  active: boolean;
};

/**
 * 로그인 사용자의 활성 Dooray 프로젝트 매핑을 조회한다.
 * 매핑이 없으면 null — 차단 흐름(/unauthorized, 403)은 호출부에서 처리.
 * 세션 기반 클라이언트를 사용하므로 RLS가 이중 방어선으로 동작한다.
 */
export async function getActiveCompanyProjectByUserId(
  userId: string
): Promise<(CompanyProjectMapping & { companyName?: string }) | null> {
  const supabase = await createServerSupabaseClient();

  const { data: membership, error: membershipError } = await supabase
    .from('company_members')
    .select('company_id, companies(name)')
    .eq('user_id', userId)
    .maybeSingle<CompanyProjectQueryRow>();

  if (membershipError || !membership) {
    return null;
  }

  const { data: project, error: projectError } = await supabase
    .from('company_dooray_projects')
    .select('dooray_project_id, dooray_project_name, active')
    .eq('company_id', membership.company_id)
    .eq('active', true)
    .maybeSingle<DoorayProjectRow>();

  if (projectError || !project?.dooray_project_id) {
    return null;
  }

  return {
    companyId: membership.company_id,
    companyName: membership.companies?.name,
    doorayProjectId: project.dooray_project_id,
    doorayProjectName: project.dooray_project_name,
    active: project.active
  };
}
