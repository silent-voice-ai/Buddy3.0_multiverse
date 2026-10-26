'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PiggyBank, Gamepad2, TrendingUp, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { useAppData } from '@/lib/useAppData';
import { AgeGroup, Currency } from '@/lib/types';

export default function AgeSelectionPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { data, update, loaded } = useAppData();
  const [selected, setSelected] = useState<AgeGroup | null>(null);
  const [currency, setCurrency] = useState<Currency>(data.currency);

  useEffect(() => {
    if (!loading && !user) router.push('/signin');
  }, [loading, user, router]);

  useEffect(() => {
    if (loaded) setCurrency(data.currency);
  }, [loaded, data.currency]);

  if (loading || !user) return null;

  const handleContinue = () => {
    if (!selected) return;
    update(prev => ({
      ...prev,
      ageGroup: selected,
      currency,
      roundUpEnabled: selected === 'teens' ? true : prev.roundUpEnabled,
    }));
    router.push('/dashboard');
  };

  const worlds = [
    {
      id: 'kids' as AgeGroup,
      title: 'Little Saver World',
      ages: 'Ages 3–10',
      icon: PiggyBank,
      bg: 'from-amber-100 to-orange-100',
      border: 'border-orange-300',
      activeBorder: 'border-orange-500 ring-4 ring-orange-200',
      iconBg: 'bg-orange-500',
    },
    {
      id: 'teens' as AgeGroup,
      title: 'Teen Moneyverse',
      ages: 'Ages 11–18',
      icon: Gamepad2,
      bg: 'from-cyan-100 to-blue-100',
      border: 'border-blue-300',
      activeBorder: 'border-blue-500 ring-4 ring-blue-200',
      iconBg: 'bg-blue-500',
    },
    {
      id: 'youth' as AgeGroup,
      title: 'Young Investor Pro',
      ages: 'Ages 18–25',
      icon: TrendingUp,
      bg: 'from-slate-100 to-emerald-100',
      border: 'border-emerald-300',
      activeBorder: 'border-emerald-500 ring-4 ring-emerald-200',
      iconBg: 'bg-emerald-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Choose Your Money World</h1>
          <p className="mt-2 text-slate-600">Hi {user.fullName.split(' ')[0]}! Pick the world that fits you.</p>
        </div>

        {/* Currency toggle */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <Globe className="h-5 w-5 text-slate-400" />
          <div className="inline-flex rounded-lg border bg-white p-1">
            <button
              onClick={() => setCurrency('INR')}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${currency === 'INR' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
            >
              India (₹)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${currency === 'USD' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
            >
              US ($)
            </button>
          </div>
        </div>

        {/* World cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {worlds.map(w => {
            const Icon = w.icon;
            const isSelected = selected === w.id;
            return (
              <button
                key={w.id}
                onClick={() => setSelected(w.id)}
                className={`rounded-2xl border-2 bg-gradient-to-br ${w.bg} p-6 text-left transition-all ${isSelected ? w.activeBorder : w.border + ' hover:shadow-md'}`}
              >
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${w.iconBg} text-white`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{w.title}</h3>
                <p className="text-sm text-slate-600">{w.ages}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Button onClick={handleContinue} disabled={!selected} size="lg" className="w-full sm:w-auto">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
