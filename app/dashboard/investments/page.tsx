'use client';

import { useAppData } from '@/lib/useAppData';
import { themes } from '@/lib/themes';
import { InvestmentCard } from '@/components/investment-card';
import { InvestmentBuddy } from '@/components/investment-buddy';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatMoney } from '@/lib/format';

export default function InvestmentsPage() {
  const { data, update, loaded } = useAppData();
  if (!loaded || !data.ageGroup) return null;
  if (data.ageGroup === 'kids') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-slate-500">Investments are available for Teens and Youth only.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isYouth = data.ageGroup === 'youth';
  const totalGrowth = data.currentValue - data.investedAmount;
  const growthPercent = data.investedAmount > 0 ? (totalGrowth / data.investedAmount) * 100 : 0;

  return (
    <div className="space-y-6">
      <h1 className={`text-2xl font-bold ${isYouth ? 'text-white' : 'text-slate-900'}`}>Investments</h1>

      {/* Portfolio Summary (Youth) */}
      {isYouth && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="text-sm text-slate-400">Total Invested</div>
            <div className="mt-1 text-xl font-bold text-white">{formatMoney(data.investedAmount, data.currency)}</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="text-sm text-slate-400">Current Value</div>
            <div className="mt-1 text-xl font-bold text-white">{formatMoney(data.currentValue, data.currency)}</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="text-sm text-slate-400">Total Growth</div>
            <div className={`mt-1 text-xl font-bold ${totalGrowth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {totalGrowth >= 0 ? '+' : ''}{formatMoney(totalGrowth, data.currency)}
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="text-sm text-slate-400">Growth %</div>
            <div className={`mt-1 text-xl font-bold ${growthPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {growthPercent >= 0 ? '+' : ''}{growthPercent.toFixed(2)}%
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <InvestmentCard data={data} update={update} isYouth={isYouth} />
        <Card className={isYouth ? 'border-slate-800 bg-slate-900' : ''}>
          <CardHeader>
            <CardTitle className="text-lg">Investment Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className={`rounded-lg p-3 text-sm ${isYouth ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
              Enter your invested amount and current value to track growth over time.
            </div>
            <div className={`rounded-lg p-3 text-sm ${isYouth ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
              Growth is calculated as: Current Value - Invested Amount.
            </div>
            <div className={`rounded-lg p-3 text-sm ${isYouth ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
              Growth % = (Growth / Invested Amount) x 100.
            </div>
            <div className={`rounded-lg p-3 text-sm ${isYouth ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
              BUDDY does not provide investment advice. Always consult a qualified financial advisor.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investment Buddy bot */}
      <InvestmentBuddy data={data} update={update} isYouth={isYouth} />
    </div>
  );
}
