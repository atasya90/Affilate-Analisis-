import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Product } from '../types';
import { ScoreBadge, MarketplaceBadge, TrendBadge, CompetitionBadge } from '../components/common/Badge';
import { formatIDR } from '../utils/calculations';
import { explainAiScore } from '../services/api';
import {
  Sparkles,
  BarChart3,
  RefreshCw,
  Info,
  CheckCircle2,
  Sliders,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const AiProductScorePage: React.FC<{ onOpenDetail: (p: Product) => void }> = ({ onOpenDetail }) => {
  const { products, setTargetProductForAi, setActiveModule } = useApp();
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const handleGenerateExplanation = async () => {
    setIsExplaining(true);
    try {
      const exp = await explainAiScore(product);
      setExplanation(exp);
    } finally {
      setIsExplaining(false);
    }
  };

  const weights = [
    { label: 'Pertumbuhan Tren 7 Hari', weight: '25%', value: product.score.breakdown.trendGrowth7d, desc: 'Akselerasi permintaan dalam 7 hari terakhir dibanding minggu sebelumnya' },
    { label: 'Popularitas 30 Hari', weight: '20%', value: product.score.breakdown.popularity30d, desc: 'Konsistensi interaksi audiens dan penelusuran bulanan' },
    { label: 'Permintaan Pasar (Order Velocity)', weight: '20%', value: product.score.breakdown.marketDemand, desc: 'Volume pesanan nyata terverifikasi di platform e-commerce' },
    { label: 'Komisi Affiliate', weight: '15%', value: product.score.breakdown.commissionRate, desc: 'Persentase komisi bersih yang diterima creator per produk' },
    { label: 'Tingkat Persaingan (Terbalik)', weight: '10%', value: product.score.breakdown.competitionScore, desc: 'Semakin sedikit toko pesaing, semakin tinggi peluang dominasi' },
    { label: 'Relevansi & Momentum Hashtag', weight: '10%', value: product.score.breakdown.hashtagRelevance, desc: 'Frekuensi kemunculan konten pada hashtag viral saat ini' },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 rounded-2xl bg-[#080d22] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              AI Opportunity Score Lab
            </span>
            <span className="text-xs text-slate-400">Algoritma Penilaian Multi-Faktor (0 - 100)</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1.5">
            Laboratorium Pembobotan Skor Peluang Produk
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Sistem penilaian berbasis data transparan tanpa rekayasa, menormalisasi parameter jika data parsial tersedia.
          </p>
        </div>

        {/* Product selector */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-400 hidden sm:inline">Pilih Produk:</span>
          <select
            value={product.id}
            onChange={(e) => {
              setSelectedProductId(e.target.value);
              setExplanation(null);
            }}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white max-w-xs truncate focus:outline-hidden"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.score.total}/100)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Product Hero Score Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/30 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src={product.imageUrl} alt={product.name} className="w-16 h-16 rounded-xl object-cover bg-slate-900 border border-slate-700" />
            <div>
              <div className="flex items-center gap-2">
                <MarketplaceBadge marketplace={product.marketplace} size="xs" />
                <span className="text-xs text-slate-400">{product.category}</span>
                {product.score.isProvisional && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Provisional
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-white mt-1">{product.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{product.storeName} • {formatIDR(product.price)}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <span className="text-xs text-slate-400">Total Skor Peluang</span>
              <div className="text-2xl font-black font-mono text-indigo-300">{product.score.total} / 100</div>
              <span className="text-xs font-semibold text-emerald-400">{product.score.level}</span>
            </div>

            <button
              onClick={handleGenerateExplanation}
              disabled={isExplaining}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isExplaining ? 'animate-spin' : ''}`} />
              <span>{isExplaining ? 'Menganalisis...' : 'Analisis AI'}</span>
            </button>
          </div>
        </div>

        {/* AI Analytical Explanation Box */}
        {(explanation || product.score.explanation) && (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/30 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Analisis Rasional Skor AI:</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {explanation || product.score.explanation}
            </p>
          </div>
        )}

        {/* 6 Transparent Factors Breakdown */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Rincian 6 Parameter Penilaian Terbuka (Algoritma Section J):
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {weights.map((w, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">{w.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      Bobot {w.weight}
                    </span>
                    <span className="text-xs font-mono font-bold text-indigo-300">{w.value}/100</span>
                  </div>
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-teal-400 h-full rounded-full"
                    style={{ width: `${w.value}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Jump to Generator */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div className="text-xs">
          <span className="font-bold text-white block">Tertarik mempromosikan produk ini?</span>
          <span className="text-slate-400">Generate 5 judul video, 5 hook, dan naskah UGC otomatis.</span>
        </div>
        <button
          onClick={() => {
            setTargetProductForAi(product);
            setActiveModule('AI Content Generator');
          }}
          className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <span>Buat Konten AI</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
