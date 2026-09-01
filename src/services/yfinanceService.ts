import { MarketTickerItem } from '../types';

export interface YFinanceSymbolConfig {
  symbol: string;
  name: string;
  category: 'Index' | 'Currency' | 'Commodity';
  prefix?: string;
  suffix?: string;
  fallbackValue: string;
  fallbackChange: string;
  fallbackIsPositive: boolean;
}

// Exactly 8 Curated Symbols: Indices, Currency Pairs, Gold & Silver
export const MARKET_SYMBOLS: YFinanceSymbolConfig[] = [
  // 1. Benchmark Indices (4)
  {
    symbol: '^NSEI',
    name: 'NIFTY 50',
    category: 'Index',
    fallbackValue: '24,842.15',
    fallbackChange: '+0.68%',
    fallbackIsPositive: true,
  },
  {
    symbol: '^BSESN',
    name: 'SENSEX',
    category: 'Index',
    fallbackValue: '81,698.40',
    fallbackChange: '+0.54%',
    fallbackIsPositive: true,
  },
  {
    symbol: '^NSEBANK',
    name: 'BANK NIFTY',
    category: 'Index',
    fallbackValue: '51,280.60',
    fallbackChange: '+0.45%',
    fallbackIsPositive: true,
  },
  {
    symbol: '^IXIC',
    name: 'NASDAQ',
    category: 'Index',
    fallbackValue: '18,518.61',
    fallbackChange: '+0.83%',
    fallbackIsPositive: true,
  },

  // 2. Currency Pairs (2)
  {
    symbol: 'INR=X',
    name: 'USD / INR',
    category: 'Currency',
    prefix: '₹',
    fallbackValue: '84.08',
    fallbackChange: '-0.04%',
    fallbackIsPositive: true,
  },
  {
    symbol: 'EURINR=X',
    name: 'EUR / INR',
    category: 'Currency',
    prefix: '₹',
    fallbackValue: '91.24',
    fallbackChange: '+0.15%',
    fallbackIsPositive: true,
  },

  // 3. Precious Metals (2)
  {
    symbol: 'GC=F',
    name: 'Gold (Spot)',
    category: 'Commodity',
    prefix: '$',
    fallbackValue: '2,735.80',
    fallbackChange: '+0.48%',
    fallbackIsPositive: true,
  },
  {
    symbol: 'SI=F',
    name: 'Silver (Spot)',
    category: 'Commodity',
    prefix: '$',
    fallbackValue: '32.18',
    fallbackChange: '+1.15%',
    fallbackIsPositive: true,
  },
];

export const CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 Hours TTL
const CACHE_KEY = 'qm_spark_ticker_data';
const CACHE_TIME_KEY = 'qm_spark_ticker_last_fetched';
const RATE_LIMIT_KEY = 'qm_spark_rate_limit_until';

export interface LiveTickerState {
  items: MarketTickerItem[];
  lastUpdated: string;
  isLive: boolean;
  isLoading: boolean;
}

// Fallback formatted default data
export const DEFAULT_MARKET_DATA: MarketTickerItem[] = MARKET_SYMBOLS.map((item) => ({
  symbol: item.name,
  name: item.category,
  value: `${item.prefix || ''}${item.fallbackValue}${item.suffix || ''}`,
  change: item.fallbackChange,
  isPositive: item.fallbackIsPositive,
}));

// Format Spark Quote data based on close array and previousClose
function formatMarketQuote(item: YFinanceSymbolConfig, sparkData: any): MarketTickerItem {
  if (!sparkData) {
    return {
      symbol: item.name,
      name: item.category,
      value: `${item.prefix || ''}${item.fallbackValue}${item.suffix || ''}`,
      change: item.fallbackChange,
      isPositive: item.fallbackIsPositive,
    };
  }

  const closes = sparkData.close || [];
  let currentPrice: number | null = null;
  for (let i = closes.length - 1; i >= 0; i--) {
    if (closes[i] !== null && closes[i] !== undefined) {
      currentPrice = closes[i];
      break;
    }
  }

  const prevClose = sparkData.previousClose || currentPrice;

  if (currentPrice === null || !prevClose) {
    return {
      symbol: item.name,
      name: item.category,
      value: `${item.prefix || ''}${item.fallbackValue}${item.suffix || ''}`,
      change: item.fallbackChange,
      isPositive: item.fallbackIsPositive,
    };
  }

  const change = currentPrice - prevClose;
  const percentChange = (change / prevClose) * 100;
  const isPos = percentChange >= 0;
  const prefix = item.prefix || '';
  const suffix = item.suffix || '';

  let formattedValue = '';
  if (currentPrice >= 1000) {
    formattedValue = `${prefix}${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${suffix}`;
  } else {
    formattedValue = `${prefix}${currentPrice.toFixed(2)}${suffix}`;
  }

  return {
    symbol: item.name,
    name: item.category,
    value: formattedValue,
    change: `${isPos ? '+' : ''}${percentChange.toFixed(2)}%`,
    isPositive: isPos,
  };
}

// Fetch Batch Spark Data with CORS Proxy Fallbacks
async function fetchSparkDataBatch(symbols: string[]): Promise<Record<string, any>> {
  const querySymbols = symbols.join(',');
  const localProxyUrl = `/api/yahoo/v8/finance/spark?symbols=${encodeURIComponent(querySymbols)}`;
  const targetUrl = `https://query1.finance.yahoo.com/v8/finance/spark?symbols=${encodeURIComponent(querySymbols)}`;

  const proxyUrls = [
    localProxyUrl,
    `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
    targetUrl,
  ];

  for (const url of proxyUrls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const resp = await fetch(url, {
        headers: {
          Accept: 'application/json, text/plain, */*',
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!resp.ok) continue;

      const data = await resp.json();
      if (data && typeof data === 'object') {
        return data;
      }
    } catch {
      // Try next proxy
    }
  }

  throw new Error('Failed to fetch spark data from all endpoints');
}

export async function fetchLiveTickerTapeData(force: boolean = false): Promise<LiveTickerState> {
  const now = Date.now();
  const cachedTimeStr = localStorage.getItem(CACHE_TIME_KEY);
  const cachedDataStr = localStorage.getItem(CACHE_KEY);
  const rateLimitUntil = Number(localStorage.getItem(RATE_LIMIT_KEY) || '0');

  const lastFetched = cachedTimeStr ? Number(cachedTimeStr) : 0;
  const isCacheFresh = !force && now - lastFetched < CACHE_TTL_MS;
  const isRateLimited = now < rateLimitUntil;

  // Return cached data if within 2-hour TTL
  if (isCacheFresh && cachedDataStr) {
    try {
      const parsed = JSON.parse(cachedDataStr);
      return {
        items: parsed,
        lastUpdated: new Date(lastFetched).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLive: true,
        isLoading: false,
      };
    } catch {
      // Fall through
    }
  }

  // If rate-limited, serve cache or defaults
  if (isRateLimited && cachedDataStr) {
    try {
      return {
        items: JSON.parse(cachedDataStr),
        lastUpdated: new Date(lastFetched).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLive: false,
        isLoading: false,
      };
    } catch {
      // Fall through
    }
  }

  try {
    const rawSymbols = MARKET_SYMBOLS.map((item) => item.symbol);
    const sparkResults = await fetchSparkDataBatch(rawSymbols);

    const formattedResults = MARKET_SYMBOLS.map((item) =>
      formatMarketQuote(item, sparkResults[item.symbol])
    );

    // Update 2-hour cache
    localStorage.setItem(CACHE_KEY, JSON.stringify(formattedResults));
    localStorage.setItem(CACHE_TIME_KEY, String(now));
    localStorage.removeItem(RATE_LIMIT_KEY);

    return {
      items: formattedResults,
      lastUpdated: new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isLive: true,
      isLoading: false,
    };
  } catch {
    // Set 5-min cooldown on error
    localStorage.setItem(RATE_LIMIT_KEY, String(now + 5 * 60 * 1000));

    if (cachedDataStr) {
      try {
        return {
          items: JSON.parse(cachedDataStr),
          lastUpdated: lastFetched ? new Date(lastFetched).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Cached',
          isLive: false,
          isLoading: false,
        };
      } catch {
        // Fall through
      }
    }

    return {
      items: DEFAULT_MARKET_DATA,
      lastUpdated: 'Live Feed',
      isLive: false,
      isLoading: false,
    };
  }
}
