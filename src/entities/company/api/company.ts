import type { CompanyProjectMapping } from '@/shared/models/company';
import { createServerSupabaseClient } from '@/shared/lib/supabase/server';

type CompanyProjectQueryRow = {
  company_id: string;
};

type DoorayProjectRow = {
  dooray_project_id: string;
  dooray_project_name: string;
  active: boolean;
};

export async function getActiveCompanyProjectByUserId(
  userId: string
): Promise<CompanyProjectMapping> {
  const supabase = await createServerSupabaseClient();

  const { data: membership, error: membershipError } = await supabase
    .from('company_members')
    .select('company_id')
    .eq('user_id', userId)
    .single<CompanyProjectQueryRow>();

  if (membershipError || !membership) {
    throw new Error('Company project mapping lookup failed');
  }

  const { data: project, error: projectError } = await supabase
    .from('company_dooray_projects')
    .select('dooray_project_id, dooray_project_name, active')
    .eq('company_id', membership.company_id)
    .eq('active', true)
    .single<DoorayProjectRow>();

  if (projectError || !project?.dooray_project_id) {
    throw new Error('Company project mapping lookup failed');
  }

  return {
    companyId: membership.company_id,
    doorayProjectId: project.dooray_project_id,
    doorayProjectName: project.dooray_project_name,
    active: project.active
  };
}
