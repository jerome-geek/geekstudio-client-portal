'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/shared/lib/supabase/browser';
import { isMockDoorayMode } from '@/shared/lib/mock-dooray';

export function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectTo = searchParams.get('redirectTo') || '/board';
  const isMockMode = isMockDoorayMode();
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);

  const handleMockEntry = () => {
    window.location.href = redirectTo;
  };

  const handleMagicLink = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const origin = window.location.origin;
    const callbackUrl = new URL('/api/auth/callback', origin);
    callbackUrl.searchParams.set('redirectTo', redirectTo);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: callbackUrl.toString()
      }
    });

    setIsSubmitting(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage('로그인 링크를 이메일로 전송했습니다. 메일함을 확인해 주세요.');
  };

  if (isMockMode) {
    return (
      <div className="mt-6 space-y-4">
        <p className="rounded-2xl bg-[#fcfaf6] px-4 py-3 text-sm leading-6 text-black/65">
          현재는 Supabase 환경변수가 없어서 mock 모드로 동작 중입니다. 바로 데모 보드로 진입할 수 있습니다.
        </p>
        <button
          type="button"
          onClick={handleMockEntry}
          className="inline-flex rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white"
        >
          mock 보드로 이동
        </button>
      </div>
    );
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={handleMagicLink}>
      <label className="block text-sm font-semibold text-ink">
        고객사 담당자 이메일
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="name@client.com"
          className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none"
          required
        />
      </label>
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isSubmitting ? '링크 전송 중...' : '매직링크 로그인'}
      </button>
      {message ? <p className="text-sm text-black/60">{message}</p> : null}
    </form>
  );
}
