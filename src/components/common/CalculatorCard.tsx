import React from 'react';
import { CalculatorMetadata } from '../../types';
import { CategoryBadge } from './CategoryBadge';
import * as Icons from 'lucide-react';

interface CalculatorCardProps {
  calc: CalculatorMetadata;
  onSelect: (slug: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (slug: string, e: React.MouseEvent) => void;
}

export const CalculatorCard: React.FC<CalculatorCardProps> = ({
  calc,
  onSelect,
  isFavorite,
  onToggleFavorite,
}) => {
  // Dynamically resolve icon from Lucide
  const IconComponent = (Icons as any)[calc.icon] || Icons.Calculator;

  return (
    <div
      onClick={() => onSelect(calc.slug)}
      className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 glow-card cursor-pointer transition-all hover:border-brand-500/40 dark:hover:border-brand-500/40"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all duration-200">
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
                {calc.name}
              </h3>
              <CategoryBadge category={calc.category} size="sm" />
            </div>
          </div>

          {onToggleFavorite && (
            <button
              type="button"
              onClick={(e) => onToggleFavorite(calc.slug, e)}
              className="p-1 text-slate-400 hover:text-amber-500 transition-colors"
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Icons.Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
            </button>
          )}
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {calc.shortDescription}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
          Calculate now <Icons.ArrowRight className="w-3.5 h-3.5" />
        </span>
        {calc.isFeatured && (
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-200/50 dark:border-amber-800/40">
            ★ Featured
          </span>
        )}
      </div>
    </div>
  );
};
