import { AgeGroup } from './types';

export interface ThemeConfig {
  name: string;
  gradient: string;
  bgClass: string;
  cardBg: string;
  primary: string;
  primaryText: string;
  accent: string;
  accentText: string;
  sidebarBg: string;
  sidebarText: string;
  sidebarActive: string;
  chartColors: string[];
  emoji: string;
  tagline: string;
}

export const themes: Record<AgeGroup, ThemeConfig> = {
  kids: {
    name: 'Little Saver World',
    gradient: 'from-amber-300 via-orange-300 to-pink-300',
    bgClass: 'bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50',
    cardBg: 'bg-white',
    primary: 'bg-orange-500',
    primaryText: 'text-orange-500',
    accent: 'bg-pink-400',
    accentText: 'text-pink-500',
    sidebarBg: 'bg-white',
    sidebarText: 'text-orange-600',
    sidebarActive: 'bg-orange-100 text-orange-700',
    chartColors: ['#f97316', '#ec4899', '#facc15', '#22c55e', '#3b82f6', '#a855f7'],
    emoji: '🐷',
    tagline: 'Little Saver World',
  },
  teens: {
    name: 'Teen Moneyverse',
    gradient: 'from-cyan-400 via-blue-500 to-purple-500',
    bgClass: 'bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50',
    cardBg: 'bg-white',
    primary: 'bg-blue-500',
    primaryText: 'text-blue-500',
    accent: 'bg-cyan-400',
    accentText: 'text-cyan-500',
    sidebarBg: 'bg-white',
    sidebarText: 'text-blue-600',
    sidebarActive: 'bg-blue-100 text-blue-700',
    chartColors: ['#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981'],
    emoji: '🎮',
    tagline: 'Teen Moneyverse',
  },
  youth: {
    name: 'Young Investor Pro',
    gradient: 'from-slate-800 via-slate-900 to-black',
    bgClass: 'bg-slate-950',
    cardBg: 'bg-slate-900',
    primary: 'bg-emerald-500',
    primaryText: 'text-emerald-400',
    accent: 'bg-emerald-500',
    accentText: 'text-emerald-400',
    sidebarBg: 'bg-slate-900',
    sidebarText: 'text-slate-400',
    sidebarActive: 'bg-emerald-500/10 text-emerald-400',
    chartColors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'],
    emoji: '📈',
    tagline: 'Young Investor Pro',
  },
};
