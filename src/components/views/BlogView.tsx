import React, { useState } from 'react';
import { BLOG_POSTS } from '../../data/blogPosts';
import { BlogPost } from '../../types';
import { MarkdownRenderer } from '../common/MarkdownRenderer';
import { AffiliateBanner } from '../common/AffiliateBanner';
import { SideDealsRail } from '../common/SideDealsRail';
import { BookOpen, Clock, ArrowRight, ArrowLeft, ExternalLink, Bookmark, Share2 } from 'lucide-react';

interface BlogViewProps {
  onSelectCalculator: (slug: string) => void;
  onBack: () => void;
}

export const BlogView: React.FC<BlogViewProps> = ({ onSelectCalculator, onBack }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(() => {
    const pathname = window.location.pathname.replace(/\/+$/, '');
    if (pathname.startsWith('/blog/')) {
      const postSlug = pathname.replace('/blog/', '');
      const found = BLOG_POSTS.find((p) => p.slug === postSlug || p.id === postSlug);
      if (found) return found;
    }
    const params = new URLSearchParams(window.location.search);
    const postSlug = params.get('post');
    if (postSlug) {
      return BLOG_POSTS.find((p) => p.slug === postSlug || p.id === postSlug) || null;
    }
    return null;
  });

  const handleSelectPost = (post: BlogPost | null) => {
    setSelectedPost(post);
    if (post) {
      window.history.pushState({}, '', `/blog/${post.slug}`);
    } else {
      window.history.pushState({}, '', '/blog');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  React.useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname.replace(/\/+$/, '');
      if (pathname.startsWith('/blog/')) {
        const postSlug = pathname.replace('/blog/', '');
        const found = BLOG_POSTS.find((p) => p.slug === postSlug || p.id === postSlug);
        if (found) {
          setSelectedPost(found);
          return;
        }
      }
      const params = new URLSearchParams(window.location.search);
      const postSlug = params.get('post');
      if (postSlug) {
        setSelectedPost(BLOG_POSTS.find((p) => p.slug === postSlug || p.id === postSlug) || null);
      } else {
        setSelectedPost(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (selectedPost) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            type="button"
            onClick={() => handleSelectPost(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Articles
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: selectedPost.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              title="Share Article"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          </div>
        </div>

        {/* 2-Column Desktop Grid Layout: Main Article (Left) + Sticky Product Snapshots Sidebar (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Article Column */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Hero Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-brand-600 dark:text-brand-400 mb-3">
                <span className="px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/60 dark:border-brand-800/60">
                  {selectedPost.category}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedPost.readTime}
                </span>
                <span>•</span>
                <span className="text-slate-400">Published {selectedPost.publishedAt}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black font-display text-slate-900 dark:text-white leading-tight mb-4">
                {selectedPost.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed italic">
                &ldquo;{selectedPost.excerpt}&rdquo;
              </p>
            </div>

            {/* Featured Image */}
            {selectedPost.imageUrl && (
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg">
                <img
                  src={selectedPost.imageUrl}
                  alt={selectedPost.title}
                  className="w-full h-64 sm:h-96 object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
              </div>
            )}

            {/* Formatted Markdown Content */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
              <MarkdownRenderer content={selectedPost.content} />
            </div>

            {/* Interactive Companion Calculator Box */}
            {selectedPost.relatedCalculatorSlug && (
              <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full inline-block mb-2">
                    Live Interactive Companion
                  </span>
                  <h4 className="text-base font-bold">
                    Run the Simulation & Calculate Your Custom Numbers
                  </h4>
                  <p className="text-xs text-brand-100 mt-1 max-w-lg">
                    Instantly compute your exact amortization, growth curve, or probability breakdown using our dedicated tool.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectCalculator(selectedPost.relatedCalculatorSlug!)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-brand-700 hover:bg-brand-50 transition-all shadow-md shrink-0 cursor-pointer"
                >
                  Open Interactive Tool →
                </button>
              </div>
            )}

            {/* Recommended Deals Banner */}
            <AffiliateBanner variant="banner" />

            {/* Reference Links & Academic Sources */}
            {selectedPost.references && selectedPost.references.length > 0 && (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-3">
                  <Bookmark className="w-3.5 h-3.5 text-brand-500" />
                  Academic References & Official Sources
                </h4>
                <div className="flex flex-col gap-2.5">
                  {selectedPost.references.map((ref, idx) => (
                    <a
                      key={idx}
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-brand-500 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-all group"
                    >
                      <div className="flex flex-col">
                        <span>{ref.title}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{ref.source}</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-500 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Side Area: Product Snapshots & Sponsored Deals Rail */}
          <div className="lg:col-span-4 sticky top-24 self-start">
            <SideDealsRail />
          </div>
        </div>
      </div>
    );
  }

  // Articles Index Grid
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </button>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-3.5 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800/60">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black font-display text-slate-900 dark:text-white">
            Journal, Mathematical Guides & Insights
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Rigorous breakdowns of financial compounding, tax policies, and probability paradoxes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BLOG_POSTS.map((post) => (
          <div
            key={post.id}
            onClick={() => handleSelectPost(post)}
            className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/50 glow-card cursor-pointer transition-all overflow-hidden flex flex-col justify-between"
          >
            {post.imageUrl && (
              <div className="relative h-44 overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/70 backdrop-blur-md text-white border border-white/20">
                  {post.category}
                </span>
              </div>
            )}

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 mb-2">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime}
                </div>

                <h2 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-2 line-clamp-2">
                  {post.title}
                </h2>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs font-bold text-brand-600 dark:text-brand-400">
                <span>Read Article</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
