import { NextResponse } from 'next/server';
import { DoorayApiError } from '@/shared/lib/dooray';

export function toErrorResponse(error: unknown) {
  if (error instanceof DoorayApiError) {
    return NextResponse.json({ message: error.message }, { status: error.status });
  }

  const message = error instanceof Error ? error.message : 'Unexpected server error';
  return NextResponse.json({ message }, { status: 500 });
}
