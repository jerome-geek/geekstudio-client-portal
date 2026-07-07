import 'server-only';

import { createServiceSupabaseClient } from '@/shared/lib/supabase/service';
import { isSupabaseConfigured } from '@/shared/lib/supabase/config';
import { HttpError } from '@/shared/lib/api-error';
import type { TrendCategory } from '@/shared/models/trend';

function ensureConfigured() {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new HttpError(
      503,
      'Supabase가 설정되지 않아 카테고리를 저장할 수 없습니다. 트렌드 스키마 적용 후 이용하세요.'
    );
  }
}

export async function upsertCategory(input: {
  categoryId: string;
  categoryName: string;
  fullPath?: string;
  parentCategoryId?: string;
  repKeyword?: string;
}): Promise<TrendCategory> {
  ensureConfigured();
  const supabase = createServiceSupabaseClient();

  const { data, error } = await supabase
    .from('trend_categories')
    .upsert(
      {
        category_id: input.categoryId,
        category_name: input.categoryName,
        full_path: input.fullPath ?? null,
        parent_category_id: input.parentCategoryId ?? null,
        rep_keyword: input.repKeyword ?? null,
        active: true
      },
      { onConflict: 'category_id' }
    )
    .select('category_id, category_name, parent_category_id, full_path, rep_keyword, active')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    categoryId: data.category_id,
    categoryName: data.category_name,
    parentCategoryId: data.parent_category_id,
    fullPath: data.full_path,
    repKeyword: data.rep_keyword,
    active: data.active
  };
}

export async function deactivateCategory(categoryId: string, active: boolean): Promise<void> {
  ensureConfigured();
  const supabase = createServiceSupabaseClient();

  const { error } = await supabase
    .from('trend_categories')
    .update({ active })
    .eq('category_id', categoryId);

  if (error) {
    throw new Error(error.message);
  }
}
