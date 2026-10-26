'use client';

import { BuddyStore } from '@/components/buddy-store';
import Link from 'next/link';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function StorePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-bold">BUDDY 3.0</span>
          </Link>
          <Link href="/" className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <BuddyStore />
      </div>
    </div>
  );
}
