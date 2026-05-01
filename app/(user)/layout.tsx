import React from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Undangan<span className="text-blue-600 dark:text-blue-400">Online</span></span>
          </Link>
          <nav className="flex gap-4">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Templates</Link>
            <Link href="/status" className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Cek Status</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-gray-200 bg-white py-8 dark:border-gray-800 dark:bg-gray-950">
        <div className="container mx-auto px-4 text-center md:px-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} UndanganOnline. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
