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
import { updatePageSeo, SEO_PRESETS } from './services/seoService';
import { AppMode } from './types';

const SLUG_ALIASES: Record<string, string> = {
  'bmi-calculator': 'bmi-calorie-calculator',
  'descriptive-statistics': 'descriptive-statistics-calculator',
  'binomial-distribution': 'binomial-distribution-calculator',
  'linear-regression': 'linear-regression-calculator',
  'confidence-interval': 'confidence-interval-calculator',
  'monte-carlo-pi': 'monte-carlo-pi-simulator',
  'monte-carlo-investment': 'monte-carlo-investment-simulator',
  'unit-converter': 'universal-unit-converter',
  'developer-tools': 'developer-tools-suite',
};

const resolveCalcSlug = (slug: string) => {
  return SLUG_ALIASES[slug] || slug;
};

export function App() {
  // 3-Mode state ('newsroom' | 'calculator' | 'blog')
  const [currentMode, setCurrentMode] = useState<AppMode>(() => {
    const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
    if (pathname === '/' || pathname === '/newsroom') return 'newsroom';
    if (pathname === '/blog' || pathname.startsWith('/blog/')) return 'blog';
    if (pathname === '/calculators' || pathname.startsWith('/calculators/')) return 'calculator';
    
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get('mode') as AppMode;
    if (modeParam && ['newsroom', 'calculator', 'blog'].includes(modeParam)) {
      return modeParam;
    }
    if (params.get('post')) {
      return 'blog';
    }
    const saved = localStorage.getItem('qm_mode') as AppMode;
    if (saved && ['newsroom', 'calculator', 'blog'].includes(saved)) {
      return saved;
    }
    return 'newsroom';
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

    let newPath = '/';
    if (mode === 'newsroom') {
      newPath = '/';
    } else if (mode === 'calculator') {
      newPath = '/calculators';
      setCurrentView('home');
    } else if (mode === 'blog') {
      newPath = '/blog';
    }
    window.history.pushState({}, '', newPath);
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
      const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
      const params = new URLSearchParams(window.location.search);

      if (pathname === '/' || pathname === '/newsroom') {
        setCurrentMode('newsroom');
      } else if (pathname === '/blog' || pathname.startsWith('/blog/')) {
        setCurrentMode('blog');
      } else if (pathname === '/calculators') {
        setCurrentMode('calculator');
        setCurrentView('home');
      } else if (pathname.startsWith('/calculators/')) {
        const rawSlug = pathname.replace('/calculators/', '');
        const cleanSlug = resolveCalcSlug(rawSlug);
        setSelectedCalcSlug(cleanSlug);
        setCurrentView('calculator');
        setCurrentMode('calculator');
      } else if (pathname.startsWith('/statistics/')) {
        const rawSlug = pathname.replace('/statistics/', '');
        const cleanSlug = resolveCalcSlug(rawSlug);
        setSelectedCalcSlug(cleanSlug);
        setCurrentView('calculator');
        setCurrentMode('calculator');
      } else if (pathname === '/statistics' || pathname === '/quickstats') {
        setCurrentView('quickstats');
        setCurrentMode('calculator');
      } else if (pathname.startsWith('/simulations/')) {
        const rawSlug = pathname.replace('/simulations/', '');
        const cleanSlug = resolveCalcSlug(rawSlug);
        setSelectedCalcSlug(cleanSlug);
        setCurrentView('calculator');
        setCurrentMode('calculator');
      } else if (pathname === '/simulations') {
        setCurrentView('simulations');
        setCurrentMode('calculator');
      } else if (pathname.startsWith('/converters/')) {
        const rawSlug = pathname.replace('/converters/', '');
        const cleanSlug = resolveCalcSlug(rawSlug);
        setSelectedCalcSlug(cleanSlug);
        setCurrentView('calculator');
        setCurrentMode('calculator');
      } else if (pathname === '/converters') {
        setSelectedCategorySlug('converters');
        setCurrentView('category');
        setCurrentMode('calculator');
      } else if (pathname.startsWith('/developer/')) {
        const rawSlug = pathname.replace('/developer/', '');
        const cleanSlug = resolveCalcSlug(rawSlug);
        setSelectedCalcSlug(cleanSlug);
        setCurrentView('calculator');
        setCurrentMode('calculator');
      } else if (pathname === '/developer') {
        setSelectedCategorySlug('developer');
        setCurrentView('category');
        setCurrentMode('calculator');
      } else if (pathname.startsWith('/category/')) {
        const catSlug = pathname.replace('/category/', '');
        setSelectedCategorySlug(catSlug);
        setCurrentView('category');
        setCurrentMode('calculator');
      } else if (pathname === '/arcade') {
        setCurrentView('arcade');
        setCurrentMode('calculator');
      } else if (pathname === '/favorites') {
        setCurrentView('favorites');
        setCurrentMode('calculator');
      } else if (pathname === '/admin') {
        setCurrentView('admin');
        setCurrentMode('calculator');
      } else {
        // Fallback to query parameters
        const mode = params.get('mode') as AppMode;
        const calc = params.get('calc');
        const cat = params.get('cat');
        const view = params.get('view');

        if (mode && ['newsroom', 'calculator', 'blog'].includes(mode)) {
          setCurrentMode(mode);
        } else if (params.has('post')) {
          setCurrentMode('blog');
        } else if (calc || cat || view) {
          setCurrentMode('calculator');
        }

        if (calc) {
          setSelectedCalcSlug(resolveCalcSlug(calc));
          setCurrentView('calculator');
        } else if (cat) {
          setSelectedCategorySlug(cat);
          setCurrentView('category');
        } else if (view) {
          setCurrentView(view);
        }
      }

      const customParams: Record<string, any> = {};
      params.forEach((val, key) => {
        if (!['calc', 'cat', 'view', 'mode', 'post'].includes(key)) {
          const num = Number(val);
          customParams[key] = !isNaN(num) && val.trim() !== '' ? num : val;
        }
      });
      setUrlParams(customParams);
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
    if (view === 'newsroom') {
      handleSelectMode('newsroom');
      return;
    }
    if (view === 'blog') {
      handleSelectMode('blog');
      return;
    }
    if (view === 'home' || view === 'calculators') {
      setCurrentMode('calculator');
      setCurrentView('home');
      window.history.pushState({}, '', '/calculators');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentMode('calculator');
    setCurrentView(view);
    let newPath = '/calculators';

    if (view === 'calculator' && slug) {
      const cleanSlug = resolveCalcSlug(slug);
      setSelectedCalcSlug(cleanSlug);
      const calcMeta = CALCULATORS_REGISTRY.find((c) => c.slug === cleanSlug || c.slug === slug);
      if (calcMeta?.category === 'statistics') {
        newPath = `/statistics/${slug.replace('-calculator', '')}`;
      } else if (calcMeta?.category === 'simulation') {
        newPath = `/simulations/${slug.replace('-simulator', '')}`;
      } else if (calcMeta?.category === 'conversion') {
        newPath = '/converters/unit-converter';
      } else if (calcMeta?.category === 'developer') {
        newPath = '/developer/developer-tools';
      } else {
        newPath = `/calculators/${slug}`;
      }
    } else if (view === 'category' && slug) {
      setSelectedCategorySlug(slug);
      if (slug === 'converters') {
        newPath = '/converters';
      } else if (slug === 'developer') {
        newPath = '/developer';
      } else {
        newPath = `/category/${slug}`;
      }
    } else if (view === 'quickstats') {
      newPath = '/statistics';
    } else if (view === 'simulations') {
      newPath = '/simulations';
    } else if (view === 'arcade') {
      newPath = '/arcade';
    } else if (view === 'favorites') {
      newPath = '/favorites';
    } else if (view === 'admin') {
      newPath = '/admin';
    }

    window.history.pushState({}, '', newPath);
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

  // Dynamic SEO Synchronization across Calculator Studio Views
  useEffect(() => {
    if (currentMode === 'calculator') {
      if (currentView === 'home') {
        updatePageSeo(SEO_PRESETS.calculatorsHub());
      } else if (currentView === 'calculator' && activeCalculator) {
        updatePageSeo(SEO_PRESETS.calculator(activeCalculator));
      } else if (currentView === 'simulations') {
        updatePageSeo(SEO_PRESETS.simulations());
      } else if (currentView === 'quickstats') {
        updatePageSeo(SEO_PRESETS.statistics());
      } else if (currentView === 'arcade') {
        updatePageSeo({
          title: 'Games & Financial Probability Arcade — QuickMoments',
          description: 'Play probability games, Monty Hall paradox simulator, and interactive math challenges.',
          canonicalPath: '/arcade',
        });
      } else if (currentView === 'favorites') {
        updatePageSeo({
          title: 'Saved Favorite Calculators — QuickMoments',
          description: 'Your personalized collection of bookmarked precision calculators and tools.',
          canonicalPath: '/favorites',
        });
      } else if (currentView === 'category') {
        updatePageSeo({
          title: `${selectedCategorySlug.charAt(0).toUpperCase() + selectedCategorySlug.slice(1)} Precision Calculators — QuickMoments`,
          description: `High-precision online tools and calculators for ${selectedCategorySlug}.`,
          canonicalPath: `/category/${selectedCategorySlug}`,
        });
      }
    }
  }, [currentMode, currentView, selectedCalcSlug, selectedCategorySlug, activeCalculator]);

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
