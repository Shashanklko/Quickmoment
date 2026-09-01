import React from 'react';
import { CategoryId } from '../../types';

interface CategoryBadgeProps {
  category: CategoryId;
  size?: 'sm' | 'md';
}

const CATEGORY_NAMES: Record<CategoryId, { label: string; bg: string; text: string }> = {
  finance: { label: 'Finance', bg: 'bg-blue-50 dark:bg-blue-950/60', text: 'text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900' },
  investment: { label: 'Investment', bg: 'bg-emerald-50 dark:bg-emerald-950/60', text: 'text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900' },
  tax: { label: 'Tax & Salary', bg: 'bg-amber-50 dark:bg-amber-950/60', text: 'text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900' },
  statistics: { label: 'Statistics', bg: 'bg-purple-50 dark:bg-purple-950/60', text: 'text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900' },
  simulation: { label: 'Monte Carlo', bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/60', text: 'text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-900' },
  education: { label: 'Education', bg: 'bg-cyan-50 dark:bg-cyan-950/60', text: 'text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900' },
  date: { label: 'Date & Time', bg: 'bg-rose-50 dark:bg-rose-950/60', text: 'text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900' },
  math: { label: 'Math', bg: 'bg-violet-50 dark:bg-violet-950/60', text: 'text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-900' },
  business: { label: 'Business', bg: 'bg-sky-50 dark:bg-sky-950/60', text: 'text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-900' },
  realEstate: { label: 'Real Estate', bg: 'bg-teal-50 dark:bg-teal-950/60', text: 'text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-900' },
  health: { label: 'Health', bg: 'bg-red-50 dark:bg-red-950/60', text: 'text-red-600 dark:text-red-400 border-red-200 dark:border-red-900' },
  developer: { label: 'Developer', bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700' },
  conversion: { label: 'Converter', bg: 'bg-indigo-50 dark:bg-indigo-950/60', text: 'text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900' },
  quirky: { label: 'Life & Memes', bg: 'bg-amber-50 dark:bg-amber-950/60', text: 'text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800' },
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, size = 'sm' }) => {
  const meta = CATEGORY_NAMES[category] || CATEGORY_NAMES.finance;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center font-semibold rounded-full border ${meta.bg} ${meta.text} ${padding}`}>
      {meta.label}
    </span>
  );
};
