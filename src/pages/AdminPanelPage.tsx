import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Product, Hashtag } from '../types';
import { formatIDR, formatCompact } from '../utils/calculations';
import {
  ShieldAlert,
  Users,
  Database,
  Trash2,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Search,
  Sliders,
} from 'lucide-react';

export const AdminPanelPage: React.FC = () => {
  const {
    userProfile,
    products,
    hashtags,
    syncLogs,
    deleteProduct,
    deleteHashtag,
    cleanDuplicates,
    dataSources,
    setUserRole,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'products' | 'hashtags' | 'logs' | 'users'>('products');
  const [duplicateNotice, setDuplicateNotice] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Role Access Control (Section S & T)
  const isAuthorized = userProfile.role === 'Super Admin' || userProfile.role === 'Admin';

  if (!isAuthorized) {
    return (
      <div className="py-20 text-center bg-[#080d22] rounded-2xl border border-rose-500/30 p-8 space-y-4 max-w-xl mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-white">Akses Terbatas: Hanya Administrator</h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Akun Anda saat ini memiliki peran <span className="font-mono text-amber-400 font-bold">"{userProfile.role}"</span>. Halaman Admin Panel memerlukan otorisasi peran Admin atau Super Admin.
        </p>
        <div className="pt-2">
          <button
            onClick={() => setUserRole('Admin')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            Alihkan Role ke "Admin" (Simulasi)
          </button>
        </div>
      </div>
    );
  }

  const handleCleanDuplicates = () => {
    const res = cleanDuplicates();
    setDuplicateNotice(
      `Pembersihan selesai: ${res.productsRemoved} produk dan ${res.hashtagsRemoved} hashtag duplikat berhasil dihapus.`
    );
    setTimeout(() => setDuplicateNotice(null), 4000);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHashtags = hashtags.filter((h) =>
    h.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 rounded-2xl bg-[#080d22] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-amber-400" />
              RBAC Authorized: {userProfile.role}
            </span>
            <span className="text-xs text-slate-400">Section S Dashboard</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1.5">
            Admin Panel & Kontrol Manajemen Data
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Kelola katalog produk, direktori hashtag, bersihkan data duplikat, dan pantau log sinkronisasi sistem.
          </p>
        </div>

        <button
          onClick={handleCleanDuplicates}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-rose-600/30 cursor-pointer shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Hapus Data Duplikat</span>
        </button>
      </div>

      {/* Duplicate cleaner notice */}
      {duplicateNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{duplicateNotice}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-lg font-bold transition ${
            activeTab === 'products'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Kelola Produk ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('hashtags')}
          className={`px-4 py-2 rounded-lg font-bold transition ${
            activeTab === 'hashtags'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Kelola Hashtag ({hashtags.length})
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-lg font-bold transition ${
            activeTab === 'logs'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Aktivitas Sinkronisasi & Error Logs ({syncLogs.length})
        </button>
      </div>

      {/* TAB 1: KELOLA PRODUK */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase">
              Daftar Produk Terdaftar ({filteredProducts.length})
            </span>
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-slate-400"
              />
            </div>
          </div>

          <div className="bg-[#080d22] rounded-xl border border-slate-800 overflow-hidden shadow-lg">
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#060916] border-b border-slate-800 text-slate-400 text-[10px] uppercase font-semibold">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Nama Produk</th>
                    <th className="p-3">Marketplace</th>
                    <th className="p-3 text-right">Harga</th>
                    <th className="p-3 text-center">Komisi</th>
                    <th className="p-3 text-center">Skor Peluang</th>
                    <th className="p-3 text-center">Aksi Hapus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-900/50 transition">
                      <td className="p-3 text-slate-400 text-[11px]">{p.id}</td>
                      <td className="p-3 font-sans font-semibold text-slate-200 max-w-sm truncate">
                        {p.name}
                      </td>
                      <td className="p-3 font-sans">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {p.marketplace}
                        </span>
                      </td>
                      <td className="p-3 text-right text-white font-bold">{formatIDR(p.price)}</td>
                      <td className="p-3 text-center text-emerald-400 font-bold">{p.commissionRate}%</td>
                      <td className="p-3 text-center text-indigo-300 font-bold">{p.score.total}/100</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => {
                            if (confirm(`Hapus produk "${p.name}"?`)) deleteProduct(p.id);
                          }}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 transition"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KELOLA HASHTAG */}
      {activeTab === 'hashtags' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase">
              Direktori Hashtag Terdaftar ({filteredHashtags.length})
            </span>
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter hashtag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-slate-400"
              />
            </div>
          </div>

          <div className="bg-[#080d22] rounded-xl border border-slate-800 overflow-hidden shadow-lg">
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#060916] border-b border-slate-800 text-slate-400 text-[10px] uppercase font-semibold">
                  <tr>
                    <th className="p-3">Rank</th>
                    <th className="p-3">Hashtag</th>
                    <th className="p-3">Platform</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3 text-right">Volume Konten</th>
                    <th className="p-3 text-center">Aksi Hapus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {filteredHashtags.map((h) => (
                    <tr key={h.id} className="hover:bg-slate-900/50 transition">
                      <td className="p-3 text-slate-400">#{h.ranking}</td>
                      <td className="p-3 font-bold text-indigo-300">{h.tag}</td>
                      <td className="p-3 font-sans text-slate-300">{h.platform}</td>
                      <td className="p-3 font-sans text-slate-300">{h.category}</td>
                      <td className="p-3 text-right text-white font-bold">{formatCompact(h.observedContentCount)}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => {
                            if (confirm(`Hapus hashtag "${h.tag}"?`)) deleteHashtag(h.id);
                          }}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 transition"
                          title="Hapus Hashtag"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SYNC LOGS & ERROR AUDIT */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <span className="text-xs font-bold text-slate-300 uppercase">
            Catatan Sinkronisasi Sistem & Log Pemrosesan
          </span>

          <div className="space-y-2">
            {syncLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-[#080d22] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        log.status === 'Success' ? 'bg-emerald-400' : 'bg-rose-400'
                      }`}
                    />
                    <span className="font-bold text-slate-200">{log.adapter}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400">
                      {log.durationMs}ms
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{log.details}</p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[10px] font-mono text-slate-400">{log.timestamp}</span>
                  <div className="text-[11px] font-mono font-semibold text-emerald-400">
                    {log.recordsProcessed} entri diproses
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
