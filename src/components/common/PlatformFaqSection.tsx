import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export const PLATFORM_FAQS: FaqItem[] = [
  {
    category: 'Platform & Accuracy',
    question: 'What is QuickMoments and what makes its calculation engines unique?',
    answer:
      'QuickMoments (quickmoment.fun) is an advanced multi-mode computational platform combining 15+ high-precision financial, statistical, tax, and health engines with real-time market intelligence and academic research journals. All math formulas are audited against institutional banking standards (RBI, US Fed, WHO, NIST) with full step-by-step mathematical proofs.',
  },
  {
    category: 'Privacy & Security',
    question: 'Are calculations on QuickMoments 100% private and confidential?',
    answer:
      'Yes, 100%. All calculation inputs (salaries, loan principals, health metrics, and CSV datasets) are computed entirely client-side inside your browser via local JavaScript execution. Your private data is never transmitted to, stored on, or harvested by any external backend servers.',
  },
  {
    category: 'Finance & Tax',
    question: 'How accurate are the Loan EMI and Indian Income Tax calculations?',
    answer:
      'Our EMI calculations use the standardized reducing-balance compounding formula: [P × r × (1 + r)^n] / [(1 + r)^n - 1], generating full month-by-month amortization schedules. Our Income Tax Calculator incorporates the latest Union Budget FY 2025-26 slabs, comparing New vs Old regimes with exact Standard Deductions and 80C/80D/HRA exemptions.',
  },
  {
    category: 'Health & Fitness',
    question: 'How does the BMI, BMR and TDEE Health Calculator compute my daily targets?',
    answer:
      'Our health suite uses the clinical Mifflin-St Jeor formula to compute Basal Metabolic Rate (BMR) and applies physical activity multipliers for Total Daily Energy Expenditure (TDEE). If Body Fat % is provided, it unlocks the Katch-McArdle formula for Lean Body Mass (LBM) targeting, supporting both Metric (cm, kg) and US Imperial (ft/in, lbs) units.',
  },
  {
    category: 'Market Feeds & RSS',
    question: 'How are live market ticker indices and economic news feeds updated?',
    answer:
      'The live market ticker queries Yahoo Finance Spark batch APIs every 2 hours with automatic caching and rate-limiting shields for 8 major benchmark instruments (NIFTY 50, SENSEX, BANK NIFTY, NASDAQ, USD/INR, EUR/INR, Gold, and Silver). The NewsRoom ingests dynamic RSS feeds from The Economic Times and Google News across 5 core categories.',
  },
  {
    category: 'Compliance & Standards',
    question: 'How does QuickMoments adhere to Google AdSense and editorial policies?',
    answer:
      'QuickMoments is fully compliant with Google Publisher Policies, verified with an official ads.txt record, SSL encryption, transparent affiliate disclosures, clear editorial sourcing, and robust privacy protections in accordance with GDPR and DPDP standards.',
  },
];

interface PlatformFaqSectionProps {
  className?: string;
}

export const PlatformFaqSection: React.FC<PlatformFaqSectionProps> = ({ className = '' }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-10 shadow-sm">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
              <HelpCircle className="w-4 h-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-brand-600 dark:text-brand-400">
              Frequently Asked Questions
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            Everything You Need to Know About QuickMoments
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Learn about our calculation accuracy, data privacy guarantees, live feeds, and editorial standards.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {PLATFORM_FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? 'bg-slate-50/80 dark:bg-slate-950/80 border-brand-500/50 dark:border-brand-500/40 shadow-xs'
                    : 'bg-white dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-xs font-bold text-brand-600 dark:text-brand-400 font-mono">
                      Q{idx + 1}.
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        {faq.category}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                  </div>

                  <div
                    className={`p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-brand-600 dark:text-brand-400' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/40 dark:border-slate-800/40 pl-11">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Trust & Transparency Footer */}
        <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-semibold">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>100% Client-Side Privacy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-brand-500" />
            <span>Google AdSense Verified Publisher</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Audited Mathematical Models</span>
          </div>
        </div>
      </div>
    </section>
  );
};
