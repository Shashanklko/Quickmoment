export type CategoryId = 
  | 'finance'
  | 'investment'
  | 'tax'
  | 'statistics'
  | 'simulation'
  | 'education'
  | 'date'
  | 'math'
  | 'business'
  | 'realEstate'
  | 'health'
  | 'developer'
  | 'conversion'
  | 'quirky';

export type AppMode = 'newsroom' | 'calculator' | 'blog';

export type NewsCategory = 'technology' | 'economy' | 'stockMarket' | 'politics' | 'global';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  color: string;
  badge?: string;
}

export type InputFieldType = 
  | 'number' 
  | 'currency' 
  | 'percentage' 
  | 'select' 
  | 'slider' 
  | 'date' 
  | 'text' 
  | 'textarea';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface InputFieldConfig {
  id: string;
  label: string;
  type: InputFieldType;
  defaultValue: any;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  tooltip?: string;
  options?: SelectOption[];
  dependsOn?: string;
}

export interface CalculatorResultItem {
  id: string;
  label: string;
  value: string | number;
  highlight?: boolean;
  type?: 'currency' | 'number' | 'percentage' | 'text' | 'badge';
  badgeColor?: 'emerald' | 'indigo' | 'amber' | 'rose' | 'blue';
  subtext?: string;
}

export interface CalculatorBreakdown {
  headers: string[];
  rows: (string | number)[][];
}

export interface CalculatorScenario {
  id: string;
  name: string;
  inputs: Record<string, any>;
  result: Record<string, any>;
  difference?: string;
}

export interface CalculatorFaq {
  question: string;
  answer: string;
}

export interface CalculatorMetadata {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  description: string;
  shortDescription: string;
  icon: string;
  isPopular?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  tags: string[];
  formula?: {
    expression: string;
    explanation: string;
    variables?: { name: string; desc: string }[];
  };
  workedExample?: {
    scenario: string;
    steps: string[];
    result: string;
  };
  faqs?: CalculatorFaq[];
  relatedSlugs?: string[];
  inputsConfig: InputFieldConfig[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  readTime: string;
  publishedAt: string;
  category: string;
  imageUrl?: string;
  relatedCalculatorSlug?: string;
  references?: {
    title: string;
    url: string;
    source: string;
  }[];
}

export interface UserHistoryItem {
  id: string;
  calculatorSlug: string;
  calculatorName: string;
  category: CategoryId;
  timestamp: number;
  summaryResult: string;
  params: Record<string, any>;
}

export interface NewsArticle {
  id: string;
  title: string;
  category: NewsCategory;
  summary: string;
  content: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  readTime: string;
  imageUrl?: string;
  tags: string[];
  relatedTicker?: string;
  impact?: 'bullish' | 'bearish' | 'neutral' | 'high';
}

export interface MarketTickerItem {
  symbol: string;
  name: string;
  value: string;
  change: string;
  isPositive: boolean;
}
