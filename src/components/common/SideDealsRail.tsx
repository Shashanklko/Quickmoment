import React from 'react';
import { AFFILIATE_CONFIG, AffiliateProduct } from '../../config/affiliate';
import { ShoppingBag, Star, ExternalLink, Tag, Sparkles, Flame } from 'lucide-react';

interface SideDealsRailProps {
  className?: string;
}

export const SideDealsRail: React.FC<SideDealsRailProps> = ({ className = '' }) => {
  return (
    <aside className={`flex flex-col gap-4 ${className}`}>
      {/* Side Rail Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Trending Amazon Deals
          </h3>
        </div>
        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
          Sponsored
        </span>
      </div>

      {/* Product Snapshot Cards */}
      <div className="flex flex-col gap-3.5">
        {AFFILIATE_CONFIG.featuredProducts.map((product) => (
          <a
            key={product.id}
            href={product.productUrl || AFFILIATE_CONFIG.amazonAffiliateLink}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="group block p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-amber-400 dark:hover:border-amber-500/60 transition-all shadow-xs overflow-hidden"
          >
            {/* Product Snapshot Image with Badge */}
            <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 mb-2.5">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-black bg-amber-500 text-white shadow-xs">
                {product.tag}
              </span>
              <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-950/80 text-emerald-400 backdrop-blur-xs">
                {product.discount}
              </span>
            </div>

            {/* Product Details */}
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">
                {product.category}
              </span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug mb-1.5">
                {product.title}
              </h4>

              {/* Star Rating */}
              <div className="flex items-center gap-1.5 mb-2">
                <div className="flex items-center text-amber-400">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span className="text-[11px] font-bold font-mono ml-1 text-slate-700 dark:text-slate-300">
                    {product.rating}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">({product.reviewsCount})</span>
              </div>

              {/* Price & CTA */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-black font-mono text-slate-900 dark:text-white">
                    {product.price}
                  </span>
                  <span className="text-[10px] text-slate-400 line-through font-mono">
                    {product.originalPrice}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform">
                  Shop <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Side Disclaimer */}
      <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight italic px-1">
        {AFFILIATE_CONFIG.disclaimer}
      </p>
    </aside>
  );
};
