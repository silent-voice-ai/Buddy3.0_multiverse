'use client';

import { Coins } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AppData } from '@/lib/types';
import { formatMoney } from '@/lib/format';

interface RoundUpProps {
  data: AppData;
  update: (updater: (prev: AppData) => AppData) => void;
  isYouth?: boolean;
  showToggle?: boolean;
}

export function RoundUpDisplay({ data, update, isYouth, showToggle }: RoundUpProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Coins className="h-5 w-5 text-amber-500" />
          UPI Round-Up Savings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`rounded-lg p-4 ${isYouth ? 'bg-slate-800' : 'bg-amber-50'}`}>
          <div className={`text-xs ${isYouth ? 'text-slate-400' : 'text-amber-700'}`}>Total Round-Ups Saved</div>
          <div className={`text-2xl font-bold ${isYouth ? 'text-emerald-400' : 'text-amber-600'}`}>
            {formatMoney(data.totalRoundUps, data.currency)}
          </div>
        </div>

        <div className={`rounded-lg p-3 text-sm ${isYouth ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-50 text-slate-600'}`}>
          Every expense is rounded up to the next 10. The difference is added to your round-up savings.
        </div>

        {showToggle && (
          <div className="flex items-center justify-between">
            <Label htmlFor="roundup-toggle" className="text-sm font-medium">Round-Up Magic</Label>
            <Switch
              id="roundup-toggle"
              checked={data.roundUpEnabled}
              onCheckedChange={(checked) => update(prev => ({ ...prev, roundUpEnabled: checked }))}
            />
          </div>
        )}

        {!showToggle && (
          <div className={`text-center text-xs font-medium ${isYouth ? 'text-emerald-400' : 'text-emerald-600'}`}>
            Round-Up is always ON for Teens
          </div>
        )}
      </CardContent>
    </Card>
  );
}
