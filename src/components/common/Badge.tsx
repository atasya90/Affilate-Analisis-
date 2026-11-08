import React from 'react';
import { CompetitionLevel, Marketplace, TrendStatus } from '../../types';
import { TrendingUp, TrendingDown, Minus, Sparkles, CheckCircle2 } from 'lucide-react';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
}) => {
  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5',
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  const variantClasses = {
    default: 'bg-slate-800 text-slate-300 border border-slate-700/60',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
    info: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',
    purple: 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export const MarketplaceBadge: React.FC<{ marketplace: Marketplace; size?: 'xs' | 'sm' | 'md' }> = ({
  marketplace,
  size = 'sm',
}) => {
  if (marketplace === 'TikTok Shop') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded font-semibold tracking-wide ${
          size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5'
        } bg-[#000000] text-white border border-slate-700 shadow-sm`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe]"></span>
        <span>TikTok Shop</span>
      </span>
    );
  }

  if (marketplace === 'Shopee') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded font-semibold tracking-wide ${
          size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5'
        } bg-[#EE4D2D]/15 text-[#ff6b4a] border border-[#EE4D2D]/40 shadow-sm`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#EE4D2D]"></span>
        <span>Shopee</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded font-semibold tracking-wide ${
        size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5'
      } bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-sm`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
      <span>Cross Platform</span>
    </span>
  );
};

export const TrendBadge: React.FC<{ status: TrendStatus; rate?: number | null }> = ({
  status,
  rate,
}) => {
  const rateText = rate !== undefined && rate !== null ? `${rate > 0 ? '+' : ''}${rate}%` : null;

  if (status === 'Rising') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
        <TrendingUp className="w-3 h-3" />
        <span>Rising</span>
        {rateText && <span className="text-[10px] opacity-90">({rateText})</span>}
      </span>
    );
  }

  if (status === 'Declining') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
        <TrendingDown className="w-3 h-3" />
        <span>Declining</span>
        {rateText && <span className="text-[10px] opacity-90">({rateText})</span>}
      </span>
    );
  }

  if (status === 'New Trend') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
        <Sparkles className="w-3 h-3" />
        <span>New Trend</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
      <Minus className="w-3 h-3" />
      <span>Stable</span>
      {rateText && <span className="text-[10px] opacity-80">({rateText})</span>}
    </span>
  );
};

export const ScoreBadge: React.FC<{ score: number; isProvisional?: boolean }> = ({
  score,
  isProvisional,
}) => {
  let color = 'bg-rose-500/20 text-rose-400 border-rose-500/40';
  let label = 'Low';

  if (score >= 80) {
    color = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-950/40';
    label = 'High';
  } else if (score >= 65) {
    color = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    label = 'Good';
  } else if (score >= 50) {
    color = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    label = 'Moderate';
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <div
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-xs font-bold font-mono tracking-tight ${color}`}
      >
        <span>{score}</span>
        <span className="text-[9px] uppercase font-sans font-semibold tracking-wider opacity-75">
          {label}
        </span>
      </div>
      {isProvisional && (
        <span
          title="Data kelengkapan terbatas, skor bersifat provisional"
          className="text-[9px] px-1 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700"
        >
          PROV
        </span>
      )}
    </div>
  );
};

export const CompetitionBadge: React.FC<{ level: CompetitionLevel }> = ({ level }) => {
  if (level === 'Low Competition') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        Low Competition
      </span>
    );
  }
  if (level === 'High Competition') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-800/40">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
        High Competition
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
      Medium Competition
    </span>
  );
};

export const VerifiedBadge: React.FC = () => (
  <span
    title="Data terverifikasi snapshot resmi"
    className="inline-flex items-center gap-0.5 text-[10px] font-medium text-sky-400 bg-sky-950/40 px-1.5 py-0.5 rounded border border-sky-800/40"
  >
    <CheckCircle2 className="w-3 h-3 text-sky-400" />
    <span>Verified</span>
  </span>
);
