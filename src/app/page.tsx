export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-sand px-6">
      <section className="w-full max-w-lg rounded-3xl border border-black/10 bg-white p-10 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-coral">
          App Scaffold Ready
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
          Geekstudio client portal foundation
        </h1>
        <p className="mt-4 text-base leading-7 text-black/70">
          This placeholder page confirms the Next.js app shell, global styles, and React Query
          provider are wired correctly.
        </p>
      </section>
    </main>
  );
}
