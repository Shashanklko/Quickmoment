import React, { useState, useEffect, useRef } from 'react';
import { CALCULATORS_REGISTRY } from '../../data/calculatorsRegistry';
import { CalculatorMetadata } from '../../types';
import { Search, X, Calculator, ArrowRight, CornerDownLeft } from 'lucide-react';
import { CategoryBadge } from './CategoryBadge';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCalculator: (slug: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCalculator,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Fuzzy / typo-tolerant filter
  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanQ = clean(query);

  const filteredCalculators = CALCULATORS_REGISTRY.filter((calc) => {
    if (!query.trim()) return calc.isPopular || calc.isFeatured;
    const nameMatch = clean(calc.name).includes(cleanQ);
    const descMatch = clean(calc.description).includes(cleanQ);
    const tagMatch = calc.tags.some((t) => clean(t).includes(cleanQ));
    return nameMatch || descMatch || tagMatch;
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredCalculators.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filteredCalculators[selectedIndex]) {
      e.preventDefault();
      onSelectCalculator(filteredCalculators[selectedIndex].slug);
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <Search className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search 50+ calculators, formulas, simulations (e.g. EMI, SIP, Tax, Monte Carlo, Age)..."
            className="w-full bg-transparent text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-slate-200 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 flex flex-col gap-1">
          {filteredCalculators.length === 0 ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-xs">
              No calculators found matching &ldquo;{query}&rdquo;. Try &ldquo;EMI&rdquo;, &ldquo;SIP&rdquo;, or &ldquo;Attendance&rdquo;.
            </div>
          ) : (
            filteredCalculators.map((calc, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={calc.id}
                  onClick={() => {
                    onSelectCalculator(calc.slug);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-brand-50 dark:bg-brand-950/70 border border-brand-200 dark:border-brand-800/80'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-brand-100/60 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400">
                      <Calculator className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {calc.name}
                        </span>
                        <CategoryBadge category={calc.category} size="sm" />
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {calc.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isSelected && (
                      <span className="text-[10px] font-mono text-brand-600 dark:text-brand-400 flex items-center gap-1">
                        Select <CornerDownLeft className="w-3 h-3" />
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>QuickMoments Search Engine</span>
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
