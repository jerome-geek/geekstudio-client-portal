import { queryOptions } from '@tanstack/react-query';
import { requestJson } from '@/shared/lib/fetcher';
import type {
  BestProductsResult,
  SpikeCategory,
  TrendCategory,
  TrendPoint
} from '@/shared/models/trend';

export const trendKeys = {
  all: ['trends'] as const,
  spikes: () => [...trendKeys.all, 'spikes'] as const,
  series: (categoryId: string, days: number) =>
    [...trendKeys.all, 'series', categoryId, days] as const,
  products: (categoryId: string) => [...trendKeys.all, 'products', categoryId] as const,
  categories: () => [...trendKeys.all, 'categories'] as const
};

export function spikesOptions() {
  return queryOptions({
    queryKey: trendKeys.spikes(),
    queryFn: () => requestJson<SpikeCategory[]>('/api/trends/spikes')
  });
}

export function seriesOptions(categoryId: string, days: number) {
  return queryOptions({
    queryKey: trendKeys.series(categoryId, days),
    queryFn: () => requestJson<TrendPoint[]>(`/api/trends/${categoryId}/series?days=${days}`),
    enabled: Boolean(categoryId)
  });
}

export function productsOptions(categoryId: string) {
  return queryOptions({
    queryKey: trendKeys.products(categoryId),
    queryFn: () => requestJson<BestProductsResult>(`/api/trends/${categoryId}/products`),
    enabled: Boolean(categoryId)
  });
}

export function categoriesOptions() {
  return queryOptions({
    queryKey: trendKeys.categories(),
    queryFn: () => requestJson<TrendCategory[]>('/api/trends/categories')
  });
}
