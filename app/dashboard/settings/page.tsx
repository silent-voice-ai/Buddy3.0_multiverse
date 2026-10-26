'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Globe, LogOut, Trash2, RefreshCw, User, Shield, FileText } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useAppData } from '@/lib/useAppData';
import { useToast } from '@/hooks/use-toast';
import { resetAppData } from '@/lib/storage';
import { AgeGroup, Currency } from '@/lib/types';
import { themes } from '@/lib/themes';

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout, deleteAccount } = useAuth();
  const { data, update, loaded } = useAppData();
  const { toast } = useToast();

  if (!loaded || !data.ageGroup) return null;

  const isYouth = data.ageGroup === 'youth';
  const theme = themes[data.ageGroup];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleReset = () => {
    resetAppData();
    router.push('/age-selection');
    toast({ title: 'App data has been reset.' });
  };

  const handleDeleteAccount = () => {
    deleteAccount();
    router.push('/');
    toast({ title: 'Your account has been deleted.' });
  };

  const handleChangeAgeGroup = (group: AgeGroup) => {
    update(prev => ({
      ...prev,
      ageGroup: group,
      roundUpEnabled: group === 'teens' ? true : prev.roundUpEnabled,
    }));
    toast({ title: `Switched to ${themes[group].name}` });
  };

  const handleChangeCurrency = (curr: Currency) => {
    update(prev => ({ ...prev, currency: curr }));
    toast({ title: `Currency changed to ${curr === 'INR' ? 'Indian Rupee (₹)' : 'US Dollar ($)'}` });
  };

  const ageGroups: { id: AgeGroup; label: string; ages: string }[] = [
    { id: 'kids', label: 'Little Saver World', ages: '3–10' },
    { id: 'teens', label: 'Teen Moneyverse', ages: '11–18' },
    { id: 'youth', label: 'Young Investor Pro', ages: '18–25' },
  ];

  return (
    <div className="space-y-6">
      <h1 className={`text-2xl font-bold ${isYouth ? 'text-white' : 'text-slate-900'}`}>Settings</h1>

      {/* Account Info */}
      <Card className={isYouth ? 'border-slate-800 bg-slate-900' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" /> Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className={isYouth ? 'text-slate-400' : 'text-slate-600'}>Name</span>
            <span className={`font-medium ${isYouth ? 'text-white' : 'text-slate-900'}`}>{user?.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className={isYouth ? 'text-slate-400' : 'text-slate-600'}>Email</span>
            <span className={`font-medium ${isYouth ? 'text-white' : 'text-slate-900'}`}>{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className={isYouth ? 'text-slate-400' : 'text-slate-600'}>Current World</span>
            <span className={`font-medium ${isYouth ? 'text-white' : 'text-slate-900'}`}>{theme.name}</span>
          </div>
        </CardContent>
      </Card>

      {/* Age Group Change */}
      <Card className={isYouth ? 'border-slate-800 bg-slate-900' : ''}>
        <CardHeader>
          <CardTitle className="text-lg">Change Age Group</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {ageGroups.map(ag => (
              <button
                key={ag.id}
                onClick={() => handleChangeAgeGroup(ag.id)}
                className={`rounded-xl border-2 p-4 text-left transition-all ${
                  data.ageGroup === ag.id
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
                    : isYouth ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`font-medium ${isYouth ? 'text-white' : 'text-slate-900'}`}>{ag.label}</div>
                <div className={`text-sm ${isYouth ? 'text-slate-400' : 'text-slate-500'}`}>Ages {ag.ages}</div>
                {data.ageGroup === ag.id && <div className="mt-1 text-xs font-medium text-emerald-500">Currently selected</div>}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Currency */}
      <Card className={isYouth ? 'border-slate-800 bg-slate-900' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe className="h-5 w-5" /> Currency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="inline-flex rounded-lg border p-1">
            <button
              onClick={() => handleChangeCurrency('INR')}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${data.currency === 'INR' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
            >
              India (₹)
            </button>
            <button
              onClick={() => handleChangeCurrency('USD')}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${data.currency === 'USD' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}
            >
              US ($)
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Round-Up Toggle (Youth only) */}
      {data.ageGroup === 'youth' && (
        <Card className={isYouth ? 'border-slate-800 bg-slate-900' : ''}>
          <CardHeader>
            <CardTitle className="text-lg">UPI Round-Up Magic</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="roundup" className="text-sm">Enable round-up savings</Label>
              <Switch
                id="roundup"
                checked={data.roundUpEnabled}
                onCheckedChange={(checked) => update(prev => ({ ...prev, roundUpEnabled: checked }))}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legal Links */}
      <Card className={isYouth ? 'border-slate-800 bg-slate-900' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5" /> Legal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Link href="/privacy" className={`flex items-center gap-2 text-sm hover:underline ${isYouth ? 'text-slate-300' : 'text-slate-700'}`}>
            <FileText className="h-4 w-4" /> Privacy Policy
          </Link>
          <Link href="/terms" className={`flex items-center gap-2 text-sm hover:underline ${isYouth ? 'text-slate-300' : 'text-slate-700'}`}>
            <FileText className="h-4 w-4" /> Terms of Use
          </Link>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className={isYouth ? 'border-red-900/50 bg-slate-900' : 'border-red-200'}>
        <CardHeader>
          <CardTitle className="text-lg text-red-500">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Reset App Data */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full border-amber-300 text-amber-600 hover:bg-amber-50">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset App Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset all app data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will clear all your spending records, goals, investments, and preferences. Your account will remain. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset} className="bg-amber-600 hover:bg-amber-700">
                  Yes, Reset Data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Logout */}
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Log Out
          </Button>

          {/* Delete Account */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account permanently?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your account and all associated data. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                  Yes, Delete My Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
