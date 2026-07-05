import { LoginForm } from '@/components/auth/login-form';
import Link from 'next/link';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-sand px-6">
      <section className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-10 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-coral">Sign in</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
          Client portal login
        </h1>
        <p className="mt-4 text-base leading-7 text-black/70">
          Supabase가 설정되면 매직링크 로그인으로 연결되고, 설정 전에는 mock 보드로 바로 진입할 수 있습니다.
        </p>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
        <Link
          href="https://supabase.com/dashboard"
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex text-sm font-semibold text-coral"
        >
          Supabase에서 고객사 매핑 설정하기
        </Link>
      </section>
    </main>
  );
}
