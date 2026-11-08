import React from 'react';
import { useApp, AppModule } from '../../contexts/AppContext';
import {
  LayoutDashboard,
  Compass,
  TrendingUp,
  Video,
  ShoppingBag,
  Hash,
  Calculator,
  Users2,
  Sparkles,
  Wand2,
  GitCompare,
  Bookmark,
  History,
  Database,
  Settings,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Flame,
  Bot,
} from 'lucide-react';

interface NavItem {
  id: AppModule;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
  section?: string;
}

export const Sidebar: React.FC<{ isCollapsed: boolean; toggleCollapse: () => void; isMobileOpen: boolean; closeMobile: () => void }> = ({
  isCollapsed,
  toggleCollapse,
  isMobileOpen,
  closeMobile,
}) => {
  const { activeModule, setActiveModule, watchlist, selectedComparisonIds, userProfile, isDemoMode } = useApp();

  const navItems: NavItem[] = [
    { section: 'UTAMA', id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Product Explorer', label: 'Product Explorer', icon: Compass },
    { id: 'Trending Products', label: 'Trending Products', icon: TrendingUp, badge: 'HOT', badgeColor: 'bg-rose-500/20 text-rose-300' },
    
    { section: 'ANALISIS MARKETPLACE', id: 'TikTok Shop Analysis', label: 'TikTok Shop', icon: Video },
    { id: 'Shopee Analysis', label: 'Shopee Indonesia', icon: ShoppingBag },
    { id: 'Hashtag Intelligence', label: 'Hashtag Intelligence', icon: Hash },

    { section: 'PROFIT & STRATEGI', id: 'Affiliate Profit Calculator', label: 'Profit Calculator', icon: Calculator },
    { id: 'Competitor Analysis', label: 'Competitor Analysis', icon: Users2 },
    { id: 'Product Comparison', label: 'Product Comparison', icon: GitCompare, badge: selectedComparisonIds.length > 0 ? selectedComparisonIds.length : undefined, badgeColor: 'bg-indigo-500/30 text-indigo-300' },

    { section: 'AI ENGINE & KONTEN', id: 'AI Product Score', label: 'AI Product Score', icon: Sparkles },
    { id: 'AI Content Generator', label: 'AI Content Generator', icon: Wand2, badge: 'AI', badgeColor: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold' },

    { section: 'MONITORING & DATA', id: 'Watchlist', label: 'Watchlist', icon: Bookmark, badge: watchlist.length > 0 ? watchlist.length : undefined, badgeColor: 'bg-emerald-500/20 text-emerald-300' },
    { id: 'Historical Analytics', label: 'Historical Analytics', icon: History },
    { id: 'Data Sources', label: 'Data Sources', icon: Database },

    { section: 'SISTEM', id: 'Settings', label: 'Settings', icon: Settings },
    { id: 'Admin Panel', label: 'Admin Panel', icon: ShieldAlert, badge: userProfile.role === 'Super Admin' ? 'SUPER' : undefined, badgeColor: 'bg-amber-500/20 text-amber-300' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#070b1a] border-r border-slate-800/80 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 bg-[#060916]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-teal-400 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Flame className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
              </div>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                  Affiliate Profit <span className="text-indigo-400 font-extrabold text-[10px] px-1 py-0.2 bg-indigo-500/10 border border-indigo-500/20 rounded">AI</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                  TikTok Shop + Shopee
                </span>
              </div>
            )}
          </div>

          <button
            onClick={toggleCollapse}
            aria-label={isCollapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
            className="hidden lg:flex w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 custom-scroll">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;

            return (
              <React.Fragment key={item.id}>
                {/* Section title */}
                {!isCollapsed && item.section && (
                  <div className={`px-2 text-[10px] font-semibold text-slate-400 tracking-wider uppercase ${idx === 0 ? 'mb-1' : 'mt-4 mb-1'}`}>
                    {item.section}
                  </div>
                )}

                <button
                  onClick={() => {
                    setActiveModule(item.id);
                    closeMobile();
                  }}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-all group relative ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-300 font-semibold border border-indigo-500/30 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'
                    }`}
                  />

                  {!isCollapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}

                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded ${
                        item.badgeColor || 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Active accent pill */}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-indigo-500 rounded-r" />
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Footer info & Profile */}
        <div className="p-3 border-t border-slate-800/80 bg-[#060916]">
          {isDemoMode && !isCollapsed && (
            <div className="mb-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0"></span>
              <div className="text-[10px] text-amber-300 leading-tight">
                <span className="font-bold">Mode Simulasi Aktif:</span> Data pasar diverifikasi berkala.
              </div>
            </div>
          )}

          <div className="flex items-center gap-2.5">
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-8 h-8 rounded-full border border-slate-700 object-cover shrink-0"
            />
            {!isCollapsed && (
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-semibold text-white truncate">{userProfile.name}</span>
                <span className="text-[10px] text-indigo-400 font-mono truncate">
                  {userProfile.plan} • {userProfile.role}
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
