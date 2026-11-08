import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Hashtag, ProductCategory } from '../types';
import { TrendBadge, ScoreBadge } from '../components/common/Badge';
import { formatCompact } from '../utils/calculations';
import {
  Hash,
  Search,
  Sparkles,
  TrendingUp,
  Bookmark,
  BookmarkCheck,
  Filter,
  CheckCircle2,
  Layers,
  ArrowUpDown,
  Wand2,
} from 'lucide-react';

export const HashtagIntelligencePage: React.FC = () => {
  const {
    hashtags,
    products,
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    setTargetProductForAi,
    setActiveModule,
  } = useApp();

  const [platformFilter, setPlatformFilter] = useState<'All' | 'TikTok' | 'Shopee' | 'Cross Platform'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Rising' | 'Stable' | 'Declining'>('All');
  const [searchTag, setSearchTag] = useState('');
  const [selectedProductForAi, setSelectedProductForAi] = useState<string>(products[0]?.id || '');

  const categories = [
    'Fashion Wanita',
    'Fashion Pria',
    'Skincare',
    'Beauty',
    'Aksesoris',
    'Tas & Sepatu',
    'Perlengkapan Rumah',
    'Elektronik & Gadget',
    'Produk Anak & Bayi',
    'Makanan & Minuman',
    'Produk Viral',
    'Affiliate Marketing',
  ];

  // Filtering
  const filteredHashtags = hashtags.filter((h) => {
    if (platformFilter !== 'All' && h.platform !== platformFilter) return false;
    if (selectedCategory !== 'All' && h.category !== selectedCategory) return false;
    if (statusFilter !== 'All' && h.trendStatus !== statusFilter) return false;
    if (searchTag.trim() && !h.tag.toLowerCase().includes(searchTag.toLowerCase())) return false;
    return true;
  });

  const chosenProduct = products.find((p) => p.id === selectedProductForAi) || products[0];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 rounded-2xl bg-[#080d22] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <Hash className="w-3 h-3 text-purple-400" />
              Hashtag Intelligence Center
            </span>
            <span className="text-xs text-slate-400">TikTok Shop & Shopee Video</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1.5">
            Eksplorasi Hashtag Populer, Rising & Cross-Platform
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Data berbasis volume konten yang teramati secara sah, indeks pencarian, dan frekuensi sampel creator tanpa data fiktif.
          </p>
        </div>

        {/* Platform quick pills */}
        <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl p-1 text-xs shrink-0">
          {(['All', 'TikTok', 'Shopee', 'Cross Platform'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPlatformFilter(p)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                platformFilter === p ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* AI Contextual Hashtag Recommender for Products (Section G Feature #10) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              AI Hashtag Recommendation Berdasarkan Produk
            </h3>
            <p className="text-xs text-slate-400">
              Pilih produk dari katalog untuk mendapatkan rekomendasi kombinasi hashtag viral, kategori, dan hook traffic.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedProductForAi}
              onChange={(e) => setSelectedProductForAi(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white max-w-xs truncate focus:outline-hidden"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.marketplace})
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setTargetProductForAi(chosenProduct);
                setActiveModule('AI Content Generator');
              }}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shrink-0"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Gunakan di Script</span>
            </button>
          </div>
        </div>

        {chosenProduct && (
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="text-xs text-slate-300 font-medium">
              Kombinasi Rekomendasi untuk: <span className="text-indigo-400 font-bold">{chosenProduct.name}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {chosenProduct.relatedHashtags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-semibold flex items-center gap-1"
                >
                  <span>{tag}</span>
                  <span className="text-[10px] text-emerald-400 font-sans">High Traffic</span>
                </span>
              ))}
              <span className="px-3 py-1 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30 text-xs font-mono font-semibold">
                #fypindonesia
              </span>
              <span className="px-3 py-1 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30 text-xs font-mono font-semibold">
                #belilokal
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#080d22] p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-hidden"
          >
            <option value="All">Semua Kategori (12)</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-hidden"
          >
            <option value="All">Semua Status Tren</option>
            <option value="Rising">Rising (+15% ke atas)</option>
            <option value="Stable">Stable</option>
            <option value="Declining">Declining</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari hashtag e.g. #racun..."
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-slate-200 placeholder-slate-400 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Hashtags Table */}
      <div className="bg-[#080d22] rounded-xl border border-slate-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#060916] border-b border-slate-800 text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
              <tr>
                <th className="p-3 w-12 text-center">Rank</th>
                <th className="p-3">Hashtag & Platform</th>
                <th className="p-3">Kategori</th>
                <th className="p-3 text-right">Volume Teramati</th>
                <th className="p-3 text-center">Tipe Indikator</th>
                <th className="p-3 text-center">Pertumbuhan 7H</th>
                <th className="p-3 text-center">Pertumbuhan 30H</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Watchlist</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredHashtags.map((h) => {
                const inWatch = isInWatchlist(h.id);
                return (
                  <tr key={h.id} className="hover:bg-slate-900/60 transition">
                    <td className="p-3 text-center font-mono font-bold text-slate-400">
                      #{h.ranking}
                    </td>
                    <td className="p-3 font-semibold text-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-indigo-300 text-sm">{h.tag}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                          {h.platform}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-300">{h.category}</td>
                    <td className="p-3 text-right font-mono font-bold text-white whitespace-nowrap">
                      {formatCompact(h.observedContentCount)} konten
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700/80 text-slate-400 whitespace-nowrap">
                        {h.indicatorType}
                      </span>
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <TrendBadge status={h.trendStatus} rate={h.volumeChange7d} />
                    </td>
                    <td className="p-3 text-center whitespace-nowrap font-mono text-emerald-400">
                      {h.volumeChange30d !== null ? `+${h.volumeChange30d}%` : 'N/A'}
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <span className="font-mono font-bold text-indigo-400 text-xs">
                        {h.popularityScore}/100
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => {
                          if (inWatch) removeFromWatchlist(h.id);
                          else addToWatchlist('hashtag', h.id);
                        }}
                        className={`p-1.5 rounded transition ${
                          inWatch ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {inWatch ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
