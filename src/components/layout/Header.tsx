import React from 'react';
import { GearMathLogo } from '../../branding/GearMathLogo';
import { AppMode } from '../../types';
import {
  Search,
  Moon,
  Sun,
  Star,
  Newspaper,
  Calculator,
  BookOpen,
  LayoutGrid,
  Sparkles,
  Gamepad2,
  Dices,
} from 'lucide-react';

interface HeaderProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  onOpenModeSelector: () => void;
  currentView: string;
  onNavigate: (view: string, slug?: string) => void;
  onOpenSearch: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  favoritesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  onOpenModeSelector,
  currentView,
  onNavigate,
  onOpenSearch,
  isDark,
  onToggleTheme,
  favoritesCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-15 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo & Brand */}
        <div
          onClick={() => {
            onSelectMode('calculator');
            onNavigate('home');
          }}
          className="cursor-pointer shrink-0 flex items-center"
        >
          <GearMathLogo size="sm" showText={true} className="hidden sm:inline-flex" />
          {/* Ultra-compact logo on mobile */}
          <div className="inline-flex sm:hidden items-center gap-1.5">
            <GearMathLogo size="xs" showText={false} />
            <span className="font-display font-black text-sm text-slate-900 dark:text-white tracking-tight">
              Quick<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500">Moments</span>
            </span>
          </div>
        </div>

        {/* Center: 3 Primary Modes Segmented Controller Pill */}
        <nav className="flex items-center gap-0.5 sm:gap-1 bg-slate-100/90 dark:bg-slate-900/90 p-0.5 sm:p-1 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs shrink-0">
          {/* Mode 1: NewsRoom */}
          <button
            type="button"
            onClick={() => onSelectMode('newsroom')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
              currentMode === 'newsroom'
                ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Real-Time Economic Times & Market Intelligence NewsRoom"
          >
            <Newspaper className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">NewsRoom</span>
            <span className="sm:hidden">News</span>
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-300" />
            </span>
          </button>

          {/* Mode 2: Calculator Studio */}
          <button
            type="button"
            onClick={() => {
              onSelectMode('calculator');
              if (currentView === 'blog') onNavigate('home');
            }}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
              currentMode === 'calculator'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="15+ High Precision Financial & Scientific Calculators"
          >
            <Calculator className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Calculators</span>
            <span className="sm:hidden">Calc</span>
          </button>

          {/* Mode 3: Blogs */}
          <button
            type="button"
            onClick={() => onSelectMode('blog')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
              currentMode === 'blog'
                ? 'bg-purple-600 text-white shadow-sm ring-1 ring-purple-400/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="10 Deep Analytical Research Guides & Financial Papers"
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Deep Blogs</span>
            <span className="sm:hidden">Blog</span>
            <span className="hidden md:inline-flex text-[9px] font-black uppercase bg-purple-400/30 text-white px-1.5 py-0.2 rounded-full">
              10
            </span>
          </button>

          {/* Mode Selector Modal Trigger Button */}
          <button
            type="button"
            onClick={onOpenModeSelector}
            className="p-1 sm:p-1.5 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            title="Explore All Modes Hub"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Quick Sub-Links for Arcade & Monte Carlo in Calculator Mode (Desktop only) */}
          {currentMode === 'calculator' && (
            <div className="hidden lg:flex items-center gap-1 border-r border-slate-200 dark:border-slate-800 pr-2 mr-1">
              <button
                type="button"
                onClick={() => onNavigate('arcade')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  currentView === 'arcade'
                    ? 'bg-amber-500 text-white'
                    : 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>Arcade</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('simulations')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  currentView === 'simulations'
                    ? 'bg-fuchsia-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Dices className="w-3.5 h-3.5" />
                <span>Monte Carlo</span>
              </button>
            </div>
          )}

          {/* Global Search Button */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 transition-all cursor-pointer"
            title="Global Search (Ctrl + K)"
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
            <span className="hidden md:inline font-medium">Search...</span>
            <kbd className="hidden lg:inline px-1.5 py-0.5 text-[10px] font-bold bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
              Ctrl K
            </kbd>
          </button>

          {/* Favorites shortcut */}
          <button
            type="button"
            onClick={() => onNavigate('favorites')}
            className="relative p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Saved Favorites"
          >
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-extrabold flex items-center justify-center shadow-xs">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
          >
            {isDark ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};

