import React, { useState } from 'react';
import { Laugh, Flame, Sparkles, MessageSquareQuote } from 'lucide-react';

interface RoastMyCalcProps {
  calculatorSlug: string;
  result: any;
}

export const RoastMyCalc: React.FC<RoastMyCalcProps> = ({ calculatorSlug, result }) => {
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  const getRoast = () => {
    if (!result) return null;

    if (calculatorSlug === 'emi-calculator' && result.type === 'emi') {
      const emi = result.res;
      const ratio = emi.totalInterest / emi.principal;
      if (ratio > 1) {
        return {
          title: '🏦 Bank Manager’s Best Friend Award',
          roast: `You are paying ₹${emi.totalInterest.toLocaleString('en-IN')} in pure interest on a ₹${emi.principal.toLocaleString('en-IN')} loan! That’s ${Number(ratio * 100).toFixed(0)}% of the principal. The bank will name a conference room in your honor.`,
          tip: 'Tip: Even an extra ₹2,000 to ₹5,000 monthly prepayment will save you ₹5+ Lakhs in interest!',
        };
      }
      return {
        title: '💼 Controlled Leverage',
        roast: `A reasonable monthly outflow of ₹${emi.monthlyEmi.toLocaleString('en-IN')}. Make sure your emergency fund is untouched before splurging!`,
        tip: 'Tip: Keep your total EMIs under 35% of your take-home pay.',
      };
    }

    if (calculatorSlug === 'attendance-calculator') {
      return {
        title: '🎓 The Bunking Strategist',
        roast: 'Attending 75% of lectures is not a crime, it is an exact mathematical optimization problem. Sleep well, future CEO.',
        tip: 'Tip: Don’t burn all your safe bunks before the monsoon season arrives!',
      };
    }

    if (calculatorSlug === 'salary-calculator') {
      return {
        title: '💸 Tax Season Emotional Damage',
        roast: 'Looking at your CTC vs your actual In-Hand salary is the fastest way to understand why adults are always tired.',
        tip: 'Tip: Check if standard deduction of ₹75,000 makes the New Tax Regime better for your bracket.',
      };
    }

    if (calculatorSlug === 'sip-calculator') {
      return {
        title: '🚀 Future Billionaire Detected',
        roast: 'Every ₹1,000 you invest today will laugh at your past impulse purchases in 15 years. Keep the discipline!',
        tip: 'Tip: Turn on the 10% Step-Up toggle to double your final corpus.',
      };
    }

    if (calculatorSlug === 'impulse-purchase-calculator') {
      return {
        title: '🛒 The Cart Abandoner',
        roast: 'If you close the tab now, you save 100% of the money without even needing a coupon code.',
        tip: 'Tip: The 48-Hour Rule prevents 85% of buyer remorse.',
      };
    }

    if (calculatorSlug === 'meeting-cost-calculator') {
      return {
        title: '🥱 Meeting Survival Matrix',
        roast: 'Half the people on this call are on mute playing Wordle. Send the summary document and give people their lives back.',
        tip: 'Tip: Cap standard syncs at 15 minutes max.',
      };
    }

    if (calculatorSlug === 'bmi-calorie-calculator') {
      const bmi = result?.res?.bmi || 22;
      return {
        title: '🥗 Fitness Reality Check',
        roast: `BMI of ${bmi} calculated. Remember: 80% of fitness progress happens in the kitchen, not scrolling workout reels at 1 AM.`,
        tip: 'Tip: Prioritize 1.6g to 2.2g of protein per kg of bodyweight and drink 3L of water daily.',
      };
    }

    if (calculatorSlug === 'cgpa-to-percentage-calculator') {
      return {
        title: '🎓 The 9.5 Multiplier Magic',
        roast: 'Turning CGPA into percentage is proof that academic metrics are 50% knowledge and 50% arbitrary conversion tables.',
        tip: 'Tip: First class distinction unlocks maximum placement cutoff criteria.',
      };
    }

    return {
      title: '🤓 Certified Number Cruncher',
      roast: 'The numbers do not lie, but they certainly know how to keep life interesting!',
      tip: 'Tip: Share this calculation with a friend to compare notes.',
    };
  };

  const roastData = getRoast();
  if (!roastData) return null;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-orange-500/10 border border-rose-300/40 dark:border-rose-900/40 shadow-xs mt-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-rose-500" />
          <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
            {roastData.title}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsRevealed(!isRevealed)}
          className="text-[11px] font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Laugh className="w-3.5 h-3.5 text-amber-500" />
          {isRevealed ? 'Hide Roast' : '⚡ Roast My Numbers'}
        </button>
      </div>

      {isRevealed && (
        <div className="mt-3 pt-3 border-t border-rose-200/50 dark:border-rose-900/40 animate-fade-in">
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed italic">
            &ldquo;{roastData.roast}&rdquo;
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-2">
            {roastData.tip}
          </p>
        </div>
      )}
    </div>
  );
};
