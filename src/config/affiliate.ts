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
  amazonProductLink1: 'https://link.amazon/B0hLMh2u2',
  amazonProductLink2: 'https://link.amazon/B08UlzUCs',
  amazonProductLink3: 'https://link.amazon/B0eAJUBdr',
  amazonProductLink4: 'https://link.amazon/B0bKz56tG',
  amazonProductLink5: 'https://link.amazon/B0d6g5Bq2',
  amazonProductLink6: 'https://link.amazon/B09BXWCdu',
  amazonProductLink7: 'https://www.amazon.in/dp/B0GNRF626K?aref=5d75ZToy8r&aaxitk=fc17998f969c29aaad4b2d37073d0748&language=en_IN&pd_rd_plhdr=t&ref=dacx_dp_579446977388855987_580270237172116285&th=1',

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
      productUrl: 'https://link.amazon/B0hLMh2u2',
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
      productUrl: 'https://link.amazon/B08UlzUCs',
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
      productUrl: 'https://link.amazon/B0eAJUBdr',
    },
    {
      id: 'keyboard-deal',
      title: 'Lunar Wireless Custom RGB Mechanical Keyboard',
      category: 'Desk Tech & Coding',
      price: '₹2,899',
      originalPrice: '₹5,499',
      discount: '47% OFF',
      rating: 4.8,
      reviewsCount: '2,940',
      imageUrl: '/images/products/keyboard.jpg',
      tag: '🚀 Developer Choice',
      productUrl: 'https://link.amazon/B09BXWCdu',
    },
    {
      id: 'backpack-deal',
      title: 'Haven Aerodynamic Waterproof Laptop Tech Backpack',
      category: 'Bags & Daily Travel',
      price: '₹1,799',
      originalPrice: '₹3,499',
      discount: '48% OFF',
      rating: 4.9,
      reviewsCount: '4,120',
      imageUrl: '/images/products/backpack.jpg',
      tag: '🎒 Amazon Choice',
      productUrl: 'https://www.amazon.in/dp/B0GNRF626K?aref=5d75ZToy8r&aaxitk=fc17998f969c29aaad4b2d37073d0748&language=en_IN&pd_rd_plhdr=t&ref=dacx_dp_579446977388855987_580270237172116285&th=1',
    },
  ] as AffiliateProduct[],

  featuredDeals: [
    {
      id: 'finance-books',
      title: 'Top Rated Finance & Wealth Management Books',
      description: 'Handpicked classics on compounding, investing, and financial independence.',
      badge: 'Amazon Choice',
      category: 'finance',
      dealUrl: 'https://link.amazon/B0h36GxsC',
    },
    {
      id: 'scientific-calculators',
      title: 'Precision Scientific & Financial Calculators',
      description: 'Official hardware calculators for engineering, CFA, MBA, and university exams.',
      badge: 'Best Seller',
      category: 'education',
      dealUrl: 'https://link.amazon/B09BXWCdu',
    },
    {
      id: 'desk-tech',
      title: 'Developer & Data Analyst Desk Gear',
      description: 'Ergonomic setups, 4K ultrawide monitors, and productivity accessories.',
      badge: 'Trending Deal',
      category: 'developer',
      dealUrl: 'https://www.amazon.in/dp/B0GNRF626K?aref=5d75ZToy8r&aaxitk=fc17998f969c29aaad4b2d37073d0748&language=en_IN&pd_rd_plhdr=t&ref=dacx_dp_579446977388855987_580270237172116285&th=1',
    },
  ],
};
