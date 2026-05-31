import Link from 'next/link';

export function AppShell({
  title,
  children,
  actions
}: Readonly<{
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f4efe7_0%,#fcfaf6_100%)]">
      <header className="border-b border-black/10 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
              Geekstudio
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">{title}</h1>
          </div>
          <nav className="flex items-center gap-3 text-sm font-medium text-black/70">
            <Link href="/board" className="rounded-full px-4 py-2 hover:bg-black/5">
              Board
            </Link>
            {actions}
          </nav>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-6 py-8">{children}</section>
    </main>
  );
}
