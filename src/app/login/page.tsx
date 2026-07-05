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
          관리자가 발급한 계정으로 로그인해 주세요.
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
