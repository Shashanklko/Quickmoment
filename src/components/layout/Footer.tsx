import React from 'react';
import { GearMathLogo } from '../../branding/GearMathLogo';
import { ShieldCheck, Zap, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, slug?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/60 backdrop-blur-md pt-12 pb-8 text-xs text-slate-500 dark:text-slate-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="flex flex-col gap-3">
            <div onClick={() => onNavigate('home')}>
              <GearMathLogo size="sm" showText={true} />
            </div>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              The next-generation calculation, statistics, and simulation SaaS platform. Calculate anything in seconds. Understand everything with clarity.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Client-Side Privacy & Zero Telemetry Leak
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Popular Categories
            </h4>
            <ul className="flex flex-col gap-2">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('category', 'finance')}
                  className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  Finance & Loans
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('category', 'investment')}
                  className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  Investment & SIP
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('category', 'tax')}
                  className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  Indian Tax & Salary (FY 24-25)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('category', 'statistics')}
                  className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  Statistics & Distributions
                </button>
              </li>
            </ul>
          </div>

          {/* Simulations & Labs */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Interactive Labs
            </h4>
            <ul className="flex flex-col gap-2">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('simulations')}
                  className="hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-fuchsia-500" />
                  Monte Carlo π Simulator
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('quickstats')}
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-1.5"
                >
                  <Zap className="w-3 h-3 text-purple-500" />
                  QuickStats CSV Analyzer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('arcade')}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1.5 font-bold"
                >
                  🎮 Math Arcade & Mini-Games
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('calc', 'attendance-calculator')}
                  className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  Attendance & Bunk Planner
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('calc', 'rent-vs-buy-calculator')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Rent vs Buy Housing Simulator
                </button>
              </li>
            </ul>
          </div>

          {/* Resources & SEO */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Resources
            </h4>
            <ul className="flex flex-col gap-2">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('blog')}
                  className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  Mathematical Explanations & Blog
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('admin')}
                  className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  Platform Analytics Dashboard
                </button>
              </li>
              <li>
                <a
                  href="https://link.amazon/B0h36GxsC"
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="text-amber-600 dark:text-amber-400 hover:underline font-semibold flex items-center gap-1"
                >
                  ⭐ Featured Amazon Deals
                </a>
              </li>
              <li>
                <span className="text-slate-400 dark:text-slate-500">
                  Version 1.0.0 (Production Pro)
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-2xl">
            &copy; {new Date().getFullYear()} QuickMoments Platform. All financial and health calculations are models for educational purposes. As an Amazon Associate, QuickMoments may earn from qualifying purchases at no extra cost to you.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Fast</span>
            <span>•</span>
            <span>Mathematical</span>
            <span>•</span>
            <span>Trustworthy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
