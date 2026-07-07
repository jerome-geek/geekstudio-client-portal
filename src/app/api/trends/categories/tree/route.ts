import { NextResponse } from 'next/server';
import { fetchCategoryChildren } from '@/entities/trend/api/category-tree';
import { toErrorResponse } from '@/shared/lib/api-error';
import { requireTrendAccess } from '@/shared/lib/trend-auth';

export async function GET(request: Request) {
  try {
    await requireTrendAccess();
    const cid = new URL(request.url).searchParams.get('cid') ?? '0';
    const nodes = await fetchCategoryChildren(cid);
    return NextResponse.json(nodes);
  } catch (error) {
    return toErrorResponse(error);
  }
}
