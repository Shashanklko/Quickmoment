import React from 'react';

interface FormulaBoxProps {
  formula: {
    expression: string;
    explanation: string;
    variables?: { name: string; desc: string }[];
  };
  workedExample?: {
    scenario: string;
    steps: string[];
    result: string;
  };
}

export const FormulaBox: React.FC<FormulaBoxProps> = ({ formula, workedExample }) => {
  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Formula Expression */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold text-xs">
            ƒ(x)
          </span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Mathematical Formula & Logic
          </h3>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 overflow-x-auto">
          <code className="text-base font-bold font-mono text-brand-600 dark:text-brand-300">
            {formula.expression}
          </code>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          {formula.explanation}
        </p>

        {formula.variables && formula.variables.length > 0 && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {formula.variables.map((v) => (
              <div key={v.name} className="flex items-center gap-2 text-xs p-2 rounded-lg bg-slate-50/60 dark:bg-slate-800/40">
                <span className="font-mono font-bold text-brand-600 dark:text-brand-400 bg-brand-100/50 dark:bg-brand-900/40 px-1.5 py-0.5 rounded">
                  {v.name}
                </span>
                <span className="text-slate-600 dark:text-slate-300">{v.desc}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Worked Example */}
      {workedExample && (
        <div className="pt-5 border-t border-slate-100 dark:border-slate-800/80">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
            Worked Step-by-Step Example
          </h4>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 italic mb-3">
            Scenario: {workedExample.scenario}
          </p>
          <div className="flex flex-col gap-1.5 pl-3 border-l-2 border-brand-500/40">
            {workedExample.steps.map((step, idx) => (
              <div key={idx} className="text-xs text-slate-700 dark:text-slate-300 font-mono">
                {step}
              </div>
            ))}
          </div>
          <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            ✨ Result: {workedExample.result}
          </div>
        </div>
      )}
    </div>
  );
};
