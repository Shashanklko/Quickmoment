import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { NEWS_ARTICLES, NEWS_CATEGORIES } from '../../data/newsRegistry';
import { NewsArticle, NewsCategory } from '../../types';
import { SideDealsRail } from '../common/SideDealsRail';
import { AffiliateBanner } from '../common/AffiliateBanner';
import { LiveTickerTape } from '../common/LiveTickerTape';
import { InvestorAwarenessCard } from '../common/InvestorAwarenessCard';
import { fetchLiveRssByCategory, RSS_NEWS_CONFIGS } from '../../services/liveRssNewsService';
import { updatePageSeo, SEO_PRESETS } from '../../services/seoService';
import {
  Newspaper,
  TrendingUp,
  Cpu,
  BarChart3,
  Landmark,
  Globe2,
  Search,
  Clock,
  ExternalLink,
  Share2,
  X,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Radio,
  Check,
  Bot,
} from 'lucide-react';

interface NewsRoomViewProps {
  onNavigateToCalculator?: (slug: string) => void;
}

export const NewsRoomView: React.FC<NewsRoomViewProps> = ({ onNavigateToCalculator }) => {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);

  // Live RSS cache state mapped by category key
  const [rssCache, setRssCache] = useState<Record<string, NewsArticle[]>>({});
  const [isLoadingRss, setIsLoadingRss] = useState<boolean>(false);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  // Sync Dynamic SEO metadata for NewsRoom
  useEffect(() => {
    updatePageSeo(SEO_PRESETS.newsroom(selectedCategory));
  }, [selectedCategory]);

  // Load live RSS feed when category changes
  const loadCategoryNews = useCallback(async (cat: NewsCategory, force: boolean = false) => {
    if (!force && rssCache[cat] && rssCache[cat].length > 0) return;

    setIsLoadingRss(true);
    try {
      const liveItems = await fetchLiveRssByCategory(cat);
      if (liveItems && liveItems.length > 0) {
        setRssCache((prev) => ({ ...prev, [cat]: liveItems }));
      }
    } catch {
      // Keep existing
    } finally {
      setIsLoadingRss(false);
    }
  }, [rssCache]);

  // Trigger fetch when category is active
  useEffect(() => {
    if (selectedCategory !== 'all') {
      loadCategoryNews(selectedCategory);
    } else {
      // Preload primary categories
      loadCategoryNews('technology');
      loadCategoryNews('stockMarket');
      loadCategoryNews('economy');
    }
  }, [selectedCategory, loadCategoryNews]);

  // Combine live RSS cache or fallback registry
  const currentArticlesPool = useMemo(() => {
    if (selectedCategory === 'all') {
      // Merge all cached RSS items with default articles
      const liveAll = Object.values(rssCache).flat();
      if (liveAll.length > 0) {
        const liveIds = new Set(liveAll.map((a) => a.title));
        const nonDuplicateRegistry = NEWS_ARTICLES.filter((a) => !liveIds.has(a.title));
        return [...liveAll, ...nonDuplicateRegistry];
      }
      return NEWS_ARTICLES;
    }

    if (rssCache[selectedCategory] && rssCache[selectedCategory].length > 0) {
      return rssCache[selectedCategory];
    }

    return NEWS_ARTICLES.filter((a) => a.category === selectedCategory);
  }, [selectedCategory, rssCache]);

  // Search filter
  const filteredArticles = useMemo(() => {
    return currentArticlesPool.filter((article) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });
  }, [currentArticlesPool, searchQuery]);

  const heroArticle = useMemo(() => {
    return filteredArticles[0] || NEWS_ARTICLES[0];
  }, [filteredArticles]);

  const restArticles = useMemo(() => {
    return filteredArticles.slice(1);
  }, [filteredArticles]);

  const getCategoryIcon = (catId: NewsCategory) => {
    switch (catId) {
      case 'technology':
        return Cpu;
      case 'economy':
        return TrendingUp;
      case 'stockMarket':
        return BarChart3;
      case 'politics':
        return Landmark;
      case 'global':
        return Globe2;
      default:
        return Newspaper;
    }
  };

  // Copy formatted AI Search Citation Handler (ChatGPT / Perplexity / Gemini)
  const handleCopyForAi = async (article: NewsArticle, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const citationText = `📌 "${article.title}"\n\n${article.summary}\n\n📰 Source: ${article.source} | QuickMoments Intelligence\n🔗 Link: ${article.sourceUrl || 'https://www.quickmoment.fun/newsroom'}\n⚡ Powered by QuickMoments Computational Intelligence: https://www.quickmoment.fun/`;

    try {
      await navigator.clipboard.writeText(citationText);
      setCopiedToast(`Copied AI citation format for ChatGPT / Perplexity!`);
      setTimeout(() => setCopiedToast(null), 3500);
    } catch {
      //
    }
  };

  // Social Share & Clipboard Copy Handler
  const handleShare = async (article: NewsArticle, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const shareData = {
      title: article.title,
      text: `${article.title}\n\nRead more on QuickMoments:`,
      url: article.sourceUrl || window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch {
        // User dismissed
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.url}`);
        setCopiedToast(`Copied "${article.title.slice(0, 30)}..." link to clipboard!`);
        setTimeout(() => setCopiedToast(null), 3000);
      } catch {
        // Clipboard error
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-16 animate-fade-in">
      {/* 1. Yahoo Finance 8-Item Live Ticker Tape (2-Hour Auto Sync) */}
      <LiveTickerTape className="mb-6" />

      {/* 2. NewsRoom Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1 sm:p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 inline-flex items-center">
              <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
            </span>
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-blue-500 dark:text-blue-400">
              Live Intelligence & The Economic Times RSS
            </span>
          </div>
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-black font-display text-slate-900 dark:text-white tracking-tight">
            Curated Global & Economic Feeds
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time feeds from The Economic Times & Yahoo Finance across 5 core divisions.
          </p>
        </div>

        {/* Search & Refresh Bar */}
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news, topics, tags..."
              className="w-full pl-9 pr-8 py-2 sm:py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              if (selectedCategory !== 'all') {
                loadCategoryNews(selectedCategory, true);
              } else {
                loadCategoryNews('technology', true);
                loadCategoryNews('stockMarket', true);
                loadCategoryNews('economy', true);
              }
            }}
            disabled={isLoadingRss}
            className="p-2 sm:p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer shrink-0"
            title="Refresh Live RSS Feed from Economic Times"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingRss ? 'animate-spin text-blue-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* 3. 5-Division Category Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
            selectedCategory === 'all'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Newspaper className="w-3.5 h-3.5" />
          <span>All 40 Stories</span>
          <span className="text-[10px] opacity-75 font-mono">({NEWS_ARTICLES.length})</span>
        </button>

        {NEWS_CATEGORIES.map((cat) => {
          const Icon = getCategoryIcon(cat.id);
          const isSelected = selectedCategory === cat.id;
          const count = NEWS_ARTICLES.filter((a) => a.category === cat.id).length;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.name}</span>
              <span className="text-[10px] opacity-75 font-mono">({count})</span>
            </button>
          );
        })}
      </div>

      {/* 4. 2-Column Main Layout: Feed (Left 8 cols) + Sticky Side Deals & Awareness Video (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Main News Feed Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Featured Breaking Hero Card */}
          {heroArticle && (
            <div
              onClick={() => setActiveArticle(heroArticle)}
              className="group p-5 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 border border-slate-800 hover:border-blue-500/80 transition-all cursor-pointer shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white px-2.5 py-0.5 rounded-full animate-pulse">
                    🔥 Live Top Story
                  </span>
                  <span className="text-[11px] font-bold text-blue-400">
                    {heroArticle.source}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {heroArticle.publishedAt}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleCopyForAi(heroArticle, e)}
                    className="p-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                    title="Copy briefing & citation format for ChatGPT / Perplexity"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Cite in AI</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleShare(heroArticle, e)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Share story"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h2 className="text-lg sm:text-2xl font-black font-display text-white group-hover:text-blue-300 transition-colors mb-3 leading-snug">
                {heroArticle.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
                {heroArticle.summary}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
                <div className="flex flex-wrap items-center gap-1.5">
                  {heroArticle.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform">
                  Read Full Briefing <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          )}

          {/* Rest of the Articles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {restArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => setActiveArticle(article)}
                className="group p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/50 glow-card transition-all cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold truncate max-w-[180px]">
                      {article.source}
                    </span>
                    <span className="shrink-0">{article.publishedAt}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug mb-2">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {article.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleCopyForAi(article, e)}
                      className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer"
                      title="Copy briefing for AI / ChatGPT citation"
                    >
                      <Bot className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleShare(article, e)}
                      className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                      title="Share this story"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="font-bold text-blue-600 dark:text-blue-400 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Read <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* In-feed Affiliate Banner */}
          <AffiliateBanner variant="banner" />
        </div>

        {/* Sticky Side Column: Investor Awareness Video Series + Amazon Product Snapshots Rail */}
        <div className="lg:col-span-4 sticky top-20 sm:top-24 self-start flex flex-col gap-6">
          {/* Investor Awareness Video Episode Series Carousel */}
          <InvestorAwarenessCard />

          {/* Amazon Trending Deals Snapshot Rail */}
          <SideDealsRail />
        </div>
      </div>

      {/* 5. Article Reader Modal / Drawer */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl my-8">
            <button
              type="button"
              onClick={() => setActiveArticle(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3 pr-10">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 font-bold">
                {activeArticle.category.toUpperCase()}
              </span>
              <span>•</span>
              <span className="text-slate-500 font-semibold">{activeArticle.source}</span>
              <span>•</span>
              <span className="text-slate-400">{activeArticle.publishedAt}</span>
            </div>

            <h2 className="text-lg sm:text-2xl font-black font-display text-slate-900 dark:text-white mb-4 leading-snug">
              {activeArticle.title}
            </h2>

            <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-5 italic">
              &ldquo;{activeArticle.summary}&rdquo;
            </div>

            {/* Full Content */}
            <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-4 mb-6 whitespace-pre-line font-sans">
              {activeArticle.content}
            </div>

            {/* Tags & Action Bar */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {activeArticle.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyForAi(activeArticle)}
                  className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-300 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer border border-blue-200/50 dark:border-blue-800/50"
                  title="Copy briefing for AI / ChatGPT citation"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Cite in AI</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleShare(activeArticle)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Share story"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>

                <a
                  href={activeArticle.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 sm:px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5 shadow-sm"
                >
                  <span>View on {activeArticle.source.split(' ')[0] || 'Economic Times'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Copied Link Toast */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{copiedToast}</span>
        </div>
      )}
    </div>
  );
};

