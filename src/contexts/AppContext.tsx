import React, { createContext, useContext, useState, useEffect } from 'react';
import { DataSourceAdapter, Hashtag, Product, SyncLog, UserProfile, WatchlistItem } from '../types';
import { INITIAL_DATA_SOURCES, INITIAL_HASHTAGS, INITIAL_PRODUCTS, INITIAL_SYNC_LOGS } from '../data/mockData';
import { syncAdapterApi } from '../services/api';

export type AppModule =
  | 'Dashboard'
  | 'Product Explorer'
  | 'Trending Products'
  | 'TikTok Shop Analysis'
  | 'Shopee Analysis'
  | 'Hashtag Intelligence'
  | 'Affiliate Profit Calculator'
  | 'Competitor Analysis'
  | 'AI Product Score'
  | 'AI Content Generator'
  | 'Product Comparison'
  | 'Watchlist'
  | 'Historical Analytics'
  | 'Data Sources'
  | 'Settings'
  | 'Admin Panel';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'price_drop' | 'score_spike' | 'trend_alert' | 'system';
}

interface AppContextType {
  activeModule: AppModule;
  setActiveModule: (module: AppModule) => void;
  products: Product[];
  hashtags: Hashtag[];
  dataSources: DataSourceAdapter[];
  syncLogs: SyncLog[];
  watchlist: WatchlistItem[];
  selectedComparisonIds: string[];
  userProfile: UserProfile;
  notifications: AppNotification[];
  selectedMarketplace: 'All' | 'TikTok Shop' | 'Shopee';
  setSelectedMarketplace: (m: 'All' | 'TikTok Shop' | 'Shopee') => void;
  selectedTimeframe: 'today' | '7d' | '30d' | '90d' | 'custom';
  setSelectedTimeframe: (t: 'today' | '7d' | '30d' | '90d' | 'custom') => void;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  
  // Watchlist methods
  addToWatchlist: (type: 'product' | 'hashtag', itemId: string, notes?: string) => void;
  removeFromWatchlist: (itemId: string) => void;
  isInWatchlist: (itemId: string) => boolean;

  // Comparison methods
  toggleComparisonProduct: (productId: string) => void;
  clearComparison: () => void;
  setComparisonProducts: (productIds: string[]) => void;

  // Data Actions
  importProducts: (newProds: Product[]) => void;
  importHashtags: (newTags: Hashtag[]) => void;
  deleteProduct: (productId: string) => void;
  deleteHashtag: (tagId: string) => void;
  cleanDuplicates: () => { productsRemoved: number; hashtagsRemoved: number };
  triggerSync: (adapterId: string) => Promise<void>;
  updateAdapterConfig: (adapterId: string, fieldKey: string, value: string) => void;
  setUserRole: (role: 'Super Admin' | 'Admin' | 'User') => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Quick AI targets
  targetProductForAi: Product | null;
  setTargetProductForAi: (product: Product | null) => void;
  targetProductForCalculator: Product | null;
  setTargetProductForCalculator: (product: Product | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModule] = useState<AppModule>('Dashboard');
  const [selectedMarketplace, setSelectedMarketplace] = useState<'All' | 'TikTok Shop' | 'Shopee'>('All');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'today' | '7d' | '30d' | '90d' | 'custom'>('7d');
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  // Storage backed or default states
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('apf_products');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed loading products from localStorage', e);
    }
    return INITIAL_PRODUCTS;
  });

  const [hashtags, setHashtags] = useState<Hashtag[]>(() => {
    try {
      const saved = localStorage.getItem('apf_hashtags');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed loading hashtags from localStorage', e);
    }
    return INITIAL_HASHTAGS;
  });

  const [dataSources, setDataSources] = useState<DataSourceAdapter[]>(() => {
    try {
      const saved = localStorage.getItem('apf_datasources');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed loading data sources from localStorage', e);
    }
    return INITIAL_DATA_SOURCES;
  });

  const [syncLogs, setSyncLogs] = useState<SyncLog[]>(INITIAL_SYNC_LOGS);

  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => {
    try {
      const saved = localStorage.getItem('apf_watchlist');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed loading watchlist from localStorage', e);
    }
    return [
      { id: 'w-1', type: 'product', itemId: 'prod-001', addedAt: '2026-11-05', initialPrice: 139000, currentPrice: 139000, initialScore: 89, currentScore: 92, notes: 'Target review UGC TikTok weekend ini' },
      { id: 'w-2', type: 'product', itemId: 'prod-002', addedAt: '2026-11-06', initialPrice: 43000, currentPrice: 43000, initialScore: 92, currentScore: 94, notes: 'Komisi tinggi 18% di Shopee Video' },
      { id: 'w-3', type: 'hashtag', itemId: 'tag-01', addedAt: '2026-11-06', initialVolume: 140000, currentVolume: 148500, notes: 'Hashtag utama untuk viral FYP' },
    ];
  });

  const [selectedComparisonIds, setSelectedComparisonIds] = useState<string[]>(['prod-001', 'prod-002']);
  const [targetProductForAi, setTargetProductForAi] = useState<Product | null>(INITIAL_PRODUCTS[0]);
  const [targetProductForCalculator, setTargetProductForCalculator] = useState<Product | null>(INITIAL_PRODUCTS[0]);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'user-001',
    email: 'creator@affiliatefinder.id',
    name: 'Rian Pratama',
    role: 'Super Admin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    plan: 'Pro Affiliate',
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Lonjakan Tren Terdeteksi',
      message: 'Skintific 5X Ceramide mengalami kenaikan velocity 7 hari (+34%) di TikTok Shop.',
      timestamp: '15 menit lalu',
      read: false,
      type: 'score_spike',
    },
    {
      id: 'notif-2',
      title: 'Hashtag #cushionviral Melejit',
      message: 'Volume konten yang teramati meningkat +38.2% dalam 7 hari terakhir.',
      timestamp: '1 jam lalu',
      read: false,
      type: 'trend_alert',
    },
    {
      id: 'notif-3',
      title: 'Sinkronisasi Selesai',
      message: 'Shopee Open Platform API berhasil memperbarui 18 snapshot data produk.',
      timestamp: '2 jam lalu',
      read: true,
      type: 'system',
    },
  ]);

  // Persist key state
  useEffect(() => {
    localStorage.setItem('apf_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('apf_hashtags', JSON.stringify(hashtags));
  }, [hashtags]);

  useEffect(() => {
    localStorage.setItem('apf_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('apf_datasources', JSON.stringify(dataSources));
  }, [dataSources]);

  // Watchlist methods
  const addToWatchlist = (type: 'product' | 'hashtag', itemId: string, notes?: string) => {
    if (watchlist.some((w) => w.itemId === itemId)) return;

    let initialPrice: number | undefined;
    let initialScore: number | undefined;
    let initialVolume: number | undefined;

    if (type === 'product') {
      const p = products.find((x) => x.id === itemId);
      if (p) {
        initialPrice = p.price;
        initialScore = p.score.total;
      }
    } else {
      const h = hashtags.find((x) => x.id === itemId);
      if (h) {
        initialVolume = h.observedContentCount;
      }
    }

    const newItem: WatchlistItem = {
      id: `w-${Date.now()}`,
      type,
      itemId,
      addedAt: new Date().toISOString().split('T')[0],
      initialPrice,
      currentPrice: initialPrice,
      initialScore,
      currentScore: initialScore,
      initialVolume,
      currentVolume: initialVolume,
      notes: notes || 'Ditambahkan dari explorer',
    };

    setWatchlist((prev) => [newItem, ...prev]);
  };

  const removeFromWatchlist = (itemId: string) => {
    setWatchlist((prev) => prev.filter((w) => w.itemId !== itemId));
  };

  const isInWatchlist = (itemId: string) => {
    return watchlist.some((w) => w.itemId === itemId);
  };

  // Comparison methods
  const toggleComparisonProduct = (productId: string) => {
    setSelectedComparisonIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 4) {
        // limit to 4 products comparison
        return [...prev.slice(1), productId];
      }
      return [...prev, productId];
    });
  };

  const clearComparison = () => {
    setSelectedComparisonIds([]);
  };

  const setComparisonProducts = (productIds: string[]) => {
    setSelectedComparisonIds(productIds.slice(0, 4));
  };

  // Data actions
  const importProducts = (newProds: Product[]) => {
    setProducts((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const filtered = newProds.filter((p) => !existingIds.has(p.id));
      return [...filtered, ...prev];
    });
  };

  const importHashtags = (newTags: Hashtag[]) => {
    setHashtags((prev) => {
      const existingIds = new Set(prev.map((h) => h.id));
      const filtered = newTags.filter((h) => !existingIds.has(h.id));
      return [...filtered, ...prev];
    });
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    removeFromWatchlist(productId);
    setSelectedComparisonIds((prev) => prev.filter((id) => id !== productId));
  };

  const deleteHashtag = (tagId: string) => {
    setHashtags((prev) => prev.filter((h) => h.id !== tagId));
    removeFromWatchlist(tagId);
  };

  const cleanDuplicates = () => {
    const seenPNames = new Set<string>();
    let pRemoved = 0;
    const cleanP = products.filter((p) => {
      const key = p.name.toLowerCase().trim();
      if (seenPNames.has(key)) {
        pRemoved++;
        return false;
      }
      seenPNames.add(key);
      return true;
    });

    const seenHTags = new Set<string>();
    let hRemoved = 0;
    const cleanH = hashtags.filter((h) => {
      const key = h.tag.toLowerCase().trim();
      if (seenHTags.has(key)) {
        hRemoved++;
        return false;
      }
      seenHTags.add(key);
      return true;
    });

    setProducts(cleanP);
    setHashtags(cleanH);

    return { productsRemoved: pRemoved, hashtagsRemoved: hRemoved };
  };

  const triggerSync = async (adapterId: string) => {
    // Set status to syncing
    setDataSources((prev) =>
      prev.map((a) => (a.id === adapterId ? { ...a, status: 'Syncing' } : a))
    );

    const syncTime = await syncAdapterApi(adapterId);

    setDataSources((prev) =>
      prev.map((a) =>
        a.id === adapterId
          ? {
              ...a,
              status: a.isOfficialApi ? 'Ready' : 'Connected',
              lastSync: syncTime,
              itemsIndexed: a.itemsIndexed + Math.floor(Math.random() * 5) + 1,
            }
          : a
      )
    );

    const adapterObj = dataSources.find((a) => a.id === adapterId);
    const newLog: SyncLog = {
      id: `log-${Date.now()}`,
      timestamp: syncTime,
      adapter: adapterObj?.name || adapterId,
      status: 'Success',
      recordsProcessed: Math.floor(Math.random() * 20) + 10,
      durationMs: Math.floor(Math.random() * 400) + 250,
      details: `Live snapshot manual trigger berhasil dijalankan untuk region Indonesia.`,
    };

    setSyncLogs((prev) => [newLog, ...prev]);
  };

  const updateAdapterConfig = (adapterId: string, fieldKey: string, value: string) => {
    setDataSources((prev) =>
      prev.map((a) => {
        if (a.id === adapterId) {
          const updatedFields = a.configFields.map((f) =>
            f.key === fieldKey ? { ...f, value } : f
          );
          return { ...a, configFields: updatedFields, status: 'Ready' };
        }
        return a;
      })
    );
  };

  const setUserRole = (role: 'Super Admin' | 'Admin' | 'User') => {
    setUserProfile((prev) => ({ ...prev, role }));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        activeModule,
        setActiveModule,
        products,
        hashtags,
        dataSources,
        syncLogs,
        watchlist,
        selectedComparisonIds,
        userProfile,
        notifications,
        selectedMarketplace,
        setSelectedMarketplace,
        selectedTimeframe,
        setSelectedTimeframe,
        globalSearch,
        setGlobalSearch,
        isDemoMode,
        setIsDemoMode,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        toggleComparisonProduct,
        clearComparison,
        setComparisonProducts,
        importProducts,
        importHashtags,
        deleteProduct,
        deleteHashtag,
        cleanDuplicates,
        triggerSync,
        updateAdapterConfig,
        setUserRole,
        markNotificationAsRead,
        clearAllNotifications,
        targetProductForAi,
        setTargetProductForAi,
        targetProductForCalculator,
        setTargetProductForCalculator,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
