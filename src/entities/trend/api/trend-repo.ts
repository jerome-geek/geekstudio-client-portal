import 'server-only';

import { createServerSupabaseClient } from '@/shared/lib/supabase/server';
import { isSupabaseConfigured } from '@/shared/lib/supabase/config';
import { computeSpike } from '@/shared/lib/spike';
import type {
  BestProductsResult,
  SpikeCategory,
  TrendCategory,
  TrendPoint
} from '@/shared/models/trend';
import {
  MOCK_CATEGORIES,
  mockProducts,
  mockSeries,
  mockSpikes
} from '@/entities/trend/api/mock-trend';

// Supabase 미설정이거나 트렌드 테이블 미적용이면 목 데이터로 폴백한다.
// PostgREST는 테이블 부재 시 PGRST205(관계 없음)를 반환한다.
function isMissingTable(error: { code?: string } | null): boolean {
  return error?.code === 'PGRST205' || error?.code === '42P01';
}

export async function listActiveCategories(): Promise<TrendCategory[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_CATEGORIES;
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('trend_categories')
    .select('category_id, category_name, parent_category_id, full_path, rep_keyword, active')
    .eq('active', true)
    .order('category_name');

  if (error) {
    if (isMissingTable(error)) {
      return MOCK_CATEGORIES;
    }
    throw new Error(error.message);
  }

  return (data ?? []).map(mapCategory);
}

export async function getSeries(categoryId: string, days: number): Promise<TrendPoint[]> {
  if (!isSupabaseConfigured()) {
    return mockSeries(categoryId, days);
  }

  const since = new Date();
  since.setDate(since.getDate() - days);

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('trend_category_daily')
    .select('date, raw_ratio, calibrated_score')
    .eq('category_id', categoryId)
    .gte('date', since.toISOString().slice(0, 10))
    .order('date');

  if (error) {
    if (isMissingTable(error)) {
      return mockSeries(categoryId, days);
    }
    throw new Error(error.message);
  }

  if (!data?.length) {
    return [];
  }

  return data.map((row) => ({
    date: row.date as string,
    rawRatio: Number(row.raw_ratio),
    calibratedScore: Number(row.calibrated_score)
  }));
}

export async function getSpikes(): Promise<SpikeCategory[]> {
  if (!isSupabaseConfigured()) {
    return mockSpikes();
  }

  const categories = await listActiveCategories();
  if (!categories.length) {
    return mockSpikes();
  }

  const spikes = await Promise.all(
    categories.map(async (category) => {
      const series = await getSeries(category.categoryId, 10);
      return computeSpike(
        {
          categoryId: category.categoryId,
          categoryName: category.categoryName,
          fullPath: category.fullPath
        },
        series
      );
    })
  );

  const valid = spikes.filter((spike): spike is SpikeCategory => spike !== null);
  if (!valid.length) {
    return mockSpikes();
  }

  return valid.sort((a, b) => b.spikeRate - a.spikeRate);
}

export async function getBestProducts(categoryId: string): Promise<BestProductsResult> {
  if (!isSupabaseConfigured()) {
    return mockProducts(categoryId);
  }

  const supabase = await createServerSupabaseClient();

  const { data: latest, error: latestError } = await supabase
    .from('trend_best_products')
    .select('date')
    .eq('category_id', categoryId)
    .order('date', { ascending: false })
    .limit(1)
    .maybeSingle<{ date: string }>();

  if (latestError) {
    if (isMissingTable(latestError)) {
      return mockProducts(categoryId);
    }
    throw new Error(latestError.message);
  }

  if (!latest?.date) {
    return { date: null, isStale: false, products: [] };
  }

  const { data, error } = await supabase
    .from('trend_best_products')
    .select('rank, product_name, price, product_url, image_url, store_name')
    .eq('category_id', categoryId)
    .eq('date', latest.date)
    .order('rank')
    .limit(10);

  if (error) {
    throw new Error(error.message);
  }

  const today = new Date().toISOString().slice(0, 10);
  return {
    date: latest.date,
    isStale: latest.date !== today,
    products: (data ?? []).map((row) => ({
      rank: row.rank as number,
      productName: row.product_name as string,
      price: row.price as number | null,
      productUrl: row.product_url as string,
      imageUrl: row.image_url as string | null,
      storeName: row.store_name as string | null
    }))
  };
}

interface CategoryRow {
  category_id: string;
  category_name: string;
  parent_category_id: string | null;
  full_path: string | null;
  rep_keyword: string | null;
  active: boolean;
}

function mapCategory(row: CategoryRow): TrendCategory {
  return {
    categoryId: row.category_id,
    categoryName: row.category_name,
    parentCategoryId: row.parent_category_id,
    fullPath: row.full_path,
    repKeyword: row.rep_keyword,
    active: row.active
  };
}
