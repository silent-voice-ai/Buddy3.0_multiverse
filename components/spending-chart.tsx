'use client';

import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Expense } from '@/lib/types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface SpendingChartProps {
  expenses: Expense[];
  chartColors: string[];
  isYouth?: boolean;
}

export function SpendingChart({ expenses, chartColors, isYouth }: SpendingChartProps) {
  const chartData = useMemo(() => {
    const grouped: Record<string, number> = {};
    expenses.forEach(e => {
      const key = e.whereSpent;
      grouped[key] = (grouped[key] || 0) + e.amount;
    });
    const labels = Object.keys(grouped);
    const values = labels.map(l => grouped[l]);
    return { labels, values };
  }, [expenses]);

  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 flex-col items-center justify-center text-center">
            <div className={`mb-3 text-4xl ${isYouth ? 'opacity-40' : 'opacity-50'}`}>📊</div>
            <p className={isYouth ? 'text-slate-500' : 'text-slate-400'}>No expenses yet</p>
            <p className={`text-sm ${isYouth ? 'text-slate-600' : 'text-slate-400'}`}>Add your first expense to see the chart</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Spent',
        data: chartData.values,
        backgroundColor: chartColors.slice(0, chartData.labels.length),
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: isYouth ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
        ticks: { color: isYouth ? '#94a3b8' : '#64748b' },
      },
      x: {
        grid: { display: false },
        ticks: { color: isYouth ? '#94a3b8' : '#64748b' },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <Bar data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
