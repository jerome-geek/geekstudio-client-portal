'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/shared/lib/supabase/browser';

const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectTo = searchParams.get('redirectTo') || '/board';
  const supabase = useMemo(
    () => (supabaseConfigured ? createBrowserSupabaseClient() : null),
    []
  );

  if (!supabaseConfigured) {
    return (
      <div className="mt-6 space-y-4">
        <p className="rounded-xl bg-[#F5F5F7] px-4 py-3 text-sm leading-relaxed text-[#6E6E73]">
          Supabase 환경변수가 없어 로컬 개발 모드로 동작 중입니다. 로그인 없이 보드로
          진입할 수 있습니다.
        </p>
        <button
          type="button"
          onClick={() => router.push(redirectTo)}
          className="h-11 rounded-lg bg-[#0071E3] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0077ED]"
        >
          보드로 이동
        </button>
      </div>
    );
  }

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    const { error } = await supabase!.auth.signInWithPassword({ email, password });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(
        error.message === 'Invalid login credentials'
          ? '이메일 또는 비밀번호가 올바르지 않습니다.'
          : error.message
      );
      return;
    }

    router.push(redirectTo);
    router.refresh();
  };

  return (
    <form className="mt-6 space-y-4" onSubmit={handleLogin}>
      <label className="block text-[15px] font-semibold text-[#1D1D1F]">
        이메일
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="name@client.com"
          autoComplete="email"
          className="mt-2 w-full rounded-[10px] border border-black/[0.08] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0071E3]/30"
          required
        />
      </label>
      <label className="block text-[15px] font-semibold text-[#1D1D1F]">
        비밀번호
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          className="mt-2 w-full rounded-[10px] border border-black/[0.08] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0071E3]/30"
          required
        />
      </label>
      {errorMessage ? <p className="text-[13px] text-[#FF3B30]">{errorMessage}</p> : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="h-11 w-full rounded-lg bg-[#0071E3] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0077ED] disabled:opacity-50"
      >
        {isSubmitting ? '로그인 중…' : '로그인'}
      </button>
      <p className="text-[13px] text-[#6E6E73]">
        계정은 관리자가 생성합니다. 로그인에 문제가 있으면 담당자에게 문의해 주세요.
      </p>
    </form>
  );
}
