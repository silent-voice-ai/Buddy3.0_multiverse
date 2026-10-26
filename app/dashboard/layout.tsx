'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Wallet, Target, TrendingUp, Mail, Flame,
  Store, Settings, LogOut, Sparkles, Home
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useAppData } from '@/lib/useAppData';
import { themes } from '@/lib/themes';
import { AgeGroup } from '@/lib/types';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  groups: AgeGroup[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, groups: ['kids', 'teens', 'youth'] },
  { label: 'Spending', href: '/dashboard/spending', icon: Wallet, groups: ['kids', 'teens', 'youth'] },
  { label: 'Budget', href: '/dashboard/budget', icon: Target, groups: ['kids', 'teens', 'youth'] },
  { label: 'Goals', href: '/dashboard/goals', icon: Target, groups: ['kids', 'teens', 'youth'] },
  { label: 'Investments', href: '/dashboard/investments', icon: TrendingUp, groups: ['teens', 'youth'] },
  { label: 'Future Self', href: '/dashboard/future-self', icon: Mail, groups: ['teens', 'youth'] },
  { label: 'Roaster', href: '/dashboard/roaster', icon: Flame, groups: ['teens'] },
  { label: 'Store', href: '/dashboard/store', icon: Store, groups: ['kids', 'teens', 'youth'] },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings, groups: ['kids', 'teens', 'youth'] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const { data, loaded } = useAppData();

  useEffect(() => {
    if (!loading && !user) router.push('/signin');
    if (loaded && user && !data.ageGroup) router.push('/age-selection');
  }, [loading, user, loaded, data.ageGroup, router]);

  if (loading || !user || !loaded || !data.ageGroup) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  const theme = themes[data.ageGroup];
  const isYouth = data.ageGroup === 'youth';
  const items = navItems.filter(item => item.groups.includes(data.ageGroup!));

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className={`min-h-screen ${theme.bgClass} ${isYouth ? 'dark' : ''}`}>
      {/* Desktop Sidebar */}
      <aside className={`fixed left-0 top-0 z-30 hidden h-screen w-64 border-r ${isYouth ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'} md:flex md:flex-col`}>
        <div className={`flex items-center gap-2 border-b px-5 py-4 ${isYouth ? 'border-slate-800' : 'border-slate-100'}`}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className={`text-sm font-bold ${isYouth ? 'text-white' : 'text-slate-900'}`}>BUDDY 3.0</div>
            <div className={`text-xs ${isYouth ? 'text-slate-400' : 'text-slate-500'}`}>{theme.name}</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {items.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? isYouth ? 'bg-emerald-500/10 text-emerald-400' : theme.sidebarActive
                    : isYouth ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={`border-t px-3 py-4 ${isYouth ? 'border-slate-800' : 'border-slate-100'}`}>
          <div className={`mb-2 px-3 text-xs ${isYouth ? 'text-slate-500' : 'text-slate-400'}`}>Hi, {user.fullName.split(' ')[0]}</div>
          <button
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isYouth ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="md:pl-64">
        <div className={`mx-auto max-w-5xl px-4 pb-24 pt-6 sm:px-6 md:pb-8`}>
          {children}
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className={`fixed bottom-0 left-0 right-0 z-30 border-t md:hidden ${isYouth ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
        <div className="no-scrollbar flex overflow-x-auto">
          {items.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-w-[64px] flex-1 flex-col items-center gap-1 px-2 py-3 text-xs transition-colors ${
                  isActive
                    ? isYouth ? 'text-emerald-400' : theme.primaryText
                    : isYouth ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
