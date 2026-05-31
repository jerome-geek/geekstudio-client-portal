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

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieMutation[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }: CookieMutation) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Middleware/server components may not allow cookie mutation during reads.
          }
        }
      }
    }
  );
}
