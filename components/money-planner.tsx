'use client';

import { useState } from 'react';
import { Wallet, PiggyBank, ShoppingBag, Gamepad2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AppData, AgeGroup } from '@/lib/types';
import { formatMoney, getCurrencySymbol } from '@/lib/format';
import { useToast } from '@/hooks/use-toast';

interface MoneyPlannerProps {
  data: AppData;
  update: (updater: (prev: AppData) => AppData) => void;
  ageGroup: AgeGroup;
  isYouth?: boolean;
}

interface Bucket {
  key: 'savePct' | 'spendPct' | 'funPct';
  label: string;
  icon: typeof PiggyBank;
  color: string;
  barClass: string;
  bgClass: string;
  textClass: string;
}

const KIDS_BUCKETS: Bucket[] = [
  { key: 'savePct', label: 'Save', icon: PiggyBank, color: '#ec4899', barClass: 'bg-pink-400', bgClass: 'bg-pink-50', textClass: 'text-pink-600' },
  { key: 'spendPct', label: 'Spend', icon: ShoppingBag, color: '#f97316', barClass: 'bg-orange-400', bgClass: 'bg-orange-50', textClass: 'text-orange-600' },
  { key: 'funPct', label: 'Fun', icon: Gamepad2, color: '#facc15', barClass: 'bg-amber-400', bgClass: 'bg-amber-50', textClass: 'text-amber-600' },
];

const TEENS_BUCKETS: Bucket[] = [
  { key: 'savePct', label: 'Save', icon: PiggyBank, color: '#3b82f6', barClass: 'bg-blue-500', bgClass: 'bg-blue-50', textClass: 'text-blue-600' },
  { key: 'spendPct', label: 'Spend', icon: ShoppingBag, color: '#06b6d4', barClass: 'bg-cyan-500', bgClass: 'bg-cyan-50', textClass: 'text-cyan-600' },
  { key: 'funPct', label: 'Fun', icon: Gamepad2, color: '#8b5cf6', barClass: 'bg-violet-500', bgClass: 'bg-violet-50', textClass: 'text-violet-600' },
];

const YOUTH_BUCKETS: Bucket[] = [
  { key: 'savePct', label: 'Save', icon: PiggyBank, color: '#10b981', barClass: 'bg-emerald-500', bgClass: 'bg-emerald-500/10', textClass: 'text-emerald-400' },
  { key: 'spendPct', label: 'Spend', icon: ShoppingBag, color: '#3b82f6', barClass: 'bg-blue-500', bgClass: 'bg-blue-500/10', textClass: 'text-blue-400' },
  { key: 'funPct', label: 'Fun', icon: Gamepad2, color: '#f59e0b', barClass: 'bg-amber-500', bgClass: 'bg-amber-500/10', textClass: 'text-amber-400' },
];

export function MoneyPlanner({ data, update, ageGroup, isYouth }: MoneyPlannerProps) {
  const { toast } = useToast();
  const [incomeInput, setIncomeInput] = useState('');
  const currencySymbol = getCurrencySymbol(data.currency);

  const buckets = ageGroup === 'kids' ? KIDS_BUCKETS : ageGroup === 'teens' ? TEENS_BUCKETS : YOUTH_BUCKETS;
  const incomeLabel = ageGroup === 'youth' ? 'Monthly Salary' : 'Pocket Money';
  const incomePlaceholder = ageGroup === 'youth' ? 'Enter your monthly salary' : 'Enter your pocket money';
  const title = ageGroup === 'youth' ? 'Income Planner' : ageGroup === 'teens' ? 'Pocket Money Planner' : 'My Money Plan';
  const subtitle = ageGroup === 'youth'
    ? 'Split your salary into saving, spending, and fun.'
    : ageGroup === 'teens'
    ? 'Divide your pocket money into save, spend, and fun.'
    : 'Split your pocket money into saving, spending, and fun!';

  const plan = data.moneyPlan;
  const total = plan.savePct + plan.spendPct + plan.funPct;
  const isBalanced = total === 100;

  const handleSetIncome = () => {
    const val = parseFloat(incomeInput);
    if (isNaN(val) || val < 0) return toast({ title: 'Enter a valid amount', variant: 'destructive' });
    update(prev => ({ ...prev, moneyPlan: { ...prev.moneyPlan, income: val } }));
    setIncomeInput('');
    toast({ title: `${incomeLabel} set!` });
  };

  const adjustPct = (key: 'savePct' | 'spendPct' | 'funPct', delta: number) => {
    update(prev => {
      const mp = { ...prev.moneyPlan };
      const newVal = Math.max(0, Math.min(100, mp[key] + delta));
      const diff = newVal - mp[key];
      // Distribute the diff across the other two buckets proportionally
      const others: ('savePct' | 'spendPct' | 'funPct')[] = (['savePct', 'spendPct', 'funPct'] as const).filter(k => k !== key);
      const otherTotal = mp[others[0]] + mp[others[1]];
      mp[key] = newVal;
      if (otherTotal > 0) {
        others.forEach(k => {
          mp[k] = Math.max(0, Math.round(mp[k] - diff * (mp[k] / otherTotal)));
        });
      } else {
        others.forEach((k, i) => { mp[k] = Math.max(0, Math.round(-diff / 2 + (i === 0 ? 0 : -diff % 2))); });
      }
      // Fix rounding to sum 100
      const sum = mp.savePct + mp.spendPct + mp.funPct;
      if (sum !== 100) {
        mp[key] = Math.max(0, mp[key] + (100 - sum));
      }
      return { ...prev, moneyPlan: mp };
    });
  };

  const setPctDirect = (key: 'savePct' | 'spendPct' | 'funPct', value: number) => {
    const clamped = Math.max(0, Math.min(100, value));
    update(prev => {
      const mp = { ...prev.moneyPlan };
      const others: ('savePct' | 'spendPct' | 'funPct')[] = (['savePct', 'spendPct', 'funPct'] as const).filter(k => k !== key);
      const remaining = 100 - clamped;
      const otherTotal = mp[others[0]] + mp[others[1]];
      mp[key] = clamped;
      if (otherTotal > 0) {
        others.forEach(k => {
          mp[k] = Math.round(remaining * (mp[k] / otherTotal));
        });
      } else {
        mp[others[0]] = Math.round(remaining / 2);
        mp[others[1]] = remaining - mp[others[0]];
      }
      const sum = mp.savePct + mp.spendPct + mp.funPct;
      if (sum !== 100) mp[others[1]] += (100 - sum);
      return { ...prev, moneyPlan: mp };
    });
  };

  const applySmartSplit = () => {
    update(prev => ({ ...prev, moneyPlan: { ...prev.moneyPlan, savePct: 50, spendPct: 30, funPct: 20 } }));
    toast({ title: 'Smart split applied! 50% save, 30% spend, 20% fun' });
  };

  const income = plan.income;

  return (
    <Card className={isYouth ? 'border-slate-800 bg-slate-900' : ''}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 text-lg ${isYouth ? 'text-white' : 'text-slate-900'}`}>
          <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${isYouth ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
            <Wallet className="h-5 w-5 text-emerald-500" />
          </span>
          {title}
        </CardTitle>
        <p className={`text-sm ${isYouth ? 'text-slate-400' : 'text-slate-500'}`}>{subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Income input */}
        <div className="space-y-2">
          <Label className={`text-sm ${isYouth ? 'text-slate-400' : 'text-slate-600'}`}>{incomeLabel}</Label>
          {income > 0 ? (
            <div className="flex items-center justify-between">
              <div>
                <span className={`text-2xl font-bold ${isYouth ? 'text-white' : 'text-slate-900'}`}>
                  {formatMoney(income, data.currency)}
                </span>
                <span className={`ml-2 text-sm ${isYouth ? 'text-slate-400' : 'text-slate-500'}`}>per month</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={isYouth ? 'text-slate-400 hover:text-white' : 'text-slate-500'}
                onClick={() => update(prev => ({ ...prev, moneyPlan: { ...prev.moneyPlan, income: 0 } }))}
              >
                Change
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{currencySymbol}</span>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={incomeInput}
                  onChange={e => setIncomeInput(e.target.value)}
                  placeholder={incomePlaceholder}
                  className={`pl-8 ${isYouth ? 'border-slate-700 bg-slate-800 text-white' : ''}`}
                />
              </div>
              <Button onClick={handleSetIncome}>Set</Button>
            </div>
          )}
        </div>

        {/* Split visualization */}
        {income > 0 && (
          <>
            {/* Stacked bar */}
            <div className={`flex h-8 w-full overflow-hidden rounded-full ${isYouth ? 'bg-slate-800' : 'bg-slate-100'}`}>
              {buckets.map(b => {
                const pct = plan[b.key];
                return (
                  <div
                    key={b.key}
                    className={`${b.barClass} flex items-center justify-center text-xs font-bold text-white transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                    title={`${b.label}: ${pct}%`}
                  >
                    {pct >= 12 ? `${pct}%` : ''}
                  </div>
                );
              })}
            </div>

            {/* Bucket controls */}
            <div className="space-y-3">
              {buckets.map(b => {
                const Icon = b.icon;
                const pct = plan[b.key];
                const amount = (income * pct) / 100;
                return (
                  <div key={b.key} className={`rounded-xl p-4 ${b.bgClass}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-5 w-5 ${b.textClass}`} />
                        <span className={`font-semibold ${b.textClass}`}>{b.label}</span>
                      </div>
                      <span className={`text-lg font-bold ${b.textClass}`}>
                        {formatMoney(amount, data.currency)}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        onClick={() => adjustPct(b.key, -5)}
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold transition-colors ${
                          isYouth ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white text-slate-600 hover:bg-slate-100'
                        }`}
                        aria-label={`Decrease ${b.label}`}
                      >
                        −
                      </button>
                      <div className={`relative h-2 flex-1 overflow-hidden rounded-full ${isYouth ? 'bg-slate-800' : 'bg-white'}`}>
                        <div
                          className={`h-full rounded-full ${b.barClass} transition-all duration-300`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <button
                        onClick={() => adjustPct(b.key, 5)}
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold transition-colors ${
                          isYouth ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white text-slate-600 hover:bg-slate-100'
                        }`}
                        aria-label={`Increase ${b.label}`}
                      >
                        +
                      </button>
                      <div className="flex w-16 flex-shrink-0 items-center gap-1">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={pct}
                          onChange={e => setPctDirect(b.key, parseInt(e.target.value) || 0)}
                          className={`h-8 px-2 text-sm ${isYouth ? 'border-slate-700 bg-slate-800 text-white' : ''}`}
                        />
                        <span className={`text-xs ${isYouth ? 'text-slate-400' : 'text-slate-500'}`}>%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Balance warning + smart split */}
            <div className="flex items-center justify-between gap-2">
              {isBalanced ? (
                <span className={`flex items-center gap-1 text-sm font-medium ${isYouth ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  <Sparkles className="h-4 w-4" /> Balanced — your plan adds up to 100%
                </span>
              ) : (
                <span className={`text-sm font-medium ${isYouth ? 'text-amber-400' : 'text-amber-600'}`}>
                  Totals {total}% — adjust to reach 100%
                </span>
              )}
              <Button variant="outline" size="sm" onClick={applySmartSplit} className={isYouth ? 'border-slate-700 text-slate-300' : ''}>
                <Sparkles className="mr-1 h-3.5 w-3.5" /> Smart Split
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
