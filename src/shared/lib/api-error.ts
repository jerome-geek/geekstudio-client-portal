import { NextResponse } from 'next/server';
import { DoorayApiError } from '@/shared/lib/dooray';

/** 라우트에서 그대로 HTTP 상태로 변환되는 오류 (401/403/404 등) */
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export function toErrorResponse(error: unknown) {
  if (error instanceof HttpError) {
    return NextResponse.json({ message: error.message }, { status: error.status });
  }

  if (error instanceof DoorayApiError) {
    return NextResponse.json({ message: error.message }, { status: error.status });
  }

  const message = error instanceof Error ? error.message : 'Unexpected server error';
  return NextResponse.json({ message }, { status: 500 });
}
