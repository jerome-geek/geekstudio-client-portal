import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

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

export async function middleware(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({
      request
    });
  }

  const response = NextResponse.next({
    request
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieMutation[]) {
          cookiesToSet.forEach(({ name, value, options }: CookieMutation) => {
            response.cookies.set(name, value, options);
          });
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const { count, error } = await supabase
    .from('company_members')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (error || !count) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/board/:path*', '/tasks/:path*']
};
