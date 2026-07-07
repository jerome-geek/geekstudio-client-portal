'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { CategoryTree } from '@/components/trends/category-tree';
import { categoriesOptions, trendKeys } from '@/entities/trend/queries';
import { requestJson } from '@/shared/lib/fetcher';
import type { CategoryTreeNode } from '@/entities/trend/api/category-tree';
import type { TrendCategory } from '@/shared/models/trend';

export default function TrendSettingsPage() {
  const queryClient = useQueryClient();
  const { data: categories = [] } = useQuery(categoriesOptions());
  const [pending, setPending] = useState<CategoryTreeNode | null>(null);
  const [repKeyword, setRepKeyword] = useState('');

  const activeIds = useMemo(
    () => new Set(categories.map((category) => category.categoryId)),
    [categories]
  );

  const addMutation = useMutation({
    mutationFn: (payload: { node: CategoryTreeNode; repKeyword: string }) =>
      requestJson<TrendCategory>('/api/trends/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: payload.node.cid,
          categoryName: payload.node.name,
          fullPath: payload.node.fullPath,
          parentCategoryId: payload.node.parentId,
          repKeyword: payload.repKeyword
        })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trendKeys.categories() });
      setPending(null);
      setRepKeyword('');
    }
  });

  const removeMutation = useMutation({
    mutationFn: (categoryId: string) =>
      requestJson('/api/trends/categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId, active: false })
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: trendKeys.categories() })
  });

  return (
    <AppShell title="수집 카테고리 관리">
      <div className="space-y-6">
        <Link
          href="/trends"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#3C50E0]"
        >
          <ArrowLeft className="h-4 w-4" /> 트렌드 대시보드로
        </Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* 트리 탐색 */}
          <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-[#1C2434]">카테고리 트리</h2>
            <p className="mb-3 text-sm text-[#8A99AD]">
              네이버 쇼핑 카테고리를 펼쳐 수집 대상을 추가하세요.
            </p>
            <CategoryTree activeIds={activeIds} onPick={setPending} />
          </section>

          {/* 활성 목록 */}
          <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-[#1C2434]">
              수집 중인 카테고리 <span className="text-[#8A99AD]">{categories.length}</span>
            </h2>
            {categories.length ? (
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li
                    key={category.categoryId}
                    className="flex items-center justify-between rounded-lg border border-[#E2E8F0] p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[#1C2434]">
                        {category.fullPath ?? category.categoryName}
                      </p>
                      <p className="text-xs text-[#8A99AD]">
                        대표 키워드: {category.repKeyword ?? '미지정'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMutation.mutate(category.categoryId)}
                      className="shrink-0 rounded px-2 py-1 text-xs font-medium text-[#E11D48] hover:bg-[#FFEBEB]"
                    >
                      해제
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-8 text-center text-sm text-[#8A99AD]">
                아직 등록된 카테고리가 없습니다.
              </p>
            )}
          </section>
        </div>
      </div>

      {/* 대표 키워드 입력 모달 */}
      {pending ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-[#1C2434]">{pending.name} 추가</h3>
            <p className="mt-1 text-sm text-[#8A99AD]">{pending.fullPath}</p>
            <label className="mt-4 block text-sm font-semibold text-[#1C2434]">
              대표 키워드 (보정 기준)
              <input
                value={repKeyword}
                onChange={(event) => setRepKeyword(event.target.value)}
                placeholder="예: 실내수영복"
                className="mt-2 w-full rounded-lg border border-[#E2E8F0] px-4 py-2.5 text-sm outline-none focus:border-[#3C50E0]"
                autoFocus
              />
            </label>
            {addMutation.isError ? (
              <p className="mt-2 text-xs text-[#E11D48]">
                {addMutation.error instanceof Error ? addMutation.error.message : '저장 실패'}
              </p>
            ) : null}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setPending(null);
                  setRepKeyword('');
                }}
                className="rounded-lg px-4 py-2 text-sm font-medium text-[#64748B] hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="button"
                disabled={!repKeyword.trim() || addMutation.isPending}
                onClick={() => addMutation.mutate({ node: pending, repKeyword: repKeyword.trim() })}
                className="rounded-lg bg-[#3C50E0] px-4 py-2 text-sm font-semibold text-white hover:bg-opacity-90 disabled:opacity-50"
              >
                {addMutation.isPending ? '저장 중…' : '추가'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
