import React from 'react';
import { CATEGORIES_REGISTRY } from '../../data/categoriesRegistry';
import { CALCULATORS_REGISTRY } from '../../data/calculatorsRegistry';
import { CalculatorCard } from '../common/CalculatorCard';
import { ArrowLeft } from 'lucide-react';
import * as Icons from 'lucide-react';

interface CategoryViewProps {
  categorySlug: string;
  onSelectCalculator: (slug: string) => void;
  onBack: () => void;
  favorites: string[];
  onToggleFavorite: (slug: string, e: React.MouseEvent) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({
  categorySlug,
  onSelectCalculator,
  onBack,
  favorites,
  onToggleFavorite,
}) => {
  const category = CATEGORIES_REGISTRY.find((c) => c.slug === categorySlug) || CATEGORIES_REGISTRY[0];
  const calculators = CALCULATORS_REGISTRY.filter((c) => c.category === category.id);
  const CatIcon = (Icons as any)[category.iconName] || Icons.Folder;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Calculators
      </button>

      {/* Category Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm mb-8">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl bg-gradient-to-tr ${category.color} text-white shadow-md`}>
            <CatIcon className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white">
                {category.name}
              </h1>
              {category.badge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-200/60 dark:border-brand-800/60">
                  {category.badge}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>

        <div className="text-right sm:border-l sm:border-slate-200 dark:sm:border-slate-800 sm:pl-6">
          <span className="text-2xl font-black font-mono text-brand-600 dark:text-brand-400">
            {calculators.length}
          </span>
          <span className="block text-[11px] text-slate-400 font-medium">
            Available Tools
          </span>
        </div>
      </div>

      {/* Calculators Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {calculators.map((calc) => (
          <CalculatorCard
            key={calc.id}
            calc={calc}
            onSelect={onSelectCalculator}
            isFavorite={favorites.includes(calc.slug)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};
