import type { CompanyProjectMapping } from '@/shared/models/company';

export async function resolveCompanyDoorayProject({
  userId,
  getProject
}: {
  userId: string;
  getProject: (userId: string) => Promise<CompanyProjectMapping>;
}) {
  const project = await getProject(userId);

  if (!project?.doorayProjectId) {
    throw new Error('No Dooray project mapping found');
  }

  return project;
}
