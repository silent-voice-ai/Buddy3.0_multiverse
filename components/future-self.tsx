'use client';

import { useState } from 'react';
import { Mail, Lock, Unlock, Send, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AppData, FutureMessage } from '@/lib/types';
import { genId, checkUnlock } from '@/lib/storage';
import { formatDate } from '@/lib/format';

interface FutureSelfProps {
  data: AppData;
  update: (updater: (prev: AppData) => AppData) => void;
  isYouth?: boolean;
}

const durations = [
  { label: '1 Week', value: '1w' },
  { label: '1 Month', value: '1m' },
  { label: '6 Months', value: '6m' },
  { label: '1 Year', value: '1y' },
];

function getUnlockDate(value: string): string {
  const now = new Date();
  switch (value) {
    case '1w': return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    case '1m': return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    case '6m': return new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000).toISOString();
    case '1y': return new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString();
    default: return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
  }
}

export function FutureSelf({ data, update, isYouth }: FutureSelfProps) {
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [duration, setDuration] = useState('1m');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleSend = () => {
    if (!message.trim()) {
      toast({ title: 'Please write a message', variant: 'destructive' });
      return;
    }
    const futureMessage: FutureMessage = {
      id: genId(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
      unlockDate: getUnlockDate(duration),
      unlocked: false,
    };
    update(prev => ({ ...prev, futureMessages: [futureMessage, ...prev.futureMessages] }));
    setMessage('');
    toast({ title: 'Message sent to Future You!', description: 'It will unlock on the selected date.' });
  };

  const handleReply = (id: string) => {
    if (!replyText.trim()) return;
    update(prev => ({
      ...prev,
      futureMessages: prev.futureMessages.map(m =>
        m.id === id ? { ...m, reply: replyText.trim() } : m
      ),
    }));
    setReplyText('');
    setReplyingTo(null);
    toast({ title: 'Reply saved!' });
  };

  return (
    <div className="space-y-6">
      {/* Compose */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mail className="h-5 w-5" />
            Write to Future Self
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Your message to Future You</Label>
            <Textarea
              id="message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Dear Future Me, I hope you..."
              rows={5}
            />
          </div>
          <div className="space-y-2">
            <Label>Unlock time</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {durations.map(d => (
                  <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSend} className="w-full">
            <Send className="mr-2 h-4 w-4" />
            Send to Future Self
          </Button>
        </CardContent>
      </Card>

      {/* Messages */}
      {data.futureMessages.length > 0 && (
        <div className="space-y-4">
          <h3 className={`text-sm font-semibold ${isYouth ? 'text-slate-400' : 'text-slate-600'}`}>
            Your Future Self Letters
          </h3>
          {data.futureMessages.map(msg => {
            const unlocked = checkUnlock(msg);
            return (
              <Card key={msg.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    {unlocked ? (
                      <Unlock className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Lock className="h-4 w-4 text-slate-400" />
                    )}
                    <span className={`text-xs ${isYouth ? 'text-slate-500' : 'text-slate-400'}`}>
                      {unlocked ? 'Unlocked' : `Unlocks ${formatDate(msg.unlockDate)}`}
                    </span>
                  </div>

                  {unlocked ? (
                    <div className="space-y-3">
                      <div className={`rounded-lg p-3 ${isYouth ? 'bg-slate-800' : 'bg-slate-50'}`}>
                        <div className={`text-xs font-medium mb-1 ${isYouth ? 'text-emerald-400' : 'text-emerald-600'}`}>
                          Letter from Past You — {formatDate(msg.createdAt)}
                        </div>
                        <p className={`text-sm ${isYouth ? 'text-slate-200' : 'text-slate-700'}`}>
                          {msg.message}
                        </p>
                      </div>

                      {msg.reply && (
                        <div className={`rounded-lg p-3 ${isYouth ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                          <div className={`text-xs font-medium mb-1 ${isYouth ? 'text-emerald-400' : 'text-emerald-600'}`}>
                            Your Reply
                          </div>
                          <p className={`text-sm ${isYouth ? 'text-slate-200' : 'text-slate-700'}`}>
                            {msg.reply}
                          </p>
                        </div>
                      )}

                      {replyingTo === msg.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            placeholder="Write a reply..."
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleReply(msg.id)}>Save Reply</Button>
                            <Button size="sm" variant="outline" onClick={() => { setReplyingTo(null); setReplyText(''); }}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : !msg.reply ? (
                        <Button size="sm" variant="outline" onClick={() => setReplyingTo(msg.id)}>
                          Reply
                        </Button>
                      ) : null}
                    </div>
                  ) : (
                    <div className={`rounded-lg p-4 text-center ${isYouth ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                      <Clock className={`mx-auto mb-2 h-6 w-6 ${isYouth ? 'text-slate-600' : 'text-slate-300'}`} />
                      <p className={`text-sm ${isYouth ? 'text-slate-500' : 'text-slate-400'}`}>
                        This letter is locked until {formatDate(msg.unlockDate)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {data.futureMessages.length === 0 && (
        <Card>
      <CardContent className="p-8 text-center">
          <Mail className={`mx-auto mb-3 h-10 w-10 ${isYouth ? 'text-slate-600' : 'text-slate-300'}`} />
          <p className={isYouth ? 'text-slate-500' : 'text-slate-400'}>No letters yet. Write your first message above!</p>
        </CardContent>
      </Card>
      )}
    </div>
  );
}
