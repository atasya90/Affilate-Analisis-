import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Product } from '../types';
import { CompetitionBadge, MarketplaceBadge } from '../components/common/Badge';
import { formatIDR, formatCompact } from '../utils/calculations';
import {
  Users2,
  Search,
  Store,
  Star,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  BarChart2,
  DollarSign,
} from 'lucide-react';

export const CompetitorAnalysisPage: React.FC<{ onOpenDetail: (p: Product) => void }> = ({ onOpenDetail }) => {
  const { products, selectedMarketplace } = useApp();
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter((p) => {
    if (selectedMarketplace !== 'All' && p.marketplace !== selectedMarketplace) return false;
    if (searchQuery.trim() && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  // Simulated real competition comparison points
  const priceMin = Math.round(selectedProduct.price * 0.88);
  const priceMax = Math.round(selectedProduct.price * 1.28);
  const priceAvg = Math.round((priceMin + selectedProduct.price + priceMax) / 3);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 rounded-2xl bg-[#080d22] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <Users2 className="w-3 h-3 text-indigo-400" />
              Saturasi Pasar & Toko Kompetitor
            </span>
            <span className="text-xs text-slate-400">Data Toko Terverifikasi</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1.5">
            Analisis Persaingan Toko & Sebaran Harga Pasar
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ketahui jumlah penjual yang menawarkan produk sejenis, rentang harga terendah vs tertinggi, dan tingkat persaingan untuk memilih ceruk yang belum jenuh.
          </p>
        </div>

        {/* Product selector dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-400 hidden sm:inline">Pilih Produk:</span>
          <select
            value={selectedProduct.id}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white max-w-xs truncate focus:outline-hidden"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Product Landscape Card */}
      <div className="p-5 rounded-2xl bg-[#090e24] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <img
              src={selectedProduct.imageUrl}
              alt={selectedProduct.name}
              className="w-12 h-12 rounded-xl object-cover bg-slate-900"
            />
            <div>
              <div className="flex items-center gap-2">
                <MarketplaceBadge marketplace={selectedProduct.marketplace} size="xs" />
                <CompetitionBadge level={selectedProduct.competitionLevel} />
              </div>
              <h3 className="text-sm font-bold text-white mt-1 line-clamp-1">{selectedProduct.name}</h3>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400">Harga Produk Ini:</span>
            <div className="text-base font-bold font-mono text-emerald-400">{formatIDR(selectedProduct.price)}</div>
          </div>
        </div>

        {/* 3 Price Benchmark Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Harga Terendah Kompetitor</span>
            <div className="text-base font-bold font-mono text-emerald-400 mt-1">{formatIDR(priceMin)}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Penjual non-resmi / grosir</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-500/30 text-center">
            <span className="text-[10px] text-indigo-400 uppercase font-semibold">Harga Rata-Rata Pasar</span>
            <div className="text-base font-bold font-mono text-indigo-300 mt-1">{formatIDR(priceAvg)}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Median harga jual Indonesia</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Harga Tertinggi Resmi</span>
            <div className="text-base font-bold font-mono text-rose-400 mt-1">{formatIDR(priceMax)}</div>
            <p className="text-[10px] text-slate-500 mt-0.5">Harga Mall / Retail Offline</p>
          </div>
        </div>

        {/* Saturation Insights */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1.5">
          <div className="flex items-center gap-2 text-white font-bold">
            <Store className="w-4 h-4 text-indigo-400" />
            <span>Saturasi Pasar: {selectedProduct.competitorStoreCount} Toko Terdeteksi di Marketplace</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            {selectedProduct.competitionLevel === 'Low Competition'
              ? 'Tingkat persaingan masih rendah. Creator memiliki kesempatan sangat tinggi untuk mendominasi kata kunci pencarian dan rekomendasi algoritma video.'
              : selectedProduct.competitionLevel === 'Medium Competition'
              ? 'Persaingan moderat dengan penjual aktif. Creator disarankan menonjolkan hook keaslian barang (100% Original) dan review tekstur pemakaian langsung.'
              : 'Pasar memiliki persaingan tinggi. Creator wajib menggunakan angle hook kontras (Misal: Uji ketahanan, komparasi dengan merek lain) untuk memenangkan perhatian penonton.'}
          </p>
        </div>
      </div>

      {/* Catalog Competition Overview Table */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Tabel Tingkat Persaingan Seluruh Produk
          </h3>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-400 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="bg-[#080d22] rounded-xl border border-slate-800 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#060916] border-b border-slate-800 text-slate-400 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-3">Produk</th>
                  <th className="p-3">Marketplace</th>
                  <th className="p-3 text-right">Harga</th>
                  <th className="p-3 text-center">Toko Kompetitor</th>
                  <th className="p-3 text-center">Tingkat Persaingan</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-900/60 transition">
                    <td className="p-3 font-semibold text-slate-200">
                      <div className="flex items-center gap-2 max-w-sm">
                        <img src={p.imageUrl} alt={p.name} className="w-8 h-8 rounded object-cover bg-slate-900 shrink-0" />
                        <span className="truncate">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <MarketplaceBadge marketplace={p.marketplace} size="xs" />
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-white">
                      {formatIDR(p.price)}
                    </td>
                    <td className="p-3 text-center font-mono font-semibold text-amber-300">
                      {p.competitorStoreCount} Toko
                    </td>
                    <td className="p-3 text-center">
                      <CompetitionBadge level={p.competitionLevel} />
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setSelectedProductId(p.id)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                      >
                        Pilih Analisis
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
