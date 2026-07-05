import { NextResponse } from 'next/server';
import { toErrorResponse } from '@/shared/lib/api-error';
import { getCompanyMapping, getSessionUser } from '@/shared/lib/session';
import { isSupabaseConfigured } from '@/shared/lib/supabase/config';

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        authenticated: false,
        name: null,
        email: null,
        companyName: null
      });
    }

    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
    }

    const mapping = await getCompanyMapping();

    return NextResponse.json({
      authenticated: true,
      name: (user.user_metadata?.name as string | undefined) ?? null,
      email: user.email ?? null,
      companyName: mapping?.companyName ?? null
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
