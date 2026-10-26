// project/app/dashboard/goals/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAppData } from '@/lib/useAppData';
import { genId } from '@/lib/storage';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Target, Plus, Trash2, PiggyBank, Award } from 'lucide-react';

export default function GoalsPage() {
  const { data: appData, update, loaded } = useAppData();
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newEmoji, setNewEmoji] = useState('🎯');
  
  // Track numeric input states independently for each specific goal item ID
  const [savingsInputs, setSavingsInputs] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  // Lifecycle check to clear achieved goals on fresh page load or manual refresh
  useEffect(() => {
    if (loaded && appData?.goals?.length) {
      const hasCompletedGoals = appData.goals.some(goal => (goal.currentAmount || 0) >= goal.targetAmount);
      
      if (hasCompletedGoals) {
        update((prev) => {
          const resetGoals = (prev.goals || []).map((goal) => {
            if ((goal.currentAmount || 0) >= goal.targetAmount) {
              // Automatically restarts the target tracking from zero on initialization
              return {
                ...goal,
                currentAmount: 0,
              };
            }
            return goal;
          });
          return { ...prev, goals: resetGoals };
        });

        toast({
          title: 'Target Reset Triggered',
          description: 'Achieved goals have successfully reached 100% and restarted from zero.',
        });
      }
    }
  }, [loaded]);

  if (!loaded) {
    return <div className="p-8 text-center text-muted-foreground">Loading BUDDY Data...</div>;
  }

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTarget || parseFloat(newTarget) <= 0) {
      toast({
        title: 'Invalid Input',
        description: 'Please specify a name and a valid numeric goal target.',
        variant: 'destructive',
      });
      return;
    }

    const newGoal = {
      id: genId(),
      title: newTitle.trim(),
      targetAmount: parseFloat(newTarget),
      currentAmount: 0,
      emoji: newEmoji || '🎯',
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
      description: `"${newGoal.title}" has been added to your targets tracking board.`,
    });
  };

  const handleAddSavings = (goalId: string) => {
    const inputStr = savingsInputs[goalId];
    const amountToAdd = parseFloat(inputStr || '');

    if (isNaN(amountToAdd) || amountToAdd <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid positive numeric amount.',
        variant: 'destructive',
      });
      return;
    }

    // Process change using the useAppData update function wrapper to persist it automatically
    update((prev) => {
      const updatedGoals = (prev.goals || []).map((goal) => {
        if (goal.id === goalId) {
          // Additive logic: pre-existing saved amount + newly entered amount input
          const newCurrentAmount = Number(goal.currentAmount || 0) + amountToAdd;
          return {
            ...goal,
            currentAmount: newCurrentAmount,
          };
        }
        return goal;
      });

      return {
        ...prev,
        goals: updatedGoals,
      };
    });

    // Reset targeted inner input field state string
    setSavingsInputs((prev) => ({ ...prev, [goalId]: '' }));

    toast({
      title: 'Savings Logged',
      description: `Successfully added ₹${amountToAdd.toLocaleString('en-IN')} to your tracker.`,
    });
  };

  const handleDeleteGoal = (goalId: string, title: string) => {
    if (!confirm(`Are you sure you want to drop "${title}" from your goals?`)) return;

    update((prev) => ({
      ...prev,
      goals: (prev.goals || []).filter((g) => g.id !== goalId),
    }));

    toast({
      title: 'Goal Removed',
      description: `"${title}" has been deleted.`,
    });
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
          <Target className="h-8 w-8 text-primary" /> Target Dashboard
        </h1>
        <p className="text-muted-foreground">Manage your custom targets and log progressive savings safely.</p>
      </div>

      {/* New Goal Form Card Layout */}
      <Card>
        <CardHeader>
          <CardTitle>Create a New Target Goal</CardTitle>
          <CardDescription>Specify an amount to save toward custom financial metrics.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateGoal} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="title">Goal Name</Label>
              <Input
                id="title"
                placeholder="e.g. Dream Laptop"
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

      {/* Grid container rendering target progress fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(appData.goals || []).length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl bg-card">
            No active targets found. Complete the form configuration above to begin tracking.
          </div>
        ) : (
          (appData.goals || []).map((goal) => {
            const currentAmount = goal.currentAmount || 0;
            const isAchieved = currentAmount >= goal.targetAmount;
            const pct = Math.min((currentAmount / goal.targetAmount) * 100, 100);
            
            return (
              <Card key={goal.id} className={`relative group overflow-hidden transition-all duration-3xl ${isAchieved ? 'border-emerald-500 bg-emerald-50/30' : ''}`}>
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
                    <span className="text-3xl" role="img" aria-label="goal logo">
                      {isAchieved ? '🏆' : goal.emoji}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle>{goal.title}</CardTitle>
                        {isAchieved && <Award className="h-4 w-4 text-emerald-600 animate-bounce" />}
                      </div>
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
                      <span className={isAchieved ? 'text-emerald-600 font-extrabold' : 'text-primary'}>
                        {isAchieved ? 'Goal Completed!' : `₹${currentAmount.toLocaleString('en-IN')}`}
                      </span>
                    </div>
                    <Progress value={pct} className={`h-2.5 ${isAchieved ? 'bg-emerald-200' : ''}`} />
                    <div className="text-right text-xs text-muted-foreground">
                      {isAchieved ? 'Refreshing will reset progress to zero' : `${pct.toFixed(1)}% Completed`}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t">
                    <div className="flex-1 relative">
                      <Input
                        type="number"
                        placeholder={isAchieved ? "Goal Completed!" : "Add sum (₹)"}
                        className="pr-8"
                        disabled={isAchieved}
                        value={savingsInputs[goal.id] || ''}
