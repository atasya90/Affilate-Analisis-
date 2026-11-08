import React, { useState } from 'react';
import { Product } from '../../types';
import { formatIDR, formatCompact } from '../../utils/calculations';
import { MarketplaceBadge, TrendBadge, ScoreBadge, VerifiedBadge, CompetitionBadge } from '../common/Badge';
import { ChartSvg } from '../common/ChartSvg';
import { useApp } from '../../contexts/AppContext';
import { explainAiScore } from '../../services/api';
import {
  X,
  Store,
  Star,
  ExternalLink,
  Wand2,
  Calculator,
  GitCompare,
  Bookmark,
  BookmarkCheck,
  TrendingUp,
  DollarSign,
  Sparkles,
  Layers,
  Hash,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const {
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleComparisonProduct,
    selectedComparisonIds,
    setTargetProductForAi,
    setTargetProductForCalculator,
    setActiveModule,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'ai_score' | 'competitors'>('overview');
  const [isExplaining, setIsExplaining] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);

  if (!product) return null;

  const inWatchlist = isInWatchlist(product.id);
  const inComparison = selectedComparisonIds.includes(product.id);
  const estCommission = Math.round(product.price * (product.commissionRate / 100));

  // Snapshot time series data for charts
  const salesHistory = product.snapshots.map((s) => ({
    label: s.date.slice(5),
    value: s.soldCount,
  }));

  const priceHistory = product.snapshots.map((s) => ({
    label: s.date.slice(5),
    value: s.price,
  }));

  const handleFetchAiExplanation = async () => {
    setIsExplaining(true);
    try {
      const exp = await explainAiScore(product);
      setAiExplanation(exp);
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#090e24] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-[#060916]">
          <div className="flex items-center gap-2">
            <MarketplaceBadge marketplace={product.marketplace} />
            {product.isVerified && <VerifiedBadge />}
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">ID: {product.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (inWatchlist) removeFromWatchlist(product.id);
                else addToWatchlist('product', product.id);
              }}
              className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition ${
                inWatchlist
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
              }`}
            >
              {inWatchlist ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{inWatchlist ? 'Tersimpan' : 'Watchlist'}</span>
            </button>

            <button
              onClick={() => toggleComparisonProduct(product.id)}
              className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition ${
                inComparison
                  ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{inComparison ? 'Dibandingkan' : 'Bandingkan'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center px-4 border-b border-slate-800 bg-[#070b1a] text-xs">
          {[
            { id: 'overview', label: 'Ringkasan & Metrik' },
            { id: 'history', label: 'Histori 30 Hari' },
            { id: 'ai_score', label: 'AI Opportunity Breakdown' },
            { id: 'competitors', label: 'Analisis Kompetisi' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2.5 font-medium border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-300 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scroll">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Product Image & Badges */}
                <div className="md:col-span-4 flex flex-col gap-3">
                  <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-square relative">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2">
                      <ScoreBadge score={product.score.total} isProvisional={product.score.isProvisional} />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Kategori:</span>
                      <span className="text-slate-200 font-medium">{product.category}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Toko:</span>
                      <span className="text-slate-200 font-medium truncate max-w-[150px]">{product.storeName}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Rating:</span>
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {product.rating} ({formatCompact(product.reviewCount)} ulasan)
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Update Terakhir:</span>
                      <span className="text-slate-300 font-mono text-[10px]">{product.lastUpdated}</span>
                    </div>
                  </div>
                </div>

                {/* Core Metrics & Quick CTAs */}
                <div className="md:col-span-8 flex flex-col justify-between space-y-4">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
                      {product.name}
                    </h2>
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <TrendBadge status={product.trendStatus} rate={product.growth7d} />
                      <CompetitionBadge level={product.competitionLevel} />
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Harga Terkini</span>
                      <div className="text-base font-bold font-mono text-white mt-0.5">
                        {formatIDR(product.price)}
                      </div>
                      {product.originalPrice && (
                        <div className="text-[10px] text-slate-500 line-through">
                          {formatIDR(product.originalPrice)}
                        </div>
                      )}
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Komisi Affiliate</span>
                      <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
                        {product.commissionRate}%
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        ≈ {formatIDR(estCommission)} / order
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Terjual</span>
                      <div className="text-base font-bold font-mono text-cyan-300 mt-0.5">
                        {formatCompact(product.soldCount)}
                      </div>
                      <div className="text-[10px] text-slate-400">Unit terverifikasi</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Pertumbuhan 7 Hari</span>
                      <div className={`text-base font-bold font-mono mt-0.5 ${product.growth7d && product.growth7d > 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                        {product.growth7d !== null ? `${product.growth7d > 0 ? '+' : ''}${product.growth7d}%` : 'N/A'}
                      </div>
                      <div className="text-[10px] text-slate-400">Velocity mingguan</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Pertumbuhan 30 Hari</span>
                      <div className={`text-base font-bold font-mono mt-0.5 ${product.growth30d && product.growth30d > 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                        {product.growth30d !== null ? `${product.growth30d > 0 ? '+' : ''}${product.growth30d}%` : 'N/A'}
                      </div>
                      <div className="text-[10px] text-slate-400">Konsistensi bulanan</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Toko Kompetitor</span>
                      <div className="text-base font-bold font-mono text-amber-300 mt-0.5">
                        {product.competitorStoreCount} Toko
                      </div>
                      <div className="text-[10px] text-slate-400">{product.competitionLevel}</div>
                    </div>
                  </div>

                  {/* Related Hashtags */}
                  <div>
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                      <Hash className="w-3.5 h-3.5 text-indigo-400" />
                      Hashtag Relevan & Viral:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {product.relatedHashtags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-xs font-mono transition"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    Manfaatkan Peluang Affiliate Produk Ini Sekarang
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Generate hook video, script UGC, atau hitung proyeksi omset bulanan Anda.
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setTargetProductForAi(product);
                      setActiveModule('AI Content Generator');
                      onClose();
                    }}
                    className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 transition"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Generate Script AI</span>
                  </button>

                  <button
                    onClick={() => {
                      setTargetProductForCalculator(product);
                      setActiveModule('Affiliate Profit Calculator');
                      onClose();
                    }}
                    className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition"
                  >
                    <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Hitung Profit</span>
                  </button>

                  <a
                    href={product.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                    title="Buka link asli toko"
                  >
                    <ExternalLink className="w-4 h-4 text-sky-400" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HISTORICAL 30 DAYS CHARTS */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <ChartSvg
                  title="Grafik Penjualan Terakumulasi 30 Hari Terakhir"
                  data={salesHistory}
                  color="#14b8a6"
                  height={220}
                  valueSuffix=" unit terjual"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <ChartSvg
                  title="Grafik Perubahan Harga Produk 30 Hari Terakhir (IDR)"
                  data={priceHistory}
                  color="#6366f1"
                  height={190}
                  valuePrefix="Rp "
                />
              </div>
            </div>
          )}

          {/* TAB 3: AI OPPORTUNITY SCORE BREAKDOWN */}
          {activeTab === 'ai_score' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/50 via-slate-900 to-slate-950 border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold font-mono text-indigo-300">
                      {product.score.total}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-indigo-400">/ 100</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{product.score.level}</h3>
                      {product.score.isProvisional && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          Provisional Score
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Kelengkapan Parameter: <span className="text-indigo-400 font-bold">{product.score.dataCompleteness}%</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleFetchAiExplanation}
                  disabled={isExplaining}
                  className="px-4 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold flex items-center gap-2 border border-indigo-500/30 transition disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isExplaining ? 'animate-spin' : ''}`} />
                  <span>{isExplaining ? 'Menganalisis AI...' : 'Analisis Mendalam AI'}</span>
                </button>
              </div>

              {/* AI Explanation Box */}
              {(aiExplanation || product.score.explanation) && (
                <div className="p-4 rounded-xl bg-slate-900/80 border border-indigo-500/20 space-y-2">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    Penjelasan Analisis Algoritma & Rekomendasi Creator:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {aiExplanation || product.score.explanation}
                  </p>
                </div>
              )}

              {/* Weights Table Breakdown (Section J Specification) */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Komposisi Algoritma Penilaian Transparan:
                </h4>

                <div className="space-y-2">
                  {[
                    { label: 'Pertumbuhan Tren 7 Hari', weight: '25%', score: product.score.breakdown.trendGrowth7d, desc: 'Tingkat akselerasi pesanan 7 hari dibanding 7 hari sebelumnya' },
                    { label: 'Popularitas 30 Hari', weight: '20%', score: product.score.breakdown.popularity30d, desc: 'Konsistensi minat audiens dan interaksi jangka menengah' },
                    { label: 'Permintaan Pasar (Order Velocity)', weight: '20%', score: product.score.breakdown.marketDemand, desc: 'Volume pesanan nyata terakumulasi di marketplace' },
                    { label: 'Komisi Affiliate', weight: '15%', score: product.score.breakdown.commissionRate, desc: 'Persentase dan nominal margin keuntungan bersih bagi creator' },
                    { label: 'Tingkat Persaingan (Terbalik)', weight: '10%', score: product.score.breakdown.competitionScore, desc: 'Semakin sedikit toko sejenis, semakin tinggi peluang dominasi' },
                    { label: 'Relevansi & Momentum Hashtag', weight: '10%', score: product.score.breakdown.hashtagRelevance, desc: 'Kekuatan dorongan konten viral dan tren search intent' },
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-200">{item.label}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            Bobot {item.weight}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="w-32 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-teal-400 h-full rounded-full"
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold font-mono text-slate-200 w-10 text-right">
                          {item.score}/100
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: COMPETITORS */}
          {activeTab === 'competitors' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Total Toko Menawarkan Produk Sejenis:</span>
                  <div className="text-lg font-bold text-white mt-0.5">
                    {product.competitorStoreCount} Toko Terdeteksi
                  </div>
                </div>
                <CompetitionBadge level={product.competitionLevel} />
              </div>

              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-300">Simulasi Sebaran Harga Kompetitor:</h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400">Harga Terendah</span>
                    <div className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                      {formatIDR(Math.round(product.price * 0.88))}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400">Harga Produk Ini</span>
                    <div className="text-xs font-mono font-bold text-indigo-300 mt-0.5">
                      {formatIDR(product.price)}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400">Harga Tertinggi</span>
                    <div className="text-xs font-mono font-bold text-rose-400 mt-0.5">
                      {formatIDR(Math.round(product.price * 1.25))}
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Rekomendasi strategi: Posisi harga produk berada pada rentang tengah yang sehat. Cocok untuk dibuatkan konten perbandingan kualitas bahan dan kepuasan rating {product.rating} bintang.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
