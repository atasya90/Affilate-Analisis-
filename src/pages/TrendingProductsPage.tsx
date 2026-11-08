import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Product } from '../types';
import { ProductCard } from '../components/products/ProductCard';
import { TrendBadge, ScoreBadge, MarketplaceBadge } from '../components/common/Badge';
import { formatIDR, formatCompact } from '../utils/calculations';
import { ChartSvg } from '../components/common/ChartSvg';
import {
  TrendingUp,
  Flame,
  Calendar,
  Sparkles,
  ArrowUpRight,
  TrendingDown,
  Layers,
  BarChart3,
} from 'lucide-react';

export const TrendingProductsPage: React.FC<{ onOpenDetail: (p: Product) => void }> = ({ onOpenDetail }) => {
  const { products, selectedMarketplace } = useApp();
  const [period, setPeriod] = useState<'7d' | '30d'>('7d');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Rising' | 'Stable' | 'New Trend'>('All');

  const filteredProducts = products.filter((p) => {
    if (selectedMarketplace !== 'All' && p.marketplace !== selectedMarketplace) return false;
    if (statusFilter !== 'All' && p.trendStatus !== statusFilter) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const valA = period === '7d' ? a.growth7d || 0 : a.growth30d || 0;
    const valB = period === '7d' ? b.growth7d || 0 : b.growth30d || 0;
    return valB - valA;
  });

  // Category growth analysis
  const categoryMomentum = [
    { name: 'Skincare & Perawatan', growth7d: '+34.2%', growth30d: '+88.5%', items: 8, status: 'Rising' },
    { name: 'Beauty & Kosmetik', growth7d: '+29.0%', growth30d: '+72.1%', items: 6, status: 'Rising' },
    { name: 'Elektronik Creator & Audio', growth7d: '+24.5%', growth30d: '+61.0%', items: 5, status: 'Rising' },
    { name: 'Fashion Wanita Hijab', growth7d: '+18.8%', growth30d: '+45.2%', items: 7, status: 'Rising' },
    { name: 'Makanan Pedas Instan', growth7d: '+21.3%', growth30d: '+52.4%', items: 4, status: 'Rising' },
    { name: 'Perlengkapan Rumah Estetik', growth7d: '+12.1%', growth30d: '+28.0%', items: 6, status: 'Stable' },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 rounded-2xl bg-[#080d22] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
              <Flame className="w-3 h-3 text-rose-400" />
              Momentum Scanner
            </span>
            <span className="text-xs text-slate-400">Verifikasi formula: ((Sekarang - Sebelumnya) / Sebelumnya) × 100</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1.5">
            Analisis Tren 7 Hari & 30 Hari Terverifikasi
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Mendeteksi produk yang baru mengalami lonjakan viralitas (7 Hari) dan produk konsisten jangka panjang (30 Hari).
          </p>
        </div>

        {/* Period Switcher */}
        <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl p-1 shrink-0">
          <button
            onClick={() => setPeriod('7d')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
              period === '7d'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Periode 7 Hari (Fast Momentum)
          </button>
          <button
            onClick={() => setPeriod('30d')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
              period === '30d'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Periode 30 Hari (Steady Growth)
          </button>
        </div>
      </div>

      {/* Category Momentum Summary */}
      <div className="p-5 rounded-2xl bg-[#080d22] border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <BarChart3 className="w-4 h-4 text-indigo-400" />
          Akselerasi Tren Berdasarkan Kategori Produk
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categoryMomentum.map((cat, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-200">{cat.name}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{cat.items} produk terindeks</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-emerald-400 block">
                  {period === '7d' ? cat.growth7d : cat.growth30d}
                </span>
                <span className="text-[10px] text-slate-400">{period === '7d' ? '7H' : '30H'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter by trend classification */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
        {(['All', 'Rising', 'Stable', 'New Trend'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              statusFilter === st
                ? 'bg-indigo-600 text-white font-semibold'
                : 'bg-[#080d22] text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {st === 'All' ? 'Semua Status Tren' : `Klasifikasi: ${st}`}
          </button>
        ))}
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} onOpenDetail={onOpenDetail} />
        ))}
      </div>
    </div>
  );
};
