'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ShieldCheck } from 'lucide-react';
import { useAppData } from '@/lib/useAppData';

const products = [
  {
    id: 1,
    name: 'BUDDY Money Starter Pack',
    price: 99,
    currency: '₹',
    description: '30-day savings challenge, expense tracker template, money-habit checklist',
    features: ['30-day savings challenge', 'Expense tracker template', 'Money-habit checklist'],
  },
  {
    id: 2,
    name: 'Teen Investor Starter Kit',
    price: 199,
    currency: '₹',
    description: 'Beginner investing guide, goal planner, savings tracker',
    features: ['Beginner investing guide', 'Goal planner', 'Savings tracker'],
  },
  {
    id: 3,
    name: 'BUDDY Complete Pack',
    price: 299,
    currency: '₹',
    description: 'All planners, templates, themes, and guides',
    features: ['All planners', 'All templates', 'All themes', 'All guides'],
  },
];

export function BuddyStore({ isYouth }: { isYouth?: boolean }) {
  const { data } = useAppData();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className={`text-2xl font-bold ${isYouth ? 'text-white' : 'text-slate-900'}`}>BUDDY Store</h1>
        <p className={`mt-1 text-sm ${isYouth ? 'text-slate-400' : 'text-slate-500'}`}>
          Digital products to level up your money game
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {products.map(product => (
          <Card key={product.id} className={`flex flex-col ${isYouth ? 'border-slate-800 bg-slate-900' : ''}`}>
            <CardHeader>
              <div className={`mb-2 flex h-12 w-12 items-center justify-center rounded-xl ${isYouth ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                <Package className="h-6 w-6 text-emerald-500" />
              </div>
              <CardTitle className={`text-lg ${isYouth ? 'text-white' : 'text-slate-900'}`}>{product.name}</CardTitle>
              <div className="text-2xl font-bold text-emerald-500">
                {product.currency}{product.price}
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <ul className="mb-4 space-y-1.5 text-sm">
                {product.features.map(feature => (
                  <li key={feature} className={`flex items-center gap-2 ${isYouth ? 'text-slate-300' : 'text-slate-600'}`}>
                    <span className="text-emerald-500">✓</span> {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-auto space-y-3">
                <div className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-center text-sm font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                  Payment Coming Soon
                </div>
                <p className={`text-center text-xs ${isYouth ? 'text-slate-500' : 'text-slate-400'}`}>
                  Digital product. Delivery details will be shared after payment.
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment info */}
      <Card className={isYouth ? 'border-slate-800 bg-slate-900' : ''}>
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 flex-shrink-0 text-emerald-500" />
            <div className={`text-sm space-y-2 ${isYouth ? 'text-slate-400' : 'text-slate-600'}`}>
              <p>BUDDY does not collect your UPI PIN, OTP, bank password, or card details.</p>
              <p>All purchases are digital products. Delivery details will be shared after payment is confirmed.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
