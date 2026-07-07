import { NextResponse } from 'next/server';
import { getSpikes } from '@/entities/trend/api/trend-repo';
import { toErrorResponse } from '@/shared/lib/api-error';
import { requireTrendAccess } from '@/shared/lib/trend-auth';

export async function GET() {
  try {
    await requireTrendAccess();
    return NextResponse.json(await getSpikes());
  } catch (error) {
    return toErrorResponse(error);
  }
}
