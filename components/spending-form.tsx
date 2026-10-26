'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AppData, Expense } from '@/lib/types';
import { genId, calculateRoundUp } from '@/lib/storage';
import { formatMoney } from '@/lib/format';

interface SpendingFormProps {
  data: AppData;
  update: (updater: (prev: AppData) => AppData) => void;
  currencySymbol: string;
  showRoundUp?: boolean;
}

export function SpendingForm({ data, update, currencySymbol, showRoundUp }: SpendingFormProps) {
  const { toast } = useToast();
  const [whereSpent, setWhereSpent] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const where = whereSpent.trim();
    const amt = parseFloat(amount);

    if (!where) {
      toast({ title: 'Please enter where you spent', variant: 'destructive' });
      return;
    }
    if (isNaN(amt) || amt <= 0) {
      toast({ title: 'Amount must be greater than 0', variant: 'destructive' });
      return;
    }

    const expense: Expense = {
      id: genId(),
      whereSpent: where,
      amount: amt,
      date: new Date().toISOString(),
    };

    const roundUp = calculateRoundUp(amt);
    const roundUpActive = data.ageGroup === 'teens' || (data.ageGroup === 'youth' && data.roundUpEnabled);

    update(prev => ({
      ...prev,
      expenses: [expense, ...prev.expenses],
      totalRoundUps: roundUpActive ? prev.totalRoundUps + roundUp : prev.totalRoundUps,
    }));

    if (roundUpActive && showRoundUp) {
      toast({
        title: 'Expense added!',
        description: `Round-up saved: ${currencySymbol}${roundUp.toFixed(2)}`,
      });
    } else {
      toast({ title: 'Expense added!' });
    }

    setWhereSpent('');
    setAmount('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Add Spending</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="whereSpent">Where did you spend?</Label>
            <Input
              id="whereSpent"
              value={whereSpent}
              onChange={e => setWhereSpent(e.target.value)}
              placeholder="e.g. Cafe, Movies, Books"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">How much?</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{currencySymbol}</span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0"
                className="pl-8"
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
