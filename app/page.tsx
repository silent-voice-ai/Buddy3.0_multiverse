// project/app/dashboard/goals/page.tsx
'use client';

import React, { useState } from 'react';
import { useAppData } from '@/lib/useAppData';
import { genId } from '@/lib/storage';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Target, Plus, Trash2, PiggyBank, Sparkles, RefreshCw } from 'lucide-react';

export default function GoalsPage() {
  const { data: appData, update, loaded } = useAppData();
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newEmoji, setNewEmoji] = useState('🎯');
  
  // Track numeric input states independently for each specific goal item ID
  const [savingsInputs, setSavingsInputs] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  if (!loaded) {
    return (
      <div className="p-8 text-center text-muted-foreground flex items-center justify-center min-h-[400px]">
        Loading BUDDY Data...
      </div>
    );
  }

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const targetVal = parseFloat(newTarget.replace(/,/g, '').trim());

    if (!newTitle.trim() || isNaN(targetVal) || targetVal <= 0) {
      toast({
        title: 'Invalid Input',
        description: 'Please specify a name and a valid numeric target amount.',
        variant: 'destructive',
      });
      return;
    }

    const newGoal = {
      id: genId(),
      title: newTitle.trim(),
      targetAmount: targetVal,
      currentAmount: 0,
      emoji: newEmoji.trim() || '🎯',
      createdAt: new Date().toISOString(),
    };

    update((prev) => ({
      ...prev,
      goals: [...(prev.goals || []), newGoal],
    }));

    setNewTitle('');
    setNewTarget('');
    setNewEmoji('🎯');

    toast({
      title: 'Goal Created!',
      description: `"${newGoal.title}" has been added to your target tracking board.`,
    });
  };

  const handleAddSavings = (goalId: string) => {
    const inputStr = savingsInputs[goalId] || '';
    const cleanInput = inputStr.replace(/,/g, '').trim();
    const amountToAdd = parseFloat(cleanInput);

    if (isNaN(amountToAdd) || amountToAdd <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid positive numeric amount to deposit.',
        variant: 'destructive',
      });
      return;
    }

    // Read goal state directly from 'prev' inside closure to ensure 100% additive accuracy
    update((prev) => {
      const updatedGoals = (prev.goals || []).map((goal) => {
        if (goal.id === goalId) {
          const currentSaved = Number(goal.currentAmount || 0);
          return {
            ...goal,
            currentAmount: currentSaved + amountToAdd,
          };
        }
        return goal;
      });

      return {
        ...prev,
        goals: updatedGoals,
      };
    });

    // Reset targeted input text field
    setSavingsInputs((prev) => ({ ...prev, [goalId]: '' }));

    toast({
      title: 'Savings Logged!',
      description: `Successfully added ₹${amountToAdd.toLocaleString('en-IN')} to your tracker.`,
    });
  };

  const handleResetGoalCycle = (goalId: string, title: string, targetAmount: number) => {
    update((prev) => {
      const updatedGoals = (prev.goals || []).map((goal) => {
        if (goal.id === goalId) {
          const totalSaved = Number(goal.currentAmount || 0);
          // Carryover: If total saved is 1200 and target is 1000, 200 stays as rollover
          const rolloverAmount = Math.max(0, totalSaved - targetAmount);
          
          return {
            ...goal,
            currentAmount: rolloverAmount,
          };
        }
        return goal;
      });

      return {
        ...prev,
        goals: updatedGoals,
      };
    });

    toast({
      title: 'New Cycle Started!',
      description: `"${title}" has been reset. Any excess carryover balances were kept in place!`,
    });
  };

  const handleDeleteGoal = (goalId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    update((prev) => ({
      ...prev,
      goals: (prev.goals || []).filter((g) => g.id !== goalId),
    }));

    toast({
      title: 'Goal Removed',
      description: `"${title}" has been removed from your targets.`,
    });
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
          <Target className="h-8 w-8 text-primary" /> Target Dashboard
        </h1>
        <p className="text-muted-foreground">Manage your custom savings goals and log progressive deposits safely.</p>
      </div>

      {/* New Goal Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Create a New Target Goal</CardTitle>
          <CardDescription>Specify an amount to save toward a custom financial target.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateGoal} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="title">Goal Name</Label>
              <Input
                id="title"
                placeholder="e.g. New Laptop"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target">Target Value (₹)</Label>
              <Input
                id="target"
                type="number"
                placeholder="e.g. 50000"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emoji">Emoji Icon</Label>
              <Input
                id="emoji"
                placeholder="🎯"
                value={newEmoji}
                onChange={(e) => setNewEmoji(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full flex items-center gap-2">
              <Plus className="h-4 w-4" /> Create Target
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Active Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(appData.goals || []).length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl bg-card">
            No active targets found. Fill out the form above to start tracking your savings!
          </div>
        ) : (
          (appData.goals || []).map((goal) => {
            const currentAmount = goal.currentAmount || 0;
            const isAchieved = currentAmount >= goal.targetAmount;
            const pct = Math.min((currentAmount / goal.targetAmount) * 100, 100);

            return (
              <Card
                key={goal.id}
                className={`relative group overflow-hidden transition-all duration-300 ${
                  isAchieved ? 'border-emerald-500 bg-emerald-50/40 shadow-md shadow-emerald-100/50' : ''
                }`}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-80 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDeleteGoal(goal.id, goal.title)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl" role="img" aria-label="goal emoji">
                      {isAchieved ? '🎉' : goal.emoji}
                    </span>
                    <div>
                      <CardTitle className={isAchieved ? 'text-emerald-900 font-bold' : ''}>
                        {goal.title}
                      </CardTitle>
                      <CardDescription>
                        Target: ₹{goal.targetAmount.toLocaleString('en-IN')}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between font-semibold text-sm">
                      <span className="text-muted-foreground">Saved Balance:</span>
                      <span
                        className={
                          isAchieved
                            ? 'text-emerald-600 font-extrabold flex items-center gap-1'
                            : 'text-primary'
                        }
                      >
                        ₹{currentAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <Progress value={pct} className={`h-2.5 ${isAchieved ? 'bg-emerald-200' : ''}`} />

                    <div className="flex justify-between text-xs font-medium text-muted-foreground">
                      <span>{pct.toFixed(1)}% Saved</span>
                      {isAchieved && (
                        <span className="text-emerald-700 font-bold flex items-center gap-1 animate-pulse">
                          Goal Achieved!
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions / Inputs Area */}
                  {isAchieved ? (
                    <div className="pt-2 border-t flex flex-col gap-2">
                      <div className="p-2.5 rounded-lg bg-emerald-100/70 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 shrink-0 text-emerald-600" />
                        Target reached! You can start a new savings cycle for this goal.
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full flex items-center justify-center gap-2 border-emerald-500 text-emerald-700 hover:bg-emerald-100"
                        onClick={() => handleResetGoalCycle(goal.id, goal.title, goal.targetAmount)}
                      >
                        <RefreshCw className="h-4 w-4" /> Start Next Cycle
                      </Button>
                    </div>
                  ) : (
                    <div className="pt-2 border-t flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Add savings (₹)"
                        value={savingsInputs[goal.id] || ''}
                        onChange={(e) =>
                          setSavingsInputs((prev) => ({ ...prev, [goal.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSavings(goal.id);
                          }
                        }}
                        className="h-9"
                      />
                      <Button
                        size="sm"
                        className="shrink-0 flex items-center gap-1.5"
                        onClick={() => handleAddSavings(goal.id)}
                      >
                        <PiggyBank className="h-4 w-4" /> Deposit
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
