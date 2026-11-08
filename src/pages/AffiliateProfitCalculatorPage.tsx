import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { calculateProfitScenarios, formatIDR } from '../utils/calculations';
import {
  Calculator,
  DollarSign,
  TrendingUp,
  Percent,
  MousePointer,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export const AffiliateProfitCalculatorPage: React.FC = () => {
  const {
    products,
    targetProductForCalculator,
    setTargetProductForCalculator,
    setTargetProductForAi,
    setActiveModule,
  } = useApp();

  const [productName, setProductName] = useState(
    targetProductForCalculator?.name || 'Skintific 5X Ceramide Barrier Moisture Gel'
  );
  const [productPrice, setProductPrice] = useState(targetProductForCalculator?.price || 139000);
  const [commissionRate, setCommissionRate] = useState(targetProductForCalculator?.commissionRate || 15);
  const [clicksCount, setClicksCount] = useState(500);
  const [conversionRate, setConversionRate] = useState(2.5); // 2.5%

  // Update when targetProduct changes
  useEffect(() => {
    if (targetProductForCalculator) {
      setProductName(targetProductForCalculator.name);
      setProductPrice(targetProductForCalculator.price);
      setCommissionRate(targetProductForCalculator.commissionRate);
    }
  }, [targetProductForCalculator]);

  const { commissionPerSale, scenarios } = calculateProfitScenarios(
    productPrice,
    commissionRate,
    clicksCount,
    conversionRate
  );

  const handleSelectProduct = (id: string) => {
    const p = products.find((x) => x.id === id);
    if (p) {
      setTargetProductForCalculator(p);
      setProductName(p.name);
      setProductPrice(p.price);
      setCommissionRate(p.commissionRate);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 rounded-2xl bg-[#080d22] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Calculator className="w-3 h-3 text-emerald-400" />
              Interactive Simulation Engine
            </span>
            <span className="text-xs text-slate-400">TikTok Shop & Shopee Affiliate</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1.5">
            Kalkulator Estimasi Profit & Komisi Bersih
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Hitung potensi omset dan pendapatan harian, mingguan, dan bulanan creator dalam berbagai skenario performa konten.
          </p>
        </div>

        {/* Quick select from catalog */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-400 hidden sm:inline">Pilih Cepat:</span>
          <select
            value={targetProductForCalculator?.id || ''}
            onChange={(e) => handleSelectProduct(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white max-w-xs truncate focus:outline-hidden"
          >
            <option value="">Pilih Produk Dari Katalog</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.marketplace})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Simulator Notice Disclaimer (Section H requirement) */}
      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
        <Info className="w-4 h-4 text-amber-400 shrink-0" />
        <p className="text-xs text-amber-300 leading-normal">
          <span className="font-bold">Disclaimer Simulasi:</span> Seluruh hasil kalkulasi merupakan simulasi matematis berdasarkan asumsi traffic dan conversion rate yang Anda tentukan, bukan jaminan pendapatan transaksi riil dari pihak platform.
        </p>
      </div>

      {/* Main Grid: Inputs vs Scenario Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#080d22] border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Parameter Input
          </h3>

          <div className="space-y-3 text-xs">
            {/* Product Name */}
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Nama Produk</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-slate-200 focus:outline-hidden"
              />
            </div>

            {/* Price */}
            <div>
              <label className="text-slate-400 font-semibold block mb-1">
                Harga Produk (IDR): <span className="text-white font-mono font-bold">{formatIDR(productPrice)}</span>
              </label>
              <input
                type="number"
                value={productPrice}
                onChange={(e) => setProductPrice(Math.max(1000, Number(e.target.value)))}
                step="5000"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-slate-200 focus:outline-hidden font-mono"
              />
            </div>

            {/* Commission Rate */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-400 font-semibold">Persentase Komisi Affiliate</label>
                <span className="text-emerald-400 font-mono font-bold">{commissionRate}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="35"
                step="0.5"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Traffic Clicks */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-400 font-semibold">Estimasi Traffic Klik per Hari</label>
                <span className="text-cyan-400 font-mono font-bold">{clicksCount} klik / hari</span>
              </div>
              <input
                type="range"
                min="50"
                max="10000"
                step="50"
                value={clicksCount}
                onChange={(e) => setClicksCount(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>50 klik (Micro)</span>
                <span>1.000 klik (FYP Sedang)</span>
                <span>10.000 klik (Mega Viral)</span>
              </div>
            </div>

            {/* Base Conversion Rate */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-400 font-semibold">Asumsi Conversion Rate (CR)</label>
                <span className="text-indigo-400 font-mono font-bold">{conversionRate}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.1"
                value={conversionRate}
                onChange={(e) => setConversionRate(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Rata-rata CR affiliate TikTok/Shopee Indonesia berkisar antara 1.5% - 4.0%.
              </p>
            </div>
          </div>

          {/* Quick Summary Pill */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Komisi Bersih per Produk:</span>
            <div className="text-lg font-bold font-mono text-emerald-400">
              {formatIDR(commissionPerSale)}
            </div>
            <p className="text-[10px] text-slate-400">
              Setiap 1 pembeli yang checkout menghasilkan Rp {commissionPerSale.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        {/* Right 3 Scenarios */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            Simulasi Skenario Potensi Pendapatan
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {scenarios.map((sc, i) => {
              const borderStyles = [
                'border-slate-800 hover:border-slate-700',
                'border-indigo-500/40 bg-indigo-950/20 shadow-lg shadow-indigo-950/30',
                'border-emerald-500/40 bg-emerald-950/20 shadow-lg shadow-emerald-950/30',
              ][i];

              const titleColors = ['text-slate-200', 'text-indigo-300', 'text-emerald-400'][i];

              return (
                <div
                  key={sc.name}
                  className={`p-4 rounded-2xl bg-[#080d22] border ${borderStyles} flex flex-col justify-between space-y-3 transition`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold uppercase tracking-wider ${titleColors}`}>
                        {sc.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                        CR {sc.conversionRate}%
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 leading-snug">{sc.roiEstimate}</p>
                  </div>

                  <div className="space-y-2 py-2 border-y border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-400">Est. Penjualan / Hari</span>
                      <div className="text-sm font-bold font-mono text-white mt-0.5">
                        {sc.estimatedSales} order
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400">Pendapatan Harian</span>
                      <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
                        {formatIDR(sc.dailyRevenue)}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400">Pendapatan Mingguan</span>
                      <div className="text-sm font-bold font-mono text-cyan-300 mt-0.5">
                        {formatIDR(sc.weeklyRevenue)}
                      </div>
                    </div>
                  </div>

                  <div className="pt-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Proyeksi 30 Hari:</span>
                    <div className="text-base sm:text-lg font-bold font-mono text-emerald-400 mt-0.5 truncate">
                      {formatIDR(sc.monthlyRevenue)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Callout */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-white block">Siap Eksekusi Konten?</span>
              <span className="text-slate-400 text-[11px]">
                Buat script video UGC dengan hook 3 detik yang disesuaikan dengan produk ini.
              </span>
            </div>
            <button
              onClick={() => {
                if (targetProductForCalculator) setTargetProductForAi(targetProductForCalculator);
                setActiveModule('AI Content Generator');
              }}
              className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition shrink-0"
            >
              Generate Script AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
