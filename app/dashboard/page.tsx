'use client';

import { useAppData } from '@/lib/useAppData';
import { themes } from '@/lib/themes';
import { formatMoney, getCurrencySymbol } from '@/lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PiggyBank, Heart, Plus, Target, TrendingUp, Coins, Sparkles } from 'lucide-react';
import { SpendingForm } from '@/components/spending-form';
import { SpendingChart } from '@/components/spending-chart';
import { SpendingList } from '@/components/spending-list';
import { BudgetManager } from '@/components/budget-manager';
import { InvestmentCard } from '@/components/investment-card';
import { RoundUpDisplay } from '@/components/round-up-display';
import { Roaster } from '@/components/roaster';
import { PiggyBankVisual } from '@/components/piggy-bank-visual';
import { MoneyPlanner } from '@/components/money-planner';
import Link from 'next/link';

export default function DashboardPage() {
  const { data, update, loaded } = useAppData();

  if (!loaded || !data.ageGroup) return null;

  const theme = themes[data.ageGroup];
  const currencySymbol = getCurrencySymbol(data.currency);
  const isYouth = data.ageGroup === 'youth';

  if (data.ageGroup === 'kids') {
    return <KidsDashboard data={data} update={update} theme={theme} currencySymbol={currencySymbol} />;
  }
  if (data.ageGroup === 'teens') {
    return <TeensDashboard data={data} update={update} theme={theme} currencySymbol={currencySymbol} />;
  }
  return <YouthDashboard data={data} update={update} theme={theme} currencySymbol={currencySymbol} isYouth={isYouth} />;
}

// =================== KIDS ===================
function KidsDashboard({ data, update, theme, currencySymbol }: any) {
  const { toast } = useToast();
  const [petNameInput, setPetNameInput] = useState('');
  const [savingsInput, setSavingsInput] = useState('');
  const [goalInput, setGoalInput] = useState('');

  const savingsPercent = data.goalAmount > 0 ? Math.min(100, (data.savings / data.goalAmount) * 100) : 0;
  const happinessLevel = data.happiness;
  const happinessEmoji = happinessLevel >= 80 ? '🤩' : happinessLevel >= 60 ? '😊' : happinessLevel >= 40 ? '😐' : happinessLevel >= 20 ? '😢' : '😭';

  const handleSetPet = () => {
    if (!petNameInput.trim()) return toast({ title: 'Please enter a pet name', variant: 'destructive' });
    update((prev: any) => ({ ...prev, petName: petNameInput.trim() }));
    setPetNameInput('');
    toast({ title: `Meet your pet, ${petNameInput.trim()}!` });
  };

  const handleSetSavings = () => {
    const val = parseFloat(savingsInput);
    if (isNaN(val) || val < 0) return toast({ title: 'Enter a valid amount', variant: 'destructive' });
    update((prev: any) => ({ ...prev, savings: val }));
    setSavingsInput('');
    toast({ title: 'Savings updated!' });
  };

  const handleSetGoal = () => {
    const val = parseFloat(goalInput);
    if (isNaN(val) || val <= 0) return toast({ title: 'Enter a valid goal amount', variant: 'destructive' });
    update((prev: any) => ({ ...prev, goalAmount: val }));
    setGoalInput('');
    toast({ title: 'Goal set!' });
  };

  const handleFeed = () => {
    update((prev: any) => ({ ...prev, happiness: Math.min(100, prev.happiness + 10) }));
    toast({ title: `Yum! ${data.petName || 'Your pet'} is happier!` });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🐷</span>
        <div>
          <h1 className="text-2xl font-bold text-orange-600">Little Saver World</h1>
          <p className="text-sm text-slate-500">Let&apos;s save together!</p>
        </div>
      </div>

      {/* Pet Section */}
      <Card className="border-2 border-orange-200 bg-gradient-to-br from-amber-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-orange-700">
            <PiggyBank className="h-6 w-6" />
            {data.petName ? `Meet ${data.petName}!` : 'Name Your Pet'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!data.petName ? (
            <div className="flex gap-2">
              <Input
                value={petNameInput}
                onChange={e => setPetNameInput(e.target.value)}
                placeholder="Enter pet name"
                className="border-orange-200"
              />
              <Button onClick={handleSetPet} className="bg-orange-500 hover:bg-orange-600">Save Name</Button>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-2 text-6xl">{happinessEmoji}</div>
              <div className="mb-4">
                <div className="mb-1 flex items-center justify-center gap-2 text-sm font-medium text-orange-700">
                  <Heart className="h-4 w-4" /> Happiness: {happinessLevel}%
                </div>
                <div className="mx-auto h-4 w-full max-w-xs overflow-hidden rounded-full bg-orange-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-pink-400 to-orange-400 transition-all duration-500"
                    style={{ width: `${happinessLevel}%` }}
                  />
                </div>
              </div>
              <Button onClick={handleFeed} className="bg-orange-500 hover:bg-orange-600 text-lg" size="lg">
                🍎 Feed {data.petName}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Money Planner */}
      <MoneyPlanner data={data} update={update} ageGroup="kids" />

      {/* Piggy Bank */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-2 border-pink-200">
          <CardHeader>
            <CardTitle className="text-lg text-pink-600">🐷 Piggy Bank</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <PiggyBankVisual
              savings={data.savings}
              goalAmount={data.goalAmount}
              goalEmoji={data.goalEmoji}
              currencySymbol={currencySymbol}
            />
            <div className="rounded-xl bg-pink-50 p-3 text-center">
              <div className="text-sm text-pink-600">Current Savings</div>
              <div className="text-2xl font-bold text-pink-700">{currencySymbol}{data.savings.toFixed(2)}</div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Pick your target</Label>
              <div className="flex flex-wrap gap-1.5">
                {['🎁', '🚲', '🎮', '🧸', '⚽', '🎨', '🪀', '🛴'].map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => update((prev: any) => ({ ...prev, goalEmoji: emoji }))}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg transition-all ${
                      data.goalEmoji === emoji ? 'bg-pink-500 ring-2 ring-pink-300' : 'bg-pink-50 hover:bg-pink-100'
                    }`}
                    aria-label={`Pick ${emoji} as your target`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              {data.goalAmount > 0 && data.savings >= data.goalAmount && (
                <div className="mt-2 rounded-lg bg-emerald-50 p-3 text-center">
                  <div className="mb-1 text-3xl">{data.goalEmoji}</div>
                  <p className="text-sm font-semibold text-emerald-600">You got it! Here&apos;s your {data.goalEmoji}!</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Goal: {currencySymbol}{data.goalAmount.toFixed(2)}</span>
                <span className="font-medium text-pink-600">{savingsPercent.toFixed(0)}%</span>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-pink-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-pink-400 to-orange-400 transition-all duration-500"
                  style={{ width: `${savingsPercent}%` }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Update savings</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{currencySymbol}</span>
                  <Input type="number" step="0.01" min="0" value={savingsInput} onChange={e => setSavingsInput(e.target.value)} placeholder={data.savings.toString()} className="pl-8" />
                </div>
                <Button onClick={handleSetSavings} className="bg-pink-500 hover:bg-pink-600">Save</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Set goal amount</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{currencySymbol}</span>
                  <Input type="number" step="0.01" min="0" value={goalInput} onChange={e => setGoalInput(e.target.value)} placeholder={data.goalAmount.toString() || '0'} className="pl-8" />
                </div>
                <Button onClick={handleSetGoal} variant="outline" className="border-pink-300 text-pink-600">Set</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <SpendingForm data={data} update={update} currencySymbol={currencySymbol} />
      </div>

      <SpendingChart expenses={data.expenses} chartColors={theme.chartColors} />

      <SpendingList expenses={data.expenses} data={data} update={update} currency={data.currency} />

      <BudgetManager data={data} update={update} />

      <div className="rounded-xl bg-gradient-to-r from-orange-100 to-pink-100 p-6 text-center">
        <Sparkles className="mx-auto mb-2 h-8 w-8 text-orange-400" />
        <p className="text-sm font-medium text-orange-700">Great job saving! Keep feeding your piggy bank!</p>
      </div>
    </div>
  );
}

// =================== TEENS ===================
function TeensDashboard({ data, update, theme, currencySymbol }: any) {
  const { toast } = useToast();
  const [friendName, setFriendName] = useState('');
  const [friendSavings, setFriendSavings] = useState('');

  const totalSpent = data.expenses.reduce((sum: number, e: any) => sum + e.amount, 0);
  const sortedFriends = [...data.friends].sort((a, b) => b.savings - a.savings);

  const handleAddFriend = () => {
    if (!friendName.trim()) return toast({ title: 'Enter a friend name', variant: 'destructive' });
    const val = parseFloat(friendSavings);
    if (isNaN(val) || val < 0) return toast({ title: 'Enter valid savings', variant: 'destructive' });
    update((prev: any) => ({
      ...prev,
      friends: [...prev.friends, { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7), name: friendName.trim(), savings: val }],
    }));
    setFriendName('');
    setFriendSavings('');
    toast({ title: 'Friend added!' });
  };

  const handleDeleteFriend = (id: string) => {
    update((prev: any) => ({ ...prev, friends: prev.friends.filter((f: any) => f.id !== id) }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🎮</span>
        <div>
          <h1 className="text-2xl font-bold text-blue-600">Teen Moneyverse</h1>
          <p className="text-sm text-slate-500">Level up your money game!</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Target className="h-4 w-4" /> Total Spent
          </div>
          <div className="mt-1 text-xl font-bold text-slate-900">{currencySymbol}{totalSpent.toFixed(2)}</div>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Coins className="h-4 w-4" /> Round-Ups
          </div>
          <div className="mt-1 text-xl font-bold text-amber-600">{currencySymbol}{data.totalRoundUps.toFixed(2)}</div>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <TrendingUp className="h-4 w-4" /> Invested
          </div>
          <div className="mt-1 text-xl font-bold text-slate-900">{currencySymbol}{data.investedAmount.toFixed(2)}</div>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <PiggyBank className="h-4 w-4" /> Savings
          </div>
          <div className="mt-1 text-xl font-bold text-blue-600">{currencySymbol}{data.savings.toFixed(2)}</div>
        </div>
      </div>

      <MoneyPlanner data={data} update={update} ageGroup="teens" />

      <div className="grid gap-6 lg:grid-cols-2">
        <SpendingForm data={data} update={update} currencySymbol={currencySymbol} showRoundUp />
        <RoundUpDisplay data={data} update={update} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <InvestmentCard data={data} update={update} />
        <BudgetManager data={data} update={update} />
      </div>

      <SpendingChart expenses={data.expenses} chartColors={theme.chartColors} />

      <SpendingList expenses={data.expenses} data={data} update={update} currency={data.currency} />

      {/* Friends Savings Royale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-blue-600">
            🏆 Friends Savings Royale
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input value={friendName} onChange={e => setFriendName(e.target.value)} placeholder="Friend name" className="flex-1" />
            <div className="relative sm:w-40">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{currencySymbol}</span>
              <Input type="number" step="0.01" min="0" value={friendSavings} onChange={e => setFriendSavings(e.target.value)} placeholder="Savings" className="pl-8" />
            </div>
            <Button onClick={handleAddFriend} className="bg-blue-500 hover:bg-blue-600">
              <Plus className="mr-1 h-4 w-4" /> Add
            </Button>
          </div>

          {sortedFriends.length > 0 ? (
            <div className="space-y-2">
              {sortedFriends.map((friend, idx) => (
                <div key={friend.id} className="flex items-center gap-3 rounded-lg border bg-slate-50 p-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    idx === 0 ? 'bg-amber-100 text-amber-700' : idx === 1 ? 'bg-slate-200 text-slate-600' : idx === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {idx + 1}
                  </div>
                  <span className="flex-1 font-medium text-slate-800">{friend.name}</span>
                  <span className="font-bold text-blue-600">{currencySymbol}{friend.savings.toFixed(2)}</span>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-red-400 hover:bg-red-50" onClick={() => handleDeleteFriend(friend.id)}>
                    ×
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400">
              <p>No friends added yet. Add friends and their savings to see the leaderboard!</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Roaster data={data} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/dashboard/future-self">
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-3 p-4">
              <span className="text-2xl">📬</span>
              <div>
                <div className="font-semibold text-slate-900">Talk to Future Self</div>
                <div className="text-sm text-slate-500">Write a letter to future you</div>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/roaster">
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-3 p-4">
              <span className="text-2xl">🔥</span>
              <div>
                <div className="font-semibold text-slate-900">Roaster</div>
                <div className="text-sm text-slate-500">Get roasted on your spending</div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

// =================== YOUTH ===================
function YouthDashboard({ data, update, theme, currencySymbol, isYouth }: any) {
  const totalSpent = data.expenses.reduce((sum: number, e: any) => sum + e.amount, 0);
  const totalGrowth = data.currentValue - data.investedAmount;
  const growthPercent = data.investedAmount > 0 ? (totalGrowth / data.investedAmount) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Young Investor Pro</h1>
          <p className="text-sm text-slate-400">Your premium money dashboard</p>
        </div>
        <span className="text-2xl">📈</span>
      </div>

      {/* Portfolio Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="text-sm text-slate-400">Total Invested</div>
          <div className="mt-1 text-xl font-bold text-white">{currencySymbol}{data.investedAmount.toFixed(2)}</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="text-sm text-slate-400">Current Value</div>
          <div className="mt-1 text-xl font-bold text-white">{currencySymbol}{data.currentValue.toFixed(2)}</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="text-sm text-slate-400">Total Growth</div>
          <div className={`mt-1 text-xl font-bold ${totalGrowth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {totalGrowth >= 0 ? '+' : ''}{currencySymbol}{totalGrowth.toFixed(2)}
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="text-sm text-slate-400">Growth %</div>
          <div className={`mt-1 text-xl font-bold ${growthPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {growthPercent >= 0 ? '+' : ''}{growthPercent.toFixed(2)}%
          </div>
        </div>
      </div>

      <MoneyPlanner data={data} update={update} ageGroup="youth" isYouth={isYouth} />

      <div className="grid gap-6 lg:grid-cols-2">
        <InvestmentCard data={data} update={update} isYouth={isYouth} />
        <RoundUpDisplay data={data} update={update} isYouth={isYouth} showToggle />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <BudgetManager data={data} update={update} isYouth={isYouth} />
        <SpendingForm data={data} update={update} currencySymbol={currencySymbol} showRoundUp />
      </div>

      <SpendingChart expenses={data.expenses} chartColors={theme.chartColors} isYouth={isYouth} />

      <SpendingList expenses={data.expenses} data={data} update={update} currency={data.currency} isYouth={isYouth} />

      <Link href="/dashboard/future-self">
        <Card className="cursor-pointer border-slate-800 bg-slate-900 transition-shadow hover:shadow-lg">
          <CardContent className="flex items-center gap-3 p-4">
            <span className="text-2xl">📬</span>
            <div>
              <div className="font-semibold text-white">Talk to Future Self</div>
              <div className="text-sm text-slate-400">Write a letter to future you</div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
