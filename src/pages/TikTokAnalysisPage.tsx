import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Product } from '../types';
import { ProductCard } from '../components/products/ProductCard';
import { formatIDR, formatCompact } from '../utils/calculations';
import {
  Video,
  Music2,
  Sparkles,
  ShoppingBag,
  Flame,
  Wand2,
  CheckCircle2,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

export const TikTokAnalysisPage: React.FC<{ onOpenDetail: (p: Product) => void }> = ({ onOpenDetail }) => {
  const { products, setActiveModule, setTargetProductForAi } = useApp();

  const tiktokProducts = products.filter((p) => p.marketplace === 'TikTok Shop');

  // Viral audio associations
  const trendingAudios = [
    { name: 'Sound Viral DJ TikTok FYP 2026', creator: 'DJ Mengkane Indo', usage: '840K video', growth: '+45%' },
    { name: 'Aesthetic Chill Lofi Review', creator: 'Morning Beats', usage: '420K video', growth: '+28%' },
    { name: 'Sound Unboxing & Spill Racun', creator: 'Creator Hub ID', usage: '310K video', growth: '+34%' },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-black via-[#080d22] to-[#041a24] border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f2fe] animate-pulse"></span>
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-cyan-400">
              TikTok Shop Indonesia Intelligence
            </span>
          </div>
          <h2 className="text-xl font-black text-white">
            Analisis Produk & Sinyal Viral TikTok Shop
          </h2>
          <p className="text-xs text-slate-300 max-w-xl">
            Optimalkan strategi konten video pendek, live shopping affiliate, dan hook 3 detik pertama untuk mengonversi penonton menjadi pembeli keranjang kuning.
          </p>
        </div>

        <button
          onClick={() => {
            if (tiktokProducts[0]) setTargetProductForAi(tiktokProducts[0]);
            setActiveModule('AI Content Generator');
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00f2fe] to-indigo-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:opacity-90 transition shrink-0 cursor-pointer"
        >
          <Wand2 className="w-4 h-4" />
          <span>Buat Script TikTok Sekarang</span>
        </button>
      </div>

      {/* Benchmarks & Audio Radar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-xl bg-[#080d22] border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Rata-rata Komisi TikTok Shop</span>
          <div className="text-2xl font-bold font-mono text-cyan-400">16.8%</div>
          <p className="text-[11px] text-slate-400">Lebih tinggi 3.2% dibanding rata-rata marketplace lain</p>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-xl bg-[#080d22] border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Format Konten Tertinggi Konversi</span>
          <div className="text-base font-bold text-white mt-1">UGC Review Jujur + Before-After</div>
          <p className="text-[11px] text-emerald-400">Est. Conversion Rate 3.8% - 5.2%</p>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-xl bg-[#080d22] border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Durasi Video Paling Efektif</span>
          <div className="text-2xl font-bold font-mono text-indigo-400">18 - 25 Detik</div>
          <p className="text-[11px] text-slate-400">Hook di 3 detik pertama dengan visual langsung ke produk</p>
        </div>
      </div>

      {/* Trending Audio Radar */}
      <div className="p-5 rounded-2xl bg-[#080d22] border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Music2 className="w-4 h-4 text-cyan-400" />
          Audio & Sound Rekomendasi FYP TikTok Saat Ini
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {trendingAudios.map((a, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-200 block truncate">{a.name}</span>
                <span className="text-[10px] text-slate-400 block">{a.creator}</span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-mono font-bold text-emerald-400">{a.growth}</span>
                <span className="text-[10px] text-slate-400 block">{a.usage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TikTok Products Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Video className="w-4 h-4 text-cyan-400" />
            Produk Unggulan TikTok Shop Indonesia ({tiktokProducts.length} Terindeks)
          </h3>
          <span className="text-xs text-slate-400">Disortir berdasarkan skor peluang tertinggi</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiktokProducts.map((product) => (
            <ProductCard key={product.id} product={product} onOpenDetail={onOpenDetail} />
          ))}
        </div>
      </div>
    </div>
  );
};
