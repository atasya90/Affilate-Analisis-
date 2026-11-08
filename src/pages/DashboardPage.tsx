import React from 'react';
import { useApp } from '../contexts/AppContext';
import { formatIDR, formatCompact } from '../utils/calculations';
import { ChartSvg } from '../components/common/ChartSvg';
import { ProductCard } from '../components/products/ProductCard';
import { MarketplaceBadge, ScoreBadge, TrendBadge, VerifiedBadge } from '../components/common/Badge';
import {
  Package,
  TrendingUp,
  Flame,
  Hash,
  Sparkles,
  Calculator,
  Bookmark,
  CheckCircle2,
  ArrowUpRight,
  Compass,
  Wand2,
  Video,
  ShoppingBag,
} from 'lucide-react';

export const DashboardPage: React.FC<{ onOpenDetail: (p: any) => void }> = ({ onOpenDetail }) => {
  const {
    products,
    hashtags,
    watchlist,
    selectedMarketplace,
    selectedTimeframe,
    setActiveModule,
    setTargetProductForAi,
    isDemoMode,
  } = useApp();

  // Filter products by selected marketplace
  const filteredProducts = products.filter((p) => {
    if (selectedMarketplace === 'All') return true;
    return p.marketplace === selectedMarketplace;
  });

  // Calculate high-level stats
  const totalIndexed = filteredProducts.length;
  const trending7dCount = filteredProducts.filter((p) => p.growth7d && p.growth7d > 15).length;
  const trending30dCount = filteredProducts.filter((p) => p.growth30d && p.growth30d > 20).length;

  // Highest growing product
  const sortedByGrowth = [...filteredProducts].sort((a, b) => (b.growth7d || 0) - (a.growth7d || 0));
  const topGrowthProduct = sortedByGrowth[0];

  // Average opportunity score
  const avgScore = totalIndexed > 0
    ? Math.round(filteredProducts.reduce((acc, p) => acc + p.score.total, 0) / totalIndexed)
    : 0;

  // Estimated total monthly commission potential across indexed catalog
  const estTotalCommission = filteredProducts.reduce((acc, p) => {
    const estUnitsPerDay = Math.max(1, Math.round(p.soldCount * 0.005));
    const commPerSale = p.price * (p.commissionRate / 100);
    return acc + (estUnitsPerDay * commPerSale * 30);
  }, 0);

  // Time-series growth charts for 7d & 30d
  const growth7dData = [
    { label: 'H-6', value: 120 },
    { label: 'H-5', value: 145 },
    { label: 'H-4', value: 180 },
    { label: 'H-3', value: 210 },
    { label: 'H-2', value: 280 },
    { label: 'H-1', value: 340 },
    { label: 'Hari Ini', value: 410 },
  ];

  const growth30dData = [
    { label: 'Minggu 1', value: 820 },
    { label: 'Minggu 2', value: 1240 },
    { label: 'Minggu 3', value: 1680 },
    { label: 'Minggu 4', value: 2450 },
  ];

  // Top opportunity products
  const topOpportunityProducts = [...filteredProducts]
    .sort((a, b) => b.score.total - a.score.total)
    .slice(0, 4);

  // Top trending hashtags
  const topHashtags = [...hashtags]
    .sort((a, b) => (b.volumeChange7d || 0) - (a.volumeChange7d || 0))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0c1236] via-[#090e24] to-[#0d163a] border border-indigo-500/30 p-5 sm:p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                Affiliate Intelligence v2.6
              </span>
              <span className="text-xs text-slate-400">
                Update Live: 07 Nov 2026, 19:15 WIB
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Temukan Produk Affiliate Paling Cuan di TikTok Shop & Shopee
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Analisis pertumbuhan terverifikasi 7 & 30 hari, estimasi komisi bersih, kurva kompetisi, dan generator konten AI untuk memaksimalkan komisi harian Anda.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveModule('Product Explorer')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Jelajahi Produk</span>
            </button>
            <button
              onClick={() => setActiveModule('AI Content Generator')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700 transition cursor-pointer"
            >
              <Wand2 className="w-4 h-4 text-indigo-400" />
              <span>AI Content</span>
            </button>
          </div>
        </div>
      </div>

      {/* 8 Core KPI Stat Cards (Section D Requirements) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1 */}
        <div className="p-4 rounded-xl bg-[#080d22] border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Produk Terindeks</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-2">
            {totalIndexed}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-sky-400" />
            <span>Katalog TikTok & Shopee</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-4 rounded-xl bg-[#080d22] border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Trending 7 Hari</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-2">
            {trending7dCount}
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1">
            Pertumbuhan volume &gt; +15%
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-4 rounded-xl bg-[#080d22] border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Trending 30 Hari</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 mt-2">
            {trending30dCount}
          </div>
          <div className="text-[11px] text-cyan-400/80 mt-1">
            Pertumbuhan stabil &gt; +20%
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-4 rounded-xl bg-[#080d22] border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Pertumbuhan Tertinggi</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-rose-400 mt-2">
            +{topGrowthProduct?.growth7d ?? 0}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1 truncate">
            {topGrowthProduct?.name || 'Skintific'}
          </div>
        </div>

        {/* Card 5 */}
        <div className="p-4 rounded-xl bg-[#080d22] border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Hashtag Teramati</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Hash className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-purple-300 mt-2">
            {hashtags.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Top #racuntiktok & #racunshopee
          </div>
        </div>

        {/* Card 6 */}
        <div className="p-4 rounded-xl bg-[#080d22] border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Rata-rata Skor Peluang</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-indigo-300 mt-2">
            {avgScore} <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="text-[11px] text-indigo-400 mt-1">
            Algoritma pembobotan multi-faktor
          </div>
        </div>

        {/* Card 7 */}
        <div className="p-4 rounded-xl bg-[#080d22] border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Potensi Komisi / Bulan</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Calculator className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-2 truncate">
            {formatIDR(estTotalCommission)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Simulasi estimasi katalog
          </div>
        </div>

        {/* Card 8 */}
        <div className="p-4 rounded-xl bg-[#080d22] border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Produk Dalam Watchlist</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-2">
            {watchlist.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Dipantau real-time oleh Anda
          </div>
        </div>
      </div>

      {/* Interactive Charts Section (7d & 30d Growth & Cross-Marketplace) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 7 Days & 30 Days Growth Comparison */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-[#080d22] border border-slate-800/80 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                Tren Pertumbuhan Produk Terverifikasi ({selectedTimeframe === '30d' ? '30 Hari' : '7 Hari'})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Perbandingan volume order harian agregat TikTok Shop & Shopee
              </p>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              {selectedTimeframe === '30d' ? '30D Velocity Curve' : '7D Fast Velocity'}
            </span>
          </div>

          <ChartSvg
            data={selectedTimeframe === '30d' ? growth30dData : growth7dData}
            height={220}
            color="#6366f1"
            secondaryColor="#14b8a6"
            valueSuffix=" pesanan"
          />

          <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">TikTok Shop Share</span>
              <div className="text-sm font-bold font-mono text-cyan-300 mt-0.5">54.2%</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Shopee Share</span>
              <div className="text-sm font-bold font-mono text-[#ff6b4a] mt-0.5">45.8%</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase">Akselerasi Tren</span>
              <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">+28.4%</div>
            </div>
          </div>
        </div>

        {/* Right: Trending Hashtags Leaderboard */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#080d22] border border-slate-800/80 shadow-lg space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Hash className="w-4 h-4 text-purple-400" />
                Hashtag Sedang Naik
              </h3>
              <button
                onClick={() => setActiveModule('Hashtag Intelligence')}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                Lihat Semua <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-800/60 mt-2">
              {topHashtags.map((h, i) => (
                <div key={h.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-mono font-bold text-slate-400 w-4">{i + 1}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-200 truncate">{h.tag}</div>
                      <div className="text-[10px] text-slate-400 truncate">{h.category}</div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <TrendBadge status={h.trendStatus} rate={h.volumeChange7d} />
                    <span className="text-[10px] text-slate-400 mt-0.5 font-mono">
                      {formatCompact(h.observedContentCount)} konten
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={() => setActiveModule('Hashtag Intelligence')}
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 transition"
            >
              Buka Hashtag Intelligence Center
            </button>
          </div>
        </div>
      </div>

      {/* Top AI Opportunity Products Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Produk Peluang Tertinggi (Skor AI 80+)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Produk dengan kombinasi terbaik antara akselerasi 7 hari, komisi affiliate tinggi, dan kompetisi terukur.
            </p>
          </div>

          <button
            onClick={() => setActiveModule('Product Explorer')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            Lihat Semua Produk <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topOpportunityProducts.map((product) => (
            <ProductCard key={product.id} product={product} onOpenDetail={onOpenDetail} />
          ))}
        </div>
      </div>
    </div>
  );
};
