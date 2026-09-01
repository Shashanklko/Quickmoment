import React from 'react';
import { AFFILIATE_CONFIG } from '../../config/affiliate';
import { ShoppingBag, ExternalLink, Sparkles, Tag } from 'lucide-react';

interface AffiliateBannerProps {
  category?: string;
  variant?: 'compact' | 'card' | 'banner';
  className?: string;
}

export const AffiliateBanner: React.FC<AffiliateBannerProps> = ({
  category = 'finance',
  variant = 'card',
  className = '',
}) => {
  const deal =
    AFFILIATE_CONFIG.featuredDeals.find((d) => d.category === category) ||
    AFFILIATE_CONFIG.featuredDeals[0];

  if (variant === 'compact') {
    return (
      <a
        href={AFFILIATE_CONFIG.amazonAffiliateLink}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={`flex items-center justify-between p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 hover:border-amber-400 text-xs font-semibold text-amber-900 dark:text-amber-200 transition-all group ${className}`}
      >
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Recommended Gear & Deals on Amazon</span>
        </div>
        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 group-hover:translate-x-0.5 transition-transform">
          Shop Deal <ExternalLink className="w-3 h-3" />
        </span>
      </a>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={`p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-indigo-500/10 border border-amber-300/60 dark:border-amber-800/60 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${className}`}>
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-500 text-white shadow-md">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-300/60 dark:border-amber-800">
                {deal.badge}
              </span>
              <span className="text-[10px] text-slate-400">Sponsored Deal</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
              {deal.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-xl">
              {deal.description}
            </p>
          </div>
        </div>

        <a
          href={AFFILIATE_CONFIG.amazonAffiliateLink}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md transition-all shrink-0 active:scale-95"
        >
          <span>View on Amazon</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  return (
    <div className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-amber-900/50 shadow-xs flex flex-col justify-between ${className}`}>
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-800/60">
              {deal.badge}
            </span>
          </div>
          <span className="text-[10px] text-slate-400">Amazon Partner</span>
        </div>

        <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">
          {deal.title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {deal.description}
        </p>
      </div>

      <a
        href={AFFILIATE_CONFIG.amazonAffiliateLink}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-all"
      >
        <span>Explore Collection</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
};
