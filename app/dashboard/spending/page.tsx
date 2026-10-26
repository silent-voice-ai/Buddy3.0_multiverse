'use client';

import { useAppData } from '@/lib/useAppData';
import { themes } from '@/lib/themes';
import { getCurrencySymbol } from '@/lib/format';
import { SpendingForm } from '@/components/spending-form';
import { SpendingChart } from '@/components/spending-chart';
import { SpendingList } from '@/components/spending-list';

export default function SpendingPage() {
  const { data, update, loaded } = useAppData();
  if (!loaded || !data.ageGroup) return null;

  const theme = themes[data.ageGroup];
  const currencySymbol = getCurrencySymbol(data.currency);
  const isYouth = data.ageGroup === 'youth';

  return (
    <div className="space-y-6">
      <h1 className={`text-2xl font-bold ${isYouth ? 'text-white' : 'text-slate-900'}`}>Spending Tracker</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <SpendingForm data={data} update={update} currencySymbol={currencySymbol} showRoundUp />
        <SpendingChart expenses={data.expenses} chartColors={theme.chartColors} isYouth={isYouth} />
      </div>

      <SpendingList expenses={data.expenses} data={data} update={update} currency={data.currency} isYouth={isYouth} />
    </div>
  );
}
