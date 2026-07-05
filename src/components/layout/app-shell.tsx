'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LogoutButton } from '@/components/auth/logout-button';
import { useMeQuery } from '@/hooks/query/use-me-query';
import { 
  LayoutDashboard, 
  KanbanSquare, 
  ListTodo, 
  Menu, 
  X, 
  Bell, 
  User,
  Layers
} from 'lucide-react';

export function AppShell({
  title,
  children,
  actions
}: Readonly<{
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: me } = useMeQuery();

  const displayName = me?.name ?? me?.email ?? '고객사 담당자';
  const displayCompany = me?.companyName ?? 'Geekstudio Client';

  const navigation = [
    { name: '대시보드', href: '/', icon: LayoutDashboard },
    { name: '보드', href: '/board', icon: KanbanSquare },
    { name: '요청 목록', href: '#', icon: ListTodo },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#F1F5F9] font-sans">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#1C2434] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-20 items-center justify-between px-6 py-5 border-b border-[#2E3A4B]">
          <Link href="/" className="flex items-center gap-2">
            <Layers className="h-6 w-6 text-blue-500" />
            <span className="text-xl font-bold tracking-tight text-white">GEEKSTUDIO</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="block text-gray-400 hover:text-white lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-7">
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#8A99AD] px-2">
              MENU
            </h3>
            <ul className="space-y-1.5">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`group flex items-center gap-2.5 rounded-sm px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? 'bg-[#333A48] text-white'
                          : 'text-[#AEB7C0] hover:bg-[#333A48] hover:text-white'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-20 w-full bg-white shadow-sm border-b border-[#E2E8F0]">
          <div className="flex flex-1 items-center justify-between px-6">
            {/* Left Side: Mobile Menu Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="block text-gray-500 hover:text-gray-900 lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h2 className="hidden text-xl font-semibold text-gray-800 sm:block">
                {title}
              </h2>
            </div>

            {/* Right Side: Actions, Profile, Logout */}
            <div className="flex items-center gap-4">
              {actions}
              
              {/* Notification Badge */}
              <button className="relative rounded-full border border-gray-200 p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
              </button>

              <div className="h-8 w-px bg-gray-200"></div>

              {/* User Dropdown Preview */}
              <div className="flex items-center gap-3">
                <span className="hidden text-right lg:block">
                  <span className="block text-sm font-medium text-gray-800">
                    {displayName}
                  </span>
                  <span className="block text-xs text-gray-500">
                    {displayCompany}
                  </span>
                </span>
                <span className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 text-gray-600">
                  <User className="h-5 w-5" />
                </span>
              </div>

              <div className="h-8 w-px bg-gray-200"></div>

              <LogoutButton />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
