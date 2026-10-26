'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { AppData } from '@/lib/types';
import { formatMoney } from '@/lib/format';
import { useToast } from '@/hooks/use-toast';

interface InvestmentCardProps {
  data: AppData;
  update: (updater: (prev: AppData) => AppData) => void;
  isYouth?: boolean;
}

export function InvestmentCard({ data, update, isYouth }: InvestmentCardProps) {
  const { toast } = useToast();
  const [investedInput, setInvestedInput] = useState('');
  const [currentInput, setCurrentInput] = useState('');

  const growth = data.currentValue - data.investedAmount;
  const growthPercent = data.investedAmount > 0 ? (growth / data.investedAmount) * 100 : 0;
  const isPositive = growth >= 0;

  const handleSave = () => {
    const invested = parseFloat(investedInput);
    const current = parseFloat(currentInput);

    if (!isNaN(invested) && invested >= 0) {
      update(prev => ({ ...prev, investedAmount: invested }));
    }
    if (!isNaN(current) && current >= 0) {
      update(prev => ({ ...prev, currentValue: current }));
    }

    setInvestedInput('');
    setCurrentInput('');
    toast({ title: 'Investment updated!' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Investment Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className={`rounded-lg p-3 ${isYouth ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <div className={`text-xs ${isYouth ? 'text-slate-400' : 'text-slate-500'}`}>Invested</div>
            <div className={`text-lg font-bold ${isYouth ? 'text-white' : 'text-slate-900'}`}>
              {formatMoney(data.investedAmount, data.currency)}
            </div>
          </div>
          <div className={`rounded-lg p-3 ${isYouth ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <div className={`text-xs ${isYouth ? 'text-slate-400' : 'text-slate-500'}`}>Current Value</div>
            <div className={`text-lg font-bold ${isYouth ? 'text-white' : 'text-slate-900'}`}>
              {formatMoney(data.currentValue, data.currency)}
            </div>
          </div>
        </div>

        {data.investedAmount > 0 ? (
          <div className={`flex items-center justify-between rounded-lg p-3 ${
            isPositive
              ? isYouth ? 'bg-emerald-500/10' : 'bg-emerald-50'
              : isYouth ? 'bg-red-500/10' : 'bg-red-50'
          }`}>
            <div>
              <div className={`text-xs ${isYouth ? 'text-slate-400' : 'text-slate-500'}`}>Growth</div>
              <div className={`text-lg font-bold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                {isPositive ? '+' : ''}{formatMoney(growth, data.currency)}
              </div>
            </div>
            <div className={`flex items-center gap-1 text-lg font-bold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
              {isPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              {isPositive ? '+' : ''}{growthPercent.toFixed(2)}%
            </div>
          </div>
        ) : (
          <div className={`rounded-lg p-3 text-center text-sm ${isYouth ? 'bg-slate-800 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
            Add an invested amount to calculate growth.
          </div>
        )}

        <div className="space-y-3 border-t pt-4">
          <div className="space-y-1.5">
            <Label htmlFor="investedInput">Invested amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                {data.currency === 'INR' ? '₹' : '$'}
              </span>
              <Input
                id="investedInput"
                type="number"
                step="0.01"
                min="0"
                value={investedInput}
                onChange={e => setInvestedInput(e.target.value)}
                placeholder={data.investedAmount.toString() || '0'}
                className="pl-8"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="currentInput">Current value</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                {data.currency === 'INR' ? '₹' : '$'}
              </span>
              <Input
                id="currentInput"
                type="number"
                step="0.01"
                min="0"
                value={currentInput}
                onChange={e => setCurrentInput(e.target.value)}
                placeholder={data.currentValue.toString() || '0'}
                className="pl-8"
              />
            </div>
          </div>
          <Button onClick={handleSave} className="w-full">Update Investment</Button>
        </div>
      </CardContent>
    </Card>
  );
}
