'use client';

import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { AppData } from '@/lib/types';
import { formatMoney } from '@/lib/format';
import { useToast } from '@/hooks/use-toast';

interface BudgetManagerProps {
  data: AppData;
  update: (updater: (prev: AppData) => AppData) => void;
  isYouth?: boolean;
}

export function BudgetManager({ data, update, isYouth }: BudgetManagerProps) {
  const { toast } = useToast();
  const [budgetInput, setBudgetInput] = useState('');

  const totalSpent = data.expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = data.budget - totalSpent;
  const percentUsed = data.budget > 0 ? Math.min(100, (totalSpent / data.budget) * 100) : 0;
  const isOverBudget = data.budget > 0 && totalSpent > data.budget;
  const isWarning = percentUsed >= 80 && !isOverBudget;

  const setBudget = () => {
    const val = parseFloat(budgetInput);
    if (isNaN(val) || val < 0) {
      toast({ title: 'Please enter a valid budget amount', variant: 'destructive' });
      return;
    }
    update(prev => ({ ...prev, budget: val }));
    setBudgetInput('');
    toast({ title: 'Budget updated!' });
  };

  const barColor = isOverBudget ? 'bg-red-500' : isWarning ? 'bg-amber-500' : isYouth ? 'bg-emerald-500' : 'bg-blue-500';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Budget Manager</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.budget === 0 ? (
          <div className="space-y-3">
            <p className={`text-sm ${isYouth ? 'text-slate-400' : 'text-slate-600'}`}>
              Set your monthly budget to start tracking.
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {data.currency === 'INR' ? '₹' : '$'}
                </span>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={budgetInput}
                  onChange={e => setBudgetInput(e.target.value)}
                  placeholder="Enter budget"
                  className="pl-8"
                />
              </div>
              <Button onClick={setBudget}>Set Budget</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isYouth ? 'text-slate-400' : 'text-slate-600'}`}>Monthly Budget</span>
                <span className={`font-semibold ${isYouth ? 'text-white' : 'text-slate-900'}`}>
                  {formatMoney(data.budget, data.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isYouth ? 'text-slate-400' : 'text-slate-600'}`}>Total Spent</span>
                <span className={`font-semibold ${isYouth ? 'text-white' : 'text-slate-900'}`}>
                  {formatMoney(totalSpent, data.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isYouth ? 'text-slate-400' : 'text-slate-600'}`}>Remaining</span>
                <span className={`font-semibold ${isOverBudget ? 'text-red-500' : isYouth ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  {formatMoney(Math.max(0, remaining), data.currency)}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className={isYouth ? 'text-slate-400' : 'text-slate-600'}>{percentUsed.toFixed(0)}% used</span>
                {isOverBudget && (
                  <span className="flex items-center gap-1 text-xs font-medium text-red-500">
                    <AlertTriangle className="h-3 w-3" /> Budget exceeded
                  </span>
                )}
                {isWarning && !isOverBudget && (
                  <span className="flex items-center gap-1 text-xs font-medium text-amber-500">
                    <AlertTriangle className="h-3 w-3" /> 80% warning
                  </span>
                )}
              </div>
              <div className={`h-3 w-full overflow-hidden rounded-full ${isYouth ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${percentUsed}%` }}
                />
              </div>
            </div>

            {isOverBudget && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:bg-red-950/50 dark:text-red-400">
                Budget exceeded! You&apos;ve spent {formatMoney(totalSpent - data.budget, data.currency)} over your budget.
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {data.currency === 'INR' ? '₹' : '$'}
                </span>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={budgetInput}
                  onChange={e => setBudgetInput(e.target.value)}
                  placeholder="Update budget"
                  className="pl-8"
                />
              </div>
              <Button variant="outline" onClick={setBudget}>Update</Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
