import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import {
  Settings,
  Sliders,
  Bell,
  Database,
  Shield,
  Check,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { userProfile, isDemoMode, setIsDemoMode } = useApp();

  const [defaultCr, setDefaultCr] = useState<number>(2.5);
  const [defaultCtr, setDefaultCtr] = useState<number>(3.0);
  const [minAlertGrowth, setMinAlertGrowth] = useState<number>(20);
  const [enablePriceDropAlert, setEnablePriceDropAlert] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleClearCache = () => {
    if (confirm('Bersihkan data cache lokal? Halaman akan dimuat ulang.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Banner */}
      <div className="p-5 rounded-2xl bg-[#080d22] border border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
              <Settings className="w-3 h-3 text-slate-400" />
              SaaS Preferences
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1.5">
            Pengaturan Aplikasi & Preferensi Creator
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Sesuaikan parameter kalkulasi profit default, batas sensitivitas notifikasi tren, dan profil akun Anda.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-indigo-600/30"
        >
          {isSaved ? <Check className="w-4 h-4" /> : null}
          <span>{isSaved ? 'Tersimpan!' : 'Simpan Pengaturan'}</span>
        </button>
      </div>

      {/* Group 1: Profil & Akun */}
      <div className="p-5 rounded-2xl bg-[#080d22] border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-400" />
          <span>Profil Pengguna & Hak Akses</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Nama Lengkap</label>
            <input
              type="text"
              defaultValue={userProfile.name}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Email Terdaftar</label>
            <input
              type="email"
              defaultValue={userProfile.email}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Paket Langganan</label>
            <input
              type="text"
              readOnly
              value={`${userProfile.plan} (Aktif)`}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-indigo-300 font-mono font-bold"
            />
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Peran Akses Sistem (RBAC)</label>
            <input
              type="text"
              readOnly
              value={userProfile.role}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-emerald-400 font-mono font-bold"
            />
          </div>
        </div>
      </div>

      {/* Group 2: Asumsi Kalkulasi Default */}
      <div className="p-5 rounded-2xl bg-[#080d22] border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span>Asumsi Standar Affiliate Calculator</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-400 font-semibold">Baseline Conversion Rate (CR)</label>
              <span className="text-emerald-400 font-mono font-bold">{defaultCr}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.1"
              value={defaultCr}
              onChange={(e) => setDefaultCr(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">Nilai standar yang digunakan saat membuka halaman kalkulator.</span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-400 font-semibold">Baseline Click-Through Rate (CTR)</label>
              <span className="text-cyan-400 font-mono font-bold">{defaultCtr}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="15"
              step="0.5"
              value={defaultCtr}
              onChange={(e) => setDefaultCtr(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">Estimasi rasio klik terhadap penonton video ulasan.</span>
          </div>
        </div>
      </div>

      {/* Group 3: Ambang Batas Notifikasi Tren */}
      <div className="p-5 rounded-2xl bg-[#080d22] border border-slate-800 space-y-4 text-xs">
        <h3 className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Bell className="w-4 h-4 text-purple-400" />
          <span>Ambang Batas Peringatan Tren (Notification Thresholds)</span>
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <span className="font-bold text-slate-200 block">Lonjakan Pertumbuhan 7 Hari</span>
              <span className="text-[11px] text-slate-400">
                Kirim notifikasi saat velocity penjualan produk melebihi +{minAlertGrowth}%
              </span>
            </div>
            <input
              type="number"
              value={minAlertGrowth}
              onChange={(e) => setMinAlertGrowth(Number(e.target.value))}
              className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center font-mono text-white"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <span className="font-bold text-slate-200 block">Peringatan Penurunan Harga Produk Watchlist</span>
              <span className="text-[11px] text-slate-400">
                Kirim pemberitahuan saat toko menurunkan harga produk yang sedang dipantau
              </span>
            </div>
            <input
              type="checkbox"
              checked={enablePriceDropAlert}
              onChange={(e) => setEnablePriceDropAlert(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Group 4: Local Storage Cache */}
      <div className="p-5 rounded-2xl bg-[#080d22] border border-slate-800 flex items-center justify-between text-xs">
        <div>
          <span className="font-bold text-slate-200 block">Reset Cache Browser</span>
          <span className="text-slate-400 text-[11px]">
            Hapus snapshot tersimpan di browser dan kembalikan dataset demo awal.
          </span>
        </div>
        <button
          onClick={handleClearCache}
          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-rose-400 border border-slate-700 font-semibold transition"
        >
          Bersihkan Cache
        </button>
      </div>
    </div>
  );
};
