import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { DataSourceAdapter, Product, Hashtag } from '../types';
import { calculateGrowthRate, calculateProductOpportunityScore, classifyTrendStatus } from '../utils/calculations';
import {
  Database,
  RefreshCw,
  Key,
  Upload,
  Download,
  CheckCircle2,
  AlertTriangle,
  Server,
  FileSpreadsheet,
  X,
  FileText,
  Sliders,
} from 'lucide-react';

export const DataSourcesPage: React.FC = () => {
  const {
    dataSources,
    triggerSync,
    updateAdapterConfig,
    importProducts,
    importHashtags,
  } = useApp();

  const [activeConfigAdapter, setActiveConfigAdapter] = useState<DataSourceAdapter | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  // CSV Import State
  const [csvPreviewType, setCsvPreviewType] = useState<'product' | 'hashtag'>('product');
  const [csvPreviewRows, setCsvPreviewRows] = useState<any[]>([]);
  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSync = async (adapterId: string) => {
    setSyncingId(adapterId);
    try {
      await triggerSync(adapterId);
    } finally {
      setSyncingId(null);
    }
  };

  // Download official CSV template
  const downloadTemplate = (type: 'product' | 'hashtag') => {
    let content = '';
    let filename = '';

    if (type === 'product') {
      filename = 'template_product_import.csv';
      content =
        'product_id,product_name,marketplace,category,price,sold_count,commission_rate,rating,review_count,product_url,snapshot_date\n' +
        'imp-001,"Lip Tint Glossy Longwear",Shopee,"Beauty",45000,12500,18,4.8,2400,"https://shopee.co.id/sample","2026-11-07"\n' +
        'imp-002,"Pembersih Wajah Salicylic Acid 100ml","TikTok Shop","Skincare",65000,28900,15,4.9,5300,"https://shop.tiktok.com/sample","2026-11-07"';
    } else {
      filename = 'template_hashtag_import.csv';
      content =
        'hashtag,platform,category,observed_content_count,search_interest,snapshot_date,source_type\n' +
        '"#racunskincareindo","TikTok","Skincare",45200,88,"2026-11-07","Observed Content Volume"\n' +
        '"#shopeehaulid","Shopee","Produk Viral",38900,82,"2026-11-07","Observed Content Volume"';
    }

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle CSV file upload & parsing
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.trim().split('\n');
      if (lines.length < 2) {
        setImportStatus('File CSV kosong atau tidak memiliki baris data.');
        return;
      }

      const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
      const isProductFile = headers.includes('product_id') || headers.includes('price');

      setCsvPreviewType(isProductFile ? 'product' : 'hashtag');

      const parsed = lines.slice(1).map((line, idx) => {
        // Simple regex parse for commas inside quotes
        const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
        const row: Record<string, string> = { _rowId: String(idx) };
        headers.forEach((h, i) => {
          row[h] = (values[i] || '').replace(/^"|"$/g, '').trim();
        });
        return row;
      });

      setCsvPreviewRows(parsed);
      setImportStatus(`Berhasil membaca ${parsed.length} baris data dari ${file.name}. Silakan periksa preview.`);
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (csvPreviewRows.length === 0) return;

    if (csvPreviewType === 'product') {
      const newProducts: Product[] = csvPreviewRows.map((r, i) => {
        const price = Number(r.price) || 50000;
        const commissionRate = Number(r.commission_rate) || 10;
        const soldCount = Number(r.sold_count) || 1000;

        const scoreRes = calculateProductOpportunityScore({
          growth7d: 20,
          popularity30d: 75,
          soldCount,
          commissionRate,
          competitionLevel: 'Medium Competition',
          hashtagScore: 70,
        });

        return {
          id: r.product_id || `imp-prod-${Date.now()}-${i}`,
          name: r.product_name || `Produk Impor #${i + 1}`,
          storeName: 'Seller Terverifikasi',
          marketplace: r.marketplace === 'Shopee' ? 'Shopee' : 'TikTok Shop',
          category: (r.category as any) || 'Produk Viral',
          price,
          soldCount,
          rating: Number(r.rating) || 4.8,
          reviewCount: Number(r.review_count) || 250,
          commissionRate,
          productUrl: r.product_url || 'https://shopee.co.id',
          imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80',
          lastUpdated: '2026-11-07 19:30 WIB',
          isVerified: true,
          isDemoData: false,
          snapshots: [
            {
              date: '2026-11-07',
              price,
              soldCount,
              popularityScore: 80,
              rating: 4.8,
              reviewCount: 250,
              commissionRate,
            },
          ],
          growth7d: 20,
          growth30d: 45,
          trendStatus: 'Rising',
          competitionLevel: 'Medium Competition',
          competitorStoreCount: 45,
          score: {
            total: scoreRes.total,
            level: scoreRes.level,
            isProvisional: scoreRes.isProvisional,
            dataCompleteness: scoreRes.dataCompleteness,
            breakdown: scoreRes.breakdown,
            explanation: 'Produk berhasil diimpor melalui integrasi modul CSV Importer.',
          },
          relatedHashtags: ['#racuntiktok', '#racunshopee'],
        };
      });

      importProducts(newProducts);
      setImportStatus(`Sukses mengimpor ${newProducts.length} produk ke dalam katalog!`);
    } else {
      const newHashtags: Hashtag[] = csvPreviewRows.map((r, i) => ({
        id: `imp-tag-${Date.now()}-${i}`,
        tag: r.hashtag || '#tagimpor',
        platform: (r.platform as any) || 'TikTok',
        category: (r.category as any) || 'Produk Viral',
        observedContentCount: Number(r.observed_content_count) || 10000,
        volumeChange7d: 15,
        volumeChange30d: 35,
        popularityScore: Number(r.search_interest) || 75,
        ranking: 99,
        trendStatus: 'Rising',
        lastUpdated: '2026-11-07 19:30 WIB',
        indicatorType: (r.source_type as any) || 'Observed Content Volume',
        snapshots: [],
        isDemoData: false,
      }));

      importHashtags(newHashtags);
      setImportStatus(`Sukses mengimpor ${newHashtags.length} hashtag baru!`);
    }

    setCsvPreviewRows([]);
    setCsvFileName(null);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 rounded-2xl bg-[#080d22] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
              <Database className="w-3 h-3 text-cyan-400" />
              Hybrid Data Source Architecture
            </span>
            <span className="text-xs text-slate-400">Section P & Q Engine</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1.5">
            Manajemen Sumber Data & Integrasi API
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Arsitektur modular mendukung API resmi TikTok Shop & Shopee, Google Trends, serta import spreadsheet CSV/Excel pengguna.
          </p>
        </div>
      </div>

      {/* 7 Modular Adapters Grid (Section P) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataSources.map((adapter) => {
          const isSyncing = syncingId === adapter.id;
          return (
            <div
              key={adapter.id}
              className="p-4 rounded-xl bg-[#080d22] border border-slate-800 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate max-w-[70%]">
                    {adapter.name}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                      adapter.status === 'Connected' || adapter.status === 'Ready'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : adapter.status === 'Syncing'
                        ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30 animate-pulse'
                        : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {adapter.status}
                  </span>
                </div>

                <span className="text-[10px] text-indigo-400 font-mono block mt-0.5">
                  Type: {adapter.type}
                </span>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {adapter.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Data Terindeks:</span>
                  <span className="font-mono font-bold text-slate-200">
                    {adapter.itemsIndexed} entri
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span>Sinkronisasi Terakhir:</span>
                  <span className="font-mono text-[11px] text-slate-300">
                    {adapter.lastSync || 'Belum tersinkron'}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleSync(adapter.id)}
                    disabled={isSyncing}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-indigo-500/30 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Sync Sekarang'}</span>
                  </button>

                  {adapter.requiresConfig && (
                    <button
                      onClick={() => setActiveConfigAdapter(adapter)}
                      className="py-1.5 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-1 transition"
                      title="Atur Kredensial API"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>Konfigurasi</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section Q: CSV Import & Export Studio */}
      <div className="p-5 rounded-2xl bg-[#080d22] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              CSV Import & Export Engine (Format Section Q)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Impor data riset eksternal dengan format terstandarisasi atau unduh template resmi.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadTemplate('product')}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Template Produk CSV</span>
            </button>
            <button
              onClick={() => downloadTemplate('hashtag')}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Template Hashtag CSV</span>
            </button>
          </div>
        </div>

        {/* Upload Dropzone */}
        <div className="p-6 rounded-xl bg-slate-950/80 border-2 border-dashed border-slate-800 hover:border-indigo-500/50 transition text-center space-y-3">
          <Upload className="w-8 h-8 text-indigo-400 mx-auto" />
          <div>
            <span className="text-xs font-bold text-white block">Unggah Berkas CSV Anda</span>
            <span className="text-[11px] text-slate-400">
              Format UTF-8 didukung. Sistem akan mendeteksi tipe data (Produk atau Hashtag) secara otomatis.
            </span>
          </div>
          <div>
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer shadow-md transition">
              <span>Pilih File CSV</span>
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
          {csvFileName && (
            <div className="text-xs text-indigo-300 font-mono">File Terpilih: {csvFileName}</div>
          )}
        </div>

        {/* Status Message */}
        {importStatus && (
          <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{importStatus}</span>
          </div>
        )}

        {/* Preview Table & Confirm Button */}
        {csvPreviewRows.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase">
                Preview Data ({csvPreviewRows.length} Baris - Tipe: {csvPreviewType.toUpperCase()})
              </span>
              <button
                onClick={handleConfirmImport}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md shadow-emerald-600/30"
              >
                Konfirmasi & Impor ke Database
              </button>
            </div>

            <div className="rounded-xl border border-slate-800 overflow-x-auto max-h-60 bg-slate-950">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#060916] border-b border-slate-800 text-slate-400 text-[10px]">
                  <tr>
                    {Object.keys(csvPreviewRows[0] || {})
                      .filter((k) => k !== '_rowId')
                      .map((k) => (
                        <th key={k} className="p-2.5">
                          {k}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {csvPreviewRows.slice(0, 10).map((row, i) => (
                    <tr key={i} className="hover:bg-slate-900/40">
                      {Object.entries(row)
                        .filter(([k]) => k !== '_rowId')
                        .map(([k, val]) => (
                          <td key={k} className="p-2.5 text-slate-300 whitespace-nowrap">
                            {String(val)}
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* API Credential Configuration Modal */}
      {activeConfigAdapter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#090e24] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-indigo-400" />
                  Konfigurasi Kredensial {activeConfigAdapter.name}
                </h3>
                <span className="text-[11px] text-slate-400">
                  Kredensial disimpan terenkripsi di server side.
                </span>
              </div>
              <button
                onClick={() => setActiveConfigAdapter(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {activeConfigAdapter.configFields.map((field) => (
                <div key={field.key}>
                  <label className="text-slate-300 font-semibold block mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.isSecret ? 'password' : 'text'}
                    placeholder={field.placeholder}
                    defaultValue={field.value || ''}
                    onChange={(e) =>
                      updateAdapterConfig(activeConfigAdapter.id, field.key, e.target.value)
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-hidden"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setActiveConfigAdapter(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                Tutup & Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
