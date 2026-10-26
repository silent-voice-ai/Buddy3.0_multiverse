'use client';

import { useAppData } from '@/lib/useAppData';
import { themes } from '@/lib/themes';
import { getCurrencySymbol, formatMoney } from '@/lib/format';
import { BudgetManager } from '@/components/budget-manager';
import { SpendingChart } from '@/components/spending-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BudgetPage() {
  const { data, update, loaded } = useAppData();
  if (!loaded || !data.ageGroup) return null;

  const theme = themes[data.ageGroup];
  const isYouth = data.ageGroup === 'youth';
  const totalSpent = data.expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      <h1 className={`text-2xl font-bold ${isYouth ? 'text-white' : 'text-slate-900'}`}>Budget Manager</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <BudgetManager data={data} update={update} isYouth={isYouth} />
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Spending Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className={isYouth ? 'text-slate-400' : 'text-slate-600'}>Total expenses</span>
                  <span className={`font-semibold ${isYouth ? 'text-white' : 'text-slate-900'}`}>{formatMoney(totalSpent, data.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isYouth ? 'text-slate-400' : 'text-slate-600'}>Number of expenses</span>
                  <span className={`font-semibold ${isYouth ? 'text-white' : 'text-slate-900'}`}>{data.expenses.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isYouth ? 'text-slate-400' : 'text-slate-600'}>Average per expense</span>
                  <span className={`font-semibold ${isYouth ? 'text-white' : 'text-slate-900'}`}>
                    {formatMoney(data.expenses.length > 0 ? totalSpent / data.expenses.length : 0, data.currency)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <SpendingChart expenses={data.expenses} chartColors={theme.chartColors} isYouth={isYouth} />
        </div>
      </div>
    </div>
  );
}
