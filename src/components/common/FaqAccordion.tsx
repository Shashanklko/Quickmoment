import React, { useState } from 'react';
import { CalculatorFaq } from '../../types';

interface FaqAccordionProps {
  faqs: CalculatorFaq[];
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1">
        Frequently Asked Questions
      </h3>
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="w-full flex items-center justify-between p-4 text-left font-semibold text-xs text-slate-900 dark:text-slate-100 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              <span>{faq.question}</span>
              <span className={`transform transition-transform text-slate-400 font-mono text-sm ${isOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {isOpen && (
              <div className="px-4 pb-4 pt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/40">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
