export type CompanyStatus = 'active' | 'inactive';
export type CompanyMemberRole = 'admin' | 'member';

export interface Company {
  id: string;
  name: string;
  status: CompanyStatus;
  createdAt: string;
}

export interface CompanyMember {
  id: string;
  companyId: string;
  userId: string;
  role: CompanyMemberRole;
  createdAt: string;
}

export interface CompanyProjectMapping {
  companyId: string;
  doorayProjectId: string;
  doorayProjectName?: string;
  active?: boolean;
}
