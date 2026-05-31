import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

type CookieMutation = {
  name: string;
  value: string;
  options?: {
    domain?: string;
    maxAge?: number;
    path?: string;
    sameSite?: boolean | 'lax' | 'strict' | 'none';
    secure?: boolean;
    httpOnly?: boolean;
  };
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const redirectTo = url.searchParams.get('redirectTo') || '/board';
  const cookieStore = await cookies();

  const response = NextResponse.redirect(new URL(redirectTo, request.url));

  if (!code) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieMutation[]) {
          cookiesToSet.forEach(({ name, value, options }: CookieMutation) => {
            response.cookies.set(name, value, options);
          });
        }
      }
    }
  );

  await supabase.auth.exchangeCodeForSession(code);
  return response;
}
