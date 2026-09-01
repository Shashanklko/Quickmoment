import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomeView } from './components/views/HomeView';
import { CategoryView } from './components/views/CategoryView';
import { CalculatorDetailView } from './components/views/CalculatorDetailView';
import { QuickStatsCsvView } from './components/views/QuickStatsCsvView';
import { MonteCarloLabView } from './components/views/MonteCarloLabView';
import { FavoritesView } from './components/views/FavoritesView';
import { BlogView } from './components/views/BlogView';
import { AdminAnalyticsView } from './components/views/AdminAnalyticsView';
import { GamesArcadeView } from './components/views/GamesArcadeView';
import { NewsRoomView } from './components/views/NewsRoomView';
import { SearchModal } from './components/common/SearchModal';
import { ModeSelectorModal } from './components/common/ModeSelectorModal';
import { CALCULATORS_REGISTRY } from './data/calculatorsRegistry';
import { AppMode } from './types';

export function App() {
  // 3-Mode state ('newsroom' | 'calculator' | 'blog')
  const [currentMode, setCurrentMode] = useState<AppMode>(() => {
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get('mode') as AppMode;
    if (modeParam && ['newsroom', 'calculator', 'blog'].includes(modeParam)) {
      return modeParam;
    }
    const saved = localStorage.getItem('qm_mode') as AppMode;
    if (saved && ['newsroom', 'calculator', 'blog'].includes(saved)) {
      return saved;
    }
    return 'calculator';
  });

  // Welcome Mode Selection Modal (Show on first visit or when triggered)
  const [isModeModalOpen, setIsModeModalOpen] = useState<boolean>(() => {
    const hasSeen = localStorage.getItem('qm_has_seen_mode_popup');
    return !hasSeen;
  });

  // Navigation state within Calculator Studio
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedCalcSlug, setSelectedCalcSlug] = useState<string>('emi-calculator');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('finance');
  const [urlParams, setUrlParams] = useState<Record<string, any>>({});

  // Search modal state
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('qm_theme');
    if (saved) return saved === 'dark';
    return true; // Default to sleek dark mode
  });

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('qm_favorites');
      return saved ? JSON.parse(saved) : ['emi-calculator', 'sip-calculator', 'salary-calculator'];
    } catch {
      return ['emi-calculator', 'sip-calculator', 'salary-calculator'];
    }
  });

  // Sync mode with localStorage
  const handleSelectMode = (mode: AppMode) => {
    setCurrentMode(mode);
    localStorage.setItem('qm_mode', mode);
    localStorage.setItem('qm_has_seen_mode_popup', 'true');

    const url = new URL(window.location.href);
    if (mode === 'newsroom') {
      url.search = '?mode=newsroom';
    } else if (mode === 'blog') {
      url.search = '?mode=blog';
    } else {
      url.search = '';
    }
    window.history.pushState({}, '', url.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync theme with HTML class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('qm_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('qm_theme', 'light');
    }
  }, [isDark]);

  // Sync favorites with localStorage
  useEffect(() => {
    localStorage.setItem('qm_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Handle URL parsing on mount and popstate
  useEffect(() => {
    const parseUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get('mode') as AppMode;
      const calc = params.get('calc');
      const cat = params.get('cat');
      const view = params.get('view');

      if (mode && ['newsroom', 'calculator', 'blog'].includes(mode)) {
        setCurrentMode(mode);
      } else if (calc || cat || view) {
        setCurrentMode('calculator');
      }

      const customParams: Record<string, any> = {};
      params.forEach((val, key) => {
        if (!['calc', 'cat', 'view', 'mode'].includes(key)) {
          const num = Number(val);
          customParams[key] = !isNaN(num) && val.trim() !== '' ? num : val;
        }
      });
      setUrlParams(customParams);

      if (calc) {
        setSelectedCalcSlug(calc);
        setCurrentView('calculator');
      } else if (cat) {
        setSelectedCategorySlug(cat);
        setCurrentView('category');
      } else if (view) {
        setCurrentView(view);
      }
    };

    parseUrl();
    window.addEventListener('popstate', parseUrl);
    return () => window.removeEventListener('popstate', parseUrl);
  }, []);

  // Global Ctrl + K / Cmd + K search shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Navigation handlers
  const handleNavigate = (view: string, slug?: string) => {
    setCurrentMode('calculator');
    setCurrentView(view);
    const url = new URL(window.location.href);
    url.search = '';

    if (view === 'calculator' && slug) {
      setSelectedCalcSlug(slug);
      url.searchParams.set('calc', slug);
    } else if (view === 'category' && slug) {
      setSelectedCategorySlug(slug);
      url.searchParams.set('cat', slug);
    } else if (view !== 'home') {
      url.searchParams.set('view', view);
    }

    window.history.pushState({}, '', url.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFavorite = (slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const activeCalculator =
    CALCULATORS_REGISTRY.find((c) => c.slug === selectedCalcSlug) || CALCULATORS_REGISTRY[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Sticky Global Header with 3-Mode Segmented Control */}
      <Header
        currentMode={currentMode}
        onSelectMode={handleSelectMode}
        onOpenModeSelector={() => setIsModeModalOpen(true)}
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        favoritesCount={favorites.length}
      />

      {/* Main 3-Mode View Router */}
      <main className="flex-1">
        {/* MODE 1: NEWSROOM INTELLIGENCE */}
        {currentMode === 'newsroom' && (
          <NewsRoomView
            onNavigateToCalculator={(slug) => {
              handleSelectMode('calculator');
              handleNavigate('calculator', slug);
            }}
          />
        )}

        {/* MODE 2: BLOGS & JOURNAL */}
        {currentMode === 'blog' && (
          <BlogView
            onSelectCalculator={(slug) => {
              handleSelectMode('calculator');
              handleNavigate('calculator', slug);
            }}
            onBack={() => handleSelectMode('calculator')}
          />
        )}

        {/* MODE 3: CALCULATOR STUDIO & ARCADE */}
        {currentMode === 'calculator' && (
          <>
            {currentView === 'home' && (
              <HomeView
                onSelectCalculator={(slug) => handleNavigate('calculator', slug)}
                onSelectCategory={(slug) => handleNavigate('category', slug)}
                onOpenSearch={() => setIsSearchOpen(true)}
                onNavigate={handleNavigate}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {currentView === 'category' && (
              <CategoryView
                categorySlug={selectedCategorySlug}
                onSelectCalculator={(slug) => handleNavigate('calculator', slug)}
                onBack={() => handleNavigate('home')}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {currentView === 'calculator' && (
              <CalculatorDetailView
                calculator={activeCalculator}
                initialParams={urlParams}
                onBack={() => handleNavigate('home')}
                onSelectRelated={(slug) => handleNavigate('calculator', slug)}
                isFavorite={favorites.includes(activeCalculator.slug)}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {currentView === 'quickstats' && <QuickStatsCsvView />}

            {currentView === 'simulations' && <MonteCarloLabView />}

            {currentView === 'arcade' && <GamesArcadeView onBack={() => handleNavigate('home')} />}

            {currentView === 'favorites' && (
              <FavoritesView
                favorites={favorites}
                onSelectCalculator={(slug) => handleNavigate('calculator', slug)}
                onBack={() => handleNavigate('home')}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {currentView === 'admin' && (
              <AdminAnalyticsView
                onBack={() => handleNavigate('home')}
                onSelectCalculator={(slug) => handleNavigate('calculator', slug)}
              />
            )}
          </>
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Global Search Dialog Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCalculator={(slug) => handleNavigate('calculator', slug)}
      />

      {/* Initial 3-Mode Destination Welcome Popup Modal */}
      <ModeSelectorModal
        isOpen={isModeModalOpen}
        onClose={() => {
          setIsModeModalOpen(false);
          localStorage.setItem('qm_has_seen_mode_popup', 'true');
        }}
        currentMode={currentMode}
        onSelectMode={handleSelectMode}
      />
    </div>
  );
}

export default App;
