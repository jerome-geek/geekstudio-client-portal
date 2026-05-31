import { queryOptions } from '@tanstack/react-query';
import { getActiveCompanyProjectByUserId } from '@/entities/company/api/company';

export function companyProjectMappingOptions(userId: string) {
  return queryOptions({
    queryKey: ['company', 'dooray-project', userId],
    queryFn: () => getActiveCompanyProjectByUserId(userId)
  });
}
