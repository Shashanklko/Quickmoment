import React, { useState, useEffect, useCallback } from 'react';
import { MarketTickerItem } from '../../types';
import { fetchLiveTickerTapeData, CACHE_TTL_MS, DEFAULT_MARKET_DATA } from '../../services/yfinanceService';
import { RefreshCw, TrendingUp, TrendingDown, Activity, Sparkles } from 'lucide-react';

interface LiveTickerTapeProps {
  className?: string;
}

export const LiveTickerTape: React.FC<LiveTickerTapeProps> = ({ className = '' }) => {
  const [tickers, setTickers] = useState<MarketTickerItem[]>(DEFAULT_MARKET_DATA);
  const [lastUpdated, setLastUpdated] = useState<string>('Live Feed');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const loadData = useCallback(async (force: boolean = false) => {
    setIsRefreshing(true);
    try {
      const state = await fetchLiveTickerTapeData(force);
      setTickers(state.items);
      setLastUpdated(state.lastUpdated);
    } catch {
      // Keep existing data
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Initial load and 2-hour interval scheduler
  useEffect(() => {
    loadData(false);

    const intervalId = setInterval(() => {
      loadData(true);
    }, CACHE_TTL_MS);

    return () => clearInterval(intervalId);
  }, [loadData]);

  return (
    <div
      className={`w-full p-2.5 sm:p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg text-xs overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Ticker Items Horizontal Scroller */}
        <div className="flex-1 flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-none py-0.5">
          {/* Live Status Badge */}
          <div className="flex items-center gap-2 pr-3 border-r border-slate-800 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-200">
                yFinance Feed
              </span>
              <span className="text-[9px] text-slate-400 font-mono">
                {lastUpdated}
              </span>
            </div>
          </div>

          {/* 8 Strict Yahoo Finance Ticker Items (Indices, Forex, Gold, Silver) */}
          {tickers.map((item, idx) => {
            const isPositive = item.isPositive;
            return (
              <div
                key={idx}
                className="flex items-center gap-2 shrink-0 px-2.5 py-1 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-slate-600 transition-colors"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-extrabold text-slate-200">
                      {item.symbol}
                    </span>
                    <span className="text-[9px] font-medium text-slate-400 uppercase tracking-tight">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs font-black font-mono text-white">
                    {item.value}
                  </span>
                </div>

                <div
                  className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-black font-mono ${
                    isPositive
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-2.5 h-2.5" />
                  ) : (
                    <TrendingDown className="w-2.5 h-2.5" />
                  )}
                  <span>{item.change}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Manual Refresh Button */}
        <div className="shrink-0 pl-2 border-l border-slate-800 flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadData(true)}
            disabled={isRefreshing}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold"
            title="Fetch live quotes from Yahoo Finance (Auto-syncs every 2 hours)"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-brand-400' : ''}`} />
            <span className="hidden sm:inline">2h Sync</span>
          </button>
        </div>
      </div>
    </div>
  );
};
