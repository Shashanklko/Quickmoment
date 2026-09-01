import { NewsArticle, NewsCategory } from '../types';
import { NEWS_ARTICLES } from '../data/newsRegistry';

export interface RssFeedConfig {
  key: NewsCategory;
  label: string;
  tag: string;
  feedUrl: string;
  backupFeedUrl: string;
  viewMoreUrl: string;
  sourceName: string;
}

export const RSS_NEWS_CONFIGS: RssFeedConfig[] = [
  {
    key: 'technology',
    label: 'Technology & AI',
    tag: 'Tech',
    feedUrl: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Feconomictimes.indiatimes.com%2Ftech%2Frssfeeds%2F13357270.cms',
    backupFeedUrl: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.google.com%2Frss%2Fsearch%3Fq%3Dtechnology%2BIndia%26hl%3Den-IN%26gl%3DIN%26ceid%3DIN:en',
    viewMoreUrl: 'https://economictimes.indiatimes.com/tech',
    sourceName: 'The Economic Times Tech',
  },
  {
    key: 'stockMarket',
    label: 'Stock Market & IPO',
    tag: 'Markets',
    feedUrl: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Feconomictimes.indiatimes.com%2Fmarkets%2Frssfeeds%2F1977021501.cms',
    backupFeedUrl: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.google.com%2Frss%2Fsearch%3Fq%3DIPO%2BIndia%2BStock%2BMarket%26hl%3Den-IN%26gl%3DIN%26ceid%3DIN:en',
    viewMoreUrl: 'https://economictimes.indiatimes.com/markets/stocks/news',
    sourceName: 'The Economic Times Markets',
  },
  {
    key: 'economy',
    label: 'Economy & Macro',
    tag: 'Economy',
    feedUrl: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Feconomictimes.indiatimes.com%2Fnews%2Feconomy%2Frssfeeds%2F13762472.cms',
    backupFeedUrl: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.google.com%2Frss%2Fsearch%3Fq%3DIndian%2BEconomy%2BRBI%2BGDP%26hl%3Den-IN%26gl%3DIN%26ceid%3DIN:en',
    viewMoreUrl: 'https://economictimes.indiatimes.com/news/economy',
    sourceName: 'The Economic Times Economy',
  },
  {
    key: 'politics',
    label: 'Politics & Policy',
    tag: 'Policy',
    feedUrl: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Feconomictimes.indiatimes.com%2Fnews%2Fpolitics-and-nation%2Frssfeeds%2F1052732854.cms',
    backupFeedUrl: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.google.com%2Frss%2Fsearch%3Fq%3DIndia%2BPolicy%2BUnion%2BBudget%26hl%3Den-IN%26gl%3DIN%26ceid%3DIN:en',
    viewMoreUrl: 'https://economictimes.indiatimes.com/news/politics-and-nation',
    sourceName: 'The Economic Times Policy',
  },
  {
    key: 'global',
    label: 'Global & Geopolitics',
    tag: 'Global',
    feedUrl: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Feconomictimes.indiatimes.com%2Fnews%2Finternational%2Fworld-news%2Frssfeeds%2F1707923769.cms',
    backupFeedUrl: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.google.com%2Frss%2Fsearch%3Fq%3DWorld%2BNews%2BGeopolitics%26hl%3Den-IN%26gl%3DIN%26ceid%3DIN:en',
    viewMoreUrl: 'https://economictimes.indiatimes.com/news/international/world-news',
    sourceName: 'The Economic Times World',
  },
];

export interface AwarenessEpisode {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: string;
}

export const AWARENESS_EPISODES: AwarenessEpisode[] = [
  {
    id: 'CM5VE6_RvwY',
    title: 'Success Story: Understanding Financial Advisory & Compounding',
    category: 'Financial Literacy',
    description: 'Learn the foundational principles of structured asset allocation, avoiding speculative traps, and choosing fiduciary financial advice.',
    duration: '12:45',
  },
  {
    id: '73OU8DlHgSQ',
    title: 'Investor Awareness Episode 1: Mutual Funds & Systematic Compounding',
    category: 'Mutual Funds',
    description: 'A deep exploration of Rupee Cost Averaging, expense ratio impacts, and index fund dynamics.',
    duration: '08:30',
  },
  {
    id: 'z6VRyiwlUqw',
    title: 'Investor Awareness Episode 2: Risk Management & Equity Microstructure',
    category: 'Risk Management',
    description: 'Essential guide on portfolio diversification, asset correlation, and managing drawdown emotions.',
    duration: '10:15',
  },
];

// Helper to strip HTML tags from RSS description
function cleanHtmlText(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>?/gm, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

export async function fetchLiveRssByCategory(categoryKey: NewsCategory): Promise<NewsArticle[]> {
  const config = RSS_NEWS_CONFIGS.find((c) => c.key === categoryKey);
  if (!config) {
    return NEWS_ARTICLES.filter((a) => a.category === categoryKey);
  }

  const urlsToTry = [config.feedUrl, config.backupFeedUrl];

  for (const url of urlsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const resp = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!resp.ok) continue;

      const data = await resp.json();

      if (data?.status === 'ok' && Array.isArray(data.items) && data.items.length > 0) {
        const liveArticles: NewsArticle[] = data.items.slice(0, 10).map((item: any, idx: number) => {
          const dateObj = new Date(item.pubDate);
          const formattedDate = isNaN(dateObj.getTime())
            ? 'Just now'
            : dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

          const cleanedSummary = cleanHtmlText(item.description || item.content || item.title);
          const fullContent = item.content ? cleanHtmlText(item.content) : cleanedSummary;

          return {
            id: `live-${categoryKey}-${idx}-${Date.now()}`,
            title: item.title,
            category: categoryKey,
            summary: cleanedSummary.slice(0, 240) + (cleanedSummary.length > 240 ? '...' : ''),
            content: fullContent || cleanedSummary,
            source: config.sourceName,
            sourceUrl: item.link || config.viewMoreUrl,
            publishedAt: formattedDate,
            readTime: '3 min read',
            imageUrl: item.thumbnail || item.enclosure?.link,
            tags: [config.tag, 'Live RSS', 'ET News'],
            impact: idx % 3 === 0 ? 'bullish' : 'high',
          };
        });

        return liveArticles;
      }
    } catch {
      // Continue to backup feed
    }
  }

  // Fallback to our curated 40-article registry for that category
  return NEWS_ARTICLES.filter((a) => a.category === categoryKey);
}
