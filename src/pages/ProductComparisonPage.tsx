import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Product } from '../types';
import { MarketplaceBadge, ScoreBadge, TrendBadge, CompetitionBadge } from '../components/common/Badge';
import { formatIDR, formatCompact } from '../utils/calculations';
import {
  GitCompare,
  Plus,
  Trash2,
  Sparkles,
  Trophy,
  ExternalLink,
  Wand2,
  Calculator,
  ArrowRight,
} from 'lucide-react';

export const ProductComparisonPage: React.FC<{ onOpenDetail: (p: Product) => void }> = ({ onOpenDetail }) => {
  const {
    products,
    selectedComparisonIds,
    toggleComparisonProduct,
    clearComparison,
    setTargetProductForAi,
    setActiveModule,
  } = useApp();

  const comparisonProducts = products.filter((p) => selectedComparisonIds.includes(p.id));

  // Determine winning product (highest AI opportunity score)
  const winningProduct = [...comparisonProducts].sort((a, b) => b.score.total - a.score.total)[0];

  const parameters = [
    { label: 'Marketplace', key: 'marketplace', render: (p: Product) => <MarketplaceBadge marketplace={p.marketplace} /> },
    { label: 'Harga Produk', key: 'price', render: (p: Product) => <span className="font-mono font-bold text-white">{formatIDR(p.price)}</span> },
    {
      label: 'Komisi Affiliate',
      key: 'commissionRate',
      render: (p: Product) => (
        <div>
          <span className="font-mono font-bold text-emerald-400">{p.commissionRate}%</span>
          <span className="text-[10px] text-slate-400 block font-mono">
            ≈ {formatIDR(Math.round(p.price * (p.commissionRate / 100)))}
          </span>
        </div>
      ),
    },
    {
      label: 'Tren 7 Hari (Velocity)',
      key: 'growth7d',
      render: (p: Product) => <TrendBadge status={p.trendStatus} rate={p.growth7d} />,
    },
    {
      label: 'Tren 30 Hari (Bulanan)',
      key: 'growth30d',
      render: (p: Product) => (
        <span className={`font-mono text-xs ${p.growth30d && p.growth30d > 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
          {p.growth30d !== null ? `${p.growth30d > 0 ? '+' : ''}${p.growth30d}%` : 'N/A'}
        </span>
      ),
    },
    {
      label: 'Tingkat Persaingan',
      key: 'competition',
      render: (p: Product) => <CompetitionBadge level={p.competitionLevel} />,
    },
    {
      label: 'Saturasi Toko',
      key: 'storeCount',
      render: (p: Product) => <span className="font-mono text-amber-300">{p.competitorStoreCount} Toko</span>,
    },
    {
      label: 'Total Terjual Terverifikasi',
      key: 'soldCount',
      render: (p: Product) => <span className="font-mono text-slate-200">{formatCompact(p.soldCount)} unit</span>,
    },
    {
      label: 'Rating & Ulasan',
      key: 'rating',
      render: (p: Product) => (
        <span className="text-amber-400 font-mono font-bold">
          ★ {p.rating} ({formatCompact(p.reviewCount)})
        </span>
      ),
    },
    {
      label: 'AI Product Opportunity Score',
      key: 'score',
      render: (p: Product) => <ScoreBadge score={p.score.total} isProvisional={p.score.isProvisional} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 rounded-2xl bg-[#080d22] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <GitCompare className="w-3 h-3 text-indigo-400" />
              Head-to-Head Comparison
            </span>
            <span className="text-xs text-slate-400">Komparasi 2 sampai 4 Produk Side-by-Side</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1.5">
            Perbandingan Potensi Produk Affiliate
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Analisis metrik riil harga, komisi, laju pertumbuhan 7H/30H, dan rekomendasi pemenang peluang tertinggi.
          </p>
        </div>

        {comparisonProducts.length > 0 && (
          <button
            onClick={clearComparison}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white text-xs font-medium flex items-center gap-1.5 transition shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Kosongkan Komparasi</span>
          </button>
        )}
      </div>

      {/* Add Product Selector Bar */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <span className="text-slate-300 font-medium">
          Tambahkan produk lain ke tabel perbandingan (Maksimal 4 produk):
        </span>
        <select
          onChange={(e) => {
            if (e.target.value) toggleComparisonProduct(e.target.value);
            e.target.value = '';
          }}
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white max-w-sm truncate focus:outline-hidden"
        >
          <option value="">+ Pilih Produk untuk Ditambahkan</option>
          {products
            .filter((p) => !selectedComparisonIds.includes(p.id))
            .map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.marketplace})
              </option>
            ))}
        </select>
      </div>

      {/* Empty State */}
      {comparisonProducts.length === 0 ? (
        <div className="py-16 text-center bg-[#080d22] rounded-2xl border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mx-auto text-slate-500">
            <GitCompare className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">Belum ada produk yang dipilih untuk dibandingkan</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Buka Product Explorer dan klik ikon <GitCompare className="w-3.5 h-3.5 inline mx-1 text-indigo-400" /> pada produk yang ingin Anda bandingkan.
          </p>
          <button
            onClick={() => setActiveModule('Product Explorer')}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
          >
            Buka Product Explorer
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Winner AI Recommendation Box */}
          {winningProduct && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      Rekomendasi Peluang Terbaik (AI Winner)
                    </span>
                    <ScoreBadge score={winningProduct.score.total} />
                  </div>
                  <h4 className="text-sm font-bold text-white mt-0.5 line-clamp-1">
                    {winningProduct.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Memiliki rasio terbaik antara akselerasi 7H ({winningProduct.growth7d !== null ? `${winningProduct.growth7d > 0 ? '+' : ''}${winningProduct.growth7d}%` : 'N/A'}), komisi {winningProduct.commissionRate}%, dan rating toko {winningProduct.rating}.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setTargetProductForAi(winningProduct);
                    setActiveModule('AI Content Generator');
                  }}
                  className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Buat Konten AI</span>
                </button>
                <button
                  onClick={() => onOpenDetail(winningProduct)}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700"
                >
                  Detail
                </button>
              </div>
            </div>
          )}

          {/* Side-by-side Table */}
          <div className="bg-[#080d22] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#060916] border-b border-slate-800">
                    <th className="p-4 w-44 font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                      Parameter Riset
                    </th>
                    {comparisonProducts.map((p) => (
                      <th key={p.id} className="p-4 min-w-[220px] max-w-[280px]">
                        <div className="flex items-center justify-between pb-2">
                          <span className="text-[10px] text-slate-400 font-mono">ID: {p.id}</span>
                          <button
                            onClick={() => toggleComparisonProduct(p.id)}
                            className="p-1 rounded text-slate-500 hover:text-rose-400 transition"
                            title="Hapus dari perbandingan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-full h-28 object-cover rounded-xl bg-slate-900 border border-slate-800 mb-2"
                        />
                        <h4 className="font-bold text-slate-100 text-xs line-clamp-2 leading-snug">
                          {p.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 mt-0.5 block truncate">
                          {p.storeName}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800/60">
                  {parameters.map((param, i) => (
                    <tr key={param.key} className={i % 2 === 0 ? 'bg-transparent' : 'bg-slate-900/20'}>
                      <td className="p-4 font-semibold text-slate-400 text-xs">
                        {param.label}
                      </td>
                      {comparisonProducts.map((p) => (
                        <td key={p.id} className="p-4">
                          {param.render(p)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
