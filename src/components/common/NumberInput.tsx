import React from 'react';

interface NumberInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  tooltip?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  tooltip,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
        {tooltip && (
          <span className="text-[11px] text-slate-400 dark:text-slate-500" title={tooltip}>
            ℹ️
          </span>
        )}
      </div>
      <div className="relative flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all shadow-sm">
        {prefix && (
          <span className="pl-3.5 pr-1 text-sm font-semibold text-slate-500 dark:text-slate-400 select-none">
            {prefix}
          </span>
        )}
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
        {suffix && (
          <span className="pr-3.5 pl-1 text-xs font-medium text-slate-400 dark:text-slate-500 select-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};
