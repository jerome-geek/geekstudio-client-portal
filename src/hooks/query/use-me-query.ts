'use client';

import { useQuery } from '@tanstack/react-query';
import { requestJson } from '@/shared/lib/fetcher';

export interface MeResponse {
  authenticated: boolean;
  name: string | null;
  email: string | null;
  companyName: string | null;
}

export function useMeQuery() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => requestJson<MeResponse>('/api/me'),
    staleTime: 5 * 60 * 1000,
    retry: false
  });
}
