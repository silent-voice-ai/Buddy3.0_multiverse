export type AgeGroup = 'kids' | 'teens' | 'youth';

export type Currency = 'INR' | 'USD';

export interface User {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface AppData {
  ageGroup: AgeGroup | null;
  currency: Currency;
  petName: string;
  savings: number;
  goalAmount: number;
  goalEmoji: string;
  happiness: number;
  expenses: Expense[];
  budget: number;
  investedAmount: number;
  currentValue: number;
  roundUpEnabled: boolean;
  totalRoundUps: number;
  goals: SavingsGoal[];
  holdings: Holding[];
  moneyPlan: MoneyPlan;
  friends: Friend[];
  futureMessages: FutureMessage[];
}

export interface MoneyPlan {
  income: number;
  savePct: number;
  spendPct: number;
  funPct: number;
}

export interface Expense {
  id: string;
  whereSpent: string;
  amount: number;
  date: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentSaved: number;
}

export interface Holding {
  id: string;
  name: string;
  symbol: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
}

export interface Friend {
  id: string;
  name: string;
  savings: number;
}

export interface FutureMessage {
  id: string;
  message: string;
  createdAt: string;
  unlockDate: string;
  unlocked: boolean;
  reply?: string;
}
