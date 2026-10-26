'use client';

import { useEffect, useState } from 'react';

interface PiggyBankVisualProps {
  savings: number;
  goalAmount: number;
  goalEmoji: string;
  currencySymbol: string;
}

const CONFETTI_COLORS = ['#f472b6', '#fb923c', '#facc15', '#34d399', '#60a5fa', '#a78bfa'];

export function PiggyBankVisual({ savings, goalAmount, currencySymbol }: PiggyBankVisualProps) {
  const percent = goalAmount > 0 ? Math.min(100, (savings / goalAmount) * 100) : 0;
  const reached = goalAmount > 0 && savings >= goalAmount;

  // Trigger the burst animation exactly once when the goal is reached.
  const [bursting, setBursting] = useState(false);
  const [hasBurst, setHasBurst] = useState(false);
  const [confetti, setConfetti] = useState<{ id: number; left: number; color: string; delay: number }[]>([]);

  useEffect(() => {
    if (reached && !hasBurst) {
      setBursting(true);
      setHasBurst(true);
      const pieces = Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: 10 + Math.random() * 80,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay: Math.random() * 0.3,
      }));
      setConfetti(pieces);
      const t = setTimeout(() => setBursting(false), 1400);
      return () => clearTimeout(t);
    }
    if (!reached && hasBurst) {
      setHasBurst(false);
      setConfetti([]);
    }
  }, [reached, hasBurst]);

  const fillHeight = reached ? 100 : percent;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-40 w-40">
        {/* Confetti layer */}
        {confetti.length > 0 && (
          <div className="pointer-events-none absolute inset-0 z-20">
            {confetti.map(c => (
              <span
                key={c.id}
                className="animate-confetti absolute top-0 h-2 w-2 rounded-sm"
                style={{ left: `${c.left}%`, backgroundColor: c.color, animationDelay: `${c.delay}s` }}
              />
            ))}
          </div>
        )}

        {/* Piggy bank SVG */}
        <svg
          viewBox="0 0 120 120"
          className={`relative z-10 h-full w-full drop-shadow-md ${bursting ? 'animate-piggy-burst' : reached ? 'animate-piggy-shake' : ''}`}
        >
          {/* Body */}
          <path
            d="M20 70 Q20 45 45 40 Q50 28 65 28 Q90 28 100 50 Q108 58 108 72 Q108 92 88 98 L84 104 L78 100 Q70 104 60 102 L50 104 L44 100 Q20 94 20 70 Z"
            fill="#fbcfe8"
            stroke="#ec4899"
            strokeWidth="3"
          />
          {/* Coin slot (top) */}
          <rect x="52" y="32" width="22" height="5" rx="2.5" fill="#9d174d" />
          {/* Inner fill clip — colored liquid that rises with savings */}
          <defs>
            <clipPath id="piggyFill">
              <path d="M24 72 Q24 48 46 44 Q52 33 65 33 Q88 33 96 52 Q104 60 104 72 Q104 90 86 95 L82 100 L78 97 Q70 100 60 98 L50 100 L46 97 Q24 91 24 72 Z" />
            </clipPath>
          </defs>
          <g clipPath="url(#piggyFill)">
            <rect
              x="0"
              y={120 - (fillHeight / 100) * 120}
              width="120"
              height="120"
              fill="url(#fillGradient)"
              style={{ transition: 'y 0.6s ease-out' }}
            />
          </g>
          <defs>
            <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          {/* Eyes */}
          <circle cx="50" cy="58" r="3.5" fill="#1f2937" />
          <circle cx="78" cy="58" r="3.5" fill="#1f2937" />
          {/* Snout */}
          <ellipse cx="92" cy="74" rx="8" ry="6" fill="#f9a8d4" stroke="#ec4899" strokeWidth="2" />
          <circle cx="90" cy="73" r="1.4" fill="#9d174d" />
          <circle cx="95" cy="73" r="1.4" fill="#9d174d" />
          {/* Legs */}
          <rect x="40" y="98" width="7" height="8" rx="2" fill="#ec4899" />
          <rect x="72" y="98" width="7" height="8" rx="2" fill="#ec4899" />
          {/* Tail */}
          <path d="M20 78 Q14 74 16 68 Q20 64 22 70" fill="none" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" />
        </svg>

        {/* Target emoji popping out when reached */}
        {reached && (
          <div className="animate-target-pop absolute left-1/2 top-2 z-30 -translate-x-1/2 text-4xl">
            🎉
          </div>
        )}
      </div>

      <div className="mt-3 text-center">
        {reached ? (
          <p className="text-base font-bold text-emerald-600">Goal reached! Time to celebrate! 🎉</p>
        ) : goalAmount > 0 ? (
          <p className="text-sm font-medium text-pink-600">
            {percent.toFixed(0)}% saved · {currencySymbol}
            {Math.max(0, goalAmount - savings).toFixed(2)} to go
          </p>
        ) : (
          <p className="text-sm text-slate-500">Set a goal to start filling your piggy!</p>
        )}
      </div>
    </div>
  );
}
