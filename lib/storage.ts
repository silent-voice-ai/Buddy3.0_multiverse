import { AppData, Expense, FutureMessage, Holding, MoneyPlan } from './types';

const APP_DATA_KEY = 'buddy_app_data';
const CURRENT_USER_KEY = 'buddy_current_user';

export const defaultAppData: AppData = {
  ageGroup: null,
  currency: 'INR',
  petName: '',
  savings: 0,
  goalAmount: 0,
  goalEmoji: '🎁',
  happiness: 50,
  expenses: [],
  budget: 0,
  investedAmount: 0,
  currentValue: 0,
  roundUpEnabled: true,
  totalRoundUps: 0,
  goals: [],
  holdings: [] as Holding[],
  moneyPlan: { income: 0, savePct: 50, spendPct: 30, funPct: 20 } as MoneyPlan,
  friends: [],
  futureMessages: [],
};

export function getAppData(): AppData {
  if (typeof window === 'undefined') return defaultAppData;
  try {
    const raw = localStorage.getItem(APP_DATA_KEY);
    if (!raw) return defaultAppData;
    return { ...defaultAppData, ...JSON.parse(raw) };
  } catch {
    return defaultAppData;
  }
}

export function saveAppData(data: AppData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(APP_DATA_KEY, JSON.stringify(data));
}

export function resetAppData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(APP_DATA_KEY);
}

export function getCurrentUserId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CURRENT_USER_KEY);
}

export function setCurrentUserId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CURRENT_USER_KEY, id);
}

export function clearCurrentUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

export function calculateRoundUp(amount: number): number {
  const rounded = Math.ceil(amount / 10) * 10;
  return rounded - amount;
}

export function checkUnlock(message: FutureMessage): boolean {
  if (message.unlocked) return true;
  const now = new Date().getTime();
  const unlock = new Date(message.unlockDate).getTime();
  if (now >= unlock) return true;
  return false;
}
