import React from 'react';
import { Product } from '../../types';
import { formatIDR, formatCompact } from '../../utils/calculations';
import { MarketplaceBadge, TrendBadge, ScoreBadge, VerifiedBadge, CompetitionBadge } from '../common/Badge';
import { useApp } from '../../contexts/AppContext';
import {
  Bookmark,
  BookmarkCheck,
  GitCompare,
  Wand2,
  Calculator,
  ExternalLink,
  Store,
  Star,
  Eye,
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetail: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetail }) => {
  const {
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    selectedComparisonIds,
    toggleComparisonProduct,
    setTargetProductForAi,
    setActiveModule,
    setTargetProductForCalculator,
    selectedTimeframe,
  } = useApp();

  const inWatchlist = isInWatchlist(product.id);
  const inComparison = selectedComparisonIds.includes(product.id);

  const displayedGrowth = selectedTimeframe === '30d' ? product.growth30d : product.growth7d;
  const growthLabel = selectedTimeframe === '30d' ? 'Tren 30H' : 'Tren 7H';

  const estCommissionPerSale = Math.round(product.price * (product.commissionRate / 100));

  const handleAiContent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTargetProductForAi(product);
    setActiveModule('AI Content Generator');
  };

  const handleCalculator = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTargetProductForCalculator(product);
    setActiveModule('Affiliate Profit Calculator');
  };

  const handleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(product.id);
    } else {
      addToWatchlist('product', product.id, `Dipantau dari Explorer (${product.marketplace})`);
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleComparisonProduct(product.id);
  };

  return (
    <div
      onClick={() => onOpenDetail(product)}
      className="group bg-[#090e23] hover:bg-[#0c1330] border border-slate-800 hover:border-indigo-500/50 rounded-xl overflow-hidden transition-all duration-200 flex flex-col cursor-pointer shadow-lg hover:shadow-indigo-950/30 relative"
    >
      {/* Top Banner & Image */}
      <div className="relative aspect-4/3 w-full bg-slate-900 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090e23] via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
          <MarketplaceBadge marketplace={product.marketplace} size="xs" />
          {product.isVerified && <VerifiedBadge />}
        </div>

        {/* Action icons on image */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
          <button
            onClick={handleWatchlist}
            aria-label={inWatchlist ? 'Hapus dari Watchlist' : 'Tambah ke Watchlist'}
            className={`p-1.5 rounded-lg backdrop-blur-md transition ${
              inWatchlist
                ? 'bg-emerald-500 text-white'
                : 'bg-black/60 text-slate-300 hover:text-white hover:bg-black/80'
            }`}
          >
            {inWatchlist ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleCompare}
            aria-label={inComparison ? 'Hapus dari Perbandingan' : 'Bandingkan Produk'}
            className={`p-1.5 rounded-lg backdrop-blur-md transition ${
              inComparison
                ? 'bg-indigo-600 text-white'
                : 'bg-black/60 text-slate-300 hover:text-white hover:bg-black/80'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Category Pill on bottom of image */}
        <div className="absolute bottom-2 left-2.5">
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-900/80 text-slate-300 backdrop-blur-xs border border-slate-700/60">
            {product.category}
          </span>
        </div>

        {/* AI Opportunity Score */}
        <div className="absolute bottom-2 right-2.5">
          <ScoreBadge score={product.score.total} isProvisional={product.score.isProvisional} />
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Store Name & Rating */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="flex items-center gap-1 truncate max-w-[65%]">
              <Store className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{product.storeName}</span>
            </span>
            <span className="flex items-center gap-1 font-mono text-amber-400">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 text-[10px]">({formatCompact(product.soldCount)} terjual)</span>
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-xs font-semibold text-slate-100 line-clamp-2 leading-snug group-hover:text-indigo-300 transition">
            {product.name}
          </h3>
        </div>

        {/* Price & Commission Grid */}
        <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1.5">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-sm font-bold font-mono text-white">
                {formatIDR(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="ml-1.5 text-[10px] text-slate-400 line-through">
                  {formatIDR(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              {product.commissionRate}% Komisi
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/60">
            <span className="text-slate-400">Est. Komisi / order:</span>
            <span className="font-mono font-semibold text-emerald-400">
              {formatIDR(estCommissionPerSale)}
            </span>
          </div>
        </div>

        {/* Growth & Trend status */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <TrendBadge status={product.trendStatus} rate={displayedGrowth} />
          </div>
          <CompetitionBadge level={product.competitionLevel} />
        </div>

        {/* Bottom Fast Action Buttons */}
        <div className="pt-2 border-t border-slate-800/80 grid grid-cols-3 gap-1.5">
          <button
            onClick={handleAiContent}
            title="Generate Script UGC & Copywriting"
            className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-[11px] font-medium transition border border-indigo-500/30 hover:border-indigo-500"
          >
            <Wand2 className="w-3 h-3" />
            <span>AI Script</span>
          </button>

          <button
            onClick={handleCalculator}
            title="Hitung Simulasi Komisi"
            className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition border border-slate-700"
          >
            <Calculator className="w-3 h-3 text-emerald-400" />
            <span>Profit</span>
          </button>

          <a
            href={product.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Buka link resmi produk"
            className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition border border-slate-700"
          >
            <ExternalLink className="w-3 h-3 text-sky-400" />
            <span>Toko</span>
          </a>
        </div>
      </div>
    </div>
  );
};
