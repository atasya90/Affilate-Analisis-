import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Product } from '../types';
import { ChartSvg } from '../components/common/ChartSvg';
import { MarketplaceBadge } from '../components/common/Badge';
import { formatIDR, formatCompact } from '../utils/calculations';
import {
  History,
  Calendar,
  Layers,
  Sparkles,
  TrendingUp,
  Download,
  Info,
} from 'lucide-react';

export const HistoricalAnalyticsPage: React.FC = () => {
  const { products, selectedMarketplace } = useApp();
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [rangeDays, setRangeDays] = useState<7 | 14 | 30>(30);

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const slicedSnapshots = product.snapshots.slice(-rangeDays);

  const salesTrend = slicedSnapshots.map((s) => ({
    label: s.date.slice(5),
    value: s.soldCount,
  }));

  const priceTrend = slicedSnapshots.map((s) => ({
    label: s.date.slice(5),
    value: s.price,
  }));

  const popularityTrend = slicedSnapshots.map((s) => ({
    label: s.date.slice(5),
    value: s.popularityScore,
  }));

  const handleExportCsv = () => {
    const headers = ['date', 'price', 'sold_count', 'popularity_score', 'commission_rate'];
    const rows = slicedSnapshots.map((s) => [s.date, s.price, s.soldCount, s.popularityScore, s.commissionRate]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${product.id}_historical_snapshots_${rangeDays}d.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 rounded-2xl bg-[#080d22] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
              <History className="w-3 h-3 text-cyan-400" />
              Historical Snapshot Engine
            </span>
            <span className="text-xs text-slate-400">Snapshot Harian Terarsip</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1.5">
            Analisis Data Historis & Lintasan Performa
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Database snapshot harian untuk membandingkan kurva harga, lonjakan penjualan terakumulasi, dan momentum popularitas.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={product.id}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white max-w-xs truncate focus:outline-hidden"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Range Filter */}
      <div className="flex items-center justify-between bg-[#080d22] p-3 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <MarketplaceBadge marketplace={product.marketplace} size="xs" />
          <span className="font-bold text-white truncate max-w-md">{product.name}</span>
        </div>

        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
          {([7, 14, 30] as const).map((days) => (
            <button
              key={days}
              onClick={() => setRangeDays(days)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                rangeDays === days ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {days} Hari
            </button>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-[#080d22] border border-slate-800 space-y-3">
          <ChartSvg
            title={`Kurva Akumulasi Penjualan (${rangeDays} Hari Terakhir)`}
            data={salesTrend}
            color="#14b8a6"
            height={200}
            valueSuffix=" unit"
          />
        </div>

        <div className="p-5 rounded-2xl bg-[#080d22] border border-slate-800 space-y-3">
          <ChartSvg
            title={`Lintasan Fluktuasi Harga (${rangeDays} Hari Terakhir)`}
            data={priceTrend}
            color="#6366f1"
            height={200}
            valuePrefix="Rp "
          />
        </div>
      </div>

      {/* Popularity chart */}
      <div className="p-5 rounded-2xl bg-[#080d22] border border-slate-800 space-y-3">
        <ChartSvg
          title={`Indeks Popularitas & Minat Pencarian (${rangeDays} Hari Terakhir)`}
          data={popularityTrend}
          color="#a855f7"
          height={180}
          valueSuffix=" / 100"
        />
      </div>

      {/* Snapshot Table */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Log Snapshot Harian Terarsip ({slicedSnapshots.length} Hari)
        </h3>

        <div className="bg-[#080d22] rounded-xl border border-slate-800 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#060916] border-b border-slate-800 text-slate-400 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-3">Tanggal Snapshot</th>
                  <th className="p-3 text-right">Harga Produk</th>
                  <th className="p-3 text-center">Unit Terjual</th>
                  <th className="p-3 text-center">Indeks Popularitas</th>
                  <th className="p-3 text-center">Komisi (%)</th>
                  <th className="p-3 text-center">Rating Toko</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {slicedSnapshots.slice().reverse().map((s, i) => (
                  <tr key={s.date} className="hover:bg-slate-900/50 transition">
                    <td className="p-3 text-slate-200">{s.date}</td>
                    <td className="p-3 text-right font-bold text-white">{formatIDR(s.price)}</td>
                    <td className="p-3 text-center text-cyan-300">{formatCompact(s.soldCount)} unit</td>
                    <td className="p-3 text-center text-purple-300">{s.popularityScore}/100</td>
                    <td className="p-3 text-center text-emerald-400 font-bold">{s.commissionRate}%</td>
                    <td className="p-3 text-center text-amber-400 font-bold">★ {s.rating}</td>
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
