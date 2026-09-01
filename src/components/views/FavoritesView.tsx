import React from 'react';
import { CALCULATORS_REGISTRY } from '../../data/calculatorsRegistry';
import { CalculatorCard } from '../common/CalculatorCard';
import { Star, ArrowLeft } from 'lucide-react';

interface FavoritesViewProps {
  favorites: string[];
  onSelectCalculator: (slug: string) => void;
  onBack: () => void;
  onToggleFavorite: (slug: string, e: React.MouseEvent) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favorites,
  onSelectCalculator,
  onBack,
  onToggleFavorite,
}) => {
  const favoriteCalculators = CALCULATORS_REGISTRY.filter((c) => favorites.includes(c.slug));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </button>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 border border-amber-200 dark:border-amber-800/60">
          <Star className="w-6 h-6 fill-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black font-display text-slate-900 dark:text-white">
            Saved Favorites
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {favoriteCalculators.length} {favoriteCalculators.length === 1 ? 'calculator' : 'calculators'} bookmarked for rapid access
          </p>
        </div>
      </div>

      {favoriteCalculators.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Star className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No favorites saved yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Click the star icon on any calculator card or detail page to bookmark your most used tools here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favoriteCalculators.map((calc) => (
            <CalculatorCard
              key={calc.id}
              calc={calc}
              onSelect={onSelectCalculator}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};
