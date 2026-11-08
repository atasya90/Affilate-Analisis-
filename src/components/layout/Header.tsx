import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import {
  Menu,
  Search,
  Bell,
  Check,
  ShieldCheck,
  ChevronDown,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const Header: React.FC<{ openMobileMenu: () => void }> = ({ openMobileMenu }) => {
  const {
    activeModule,
    selectedMarketplace,
    setSelectedMarketplace,
    selectedTimeframe,
    setSelectedTimeframe,
    globalSearch,
    setGlobalSearch,
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    userProfile,
    setUserRole,
    isDemoMode,
    setIsDemoMode,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#060916]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-6 flex items-center justify-between gap-3">
      {/* Left: Mobile hamburger & Active Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={openMobileMenu}
          aria-label="Buka menu navigasi"
          className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm lg:text-base font-bold text-white truncate">{activeModule}</h1>
            {isDemoMode && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                SIMULATED DATA
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-400 hidden md:block">
            Riset Produk TikTok Shop & Shopee Indonesia
          </span>
        </div>
      </div>

      {/* Center: Global Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-2">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari produk, toko, kategori, atau hashtag..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 transition"
          />
          {globalSearch && (
            <button
              onClick={() => setGlobalSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Right: Marketplace Filters, Timeframe, Notifications, Role Switcher */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Marketplace Selector */}
        <div className="hidden sm:flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-0.5 text-xs">
          {(['All', 'TikTok Shop', 'Shopee'] as const).map((mp) => (
            <button
              key={mp}
              onClick={() => setSelectedMarketplace(mp)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                selectedMarketplace === mp
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mp}
            </button>
          ))}
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-0.5 text-xs">
          {(
            [
              { id: '7d', label: '7 Hari' },
              { id: '30d', label: '30 Hari' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTimeframe(t.id)}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition ${
                selectedTimeframe === t.id
                  ? 'bg-slate-800 text-indigo-300 font-bold border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            aria-label="Notifikasi dan peringatan tren"
            className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0a0f26] border border-slate-800 rounded-xl shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white">Notifikasi Tren & Sistem</span>
                {unreadCount > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Tandai semua dibaca
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-800/60 max-h-64 overflow-y-auto mt-2">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationAsRead(notif.id)}
                    className={`py-2 px-1 cursor-pointer transition rounded ${
                      notif.read ? 'opacity-60' : 'bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200">{notif.title}</span>
                      <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{notif.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsRoleOpen(!isRoleOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden xl:inline text-slate-400">Role:</span>
            <span className="font-semibold text-indigo-300">{userProfile.role}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isRoleOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#0a0f26] border border-slate-800 rounded-xl shadow-xl p-1.5 z-50">
              <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase">
                Ganti Role Simulasi
              </div>
              {(['Super Admin', 'Admin', 'User'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setUserRole(r);
                    setIsRoleOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between ${
                    userProfile.role === r
                      ? 'bg-indigo-600/20 text-indigo-300 font-bold'
                      : 'text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <span>{r}</span>
                  {userProfile.role === r && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
