'use client';

import { useState, useMemo } from 'react';
import { Flame, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppData } from '@/lib/types';
import { calculateRoundUp } from '@/lib/storage';
import { formatMoney } from '@/lib/format';

interface RoasterProps {
  data: AppData;
  isYouth?: boolean;
}

function generateRoast(data: AppData): string {
  const expenses = data.expenses;
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const budget = data.budget;
  const percentUsed = budget > 0 ? (totalSpent / budget) * 100 : 0;

  if (expenses.length === 0) {
    return 'Clean wallet, clear mind. Add your first expense to begin.';
  }

  // Group by category
  const grouped: Record<string, number> = {};
  expenses.forEach(e => {
    grouped[e.whereSpent] = (grouped[e.whereSpent] || 0) + e.amount;
  });
  const sorted = Object.entries(grouped).sort((a, b) => b[1] - a[1]);
  const topCategory = sorted[0];
  const topCategoryLower = topCategory[0].toLowerCase();

  const roasts: string[] = [];

  // High cafe/food spending
  if (topCategoryLower.includes('cafe') || topCategoryLower.includes('coffee') || topCategoryLower.includes('tea')) {
    if (topCategory[1] > totalSpent * 0.3) {
      roasts.push('Your cafe orders are working harder than your savings goal.');
    }
  }

  // High food/restaurant spending
  if (topCategoryLower.includes('food') || topCategoryLower.includes('restaurant') || topCategoryLower.includes('snack')) {
    if (topCategory[1] > totalSpent * 0.4) {
      roasts.push('Your food spending could fund a small vacation. Just saying.');
    }
  }

  // Budget nearly over
  if (percentUsed >= 80 && percentUsed < 100) {
    roasts.push('Your wallet called. It wants a break.');
  }

  // Budget exceeded
  if (percentUsed >= 100) {
    roasts.push('Budget? What budget? You and your budget need to talk.');
  }

  // Good savings
  if (data.savings > 0 && data.goalAmount > 0 && (data.savings / data.goalAmount) >= 0.5) {
    roasts.push('Future you is impressed. Keep going.');
  }

  // High round-ups
  if (data.totalRoundUps > 100) {
    roasts.push('Your round-ups are quietly building your money multiverse.');
  }

  // Many small expenses
  if (expenses.length > 15 && totalSpent < budget * 0.5) {
    roasts.push('Death by a thousand small purchases. At least the budget is fine.');
  }

  // Top category dominating
  if (topCategory[1] > totalSpent * 0.6) {
    roasts.push(`Most of your money is going to ${topCategory[0]}. Maybe diversify your spending portfolio?`);
  }

  // If budget is set and doing well
  if (budget > 0 && percentUsed < 50 && expenses.length > 3) {
    roasts.push('You\'re under budget and spending smart. Who are you and what did you do with the old you?');
  }

  // Low round-ups
  if (data.totalRoundUps > 0 && data.totalRoundUps < 20) {
    roasts.push('Your round-ups are cute. They\'ll grow up someday.');
  }

  // Pick a random roast, or a default
  if (roasts.length === 0) {
    roasts.push(`You've spent ${formatMoney(totalSpent, data.currency)} across ${expenses.length} expenses. The math is mathing, but is it working for you?`);
    roasts.push(`${topCategory[0]} is your top spending spot. At least you\'re consistent.`);
  }

  return roasts[Math.floor(Math.random() * roasts.length)];
}

export function Roaster({ data, isYouth }: RoasterProps) {
  const [roast, setRoast] = useState<string | null>(null);

  const currentRoast = useMemo(() => {
    return roast || generateRoast(data);
  }, [roast, data]);

  const handleRoastAgain = () => {
    setRoast(generateRoast(data));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Flame className="h-5 w-5 text-orange-500" />
          The Roaster
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`rounded-xl p-6 text-center ${isYouth ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-orange-50 to-pink-50'}`}>
          <p className={`text-lg font-medium leading-relaxed ${isYouth ? 'text-slate-100' : 'text-slate-800'}`}>
            &ldquo;{currentRoast}&rdquo;
          </p>
        </div>
        <Button onClick={handleRoastAgain} variant="outline" className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Roast Me Again
        </Button>
        <p className={`text-center text-xs ${isYouth ? 'text-slate-500' : 'text-slate-400'}`}>
          Roasts are based on your real spending data. No offense intended — just friendly fun.
        </p>
      </CardContent>
    </Card>
  );
}
