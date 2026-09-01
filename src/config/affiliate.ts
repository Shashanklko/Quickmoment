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
  productUrl: string;
}

export const AFFILIATE_CONFIG = {
  amazonAffiliateLink: 'https://link.amazon/B0h36GxsC',
  financial_book: 'https://link.amazon/B0h36GxsC',
  trimmer: 'https://link.amazon/B0hLMh2u2',
  Noisetwist_watch: 'https://link.amazon/B08UlzUCs',
  fasttrack: 'https://link.amazon/B0eAJUBdr',
  Headset: 'https://link.amazon/B01cjScTs',
  shoe: 'https://link.amazon/B00rYMX75',

  disclaimer: 'As an Amazon Associate, QuickMoments may earn from qualifying purchases at no extra cost to you.',

  // Exact 6 User Products Catalog
  featuredProducts: [
    {
      id: 'trimmer-deal',
      title: 'Precision Cordless Beard & Hair Trimmer for Men',
      category: 'Grooming & Personal Care',
      price: '₹1,299',
      originalPrice: '₹2,499',
      discount: '48% OFF',
      rating: 4.8,
      reviewsCount: '9,420',
      imageUrl: '/images/products/trimmer.jpg',
      tag: '🔥 Best Seller',
      productUrl: 'https://link.amazon/B0hLMh2u2',
    },
    {
      id: 'noisetwist-deal',
      title: 'Noise Twist Bluetooth Calling Smartwatch with Display',
      category: 'Smartwatches & Tech',
      price: '₹1,499',
      originalPrice: '₹3,999',
      discount: '62% OFF',
      rating: 4.7,
      reviewsCount: '14,800',
      imageUrl: '/images/products/noisetwist_watch.jpg',
      tag: '⚡ Lightning Deal',
      productUrl: 'https://link.amazon/B08UlzUCs',
    },
    {
      id: 'fasttrack-deal',
      title: 'Fastrack Reflex Vivid HD Display Fitness Smartwatch',
      category: 'Wearables & Health',
      price: '₹1,699',
      originalPrice: '₹3,495',
      discount: '51% OFF',
      rating: 4.6,
      reviewsCount: '6,310',
      imageUrl: '/images/products/fasttrack.jpg',
      tag: '⭐ Popular Choice',
      productUrl: 'https://link.amazon/B0eAJUBdr',
    },
    {
      id: 'headset-deal',
      title: 'Wireless Active Noise Cancelling Over-Ear Headset',
      category: 'Audio & Music',
      price: '₹2,499',
      originalPrice: '₹4,999',
      discount: '50% OFF',
      rating: 4.9,
      reviewsCount: '11,250',
      imageUrl: '/images/products/headset.jpg',
      tag: '🎧 Top Rated Audio',
      productUrl: 'https://link.amazon/B01cjScTs',
    },
    {
      id: 'shoe-deal',
      title: 'Men Ultra-Light Lightweight Running Sports Shoes',
      category: 'Footwear & Athletic',
      price: '₹1,599',
      originalPrice: '₹2,999',
      discount: '47% OFF',
      rating: 4.8,
      reviewsCount: '8,640',
      imageUrl: '/images/products/shoe.jpg',
      tag: '👟 Amazon Choice',
      productUrl: 'https://link.amazon/B00rYMX75',
    },
    {
      id: 'financial-book-deal',
      title: 'Top Financial Freedom & Wealth Compounding Bestseller Book',
      category: 'Finance Books & Investing',
      price: '₹399',
      originalPrice: '₹799',
      discount: '50% OFF',
      rating: 4.9,
      reviewsCount: '18,500',
      imageUrl: '/images/products/financial_book.jpg',
      tag: '📚 Must Read',
      productUrl: 'https://link.amazon/B0h36GxsC',
    },
  ] as AffiliateProduct[],

  featuredDeals: [
    {
      id: 'finance-books',
      title: 'Top Rated Finance & Wealth Management Books',
      description: 'Master money compounding, investment psychology, and financial freedom.',
      badge: 'Amazon Choice',
      category: 'finance',
      dealUrl: 'https://link.amazon/B0h36GxsC',
    },
    {
      id: 'grooming-trimmer',
      title: 'Men Precision Beard & Hair Grooming Trimmer',
      description: 'Professional high-torque blades with long battery life & fast USB charging.',
      badge: 'Best Seller',
      category: 'fitness',
      dealUrl: 'https://link.amazon/B0hLMh2u2',
    },
    {
      id: 'audio-headset',
      title: 'Active Noise Cancelling Wireless Headset',
      description: 'Studio-grade deep bass, low latency, and crystal clear call microphones.',
      badge: 'Trending Deal',
      category: 'developer',
      dealUrl: 'https://link.amazon/B01cjScTs',
    },
  ],
};
