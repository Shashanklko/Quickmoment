import React from 'react';
import { AppMode } from '../../types';
import { Newspaper, Calculator, BookOpen, ArrowRight, X, CheckCircle2 } from 'lucide-react';
import { GearMathLogo } from '../../branding/GearMathLogo';

interface ModeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
}

export const ModeSelectorModal: React.FC<ModeSelectorModalProps> = ({
  isOpen,
  onClose,
  currentMode,
  onSelectMode,
}) => {
  if (!isOpen) return null;

  const modes = [
    {
      id: 'newsroom' as AppMode,
      title: 'NewsRoom',
      tagline: 'Tech, Markets & Macro',
      badge: 'LIVE 40+ FEEDS',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      icon: Newspaper,
      gradient: 'from-blue-600/20 via-slate-900 to-slate-900',
      borderHover: 'hover:border-blue-500',
      accentColor: 'text-blue-400',
      description: 'Curated 5-division market intelligence, ET feeds & live yFinance ticker.',
      features: ['5 Category Divisions', 'Live NIFTY / Sensex Ticker'],
      buttonText: 'Enter NewsRoom',
    },
    {
      id: 'calculator' as AppMode,
      title: 'Calculators',
      tagline: '15+ Precision Engines',
      badge: 'CORE ENGINE',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      icon: Calculator,
      gradient: 'from-emerald-600/20 via-slate-900 to-slate-900',
      borderHover: 'hover:border-emerald-500',
      accentColor: 'text-emerald-400',
      description: 'EMI amortization, SIP compounding, Monte Carlo lab & mini-games arcade.',
      features: ['Monte Carlo 100k Trials', '4 Mini-Games Arcade'],
      buttonText: 'Enter Calculators',
    },
    {
      id: 'blog' as AppMode,
      title: 'Deep Blogs',
      tagline: '10 Analytical Guides',
      badge: 'RESEARCH',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      icon: BookOpen,
      gradient: 'from-purple-600/20 via-slate-900 to-slate-900',
      borderHover: 'hover:border-purple-500',
      accentColor: 'text-purple-400',
      description: 'In-depth long-form research with LaTeX math proofs & tax optimization guides.',
      features: ['10 Long-Form Guides', 'LaTeX Math Proofs'],
      buttonText: 'Enter Deep Blogs',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title="Close Mode Selector"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Compact Modal Header */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="mb-2">
            <GearMathLogo size="sm" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-400 bg-brand-950/80 border border-brand-800/60 px-2.5 py-0.5 rounded-full mb-1">
            Welcome to QuickMoments
          </span>
          <h2 className="text-xl sm:text-2xl font-black font-display text-white tracking-tight">
            Select Your Destination
          </h2>
          <p className="text-xs text-slate-400 max-w-sm mt-0.5">
            Switch modes anytime from the top navigation pill.
          </p>
        </div>

        {/* Compact 3-Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-4">
          {modes.map((m) => {
            const Icon = m.icon;
            const isSelected = currentMode === m.id;

            return (
              <div
                key={m.id}
                onClick={() => {
                  onSelectMode(m.id);
                  onClose();
                }}
                className={`group relative flex flex-col justify-between p-4 rounded-2xl bg-gradient-to-b ${m.gradient} border ${
                  isSelected ? 'border-brand-500 ring-2 ring-brand-500/30' : 'border-slate-800'
                } ${m.borderHover} cursor-pointer transition-all duration-200 shadow-md hover:shadow-xl hover:-translate-y-0.5`}
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-2.5">
                    <div className={`p-2 rounded-xl bg-slate-800/80 ${m.accentColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${m.badgeColor}`}
                    >
                      {m.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-black font-display text-white group-hover:text-brand-300 transition-colors mb-0.5">
                    {m.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold mb-2">
                    {m.tagline}
                  </p>

                  <p className="text-[11px] text-slate-300 leading-snug mb-3 line-clamp-2">
                    {m.description}
                  </p>
                </div>

                <div>
                  {/* Compact Feature Bullets */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-1 mb-3">
                    {m.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <CheckCircle2 className={`w-3 h-3 ${m.accentColor} shrink-0`} />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Launch CTA */}
                  <button
                    type="button"
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-brand-500 text-white shadow-md'
                        : 'bg-slate-800 text-white group-hover:bg-brand-600'
                    }`}
                  >
                    <span>{m.buttonText}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="text-center text-[10px] text-slate-500">
          Tip: You can change destination anytime via the mode selector in the header.
        </div>
      </div>
    </div>
  );
};
