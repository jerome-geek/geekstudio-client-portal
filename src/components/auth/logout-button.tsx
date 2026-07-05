'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/shared/lib/supabase/browser';

const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export function LogoutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (!supabaseConfigured) {
    return null;
  }

  const handleLogout = async () => {
    setIsSigningOut(true);
    await createBrowserSupabaseClient().auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isSigningOut}
      className="rounded-lg px-3 py-2 text-sm font-medium text-[#6E6E73] transition-colors hover:bg-[#F5F5F7] hover:text-[#1D1D1F] disabled:opacity-50"
    >
      {isSigningOut ? '로그아웃 중…' : '로그아웃'}
    </button>
  );
}
