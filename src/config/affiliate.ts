export interface AffiliateProduct {
  id: string;
  title: string;
  category: string;
  price: string;
  originalPrice: string;
  discount: string;
  rating: number;
  reviewsCount: string;
  imageUrl: string;
  tag: string;
  productUrl?: string;
}

export interface AffiliateDeal {
  id: string;
  title: string;
  description: string;
  badge: string;
  category: string;
  dealUrl?: string;
}

export const AFFILIATE_CONFIG = {
  amazonAffiliateLink: 'https://link.amazon/B0h36GxsC',
  financial_book: 'https://link.amazon/B0er4jnnI',
  trimmer: 'https://link.amazon/B0hLMh2u2',
  Noisetwist_watch: 'https://link.amazon/B08UlzUCs',
  fasttrack: 'https://link.amazon/B0eAJUBdr',
  Headset: 'https://link.amazon/B01cjScTs',
  shoe: 'https://link.amazon/B00rYMX75',

  disclaimer: 'As an Amazon Associate, QuickMoments may earn from qualifying purchases at no extra cost to you.',

  // Diverse Product Showcase Catalog
  featuredProducts: [
    {
      id: 'sneakers-deal',
      title: 'Aurora Ultra-Responsive Running Sneakers',
      category: 'Footwear & Sports',
      price: '₹2,499',
      originalPrice: '₹4,999',
      discount: '50% OFF',
      rating: 4.8,
      reviewsCount: '3,820',
      imageUrl: '/images/products/sneakers.jpg',
      tag: '🔥 Best Seller',
      productUrl: 'https://link.amazon/B00rYMX75',
    },
    {
      id: 'headphones-deal',
      title: 'Nexus Pro Active Noise Cancelling Wireless Headphones',
      category: 'Audio & Gadgets',
      price: '₹3,299',
      originalPrice: '₹6,499',
      discount: '49% OFF',
      rating: 4.9,
      reviewsCount: '8,150',
      imageUrl: '/images/products/headphones.jpg',
      tag: '⭐ Top Rated',
      productUrl: 'https://link.amazon/B01cjScTs',
    },
    {
      id: 'smartwatch-deal',
      title: 'Aurora AMOLED Fitness & Heart Rate Smartwatch',
      category: 'Wearables & Health',
      price: '₹1,999',
      originalPrice: '₹3,999',
      discount: '50% OFF',
      rating: 4.7,
      reviewsCount: '5,400',
      imageUrl: '/images/products/smartwatch.jpg',
      tag: '⚡ Lightning Deal',
      productUrl: 'https://link.amazon/B08UlzUCs',
    },
  ] as AffiliateProduct[],

  featuredDeals: [
    {
      id: 'finance-books',
      title: 'Top Rated Finance & Wealth Management Books',
      description: 'Handpicked classics on compounding, investing, and financial independence.',
      badge: 'Amazon Choice',
      category: 'finance',
      dealUrl: 'https://link.amazon/B0er4jnnI',
    },
    {
      id: 'scientific-calculators',
      title: 'Precision Scientific & Financial Calculators',
      description: 'Official hardware calculators for engineering, CFA, MBA, and university exams.',
      badge: 'Best Seller',
      category: 'education',
      dealUrl: 'https://link.amazon/B0eAJUBdr',
    },
    {
      id: 'desk-tech',
      title: 'Developer & Data Analyst Desk Gear',
      description: 'Ergonomic setups, 4K ultrawide monitors, and productivity accessories.',
      badge: 'Trending Deal',
      category: 'developer',
      dealUrl: 'https://link.amazon/B01cjScTs',
    },
  ] as AffiliateDeal[],
};
