import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Product, Hashtag } from '../types';
import { MarketplaceBadge, ScoreBadge, TrendBadge } from '../components/common/Badge';
import { formatIDR, formatCompact } from '../utils/calculations';
import {
  Bookmark,
  Trash2,
  ExternalLink,
  Wand2,
  Calculator,
  GitCompare,
  TrendingUp,
  Hash,
  AlertCircle,
  Eye,
} from 'lucide-react';

export const WatchlistPage: React.FC<{ onOpenDetail: (p: Product) => void }> = ({ onOpenDetail }) => {
  const {
    watchlist,
    removeFromWatchlist,
    products,
    hashtags,
    setTargetProductForAi,
    setTargetProductForCalculator,
    setActiveModule,
    toggleComparisonProduct,
  } = useApp();

  const productWatchlist = watchlist
    .filter((w) => w.type === 'product')
    .map((w) => {
      const p = products.find((x) => x.id === w.itemId);
      return { item: w, product: p };
    })
    .filter((x): x is { item: typeof x.item; product: Product } => !!x.product);

  const hashtagWatchlist = watchlist
    .filter((w) => w.type === 'hashtag')
    .map((w) => {
      const h = hashtags.find((x) => x.id === w.itemId);
      return { item: w, hashtag: h };
    })
    .filter((x): x is { item: typeof x.item; hashtag: Hashtag } => !!x.hashtag);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 rounded-2xl bg-[#080d22] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Bookmark className="w-3 h-3 text-emerald-400" />
              Monitoring Center
            </span>
            <span className="text-xs text-slate-400">Total {watchlist.length} Item Dipantau</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1.5">
            Watchlist Produk & Hashtag Unggulan
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pantau fluktuasi harga, akselerasi kecepatan penjualan harian, dan perubahan skor peluang AI secara berkala.
          </p>
        </div>

        <button
          onClick={() => setActiveModule('Product Explorer')}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shrink-0"
        >
          + Tambah Produk Baru
        </button>
      </div>

      {watchlist.length === 0 ? (
        <div className="py-16 text-center bg-[#080d22] rounded-2xl border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mx-auto text-slate-500">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">Watchlist Anda masih kosong</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Simpan produk potensial atau hashtag yang ingin Anda pantau dari Product Explorer atau Hashtag Intelligence.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Section 1: Produk Dipantau */}
          {productWatchlist.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <span>Produk Dipantau ({productWatchlist.length})</span>
              </h3>

              <div className="bg-[#080d22] rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#060916] border-b border-slate-800 text-slate-400 uppercase text-[10px] font-semibold">
                      <tr>
                        <th className="p-3">Produk</th>
                        <th className="p-3">Marketplace</th>
                        <th className="p-3 text-right">Harga Saat Ini</th>
                        <th className="p-3 text-center">Komisi</th>
                        <th className="p-3 text-center">Tren 7H</th>
                        <th className="p-3 text-center">Skor Peluang AI</th>
                        <th className="p-3">Catatan Riset</th>
                        <th className="p-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {productWatchlist.map(({ item, product: p }) => (
                        <tr key={item.id} className="hover:bg-slate-900/50 transition">
                          <td className="p-3">
                            <div className="flex items-center gap-2.5 max-w-sm">
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="w-10 h-10 rounded-lg object-cover bg-slate-900 shrink-0"
                              />
                              <div className="min-w-0">
                                <span
                                  onClick={() => onOpenDetail(p)}
                                  className="font-semibold text-slate-200 line-clamp-1 hover:text-indigo-300 transition cursor-pointer"
                                >
                                  {p.name}
                                </span>
                                <span className="text-[10px] text-slate-400 block truncate">
                                  {p.storeName}
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
                          <td className="p-3 text-center whitespace-nowrap font-mono text-emerald-400 font-bold">
                            {p.commissionRate}%
                          </td>
                          <td className="p-3 text-center whitespace-nowrap">
                            <TrendBadge status={p.trendStatus} rate={p.growth7d} />
                          </td>
                          <td className="p-3 text-center whitespace-nowrap">
                            <ScoreBadge score={p.score.total} />
                          </td>
                          <td className="p-3 text-slate-300 text-[11px] max-w-xs truncate">
                            {item.notes}
                          </td>
                          <td className="p-3 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => {
                                  setTargetProductForAi(p);
                                  setActiveModule('AI Content Generator');
                                }}
                                title="Buat Script AI"
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
                                className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white transition"
                              >
                                <Calculator className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => removeFromWatchlist(p.id)}
                                title="Hapus dari Watchlist"
                                className="p-1.5 rounded bg-slate-800 text-slate-500 hover:text-rose-400 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Hashtag Dipantau */}
          {hashtagWatchlist.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Hash className="w-4 h-4 text-purple-400" />
                <span>Hashtag Dipantau ({hashtagWatchlist.length})</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {hashtagWatchlist.map(({ item, hashtag: h }) => (
                  <div key={item.id} className="p-4 rounded-xl bg-[#080d22] border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-indigo-300">{h.tag}</span>
                        <span className="text-[10px] text-slate-400 px-1.5 py-0.2 rounded bg-slate-900 font-mono">
                          {h.platform}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 block mt-1">
                        Volume: {formatCompact(h.observedContentCount)} konten
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <TrendBadge status={h.trendStatus} rate={h.volumeChange7d} />
                      <button
                        onClick={() => removeFromWatchlist(h.id)}
                        className="p-1.5 rounded text-slate-500 hover:text-rose-400 transition"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
