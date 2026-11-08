import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { Product, ProductCategory } from '../types';
import { ProductCard } from '../components/products/ProductCard';
import { MarketplaceBadge, ScoreBadge, TrendBadge, VerifiedBadge, CompetitionBadge } from '../components/common/Badge';
import { formatIDR, formatCompact } from '../utils/calculations';
import {
  Search,
  Filter,
  Grid,
  List,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ExternalLink,
  Wand2,
  Calculator,
  Bookmark,
  BookmarkCheck,
  GitCompare,
  Sparkles,
} from 'lucide-react';

type ExplorerTab =
  | 'All Products'
  | 'Trending 7 Days'
  | 'Trending 30 Days'
  | 'Fast Growing'
  | 'Best Opportunity'
  | 'Highest Commission'
  | 'Low Competition';

export const ProductExplorerPage: React.FC<{ onOpenDetail: (p: Product) => void }> = ({ onOpenDetail }) => {
  const {
    products,
    selectedMarketplace,
    setSelectedMarketplace,
    globalSearch,
    setGlobalSearch,
    setTargetProductForAi,
    setTargetProductForCalculator,
    setActiveModule,
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    selectedComparisonIds,
    toggleComparisonProduct,
  } = useApp();

  const [activeTab, setActiveTab] = useState<ExplorerTab>('All Products');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [minCommission, setMinCommission] = useState<number>(0);
  const [minScore, setMinScore] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(500000);
  const [sortBy, setSortBy] = useState<'score' | 'growth7d' | 'soldCount' | 'commission' | 'price'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  const categories: ProductCategory[] = [
    'Skincare',
    'Beauty',
    'Fashion Wanita',
    'Fashion Pria',
    'Elektronik & Gadget',
    'Perlengkapan Rumah',
    'Tas & Sepatu',
    'Aksesoris',
    'Makanan & Minuman',
    'Produk Anak & Bayi',
    'Kesehatan & Kebugaran',
  ];

  // Filtering & Sorting pipeline
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Marketplace
      if (selectedMarketplace !== 'All' && p.marketplace !== selectedMarketplace) {
        return false;
      }

      // 2. Tab rules
      if (activeTab === 'Trending 7 Days' && (!p.growth7d || p.growth7d < 15)) return false;
      if (activeTab === 'Trending 30 Days' && (!p.growth30d || p.growth30d < 15)) return false;
      if (activeTab === 'Fast Growing' && (!p.growth7d || p.growth7d < 25)) return false;
      if (activeTab === 'Best Opportunity' && p.score.total < 80) return false;
      if (activeTab === 'Highest Commission' && p.commissionRate < 15) return false;
      if (activeTab === 'Low Competition' && p.competitionLevel !== 'Low Competition') return false;

      // 3. Category
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // 4. Commission Rate
      if (p.commissionRate < minCommission) {
        return false;
      }

      // 5. Score
      if (p.score.total < minScore) {
        return false;
      }

      // 6. Max Price
      if (p.price > maxPrice) {
        return false;
      }

      // 7. Global Search (name, store, category, hashtag)
      if (globalSearch.trim()) {
        const q = globalSearch.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesStore = p.storeName.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        const matchesHashtag = p.relatedHashtags.some((h) => h.toLowerCase().includes(q));
        if (!matchesName && !matchesStore && !matchesCat && !matchesHashtag) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'score') comparison = b.score.total - a.score.total;
      else if (sortBy === 'growth7d') comparison = (b.growth7d || 0) - (a.growth7d || 0);
      else if (sortBy === 'soldCount') comparison = b.soldCount - a.soldCount;
      else if (sortBy === 'commission') comparison = b.commissionRate - a.commissionRate;
      else if (sortBy === 'price') comparison = b.price - a.price;

      return sortOrder === 'desc' ? comparison : -comparison;
    });
  }, [
    products,
    selectedMarketplace,
    activeTab,
    selectedCategory,
    minCommission,
    minScore,
    maxPrice,
    globalSearch,
    sortBy,
    sortOrder,
  ]);

  // Reset page when filters change
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setSelectedCategory('All');
    setMinCommission(0);
    setMinScore(0);
    setMaxPrice(500000);
    setGlobalSearch('');
    setSelectedMarketplace('All');
    setCurrentPage(1);
  };

  const tabs: ExplorerTab[] = [
    'All Products',
    'Trending 7 Days',
    'Trending 30 Days',
    'Fast Growing',
    'Best Opportunity',
    'Highest Commission',
    'Low Competition',
  ];

  return (
    <div className="space-y-5">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#080d22] p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
            Product Trend Scanner
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ditemukan <span className="text-indigo-400 font-bold font-mono">{filteredProducts.length}</span> produk affiliate terverifikasi
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari produk atau hashtag..."
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Tampilan Grid"
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              aria-label="Tampilan Tabel"
              className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scroll text-xs">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
              activeTab === tab
                ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                : 'bg-[#080d22] text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#080d22] p-4 rounded-xl border border-slate-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        {/* Marketplace */}
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Marketplace</label>
          <select
            value={selectedMarketplace}
            onChange={(e) => {
              setSelectedMarketplace(e.target.value as any);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-hidden"
          >
            <option value="All">Semua Platform</option>
            <option value="TikTok Shop">TikTok Shop</option>
            <option value="Shopee">Shopee Indonesia</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Kategori</label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-hidden"
          >
            <option value="All">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Min Commission */}
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Min. Komisi: <span className="text-emerald-400 font-mono">{minCommission}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="25"
            step="1"
            value={minCommission}
            onChange={(e) => setMinCommission(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>

        {/* Min AI Score */}
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Min. AI Score: <span className="text-indigo-400 font-mono">{minScore}</span>
          </label>
          <input
            type="range"
            min="0"
            max="95"
            step="5"
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>

        {/* Sort By */}
        <div>
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Urutkan</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-hidden"
          >
            <option value="score">Skor Peluang AI</option>
            <option value="growth7d">Pertumbuhan 7 Hari</option>
            <option value="commission">Persentase Komisi</option>
            <option value="soldCount">Total Terjual</option>
            <option value="price">Harga Produk</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="flex items-end">
          <button
            onClick={resetFilters}
            className="w-full py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center gap-1.5 text-xs font-semibold transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filter</span>
          </button>
        </div>
      </div>

      {/* Products Display (Grid View or Table View) */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center bg-[#080d22] rounded-2xl border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mx-auto text-slate-500">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">Tidak ada produk yang sesuai dengan kriteria</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Coba sesuaikan filter kategori, rentang komisi, atau hapus kata kunci pencarian Anda.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
          >
            Kembalikan Semua Filter
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} onOpenDetail={onOpenDetail} />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-[#080d22] rounded-xl border border-slate-800 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#060916] border-b border-slate-800 text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                <tr>
                  <th className="p-3 w-12 text-center">Bandingkan</th>
                  <th className="p-3">Produk & Toko</th>
                  <th className="p-3">Marketplace</th>
                  <th className="p-3 text-right">Harga</th>
                  <th className="p-3 text-center">Komisi</th>
                  <th className="p-3 text-center">Tren 7H</th>
                  <th className="p-3 text-center">Tren 30H</th>
                  <th className="p-3 text-center">Skor AI</th>
                  <th className="p-3 text-center">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {paginatedProducts.map((p) => {
                  const inComp = selectedComparisonIds.includes(p.id);
                  const inWatch = isInWatchlist(p.id);
                  return (
                    <tr
                      key={p.id}
                      onClick={() => onOpenDetail(p)}
                      className="hover:bg-slate-900/60 transition cursor-pointer group"
                    >
                      <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => toggleComparisonProduct(p.id)}
                          className={`p-1.5 rounded transition ${
                            inComp ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <GitCompare className="w-3.5 h-3.5" />
                        </button>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2.5 max-w-sm">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-900 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-semibold text-slate-200 line-clamp-1 group-hover:text-indigo-300 transition">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate">
                              {p.storeName} • {p.category}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <MarketplaceBadge marketplace={p.marketplace} size="xs" />
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-white whitespace-nowrap">
                        {formatIDR(p.price)}
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        <span className="font-bold text-emerald-400 font-mono">{p.commissionRate}%</span>
                        <span className="block text-[10px] text-slate-400 font-mono">
                          ≈ {formatIDR(Math.round(p.price * (p.commissionRate / 100)))}
                        </span>
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        <TrendBadge status={p.trendStatus} rate={p.growth7d} />
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        <span className={`font-mono text-xs ${p.growth30d && p.growth30d > 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                          {p.growth30d !== null ? `${p.growth30d > 0 ? '+' : ''}${p.growth30d}%` : 'N/A'}
                        </span>
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        <ScoreBadge score={p.score.total} isProvisional={p.score.isProvisional} />
                      </td>
                      <td className="p-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setTargetProductForAi(p);
                              setActiveModule('AI Content Generator');
                            }}
                            title="Generate Script AI"
                            className="p-1.5 rounded bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white transition"
                          >
                            <Wand2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setTargetProductForCalculator(p);
                              setActiveModule('Affiliate Profit Calculator');
                            }}
                            title="Kalkulator Profit"
                            className="p-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition"
                          >
                            <Calculator className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (inWatch) removeFromWatchlist(p.id);
                              else addToWatchlist('product', p.id);
                            }}
                            title="Watchlist"
                            className={`p-1.5 rounded transition ${
                              inWatch ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
                            }`}
                          >
                            {inWatch ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Bar */}
      {filteredProducts.length > 0 && (
        <div className="flex items-center justify-between bg-[#080d22] p-3 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400">
            Halaman <span className="text-white font-bold">{currentPage}</span> dari{' '}
            <span className="text-white font-bold">{totalPages}</span>
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-semibold transition ${
                  currentPage === pg
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {pg}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
