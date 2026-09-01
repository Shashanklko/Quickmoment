import React from 'react';

interface CurrencyInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (val: number) => void;
  currencySymbol?: string;
  min?: number;
  max?: number;
  step?: number;
  quickChips?: number[];
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  id,
  label,
  value,
  onChange,
  currencySymbol = '₹',
  min = 0,
  max,
  step = 1000,
  quickChips,
}) => {
  // Format for display: Indian numbering style (lakhs/crores) or international
  const formatIndianNumber = (num: number) => {
    if (!num || isNaN(num)) return '0';
    if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(2)} L`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)} k`;
    return num.toLocaleString('en-IN');
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
        <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded-full border border-brand-200/50 dark:border-brand-800/40">
          {currencySymbol} {formatIndianNumber(value)}
        </span>
      </div>
      <div className="relative flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all shadow-sm">
        <span className="pl-3.5 pr-1 text-sm font-bold text-slate-500 dark:text-slate-400 select-none">
          {currencySymbol}
        </span>
        <input
          type="number"
          id={id}
          value={isNaN(value) ? '' : value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            const parsed = parseFloat(e.target.value);
            onChange(isNaN(parsed) ? 0 : parsed);
          }}
          className="w-full px-3 py-2.5 bg-transparent text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
        />
      </div>

      {/* Quick selection chips if provided */}
      {quickChips && quickChips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {quickChips.map((chipVal) => (
            <button
              key={chipVal}
              type="button"
              onClick={() => onChange(chipVal)}
              className={`px-2 py-0.5 text-[11px] rounded-md font-medium transition-all ${
                value === chipVal
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {currencySymbol} {formatIndianNumber(chipVal)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
