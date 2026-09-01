import React from 'react';

interface SliderFieldProps {
  id: string;
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  prefix?: string;
}

export const SliderField: React.FC<SliderFieldProps> = ({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix = '',
  prefix = '',
}) => {
  return (
    <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs">
          <input
            type="number"
            value={isNaN(value) ? '' : value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onChange(isNaN(val) ? min : val);
            }}
            className="w-16 text-right text-xs font-bold text-brand-600 dark:text-brand-400 bg-transparent focus:outline-none"
          />
          {suffix && (
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
              {suffix}
            </span>
          )}
        </div>
      </div>

      <div className="relative flex items-center">
        <input
          type="range"
          id={id}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-600 focus:outline-none"
        />
      </div>

      <div className="flex justify-between text-[10px] font-semibold text-slate-400 dark:text-slate-500">
        <span>{prefix}{min} {suffix}</span>
        <span>{prefix}{max} {suffix}</span>
      </div>
    </div>
  );
};
