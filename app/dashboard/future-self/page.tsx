'use client';

import { useAppData } from '@/lib/useAppData';
import { FutureSelf } from '@/components/future-self';

export default function FutureSelfPage() {
  const { data, update, loaded } = useAppData();
  if (!loaded || !data.ageGroup) return null;
  const isYouth = data.ageGroup === 'youth';

  return (
    <div className="space-y-6">
      <h1 className={`text-2xl font-bold ${isYouth ? 'text-white' : 'text-slate-900'}`}>Talk to Future Self</h1>
      <FutureSelf data={data} update={update} isYouth={isYouth} />
    </div>
  );
}
