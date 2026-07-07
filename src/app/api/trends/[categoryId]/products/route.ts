import { NextResponse } from 'next/server';
import { getBestProducts } from '@/entities/trend/api/trend-repo';
import { toErrorResponse } from '@/shared/lib/api-error';
import { requireTrendAccess } from '@/shared/lib/trend-auth';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    await requireTrendAccess();
    const { categoryId } = await params;
    return NextResponse.json(await getBestProducts(categoryId));
  } catch (error) {
    return toErrorResponse(error);
  }
}
