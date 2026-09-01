import React, { useState, useEffect } from 'react';
import { Flame, Sparkles, Shuffle, Smile, Trophy, Zap, RefreshCw, Heart } from 'lucide-react';

const FORTUNES = [
  {
    quote: 'Today, the probability of you doing something extraordinary is strictly greater than zero.',
    meme: '📊 P(Success) > 0 | Don’t let rounding errors hold you back!',
    stat: 'Did you know? If you shuffle a deck of 52 cards properly, that exact order has almost certainly never existed in the history of the universe (8 × 10⁶⁷ combinations).',
  },
  {
    quote: 'Your coffee intake today is directly correlated with your debugging speed ($R² = 0.99$).',
    meme: '☕ Caffeine + Wi-Fi = Infinite Productivity',
    stat: 'Did you know? The number of seconds in 6 weeks is exactly 10! (10 factorial = 3,628,800 seconds).',
  },
  {
    quote: 'Compounding is the 8th wonder of the world. Start with 1% improvement today.',
    meme: '📈 1.01³⁶⁵ = 37.8 vs 0.99³⁶⁵ = 0.03',
    stat: 'Did you know? If you fold a standard piece of paper 42 times, its thickness would reach the Moon.',
  },
  {
    quote: 'Never underestimate the power of saying "Per my previous email".',
    meme: '✉️ Professional translation: "Can you please read?"',
    stat: 'Did you know? You have a higher probability of becoming an astronaut (1 in 12,000,000) than picking the exact 6 lottery numbers.',
  },
  {
    quote: 'A bad day with a solid emergency fund is just an inconvenient Tuesday.',
    meme: '🛡️ Financial peace of mind is priceless',
    stat: 'Did you know? 111,111,111 × 111,111,111 = 12,345,678,987,654,321 (a perfect palindrome).',
  },
];

const DECISIONS = [
  '✅ YES, Absolutely Go For It!',
  '☕ Drink a Coffee and Re-evaluate in 30 mins',
  '🛌 Take a Power Nap First',
  '💰 Put It In Your Mutual Fund Instead',
  '🍕 Order the Pizza, You Earned It',
  '🚫 NO, Abort Mission Immediately!',
  '🎲 Roll the Dice and Trust Fate',
];

export const DailyFortuneWidget: React.FC = () => {
  const [fortuneIndex, setFortuneIndex] = useState<number>(0);
  const [streak, setStreak] = useState<number>(1);
  const [decisionResult, setDecisionResult] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  useEffect(() => {
    // Persistent daily streak logic
    const lastVisit = localStorage.getItem('qm_last_visit');
    const savedStreak = Number(localStorage.getItem('qm_streak') || '1');
    const today = new Date().toDateString();

    if (lastVisit !== today) {
      const newStreak = lastVisit ? savedStreak + 1 : 1;
      setStreak(newStreak);
      localStorage.setItem('qm_streak', newStreak.toString());
      localStorage.setItem('qm_last_visit', today);
    } else {
      setStreak(savedStreak);
    }

    // Set daily fortune based on date
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setFortuneIndex(dayOfYear % FORTUNES.length);
  }, []);

  const handleSpinDecision = () => {
    setIsSpinning(true);
    let count = 0;
    const interval = setInterval(() => {
      setDecisionResult(DECISIONS[Math.floor(Math.random() * DECISIONS.length)]);
      count++;
      if (count >= 12) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 80);
  };

  const fortune = FORTUNES[fortuneIndex];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-purple-500/10 border border-amber-300/40 dark:border-amber-800/40 shadow-xs mb-8">
      {/* Daily Fortune & Streak */}
      <div className="lg:col-span-8 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-white shadow-xs">
              <Flame className="w-4 h-4 fill-amber-200" />
              {streak} DAY GENIUS STREAK
            </span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              Daily Math Fortune & Trivia
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-black font-display text-slate-900 dark:text-white mt-2 leading-snug">
            &ldquo;{fortune.quote}&rdquo;
          </h3>

          <p className="text-xs font-mono font-semibold text-brand-600 dark:text-brand-400 mt-1">
            {fortune.meme}
          </p>

          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed bg-white/60 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
            💡 <strong>Mind-Blowing Stat:</strong> {fortune.stat}
          </p>
        </div>
      </div>

      {/* Interactive Random Decision Spinner */}
      <div className="lg:col-span-4 flex flex-col justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full">
              Indecisive?
            </span>
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
            Instant Decision Roulette
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
            Ask any life dilemma in your mind and let pure entropy decide for you.
          </p>
        </div>

        {decisionResult && (
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 text-center mb-3 animate-fade-in">
            <span className="text-xs font-extrabold text-purple-700 dark:text-purple-300 block">
              {decisionResult}
            </span>
          </div>
        )}

        <button
          type="button"
          disabled={isSpinning}
          onClick={handleSpinDecision}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          <Shuffle className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
          {isSpinning ? 'Consulting the Universe...' : 'Spin Decision Wheel'}
        </button>
      </div>
    </div>
  );
};
