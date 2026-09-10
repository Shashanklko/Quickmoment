/**
 * QuickMoments Omnichannel SEO & Generative Engine Optimization (GEO) Service
 * Manages dynamic document title, meta tags, OpenGraph, Twitter cards, and Schema.org JSON-LD
 * for Web Search (Google, Bing) and AI Recommendation Engines (ChatGPT Search, Perplexity, Gemini, Claude, Copilot).
 */

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonicalPath?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  structuredData?: Record<string, any> | Array<Record<string, any>>;
}

const BASE_URL = 'https://www.quickmoment.fun';
const DEFAULT_IMAGE = `${BASE_URL}/og-preview.png`;
const SITE_NAME = 'QuickMoments';

// Helper to set or create a meta tag
function setMetaTag(attributeName: string, attributeValue: string, content: string) {
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

// Helper to set canonical link
function setCanonical(url: string) {
  let element = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', url);
}

// Helper to inject or replace dynamic Schema.org JSON-LD
function setStructuredData(data: Record<string, any> | Array<Record<string, any>>) {
  const SCRIPT_ID = 'qm-dynamic-structured-data';
  let scriptElement = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (!scriptElement) {
    scriptElement = document.createElement('script');
    scriptElement.id = SCRIPT_ID;
    scriptElement.type = 'application/ld+json';
    document.head.appendChild(scriptElement);
  }

  const jsonLdContent = Array.isArray(data)
    ? { '@context': 'https://schema.org', '@graph': data }
    : { '@context': 'https://schema.org', ...data };

  scriptElement.textContent = JSON.stringify(jsonLdContent);
}

export function updatePageSeo(config: SeoConfig) {
  const canonicalUrl = `${BASE_URL}${config.canonicalPath || window.location.pathname}`;
  const keywordsStr = config.keywords
    ? config.keywords.join(', ')
    : 'QuickMoments, Precision Calculators, The Economic Times News, Stock Market Live, EMI Calculator, SIP Calculator, Financial Intelligence, Deep Blogs';

  // 1. Update Title
  document.title = config.title.includes(SITE_NAME)
    ? config.title
    : `${config.title} | ${SITE_NAME}`;

  // 2. Standard Meta Tags
  setMetaTag('name', 'title', document.title);
  setMetaTag('name', 'description', config.description);
  setMetaTag('name', 'keywords', keywordsStr);
  setMetaTag('name', 'author', config.author || 'QuickMoments Intelligence Team');
  setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  setMetaTag('name', 'ai-content-declaration', 'human-curated, algorithmic precision, verified live financial feeds');
  setCanonical(canonicalUrl);

  // 3. OpenGraph Tags (Facebook, WhatsApp, LinkedIn, Discord)
  setMetaTag('property', 'og:site_name', SITE_NAME);
  setMetaTag('property', 'og:title', document.title);
  setMetaTag('property', 'og:description', config.description);
  setMetaTag('property', 'og:url', canonicalUrl);
  setMetaTag('property', 'og:type', config.ogType || 'website');
  setMetaTag('property', 'og:image', config.ogImage || DEFAULT_IMAGE);
  setMetaTag('property', 'og:locale', 'en_US');

  // 4. Twitter Card Tags
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', document.title);
  setMetaTag('name', 'twitter:description', config.description);
  setMetaTag('name', 'twitter:image', config.ogImage || DEFAULT_IMAGE);
  setMetaTag('name', 'twitter:url', canonicalUrl);

  // 5. Academic & AI Citation Meta Tags
  if (config.publishedTime) {
    setMetaTag('name', 'citation_publication_date', config.publishedTime);
    setMetaTag('property', 'article:published_time', config.publishedTime);
  }
  if (config.author) {
    setMetaTag('name', 'citation_author', config.author);
    setMetaTag('property', 'article:author', config.author);
  }
  setMetaTag('name', 'citation_title', document.title);

  // 6. Schema.org JSON-LD Structured Data
  if (config.structuredData) {
    setStructuredData(config.structuredData);
  }
}

/**
 * Pre-configured SEO presets for core views
 */
export const SEO_PRESETS = {
  home: (): SeoConfig => ({
    title: 'QuickMoments — Live Breaking News, Market Intelligence & Financial Journal',
    description:
      'Real-time news feeds from The Economic Times & Yahoo Finance across Technology, Stock Markets, and Macro Economy, combined with 15+ high-precision financial calculators and peer-reviewed research blogs.',
    canonicalPath: '/',
    keywords: [
      'QuickMoments',
      'Economic Times news live',
      'stock market news live',
      'NIFTY 50 live updates',
      'SENSEX live',
      'tech news India',
      'precision calculators',
      'EMI calculator',
      'SIP calculator',
      'Monte Carlo simulations',
      'income tax FY 2025-26',
    ],
    structuredData: [
      {
        '@type': 'NewsMediaOrganization',
        '@id': `${BASE_URL}/#organization`,
        name: 'QuickMoments Intelligence',
        url: BASE_URL,
        logo: `${BASE_URL}/favicon.png`,
        publishingPrinciples: `${BASE_URL}/blog`,
        sameAs: [
          'https://economictimes.indiatimes.com',
          'https://finance.yahoo.com',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        url: BASE_URL,
        name: 'QuickMoments',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${BASE_URL}/?search={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'WebApplication',
        '@id': `${BASE_URL}/#app`,
        name: 'QuickMoments',
        url: BASE_URL,
        applicationCategory: 'NewsApplication, FinanceApplication, EducationalApplication',
        operatingSystem: 'All',
        description:
          'Multi-mode news intelligence and computational platform combining real-time Economic Times market newsroom, precision financial engines, and academic research journal.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
    ],
  }),

  calculatorsHub: (): SeoConfig => ({
    title: '15+ Precision Financial & Scientific Calculators — QuickMoments',
    description:
      'High-precision financial, tax, and health calculation suites with reducing-balance EMI amortization, SIP compounding, Monte Carlo simulations, and tax regime comparisons.',
    canonicalPath: '/calculators',
    keywords: [
      'precision calculators',
      'EMI calculator',
      'SIP calculator',
      'income tax calculator FY 2025-26',
      'Monte Carlo simulator',
      'salary calculator',
      'retirement planning',
      'rent vs buy calculator',
    ],
    structuredData: [
      {
        '@type': 'WebApplication',
        '@id': `${BASE_URL}/calculators#app`,
        name: 'QuickMoments Calculator Studio',
        url: `${BASE_URL}/calculators`,
        applicationCategory: 'FinanceApplication, EducationalApplication',
        operatingSystem: 'All',
        description: 'Suite of 15+ institutional-grade financial, statistical, and simulation calculators.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
    ],
  }),

  newsroom: (category?: string): SeoConfig => ({
    title: category && category !== 'all'
      ? `${category.charAt(0).toUpperCase() + category.slice(1)} News & Market Intelligence | QuickMoments NewsRoom`
      : 'Live NewsRoom — Real-Time Financial, Economic & Tech Intelligence | The Economic Times Feed',
    description:
      'Live financial, market, and technology intelligence powered by The Economic Times RSS and Yahoo Finance quotes. NIFTY 50, SENSEX, AI breakthroughs, macro policy, and global analysis.',
    canonicalPath: '/newsroom',
    keywords: [
      'Economic Times RSS',
      'stock market news live',
      'NIFTY 50 live quotes',
      'SENSEX live updates',
      'tech news India',
      'semiconductor news',
      'RBI monetary policy',
      'Union Budget news',
      'Yahoo Finance market feed',
    ],
    structuredData: [
      {
        '@type': 'NewsMediaOrganization',
        '@id': `${BASE_URL}/newsroom#organization`,
        name: 'QuickMoments NewsRoom Intelligence',
        url: `${BASE_URL}/newsroom`,
        logo: `${BASE_URL}/favicon.png`,
        sameAs: [
          'https://economictimes.indiatimes.com',
          'https://finance.yahoo.com',
        ],
      },
      {
        '@type': 'LiveBlogPosting',
        '@id': `${BASE_URL}/newsroom#liveblog`,
        headline: 'Real-Time Financial, Economic & Technology Intelligence Feed',
        description: 'Live newsroom feed aggregating verified intelligence from The Economic Times and Yahoo Finance.',
        url: `${BASE_URL}/newsroom`,
        datePublished: '2026-09-02T00:00:00+05:30',
        dateModified: new Date().toISOString(),
        publisher: {
          '@type': 'Organization',
          name: 'QuickMoments',
          url: BASE_URL,
        },
      },
    ],
  }),

  blogHub: (): SeoConfig => ({
    title: 'Research Journal & Deep Guides — Financial Mathematics, Science & Policy | QuickMoments',
    description:
      'Explore 10 peer-reviewed research articles on reducing-balance EMI mathematics, SIP compounding backtests, 2nm GAA semiconductors, tax inflection points, and quantum algorithms.',
    canonicalPath: '/blog',
    keywords: [
      'financial research blog',
      'how EMI is calculated',
      'SIP vs Lumpsum backtest',
      '2nm GAA transistors',
      'quantum computing shor algorithm',
      'old vs new tax regime',
      'rule of 72 compound living',
    ],
    structuredData: [
      {
        '@type': 'Blog',
        '@id': `${BASE_URL}/blog#hub`,
        name: 'QuickMoments Research Journal',
        url: `${BASE_URL}/blog`,
        description: 'Peer-reviewed articles on mathematical finance, economics, computing, and decision theory.',
        publisher: {
          '@type': 'Organization',
          name: 'QuickMoments Intelligence Team',
          url: BASE_URL,
        },
      },
    ],
  }),

  blogPost: (post: {
    title: string;
    excerpt: string;
    slug: string;
    category: string;
    publishedAt: string;
    readTime: string;
  }): SeoConfig => ({
    title: `${post.title} | QuickMoments Journal`,
    description: post.excerpt,
    canonicalPath: `/blog/${post.slug}`,
    ogType: 'article',
    publishedTime: '2026-01-15T00:00:00+05:30',
    author: 'QuickMoments Research Editorial',
    keywords: [
      post.title,
      post.category,
      'financial mathematics',
      'empirical research',
      'QuickMoments whitepapers',
    ],
    structuredData: [
      {
        '@type': 'TechArticle',
        '@id': `${BASE_URL}/blog/${post.slug}#article`,
        headline: post.title,
        description: post.excerpt,
        url: `${BASE_URL}/blog/${post.slug}`,
        datePublished: '2026-01-15T00:00:00+05:30',
        dateModified: '2026-09-02T00:00:00+05:30',
        articleSection: post.category,
        timeRequired: post.readTime,
        author: {
          '@type': 'Organization',
          name: 'QuickMoments Intelligence Team',
        },
        publisher: {
          '@type': 'Organization',
          name: 'QuickMoments',
          logo: {
            '@type': 'ImageObject',
            url: `${BASE_URL}/favicon.png`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${BASE_URL}/blog/${post.slug}`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: BASE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Research Journal',
            item: `${BASE_URL}/blog`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: post.title,
            item: `${BASE_URL}/blog/${post.slug}`,
          },
        ],
      },
    ],
  }),

  calculator: (calc: {
    name: string;
    shortDescription: string;
    slug: string;
    category: string;
    tags: string[];
    formula?: { expression: string; explanation: string };
    faqs?: Array<{ question: string; answer: string }>;
  }): SeoConfig => ({
    title: `${calc.name} — Free High-Precision Computation & Amortization | QuickMoments`,
    description: calc.shortDescription,
    canonicalPath: `/calculators/${calc.slug}`,
    keywords: [
      calc.name,
      ...calc.tags,
      'free online calculator',
      'precision calculation',
      'QuickMoments engines',
    ],
    structuredData: [
      {
        '@type': 'SoftwareApplication',
        '@id': `${BASE_URL}/calculators/${calc.slug}#app`,
        name: `${calc.name} — QuickMoments`,
        url: `${BASE_URL}/calculators/${calc.slug}`,
        applicationCategory: 'FinanceApplication, EducationalApplication',
        operatingSystem: 'All browsers',
        description: calc.shortDescription,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      ...(calc.faqs && calc.faqs.length > 0
        ? [
            {
              '@type': 'FAQPage',
              '@id': `${BASE_URL}/calculators/${calc.slug}#faq`,
              mainEntity: calc.faqs.map((f) => ({
                '@type': 'Question',
                name: f.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: f.answer,
                },
              })),
            },
          ]
        : []),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: BASE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Calculators',
            item: `${BASE_URL}/#calculators`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: calc.name,
            item: `${BASE_URL}/calculators/${calc.slug}`,
          },
        ],
      },
    ],
  }),

  simulations: (): SeoConfig => ({
    title: 'Monte Carlo Simulation Lab — 100,000-Trial Stochastic Modeling | QuickMoments',
    description:
      'Run in-browser stochastic simulations with 100k iterations for investment portfolio returns, market volatility distributions, and mathematical physics.',
    canonicalPath: '/simulations',
    keywords: [
      'Monte Carlo simulator',
      'stochastic modeling',
      'portfolio probability distribution',
      'Geometric Brownian Motion',
      'Monte Carlo Pi simulation',
    ],
  }),

  statistics: (): SeoConfig => ({
    title: 'CSV QuickStats Studio — Instant Dataset Analysis & Regression | QuickMoments',
    description:
      'Upload CSV data for instantaneous client-side descriptive statistics, standard deviation, skewness, linear regression, and distribution histograms.',
    canonicalPath: '/statistics',
    keywords: [
      'CSV statistics calculator',
      'descriptive statistics',
      'linear regression solver',
      'dataset analyzer online',
      'client side privacy statistics',
    ],
  }),
};
