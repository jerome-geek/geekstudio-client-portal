import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-sand px-6">
      <section className="w-full max-w-lg rounded-3xl border border-black/10 bg-white p-10 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-coral">
          Access Required
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
          고객사 매핑이 아직 없습니다
        </h1>
        <p className="mt-4 text-base leading-7 text-black/70">
          로그인은 성공했지만 현재 계정이 어떤 고객사와도 연결되어 있지 않습니다.
          Supabase의 `company_members`와 `company_dooray_projects`를 설정한 뒤 다시 시도해 주세요.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/login"
            className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white"
          >
            로그인으로 돌아가기
          </Link>
          <Link
            href="/"
            className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-ink"
          >
            홈으로 이동
          </Link>
        </div>
      </section>
    </main>
  );
}
