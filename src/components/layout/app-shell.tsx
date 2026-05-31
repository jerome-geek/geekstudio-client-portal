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
    <main className="min-h-screen bg-[#f7f7f7] text-[#222]">
      <header className="border-b border-[#dcdcdc] bg-white">
        <div className="flex h-[70px] items-center justify-between px-5">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[21px] font-bold tracking-tight">긱스튜디오</span>
              <span className="text-lg text-[#666]">▾</span>
            </div>
            <nav className="flex items-center gap-7 text-[15px] font-medium text-[#333]">
              <Link href="#" className="flex items-center gap-2 text-[#333]">
                <span className="text-base">⌁</span>
                <span>대시보드</span>
              </Link>
              <Link href="#" className="flex items-center gap-2 text-[#333]">
                <span className="text-base">☰</span>
                <span>목록</span>
              </Link>
              <Link href="/board" className="flex items-center gap-2 font-semibold text-[#2f6fff]">
                <span className="text-base">▥</span>
                <span>보드</span>
              </Link>
              <Link href="#" className="flex items-center gap-2 text-[#333]">
                <span className="text-base">◫</span>
                <span>플래닝</span>
              </Link>
              <Link href="#" className="flex items-center gap-2 text-[#333]">
                <span className="text-base">▱</span>
                <span>타임라인</span>
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm text-[#666]">
            <span className="rounded-full border border-[#ddd] px-3 py-2">{title}</span>
            {actions}
          </div>
        </div>
      </header>
      <section className="px-1 py-3 md:px-2">{children}</section>
    </main>
  );
}
