'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, ChevronDown, Plus } from 'lucide-react';
import { requestJson } from '@/shared/lib/fetcher';
import type { CategoryTreeNode } from '@/entities/trend/api/category-tree';

function useChildren(cid: string, enabled: boolean) {
  return useQuery({
    queryKey: ['trend-tree', cid],
    queryFn: () => requestJson<CategoryTreeNode[]>(`/api/trends/categories/tree?cid=${cid}`),
    enabled,
    staleTime: 60 * 60 * 1000
  });
}

function TreeNode({
  node,
  activeIds,
  onPick
}: {
  node: CategoryTreeNode;
  activeIds: Set<string>;
  onPick: (node: CategoryTreeNode) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const { data: children = [], isLoading } = useChildren(node.cid, expanded && !node.leaf);
  const isActive = activeIds.has(node.cid);

  return (
    <div>
      <div className="flex items-center gap-1 py-1">
        {node.leaf ? (
          <span className="w-5" />
        ) : (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex h-5 w-5 items-center justify-center text-gray-400 hover:text-gray-700"
          >
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        )}
        <span className="flex-1 text-sm text-[#1C2434]">{node.name}</span>
        <button
          type="button"
          onClick={() => onPick(node)}
          disabled={isActive}
          className={`flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${
            isActive
              ? 'bg-[#EBFDF5] text-[#10B981]'
              : 'text-[#3C50E0] hover:bg-[#F1F5F9]'
          }`}
        >
          {isActive ? '수집 중' : (<><Plus className="h-3 w-3" /> 추가</>)}
        </button>
      </div>
      {expanded ? (
        <div className="ml-5 border-l border-[#E2E8F0] pl-2">
          {isLoading ? (
            <p className="py-1 text-xs text-[#8A99AD]">불러오는 중…</p>
          ) : (
            children.map((child) => (
              <TreeNode key={child.cid} node={child} activeIds={activeIds} onPick={onPick} />
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}

export function CategoryTree({
  activeIds,
  onPick
}: {
  activeIds: Set<string>;
  onPick: (node: CategoryTreeNode) => void;
}) {
  const { data: roots = [], isLoading, error } = useChildren('0', true);

  if (isLoading) {
    return <p className="text-sm text-[#8A99AD]">카테고리 트리 불러오는 중…</p>;
  }
  if (error) {
    return (
      <p className="text-sm text-red-600">
        트리를 불러오지 못했습니다: {error instanceof Error ? error.message : '오류'}
      </p>
    );
  }

  return (
    <div className="max-h-[560px] overflow-y-auto pr-2">
      {roots.map((node) => (
        <TreeNode key={node.cid} node={node} activeIds={activeIds} onPick={onPick} />
      ))}
    </div>
  );
}
