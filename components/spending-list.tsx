'use client';

import { Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Expense, AppData } from '@/lib/types';
import { formatMoney, formatDate } from '@/lib/format';
import { calculateRoundUp } from '@/lib/storage';

interface SpendingListProps {
  expenses: Expense[];
  data: AppData;
  update: (updater: (prev: AppData) => AppData) => void;
  currency: AppData['currency'];
  isYouth?: boolean;
}

export function SpendingList({ expenses, data, update, currency, isYouth }: SpendingListProps) {
  const handleDelete = (id: string) => {
    const expense = expenses.find(e => e.id === id);
    if (!expense) return;

    const roundUp = calculateRoundUp(expense.amount);
    const roundUpActive = data.ageGroup === 'teens' || (data.ageGroup === 'youth' && data.roundUpEnabled);

    update(prev => ({
      ...prev,
      expenses: prev.expenses.filter(e => e.id !== id),
      totalRoundUps: roundUpActive ? Math.max(0, prev.totalRoundUps - roundUp) : prev.totalRoundUps,
    }));
  };

  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center">
            <p className={isYouth ? 'text-slate-500' : 'text-slate-400'}>No expenses yet. Add one above!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {expenses.map(expense => (
            <div
              key={expense.id}
              className={`flex items-center justify-between rounded-lg border p-3 ${
                isYouth ? 'border-slate-800 bg-slate-800/50' : 'border-slate-100 bg-slate-50'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className={`truncate font-medium ${isYouth ? 'text-white' : 'text-slate-900'}`}>
                  {expense.whereSpent}
                </div>
                <div className={`text-xs ${isYouth ? 'text-slate-500' : 'text-slate-400'}`}>
                  {formatDate(expense.date)}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`font-semibold ${isYouth ? 'text-emerald-400' : 'text-slate-900'}`}>
                  {formatMoney(expense.amount, currency)}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDelete(expense.id)}
                  className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
