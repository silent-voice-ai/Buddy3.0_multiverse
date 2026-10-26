'use client';

import { BuddyStore } from '@/components/buddy-store';
import { useAppData } from '@/lib/useAppData';

export default function DashboardStorePage() {
  const { data, loaded } = useAppData();
  if (!loaded || !data.ageGroup) return null;
  const isYouth = data.ageGroup === 'youth';

  return <BuddyStore isYouth={isYouth} />;
}
