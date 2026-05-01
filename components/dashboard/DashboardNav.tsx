'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase.client';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/types';
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart2,
  CreditCard,
  Settings,
  LogOut,
  X,
  Menu,
  PlusCircle,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/invitations', icon: FileText, label: 'Undangan Saya' },
  { href: '/dashboard/guests', icon: Users, label: 'Manajemen Tamu' },
  { href: '/dashboard/analytics', icon: BarChart2, label: 'Analytics' },
  { href: '/dashboard/subscription', icon: CreditCard, label: 'Langganan' },
];

interface Props {
  user: User;
  profile: Profile | null;
}

export default function DashboardNav({ user, profile }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const planLabel = { free: 'Gratis', pro: 'Pro ⭐', premium: 'Premium 👑' }[profile?.plan || 'free'];
  const planColor = { free: 'badge-gray', pro: 'badge-rose', premium: 'badge-gold' }[profile?.plan || 'free'];

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">💌</span>
          <span className="font-serif font-bold text-lg text-gray-900">
            Undangan<span className="text-rose-500">Digital</span>
          </span>
        </Link>
        <button onClick={() => setOpen(false)} className="md:hidden text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      {/* Create CTA */}
      <div className="p-4">
        <Link
          href="/dashboard/invitations/new"
          className="flex items-center justify-center gap-2 w-full btn btn-primary text-sm"
          onClick={() => setOpen(false)}
        >
          <PlusCircle size={16} />
          Buat Undangan
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-rose-50 text-rose-600'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <item.icon size={18} className={isActive ? 'text-rose-500' : 'text-gray-400'} />
              {item.label}
            </Link>
          );
        })}

        {/* AI Generator CTA */}
        <Link
          href="/dashboard/ai"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors mt-2"
        >
          <Sparkles size={18} className="text-amber-500" />
          AI Generator
          {profile?.plan === 'free' && (
            <span className="ml-auto text-xs bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded-full">Pro</span>
          )}
        </Link>
      </nav>

      {/* User profile */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-sm flex-shrink-0">
            {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {profile?.full_name || 'Pengguna'}
            </p>
            <span className={cn('badge text-xs', planColor)}>{planLabel}</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut size={16} />
          Keluar
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white rounded-xl shadow p-2 border border-gray-100"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar desktop */}
      <aside className={cn(
        'fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 z-40 transform transition-transform duration-300',
        'hidden md:block',
      )}>
        {sidebarContent}
      </aside>

      {/* Sidebar mobile */}
      <aside className={cn(
        'fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 z-50 transform transition-transform duration-300 md:hidden',
        open ? 'translate-x-0' : '-translate-x-full',
      )}>
        {sidebarContent}
      </aside>
    </>
  );
}
