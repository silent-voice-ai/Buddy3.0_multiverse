'use client';

import Link from 'next/link';
import { Sparkles, PiggyBank, Gamepad2, TrendingUp, Shield, Wallet, Target, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';

export default function LandingPage() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">BUDDY 3.0</span>
          </div>
          <div className="flex items-center gap-3">
            {!loading && user ? (
              <Link href="/dashboard">
                <Button size="sm">Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/signin">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700">
              <Sparkles className="h-4 w-4" />
              Money management for every age
            </div>
            <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Your money,{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
                your multiverse
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
              BUDDY 3.0 adapts to your age with playful saving for kids, gamified money tools for teens, and a premium investor dashboard for young adults.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Your Journey — Free
                </Button>
              </Link>
              <Link href="/store">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Store className="mr-2 h-4 w-4" />
                  BUDDY Store
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Three Worlds */}
      <section className="border-t bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-slate-900">Three Money Worlds</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
            Each world is designed for its age group with the right tools, tone, and features.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {/* Kids */}
            <div className="rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 transition-shadow hover:shadow-lg">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 text-white">
                <PiggyBank className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-orange-900">Little Saver World</h3>
              <p className="text-sm font-medium text-orange-600">Ages 3–10</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>• Pet piggy bank with happiness meter</li>
                <li>• Simple spending tracker</li>
                <li>• Savings goals with progress bars</li>
                <li>• Feed button to boost happiness</li>
              </ul>
            </div>

            {/* Teens */}
            <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-6 transition-shadow hover:shadow-lg">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500 text-white">
                <Gamepad2 className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-blue-900">Teen Moneyverse</h3>
              <p className="text-sm font-medium text-blue-600">Ages 11–18</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>• Goal tracker with progress bars</li>
                <li>• Investment card with growth</li>
                <li>• UPI Round-Up savings simulation</li>
                <li>• Friends Savings Royale leaderboard</li>
                <li>• Talk to Future Self + Roaster</li>
              </ul>
            </div>

            {/* Youth */}
            <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-slate-50 to-emerald-50 p-6 transition-shadow hover:shadow-lg">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                <TrendingUp className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Young Investor Pro</h3>
              <p className="text-sm font-medium text-emerald-600">Ages 18–25</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>• Portfolio growth dashboard</li>
                <li>• Investment tracker with growth %</li>
                <li>• UPI Round-Up Magic toggle</li>
                <li>• Monthly budget manager</li>
                <li>• Talk to Future Self</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                <Wallet className="h-6 w-6 text-slate-700" />
              </div>
              <h4 className="font-semibold">Spending Tracker</h4>
              <p className="mt-1 text-sm text-slate-600">Track every expense with live charts</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                <Target className="h-6 w-6 text-slate-700" />
              </div>
              <h4 className="font-semibold">Budget Manager</h4>
              <p className="mt-1 text-sm text-slate-600">Set budgets and get smart warnings</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                <Shield className="h-6 w-6 text-slate-700" />
              </div>
              <h4 className="font-semibold">Privacy First</h4>
              <p className="mt-1 text-sm text-slate-600">Your data stays on your device</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                <TrendingUp className="h-6 w-6 text-slate-700" />
              </div>
              <h4 className="font-semibold">Investment Tracking</h4>
              <p className="mt-1 text-sm text-slate-600">Watch your portfolio grow</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-gradient-to-br from-emerald-500 to-blue-600 py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-white">Ready to start?</h2>
          <p className="mt-3 text-emerald-50">Join BUDDY 3.0 and take control of your money today.</p>
          <Link href="/signup" className="mt-6 inline-block">
            <Button size="lg" variant="secondary" className="bg-white text-emerald-700 hover:bg-emerald-50">
              Create Your Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-bold">BUDDY 3.0</span>
          </div>
          <div className="flex gap-4 text-sm text-slate-600">
            <Link href="/privacy" className="hover:text-slate-900">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-900">Terms of Use</Link>
            <Link href="/store" className="hover:text-slate-900">Store</Link>
          </div>
          <p className="text-sm text-slate-400">© 2026 BUDDY 3.0</p>
        </div>
      </footer>
    </div>
  );
}
