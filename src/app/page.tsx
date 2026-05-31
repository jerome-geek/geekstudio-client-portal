import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-sand px-6">
      <section className="w-full max-w-lg rounded-3xl border border-black/10 bg-white p-10 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-coral">
          Geekstudio Client Portal
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
          고객 요청 보드 데모
        </h1>
        <p className="mt-4 text-base leading-7 text-black/70">
          지금은 Supabase와 Dooray 실연동 전 단계라서, dev 서버에서는 mock 데이터 기반 보드를 바로 볼 수 있습니다.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/board"
            className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white"
          >
            보드 열기
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-ink"
          >
            로그인 화면 보기
          </Link>
        </div>
      </section>
    </main>
  );
}
