import { NextResponse } from 'next/server';
import { getSeries } from '@/entities/trend/api/trend-repo';
import { toErrorResponse } from '@/shared/lib/api-error';
import { requireTrendAccess } from '@/shared/lib/trend-auth';

const ALLOWED_DAYS = new Set([7, 30, 90]);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    await requireTrendAccess();
    const { categoryId } = await params;
    const daysParam = Number(new URL(request.url).searchParams.get('days') ?? 30);
    const days = ALLOWED_DAYS.has(daysParam) ? daysParam : 30;
    return NextResponse.json(await getSeries(categoryId, days));
  } catch (error) {
    return toErrorResponse(error);
  }
}
