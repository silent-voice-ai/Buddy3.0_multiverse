const handleAddSavings = (goalId: string) => {
  const input = (savingsInputs[goalId] || '')
    .replace(/,/g, '')
    .trim();

  const amount = Number(input);
  const depositPaise = Math.round(amount * 100);

  if (
    !input ||
    !Number.isFinite(amount) ||
    amount <= 0 ||
    !Number.isSafeInteger(depositPaise) ||
    depositPaise <= 0
  ) {
    toast({
      title: 'Invalid Amount',
      description: 'Please enter a valid amount of at least ₹0.01.',
      variant: 'destructive',
    });
    return;
  }

  const selectedGoal = (appData.goals || []).find(
    (goal) => goal.id === goalId
  );

  if (!selectedGoal) {
    toast({
      title: 'Goal Not Found',
      description: 'Please refresh the page and try again.',
      variant: 'destructive',
    });
    return;
  }

  const targetPaise = Math.round(
    Number(selectedGoal.targetAmount) * 100
  );

  if (
    !Number.isSafeInteger(targetPaise) ||
    targetPaise <= 0
  ) {
    toast({
      title: 'Invalid Target',
      description: 'This goal needs a valid positive target amount.',
      variant: 'destructive',
    });
    return;
  }

  update((prev) => ({
    ...prev,
    goals: (prev.goals || []).map((goal) => {
      if (goal.id !== goalId) return goal;

      const savedPaise = Math.round(
        Number(goal.currentAmount || 0) * 100
      );
      const goalTargetPaise = Math.round(
        Number(goal.targetAmount) * 100
      );

      if (
        !Number.isSafeInteger(savedPaise) ||
        savedPaise < 0 ||
        !Number.isSafeInteger(goalTargetPaise) ||
        goalTargetPaise <= 0
      ) {
        return goal;
      }

      const totalPaise = savedPaise + depositPaise;

      if (!Number.isSafeInteger(totalPaise)) {
        return goal;
      }

      // Complete as many cycles as necessary and keep the remainder.
      const remainingPaise = totalPaise % goalTargetPaise;

      return {
        ...goal,
        currentAmount: remainingPaise / 100,
      };
    }),
  }));

  setSavingsInputs((prev) => ({
    ...prev,
    [goalId]: '',
  }));

  toast({
    title: 'Savings Submitted',
    description:
      'Your contribution has been added. Any completed target cycles restart automatically, with extra savings carried forward.',
  });
};
