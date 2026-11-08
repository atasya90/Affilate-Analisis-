import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Product } from '../types';
import { ProductCard } from '../components/products/ProductCard';
import { formatIDR, formatCompact } from '../utils/calculations';
import {
  ShoppingBag,
  Tag,
  Sparkles,
  Award,
  Video,
  Wand2,
  CheckCircle2,
  Percent,
} from 'lucide-react';

export const ShopeeAnalysisPage: React.FC<{ onOpenDetail: (p: Product) => void }> = ({ onOpenDetail }) => {
  const { products, setActiveModule, setTargetProductForAi } = useApp();

  const shopeeProducts = products.filter((p) => p.marketplace === 'Shopee');

  const shopeeInsights = [
    { title: 'Dampak Shopee Video', stat: '2.8x Lebih Cepat Checkout', desc: 'Video ulasan dengan voucher diskon live meningkatkan impulse buying secara instan.' },
    { title: 'Toko Star+ & Mall', stat: '98% Trust Score', desc: 'Produk dari toko Star+ memiliki bounce rate 40% lebih rendah dibanding seller reguler.' },
    { title: 'Voucher Gratis Ongkir Xtra', stat: 'Faktor Konversi #1', desc: '82% pembeli Shopee Indonesia hanya checkout jika gratis ongkir aktif.' },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#200c06] via-[#080d22] to-[#1a0804] border border-[#EE4D2D]/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EE4D2D] animate-pulse"></span>
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-[#ff6b4a]">
              Shopee Indonesia Affiliate Intelligence
            </span>
          </div>
          <h2 className="text-xl font-black text-white">
            Analisis Produk Shopee Video & Shopee Mall
          </h2>
          <p className="text-xs text-slate-300 max-w-xl">
            Maksimalkan konversi komisi affiliate Shopee melalui optimasi judul SEO pencarian, sinergi Shopee Video, dan link affiliate keranjang oranye.
          </p>
        </div>

        <button
          onClick={() => {
            if (shopeeProducts[0]) setTargetProductForAi(shopeeProducts[0]);
            setActiveModule('AI Content Generator');
          }}
          className="px-4 py-2.5 rounded-xl bg-[#EE4D2D] hover:bg-[#d63b1d] text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#EE4D2D]/30 transition shrink-0 cursor-pointer"
        >
          <Wand2 className="w-4 h-4" />
          <span>Buat SEO Copy Shopee</span>
        </button>
      </div>

      {/* Conversion Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {shopeeInsights.map((ins, i) => (
          <div key={i} className="p-4 rounded-xl bg-[#080d22] border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">{ins.title}</span>
            <div className="text-base font-bold text-[#ff6b4a] mt-1">{ins.stat}</div>
            <p className="text-[11px] text-slate-400 leading-normal">{ins.desc}</p>
          </div>
        ))}
      </div>

      {/* Shopee Catalog Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#EE4D2D]" />
            Katalog Produk Shopee Indonesia ({shopeeProducts.length} Terindeks)
          </h3>
          <span className="text-xs text-slate-400">Verifikasi toko Star / Mall dengan rating tinggi</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {shopeeProducts.map((product) => (
            <ProductCard key={product.id} product={product} onOpenDetail={onOpenDetail} />
          ))}
        </div>
      </div>
    </div>
  );
};
