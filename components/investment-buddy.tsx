'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, TrendingUp, TrendingDown, Sparkles, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AppData, Holding, Currency } from '@/lib/types';
import { formatMoney, getCurrencySymbol } from '@/lib/format';
import { genId } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface InvestmentBuddyProps {
  data: AppData;
  update: (updater: (prev: AppData) => AppData) => void;
  isYouth?: boolean;
}

interface ChatMessage {
  id: string;
  role: 'bot' | 'user';
  text: string;
}

function totalInvested(holdings: Holding[]): number {
  return holdings.reduce((sum, h) => sum + h.quantity * h.buyPrice, 0);
}

function totalValue(holdings: Holding[]): number {
  return holdings.reduce((sum, h) => sum + h.quantity * h.currentPrice, 0);
}

function generateBotReply(input: string, data: AppData): string {
  const q = input.toLowerCase().trim();
  const holdings = data.holdings;
  const symbol = getCurrencySymbol(data.currency);
  const invested = totalInvested(holdings);
  const current = totalValue(holdings);
  const growth = current - invested;
  const growthPct = invested > 0 ? (growth / invested) * 100 : 0;

  if (holdings.length === 0 && /add|buy|invest|holding|share|stock/i.test(q)) {
    return `You don't have any holdings yet. Add your first share below — enter a name, how many units you own, what you paid, and what it's worth now. I'll track the growth for you.`;
  }

  if (holdings.length === 0) {
    return `Your portfolio is empty right now. Add a share or investment below, then ask me how it's growing! I can tell you your total value, growth, best/worst performers, and more.`;
  }

  if (/hello|hi|hey|sup|yo\b/.test(q)) {
    return `Hey! I'm your Investment Buddy. You've got ${holdings.length} holding${holdings.length === 1 ? '' : 's'} worth ${formatMoney(current, data.currency)}. Ask me about your growth, best performer, or what to watch.`;
  }

  if (/how.*grow|growth|perform|doing|how.*going/.test(q)) {
    const dir = growth >= 0 ? 'up' : 'down';
    return `Your portfolio is ${dir} ${growthPct >= 0 ? '+' : ''}${growthPct.toFixed(2)}% — that's ${growth >= 0 ? '+' : ''}${formatMoney(growth, data.currency)} on top of your ${formatMoney(invested, data.currency)} invested. Current value: ${formatMoney(current, data.currency)}.`;
  }

  if (/best|top|winner|highest|biggest gain/.test(q)) {
    const sorted = [...holdings].sort((a, b) => {
      const ga = (a.currentPrice - a.buyPrice) / a.buyPrice;
      const gb = (b.currentPrice - b.buyPrice) / b.buyPrice;
      return gb - ga;
    });
    const best = sorted[0];
    const gpct = ((best.currentPrice - best.buyPrice) / best.buyPrice) * 100;
    return `Your best performer is ${best.name} (${best.symbol.toUpperCase()}) — ${gpct >= 0 ? '+' : ''}${gpct.toFixed(2)}% return. You hold ${best.quantity} units bought at ${symbol}${best.buyPrice}, now worth ${symbol}${best.currentPrice}.`;
  }

  if (/worst|bottom|loser|lowest|biggest loss|down/.test(q)) {
    const sorted = [...holdings].sort((a, b) => {
      const ga = (a.currentPrice - a.buyPrice) / a.buyPrice;
      const gb = (b.currentPrice - b.buyPrice) / b.buyPrice;
      return ga - gb;
    });
    const worst = sorted[0];
    const gpct = ((worst.currentPrice - worst.buyPrice) / worst.buyPrice) * 100;
    return `Your weakest holding is ${worst.name} (${worst.symbol.toUpperCase()}) — ${gpct >= 0 ? '+' : ''}${gpct.toFixed(2)}%. You hold ${worst.quantity} units at ${symbol}${worst.buyPrice}, now ${symbol}${worst.currentPrice}.`;
  }

  if (/total|value|worth|portfolio|summary/.test(q)) {
    return `Portfolio summary: Invested ${formatMoney(invested, data.currency)} · Current value ${formatMoney(current, data.currency)} · Net ${growth >= 0 ? '+' : ''}${formatMoney(growth, data.currency)} (${growthPct >= 0 ? '+' : ''}${growthPct.toFixed(2)}%) across ${holdings.length} holding${holdings.length === 1 ? '' : 's'}.`;
  }

  if (/sell|exit|should i sell|when to sell/.test(q)) {
    const losers = holdings.filter(h => h.currentPrice < h.buyPrice);
    const winners = holdings.filter(h => h.currentPrice > h.buyPrice);
    if (losers.length > 0) {
      return `You have ${losers.length} holding${losers.length === 1 ? '' : 's'} trading below your buy price. A common rule: set a stop-loss limit and don't panic-sell on small dips. I can't give financial advice — talk to a licensed advisor before big moves.`;
    }
    return `Everything is in the green right now. If you're thinking of selling, consider your goals and tax impact first. I can't give financial advice — consult a licensed advisor for big decisions.`;
  }

  if (/diversif|spread|risk|too much|concentrat/.test(q)) {
    const sorted = [...holdings].sort((a, b) => (b.quantity * b.currentPrice) - (a.quantity * a.currentPrice));
    const top = sorted[0];
    const topPct = current > 0 ? ((top.quantity * top.currentPrice) / current) * 100 : 0;
    if (topPct > 50) {
      return `Heads up: ${top.name} makes up ${topPct.toFixed(0)}% of your portfolio. Concentration like that means higher risk — spreading across more holdings can soften the bumps.`;
    }
    return `Your portfolio looks reasonably spread out. Your biggest holding is ${top.name} at ${topPct.toFixed(0)}% of total value. Diversification helps reduce risk.`;
  }

  if (/help|what can you|what do you do/.test(q)) {
    return `I'm your Investment Buddy. Try asking: "How is my portfolio growing?", "What's my best performer?", "What's my worst holding?", "Show my total value", or "Am I over-concentrated?". You can also add or remove holdings below.`;
  }

  if (/thank|thanks|cool|nice|awesome|great/.test(q)) {
    return `Anytime! I'm here whenever you want to check on your shares. 📈`;
  }

  // Fallback: give a quick snapshot
  return `Here's a quick read: your ${holdings.length} holding${holdings.length === 1 ? '' : 's'} are worth ${formatMoney(current, data.currency)} (${growthPct >= 0 ? '+' : ''}${growthPct.toFixed(2)}% overall). Ask me "how is my portfolio growing?" or "what's my best performer?" for the details.`;
}

const SUGGESTIONS = [
  'How is my portfolio growing?',
  "What's my best performer?",
  "What's my worst holding?",
  'Am I over-concentrated?',
];

export function InvestmentBuddy({ data, update, isYouth }: InvestmentBuddyProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'bot',
      text: data.holdings.length > 0
        ? `Hey! I'm your Investment Buddy. You've got ${data.holdings.length} holding${data.holdings.length === 1 ? '' : 's'} — ask me how they're growing, or add a new one below.`
        : `Hey! I'm your Investment Buddy. Add your first share or investment below, then ask me how it's growing. I'll help you track performance and spot risks.`,
    },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Holding form
  const [hName, setHName] = useState('');
  const [hSymbol, setHSymbol] = useState('');
  const [hQty, setHQty] = useState('');
  const [hBuy, setHBuy] = useState('');
  const [hCurrent, setHCurrent] = useState('');

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: ChatMessage = { id: genId(), role: 'user', text: trimmed };
    const reply = generateBotReply(trimmed, data);
    const botMsg: ChatMessage = { id: genId(), role: 'bot', text: reply };
    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput('');
  };

  const handleAddHolding = () => {
    if (!hName.trim()) return toast({ title: 'Enter a holding name', variant: 'destructive' });
    const qty = parseFloat(hQty);
    const buy = parseFloat(hBuy);
    const cur = parseFloat(hCurrent);
    if (isNaN(qty) || qty <= 0) return toast({ title: 'Enter a valid quantity', variant: 'destructive' });
    if (isNaN(buy) || buy < 0) return toast({ title: 'Enter a valid buy price', variant: 'destructive' });
    if (isNaN(cur) || cur < 0) return toast({ title: 'Enter a valid current price', variant: 'destructive' });

    const newHolding: Holding = {
      id: genId(),
      name: hName.trim(),
      symbol: hSymbol.trim() || hName.trim().slice(0, 4).toLowerCase(),
      quantity: qty,
      buyPrice: buy,
      currentPrice: cur,
    };
    update(prev => ({ ...prev, holdings: [...prev.holdings, newHolding] }));
    setHName(''); setHSymbol(''); setHQty(''); setHBuy(''); setHCurrent('');
    toast({ title: 'Holding added!' });
    setMessages(prev => [...prev, {
      id: genId(),
      role: 'bot',
      text: `Added ${newHolding.name} to your portfolio. You own ${qty} units. Ask me "how is my portfolio growing?" to see how it's doing.`,
    }]);
  };

  const handleDeleteHolding = (id: string) => {
    update(prev => ({ ...prev, holdings: prev.holdings.filter(h => h.id !== id) }));
  };

  const handleUpdateCurrent = (id: string, value: string) => {
    const val = parseFloat(value);
    if (isNaN(val) || val < 0) return;
    update(prev => ({
      ...prev,
      holdings: prev.holdings.map(h => h.id === id ? { ...h, currentPrice: val } : h),
    }));
  };

  const invested = totalInvested(data.holdings);
  const current = totalValue(data.holdings);
  const growth = current - invested;
  const growthPct = invested > 0 ? (growth / invested) * 100 : 0;
  const symbol = getCurrencySymbol(data.currency);

  return (
    <div className="space-y-4">
      <Card className={isYouth ? 'border-slate-800 bg-slate-900' : ''}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 text-lg ${isYouth ? 'text-white' : 'text-slate-900'}`}>
            <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${isYouth ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
              <Bot className="h-5 w-5 text-emerald-500" />
            </span>
            Investment Buddy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Chat window */}
          <div
            ref={scrollRef}
            className={`max-h-72 space-y-3 overflow-y-auto rounded-xl p-4 ${isYouth ? 'bg-slate-950' : 'bg-slate-50'}`}
          >
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? isYouth ? 'bg-emerald-600 text-white' : 'bg-blue-500 text-white'
                      : isYouth ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  {m.role === 'bot' && (
                    <Sparkles className="mb-1 inline h-3.5 w-3.5 text-emerald-500" />
                  )}
                  {' '}{m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Suggestion chips */}
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => send(s)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  isYouth
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') send(input); }}
              placeholder="Ask about your investments..."
              className={isYouth ? 'border-slate-700 bg-slate-800 text-white' : ''}
            />
            <Button onClick={() => send(input)} className="flex-shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio snapshot */}
      {data.holdings.length > 0 && (
        <Card className={isYouth ? 'border-slate-800 bg-slate-900' : ''}>
          <CardHeader>
            <CardTitle className={`text-base ${isYouth ? 'text-white' : 'text-slate-900'}`}>Portfolio Snapshot</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <div className={`rounded-lg p-3 text-center ${isYouth ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <div className={`text-xs ${isYouth ? 'text-slate-400' : 'text-slate-500'}`}>Invested</div>
                <div className={`text-sm font-bold ${isYouth ? 'text-white' : 'text-slate-900'}`}>{formatMoney(invested, data.currency)}</div>
              </div>
              <div className={`rounded-lg p-3 text-center ${isYouth ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <div className={`text-xs ${isYouth ? 'text-slate-400' : 'text-slate-500'}`}>Current</div>
                <div className={`text-sm font-bold ${isYouth ? 'text-white' : 'text-slate-900'}`}>{formatMoney(current, data.currency)}</div>
              </div>
              <div className={`rounded-lg p-3 text-center ${growth >= 0 ? (isYouth ? 'bg-emerald-500/10' : 'bg-emerald-50') : (isYouth ? 'bg-red-500/10' : 'bg-red-50')}`}>
                <div className={`text-xs ${isYouth ? 'text-slate-400' : 'text-slate-500'}`}>Growth</div>
                <div className={`flex items-center justify-center gap-1 text-sm font-bold ${growth >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {growth >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  {growthPct >= 0 ? '+' : ''}{growthPct.toFixed(2)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add holding form */}
      <Card className={isYouth ? 'border-slate-800 bg-slate-900' : ''}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 text-base ${isYouth ? 'text-white' : 'text-slate-900'}`}>
            <Plus className="h-4 w-4 text-emerald-500" /> Add a Holding
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className={`text-xs ${isYouth ? 'text-slate-400' : 'text-slate-600'}`}>Name (e.g. Reliance, Apple)</Label>
              <Input value={hName} onChange={e => setHName(e.target.value)} placeholder="Company / asset name" className={isYouth ? 'border-slate-700 bg-slate-800 text-white' : ''} />
            </div>
            <div className="space-y-1.5">
              <Label className={`text-xs ${isYouth ? 'text-slate-400' : 'text-slate-600'}`}>Symbol (optional)</Label>
              <Input value={hSymbol} onChange={e => setHSymbol(e.target.value)} placeholder="e.g. REL, AAPL" className={isYouth ? 'border-slate-700 bg-slate-800 text-white' : ''} />
            </div>
            <div className="space-y-1.5">
              <Label className={`text-xs ${isYouth ? 'text-slate-400' : 'text-slate-600'}`}>Quantity</Label>
              <Input type="number" step="0.01" min="0" value={hQty} onChange={e => setHQty(e.target.value)} placeholder="0" className={isYouth ? 'border-slate-700 bg-slate-800 text-white' : ''} />
            </div>
            <div className="space-y-1.5">
              <Label className={`text-xs ${isYouth ? 'text-slate-400' : 'text-slate-600'}`}>Buy price ({symbol})</Label>
              <Input type="number" step="0.01" min="0" value={hBuy} onChange={e => setHBuy(e.target.value)} placeholder="0" className={isYouth ? 'border-slate-700 bg-slate-800 text-white' : ''} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className={`text-xs ${isYouth ? 'text-slate-400' : 'text-slate-600'}`}>Current price ({symbol})</Label>
              <Input type="number" step="0.01" min="0" value={hCurrent} onChange={e => setHCurrent(e.target.value)} placeholder="0" className={isYouth ? 'border-slate-700 bg-slate-800 text-white' : ''} />
            </div>
          </div>
          <Button onClick={handleAddHolding} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add to Portfolio
          </Button>
        </CardContent>
      </Card>

      {/* Holdings list */}
      {data.holdings.length > 0 && (
        <Card className={isYouth ? 'border-slate-800 bg-slate-900' : ''}>
          <CardHeader>
            <CardTitle className={`text-base ${isYouth ? 'text-white' : 'text-slate-900'}`}>Your Holdings ({data.holdings.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.holdings.map(h => {
              const hGrowth = h.currentPrice - h.buyPrice;
              const hGrowthPct = h.buyPrice > 0 ? (hGrowth / h.buyPrice) * 100 : 0;
              const positive = hGrowth >= 0;
              return (
                <div key={h.id} className={`rounded-lg border p-3 ${isYouth ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className={`font-semibold ${isYouth ? 'text-white' : 'text-slate-900'}`}>
                        {h.name} <span className={`text-xs font-normal ${isYouth ? 'text-slate-400' : 'text-slate-500'}`}>{h.symbol.toUpperCase()}</span>
                      </div>
                      <div className={`text-xs ${isYouth ? 'text-slate-400' : 'text-slate-500'}`}>
                        {h.quantity} units · bought {symbol}{h.buyPrice}
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-red-400 hover:bg-red-50" onClick={() => handleDeleteHolding(h.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${isYouth ? 'text-slate-400' : 'text-slate-500'}`}>Current:</span>
                      <div className="relative w-24">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">{symbol}</span>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={h.currentPrice}
                          onChange={e => handleUpdateCurrent(h.id, e.target.value)}
                          className={`h-7 pl-6 text-xs ${isYouth ? 'border-slate-700 bg-slate-900 text-white' : ''}`}
                        />
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-bold ${positive ? 'text-emerald-500' : 'text-red-500'}`}>
                      {positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                      {hGrowthPct >= 0 ? '+' : ''}{hGrowthPct.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Re-export Currency type alias for convenience if needed elsewhere
export type { Currency };
