'use client';

import { useAppData } from '@/lib/useAppData';
import { Roaster } from '@/components/roaster';

export default function RoasterPage() {
  const { data, loaded } = useAppData();
  if (!loaded || !data.ageGroup) return null;
  const isYouth = data.ageGroup === 'youth';

  return (
    <div className="space-y-6">
      <h1 className={`text-2xl font-bold ${isYouth ? 'text-white' : 'text-slate-900'}`}>The Roaster</h1>
      <Roaster data={data} isYouth={isYouth} />
    </div>
  );
}
