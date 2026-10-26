'use client';

import { useState } from 'react';
import { useAppData } from '@/lib/useAppData';
import { themes } from '@/lib/themes';
import { getCurrencySymbol, formatMoney } from '@/lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { genId } from '@/lib/storage';

export default function GoalsPage() {
  const { data, update, loaded } = useAppData();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [saved, setSaved] = useState('');

  if (!loaded || !data.ageGroup) return null;

  const theme = themes[data.ageGroup];
  const isYouth = data.ageGroup === 'youth';
  const currencySymbol = getCurrencySymbol(data.currency);

  const handleAddGoal = () => {
    if (!name.trim()) return toast({ title: 'Enter a goal name', variant: 'destructive' });
    const targetVal = parseFloat(target);
    const savedVal = parseFloat(saved) || 0;
    if (isNaN(targetVal) || targetVal <= 0) return toast({ title: 'Enter a valid target amount', variant: 'destructive' });

    update(prev => ({
      ...prev,
      goals: [...prev.goals, { id: genId(), name: name.trim(), targetAmount: targetVal, currentSaved: savedVal }],
    }));
    setName('');
    setTarget('');
    setSaved('');
    toast({ title: 'Goal added!' });
  };

  const handleUpdateSaved = (id: string, value: string) => {
    const val = parseFloat(value);
    if (isNaN(val) || val < 0) return;
    update(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.id === id ? { ...g, currentSaved: val } : g),
    }));
  };

  const handleDeleteGoal = (id: string) => {
    update(prev => ({ ...prev, goals: prev.goals.filter(g => g.id !== id) }));
  };

  // Kids also show piggy bank info on goals page
  const showPiggyBank = data.ageGroup === 'kids';

  return (
    <div className="space-y-6">
      <h1 className={`text-2xl font-bold ${isYouth ? 'text-white' : 'text-slate-900'}`}>Goals</h1>

      {showPiggyBank && (
        <Card className={isYouth ? 'border-slate-800 bg-slate-900' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5" /> Piggy Bank Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={isYouth ? 'text-slate-400' : 'text-slate-600'}>Current Savings</span>
                <span className={`font-bold ${isYouth ? 'text-white' : 'text-slate-900'}`}>{formatMoney(data.savings, data.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className={isYouth ? 'text-slate-400' : 'text-slate-600'}>Goal Amount</span>
                <span className={`font-bold ${isYouth ? 'text-white' : 'text-slate-900'}`}>{formatMoney(data.goalAmount, data.currency)}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${data.goalAmount > 0 ? Math.min(100, (data.savings / data.goalAmount) * 100) : 0}%` }}
                />
              </div>
              <p className={`text-sm ${isYouth ? 'text-slate-400' : 'text-slate-500'}`}>
                {data.goalAmount > 0
                  ? `${((data.savings / data.goalAmount) * 100).toFixed(0)}% of your goal reached!`
                  : 'Set a goal amount from the dashboard.'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Goal Form */}
      <Card className={isYouth ? 'border-slate-800 bg-slate-900' : ''}>
        <CardHeader>
          <CardTitle className="text-lg">Add a New Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="goalName">Goal name</Label>
              <Input id="goalName" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. New Bike" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="goalTarget">Target amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{currencySymbol}</span>
                <Input id="goalTarget" type="number" step="0.01" min="0" value={target} onChange={e => setTarget(e.target.value)} placeholder="0" className="pl-8" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="goalSaved">Already saved</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{currencySymbol}</span>
                <Input id="goalSaved" type="number" step="0.01" min="0" value={saved} onChange={e => setSaved(e.target.value)} placeholder="0" className="pl-8" />
              </div>
            </div>
          </div>
          <Button onClick={handleAddGoal} className="mt-4 w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add Goal
          </Button>
        </CardContent>
      </Card>

      {/* Goals List */}
      {data.goals.length > 0 ? (
        <div className="space-y-4">
          {data.goals.map(goal => {
            const percent = goal.targetAmount > 0 ? Math.min(100, (goal.currentSaved / goal.targetAmount) * 100) : 0;
            const remaining = Math.max(0, goal.targetAmount - goal.currentSaved);
            return (
              <Card key={goal.id} className={isYouth ? 'border-slate-800 bg-slate-900' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`font-semibold ${isYouth ? 'text-white' : 'text-slate-900'}`}>{goal.name}</h3>
                      <p className={`text-sm ${isYouth ? 'text-slate-400' : 'text-slate-500'}`}>
                        {formatMoney(goal.currentSaved, data.currency)} of {formatMoney(goal.targetAmount, data.currency)}
                      </p>
                    </div>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => handleDeleteGoal(goal.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${percent}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={isYouth ? 'text-slate-400' : 'text-slate-500'}>{percent.toFixed(0)}% complete</span>
                      <span className={isYouth ? 'text-slate-400' : 'text-slate-500'}>
                        {remaining > 0 ? `${formatMoney(remaining, data.currency)} to go` : 'Goal reached!'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <Label className={`text-xs ${isYouth ? 'text-slate-500' : 'text-slate-400'}`}>Update saved:</Label>
                      <div className="relative w-32">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{currencySymbol}</span>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={goal.currentSaved}
                          onChange={e => handleUpdateSaved(goal.id, e.target.value)}
                          className="h-8 pl-8 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className={isYouth ? 'border-slate-800 bg-slate-900' : ''}>
          <CardContent className="p-8 text-center">
            <Target className={`mx-auto mb-3 h-10 w-10 ${isYouth ? 'text-slate-600' : 'text-slate-300'}`} />
            <p className={isYouth ? 'text-slate-500' : 'text-slate-400'}>No goals yet. Add your first goal above!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
