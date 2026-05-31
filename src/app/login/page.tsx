import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-sand px-6">
      <section className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-10 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-coral">Sign in</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
          Client portal login
        </h1>
        <p className="mt-4 text-base leading-7 text-black/70">
          Supabase authentication UI will be connected here in the next implementation steps.
        </p>
        <Link
          href="/board"
          className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white"
        >
          mock 보드로 이동
        </Link>
      </section>
    </main>
  );
}
