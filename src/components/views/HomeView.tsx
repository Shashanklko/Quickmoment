import React from 'react';
import { CATEGORIES_REGISTRY } from '../../data/categoriesRegistry';
import { CALCULATORS_REGISTRY } from '../../data/calculatorsRegistry';
import { CalculatorCard } from '../common/CalculatorCard';
import { GearMathLogo } from '../../branding/GearMathLogo';
import { Search, Sparkles, TrendingUp, ShieldCheck, Zap, ArrowRight, Dices, BarChart2 } from 'lucide-react';
import { AffiliateBanner } from '../common/AffiliateBanner';
import { DailyFortuneWidget } from '../common/DailyFortuneWidget';
import { LiveTickerTape } from '../common/LiveTickerTape';
import { PlatformFaqSection } from '../common/PlatformFaqSection';
import * as Icons from 'lucide-react';

interface HomeViewProps {
  onSelectCalculator: (slug: string) => void;
  onSelectCategory: (slug: string) => void;
  onOpenSearch: () => void;
  onNavigate: (view: string, slug?: string) => void;
  favorites: string[];
  onToggleFavorite: (slug: string, e: React.MouseEvent) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectCalculator,
  onSelectCategory,
  onOpenSearch,
  onNavigate,
  favorites,
  onToggleFavorite,
}) => {
  const popularCalculators = CALCULATORS_REGISTRY.filter((c) => c.isPopular);

  return (
    <div className="flex flex-col gap-16 pb-12 animate-fade-in">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-12 text-center max-w-4xl mx-auto px-4">
        {/* Subtle glowing ambient backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-brand-500/20 via-accent-500/15 to-cyan-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/80 dark:border-brand-800/80 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-6 shadow-xs animate-float">
          <Sparkles className="w-3.5 h-3.5 text-brand-500 animate-spin-slow" />
          <span>Next-Generation Calculation & Simulation Engine</span>
        </div>

        {/* Rotating Gear Hero Graphic & Main Heading */}
        <div className="flex flex-col items-center justify-center gap-4 mb-4">
          <GearMathLogo size="xl" interactive={true} />
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-slate-900 dark:text-white leading-tight">
            Calculate Anything in Seconds.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-500 to-accent-500">
              Understand Everything.
            </span>
          </h1>
        </div>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
          Free, accurate, full-scale SaaS calculators engineered for real-world decisions: finance, salary, loans, statistical distributions, and live Monte Carlo simulations.
        </p>

        {/* Large Global Search Trigger */}
        <div
          onClick={onOpenSearch}
          className="relative max-w-2xl mx-auto p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-xl hover:shadow-2xl hover:border-brand-500 transition-all cursor-pointer group flex items-center gap-3"
        >
          <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 group-hover:scale-105 transition-transform">
            <Search className="w-5 h-5" />
          </div>
          <div className="flex-1 text-left">
            <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 block">
              Search for any calculator or formula...
            </span>
            <span className="text-[11px] text-slate-400/80 dark:text-slate-600 hidden sm:inline">
              Try &ldquo;EMI&rdquo;, &ldquo;SIP Step-Up&rdquo;, &ldquo;Income Tax&rdquo;, &ldquo;Attendance Bunk&rdquo;, &ldquo;Monte Carlo π&rdquo;
            </span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            Ctrl K
          </kbd>
        </div>

        {/* Quick feature pill tags */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Instant Real-Time Calculations</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span>Dynamic Scenario &quot;What-If&quot; Engines</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-brand-500" />
            <span>100% Client-Side Privacy</span>
          </div>
        </div>
      </section>

      {/* Yahoo Finance 8-Item Live Ticker Tape */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <LiveTickerTape />
      </section>

      {/* Daily Fortune & Streak Widget */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <DailyFortuneWidget />
      </section>

      {/* Popular Calculators Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold text-xs">
                ★
              </span>
              <h2 className="text-lg sm:text-xl font-black font-display tracking-tight text-slate-900 dark:text-white">
                Popular Calculators
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Most used financial and mathematical decision tools
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenSearch}
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            Explore all 50+ <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularCalculators.slice(0, 8).map((calc) => (
            <CalculatorCard
              key={calc.id}
              calc={calc}
              onSelect={onSelectCalculator}
              isFavorite={favorites.includes(calc.slug)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>

        {/* Featured Amazon Deals & Gear */}
        <div className="mt-8">
          <AffiliateBanner variant="banner" />
        </div>
      </section>

      {/* Interactive Simulation & QuickStats Banner Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Monte Carlo Lab */}
          <div
            onClick={() => onNavigate('simulations')}
            className="group p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-fuchsia-900/30 via-slate-900 to-slate-900 border border-fuchsia-500/30 hover:border-fuchsia-500/70 transition-all cursor-pointer shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-fuchsia-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-2xl bg-fuchsia-500/20 text-fuchsia-400">
                <Dices className="w-6 h-6 animate-spin-slow" />
              </div>
              <span className="text-[11px] font-bold text-fuchsia-400 uppercase tracking-wider bg-fuchsia-950/60 px-2.5 py-1 rounded-full border border-fuchsia-800/40">
                Interactive Playground
              </span>
            </div>

            <h3 className="text-xl font-black font-display text-white mb-2 group-hover:text-fuchsia-300 transition-colors">
              Monte Carlo Simulation Lab
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Run up to 100,000 stochastic sampling trials to estimate fundamental constants like π, visualize stock market volatility percentile bands, and model discrete probabilities.
            </p>

            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-fuchsia-400 group-hover:translate-x-1 transition-transform">
              Launch Simulation Lab <ArrowRight className="w-4 h-4" />
            </span>
          </div>

          {/* Card 2: QuickStats CSV Analyzer */}
          <div
            onClick={() => onNavigate('quickstats')}
            className="group p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-900/30 via-slate-900 to-slate-900 border border-purple-500/30 hover:border-purple-500/70 transition-all cursor-pointer shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400">
                <BarChart2 className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider bg-purple-950/60 px-2.5 py-1 rounded-full border border-purple-800/40">
                Data Science Tool
              </span>
            </div>

            <h3 className="text-xl font-black font-display text-white mb-2 group-hover:text-purple-300 transition-colors">
              QuickStats CSV Data Analyzer
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Paste or upload raw CSV data to instantly compute mean, median, IQR, Tukey outliers, standard deviation, and generate interactive frequency histograms and box plots.
            </p>

            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 group-hover:translate-x-1 transition-transform">
              Open CSV Analyzer <ArrowRight className="w-4 h-4" />
            </span>
          </div>

          {/* Card 3: Math Arcade & Time Pass */}
          <div
            onClick={() => onNavigate('arcade')}
            className="group p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-900/30 via-slate-900 to-slate-900 border border-amber-500/30 hover:border-amber-500/70 transition-all cursor-pointer shadow-lg relative overflow-hidden md:col-span-2 lg:col-span-1"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
                <Sparkles className="w-6 h-6 animate-bounce" />
              </div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-800/40">
                🎮 Time Pass Arcade
              </span>
            </div>

            <h3 className="text-xl font-black font-display text-white mb-2 group-hover:text-amber-300 transition-colors">
              Math Arcade & Mini-Games
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Play addictive mini-games: 60-Second Speed Math Rush, Exponential 2048 Tile Puzzle, Higher/Lower Probability, and the 3-Door Diamond Vault.
            </p>

            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
              Play Mini-Games Now <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </section>

      {/* Calculator Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-black font-display tracking-tight text-slate-900 dark:text-white">
            Browse by Category
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Organized specialized suites for finance, academia, health, and engineering
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES_REGISTRY.map((cat) => {
            const CatIcon = (Icons as any)[cat.iconName] || Icons.Folder;
            const count = CALCULATORS_REGISTRY.filter((c) => c.category === cat.id).length;

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/50 dark:hover:border-brand-500/50 glow-card cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${cat.color} text-white shadow-xs group-hover:scale-110 transition-transform`}>
                      <CatIcon className="w-5 h-5" />
                    </div>
                    {cat.badge && (
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                        {cat.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  <span>{count} {count === 1 ? 'Tool' : 'Tools'}</span>
                  <span>View Suite →</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Authority & AdSense Compliance FAQ Section */}
      <PlatformFaqSection />
    </div>
  );
};
