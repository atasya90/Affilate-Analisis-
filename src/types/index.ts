export type Marketplace = 'TikTok Shop' | 'Shopee' | 'Cross Platform';

export type ProductCategory =
  | 'Fashion Wanita'
  | 'Fashion Pria'
  | 'Skincare'
  | 'Beauty'
  | 'Aksesoris'
  | 'Tas & Sepatu'
  | 'Perlengkapan Rumah'
  | 'Elektronik & Gadget'
  | 'Produk Anak & Bayi'
  | 'Makanan & Minuman'
  | 'Produk Viral'
  | 'Kesehatan & Kebugaran';

export type TrendStatus = 'Rising' | 'Stable' | 'Declining' | 'New Trend';

export type CompetitionLevel = 'Low Competition' | 'Medium Competition' | 'High Competition';

export interface ProductSnapshot {
  date: string; // ISO date 'YYYY-MM-DD'
  price: number;
  soldCount: number;
  popularityScore: number;
  rating: number;
  reviewCount: number;
  commissionRate: number; // percentage, e.g. 10%
}

export interface Product {
  id: string;
  name: string;
  storeName: string;
  marketplace: 'TikTok Shop' | 'Shopee';
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  soldCount: number;
  rating: number;
  reviewCount: number;
  commissionRate: number; // e.g. 12 means 12%
  productUrl: string;
  imageUrl: string;
  lastUpdated: string;
  isVerified: boolean;
  isDemoData: boolean;
  
  // Historical snapshots (minimum 30 days)
  snapshots: ProductSnapshot[];

  // Computed metrics
  growth7d: number | null; // percentage, null if previous is 0 or unavailable
  growth30d: number | null;
  trendStatus: TrendStatus;
  competitionLevel: CompetitionLevel;
  competitorStoreCount: number;
  
  // Opportunity score factors
  score: {
    total: number; // 0 - 100
    level: 'High Opportunity' | 'Good Opportunity' | 'Moderate Opportunity' | 'Low Opportunity';
    isProvisional: boolean;
    dataCompleteness: number; // 0 - 100%
    breakdown: {
      trendGrowth7d: number; // weight 25%
      popularity30d: number; // weight 20%
      marketDemand: number; // weight 20%
      commissionRate: number; // weight 15%
      competitionScore: number; // weight 10%
      hashtagRelevance: number; // weight 10%
    };
    explanation?: string;
  };

  // Associated Hashtags
  relatedHashtags: string[];
}

export interface HashtagSnapshot {
  date: string;
  observedCount: number;
  searchInterest: number;
}

export interface Hashtag {
  id: string;
  tag: string; // e.g. '#racunshopee'
  platform: 'TikTok' | 'Shopee' | 'Cross Platform';
  category: ProductCategory | 'Affiliate Marketing';
  observedContentCount: number;
  volumeChange7d: number | null; // percentage
  volumeChange30d: number | null;
  popularityScore: number; // 0 - 100
  ranking: number;
  trendStatus: TrendStatus;
  lastUpdated: string;
  indicatorType: 'Observed Content Volume' | 'Search Query Index' | 'Creator Activity Sample';
  snapshots: HashtagSnapshot[];
  isDemoData: boolean;
}

export interface CalculatorInput {
  productName: string;
  productPrice: number;
  commissionRate: number;
  clicksCount: number;
  conversionRate: number; // percentage (e.g. 2.5%)
  monthlyTargetRevenue?: number;
}

export interface ProfitScenario {
  name: 'Konservatif' | 'Moderat' | 'Optimistis';
  conversionRate: number;
  estimatedSales: number;
  commissionPerSale: number;
  dailyRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  roiEstimate: string;
}

export interface CompetitorComparison {
  productId: string;
  similarStores: {
    storeName: string;
    price: number;
    rating: number;
    soldCount: number;
    marketplace: 'TikTok Shop' | 'Shopee';
  }[];
  priceSpread: {
    min: number;
    max: number;
    average: number;
  };
}

export interface GeneratedContent {
  productId: string;
  productName: string;
  createdAt: string;
  tiktok: {
    titles: string[];
    hooks: string[];
    ugcScripts: {
      title: string;
      scene: string;
      spokenText: string;
      visualCue: string;
    }[];
    caption: string;
    cta: string;
    hashtags: string[];
  };
  shopee: {
    seoTitle: string;
    shortPitch: string;
    promotionalCaption: string;
    keywords: string[];
    hashtags: string[];
  };
  voiceovers: {
    duration10s: string;
    duration15s: string;
    duration30s: string;
  };
}

export interface WatchlistItem {
  id: string;
  type: 'product' | 'hashtag';
  itemId: string;
  addedAt: string;
  initialPrice?: number;
  currentPrice?: number;
  initialScore?: number;
  currentScore?: number;
  initialVolume?: number;
  currentVolume?: number;
  notes?: string;
}

export interface DataSourceAdapter {
  id: string;
  name: string;
  type:
    | 'TikTokShopAdapter'
    | 'ShopeeAdapter'
    | 'TikTokTrendAdapter'
    | 'HashtagAdapter'
    | 'GoogleTrendsAdapter'
    | 'CsvImportAdapter'
    | 'ManualDataAdapter';
  description: string;
  status: 'Connected' | 'Ready' | 'Error' | 'Syncing' | 'Requires Credentials';
  lastSync: string | null;
  itemsIndexed: number;
  isOfficialApi: boolean;
  errorMessage?: string;
  syncIntervalMinutes: number;
  requiresConfig: boolean;
  configFields: {
    key: string;
    label: string;
    placeholder: string;
    isSecret: boolean;
    value?: string;
  }[];
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'Super Admin' | 'Admin' | 'User';
  avatarUrl: string;
  plan: 'Pro Affiliate' | 'Enterprise Team' | 'Free Creator';
}

export interface SyncLog {
  id: string;
  timestamp: string;
  adapter: string;
  status: 'Success' | 'Failed' | 'Warning';
  recordsProcessed: number;
  durationMs: number;
  details: string;
}
