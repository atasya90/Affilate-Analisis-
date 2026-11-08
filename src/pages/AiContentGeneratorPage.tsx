import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { GeneratedContent, Product } from '../types';
import { generateAiContent } from '../services/api';
import { formatIDR } from '../utils/calculations';
import { MarketplaceBadge } from '../components/common/Badge';
import {
  Wand2,
  Copy,
  Check,
  Download,
  RefreshCw,
  Sparkles,
  Video,
  ShoppingBag,
  Mic,
  Clock,
  Layers,
  ChevronDown,
} from 'lucide-react';

export const AiContentGeneratorPage: React.FC = () => {
  const { products, targetProductForAi, setTargetProductForAi } = useApp();

  const [selectedProductId, setSelectedProductId] = useState<string>(
    targetProductForAi?.id || products[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'tiktok' | 'shopee' | 'voiceover'>('tiktok');
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const handleGenerate = async (targetProd = product) => {
    if (!targetProd) return;
    setIsLoading(true);
    try {
      const result = await generateAiContent(targetProd);
      setContent(result);
    } catch (err) {
      console.error('Error generating content:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (targetProductForAi) {
      setSelectedProductId(targetProductForAi.id);
      handleGenerate(targetProductForAi);
    } else if (product && !content) {
      handleGenerate(product);
    }
  }, [targetProductForAi]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExportText = () => {
    if (!content) return;
    const exportText = `================================================
AFFILIATE CONTENT STRATEGY: ${product.name}
Marketplace: ${product.marketplace} | Harga: Rp ${product.price.toLocaleString('id-ID')} | Komisi: ${product.commissionRate}%
Dibuat: ${new Date().toLocaleString('id-ID')}
================================================

--- 1. TIKTOK CONTENT STRATEGY ---
5 JUDUL VIDEO:
${content.tiktok.titles.map((t, i) => `${i + 1}. ${t}`).join('\n')}

5 HOOK 3 DETIK:
${content.tiktok.hooks.map((h, i) => `${i + 1}. "${h}"`).join('\n')}

3 UGC VIDEO SCRIPTS:
${content.tiktok.ugcScripts.map((s, i) => `\n[${s.title}]\nScene: ${s.scene}\nDialog: "${s.spokenText}"\nVisual: ${s.visualCue}\n`).join('\n')}

CAPTION TIKTOK:
${content.tiktok.caption}

CTA:
${content.tiktok.cta}

HASHTAG TIKTOK:
${content.tiktok.hashtags.join(' ')}

--- 2. SHOPEE CONTENT STRATEGY ---
JUDUL SEO SHOPEE:
${content.shopee.seoTitle}

DESKRIPSI SINGKAT:
${content.shopee.shortPitch}

CAPTION PROMO SHOPEE:
${content.shopee.promotionalCaption}

KATA KUNCI SEO:
${content.shopee.keywords.join(', ')}

HASHTAG SHOPEE:
${content.shopee.hashtags.join(' ')}

--- 3. AI VOICEOVER SCRIPTS ---
10 DETIK:
"${content.voiceovers.duration10s}"

15 DETIK:
"${content.voiceovers.duration15s}"

30 DETIK:
"${content.voiceovers.duration30s}"
`;

    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Affiliate_Content_${product.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-5 rounded-2xl bg-[#080d22] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <Wand2 className="w-3 h-3 text-indigo-400" />
              Gemini 3.8 Flash Copywriting Studio
            </span>
            <span className="text-xs text-slate-400">Gaya Bahasa Natural & Persuasif Indonesia</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1.5">
            AI Content Generator untuk TikTok Shop & Shopee
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Generate otomatis 5 judul, 5 hook 3 detik, 3 script video UGC, optimasi SEO Shopee, dan naskah voiceover siap rekam.
          </p>
        </div>

        {/* Product selector & Generate Button */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <select
            value={product.id}
            onChange={(e) => {
              setSelectedProductId(e.target.value);
              const p = products.find((x) => x.id === e.target.value);
              if (p) {
                setTargetProductForAi(p);
                handleGenerate(p);
              }
            }}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white max-w-xs truncate focus:outline-hidden"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.marketplace})
              </option>
            ))}
          </select>

          <button
            onClick={() => handleGenerate()}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Menulis Konten...' : 'Regenerate AI'}</span>
          </button>

          {content && (
            <button
              onClick={handleExportText}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
              title="Download teks kampanye lengkap"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export TXT</span>
            </button>
          )}
        </div>
      </div>

      {/* Selected Product Pill */}
      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <img src={product.imageUrl} alt={product.name} className="w-9 h-9 rounded-lg object-cover bg-slate-900 shrink-0" />
          <div className="min-w-0">
            <span className="font-bold text-slate-200 block truncate">{product.name}</span>
            <span className="text-[10px] text-slate-400">
              {product.storeName} • {formatIDR(product.price)} • Komisi {product.commissionRate}%
            </span>
          </div>
        </div>
        <MarketplaceBadge marketplace={product.marketplace} size="xs" />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('tiktok')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition ${
            activeTab === 'tiktok'
              ? 'bg-[#00f2fe]/20 text-[#00f2fe] border border-[#00f2fe]/40'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>TikTok Video Strategy</span>
        </button>

        <button
          onClick={() => setActiveTab('shopee')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition ${
            activeTab === 'shopee'
              ? 'bg-[#EE4D2D]/20 text-[#ff6b4a] border border-[#EE4D2D]/40'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Shopee SEO & Promo</span>
        </button>

        <button
          onClick={() => setActiveTab('voiceover')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition ${
            activeTab === 'voiceover'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>AI Voiceover Scripts (10s, 15s, 30s)</span>
        </button>
      </div>

      {/* Content Panels */}
      {!content || isLoading ? (
        <div className="py-20 text-center bg-[#080d22] rounded-2xl border border-slate-800 space-y-3">
          <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
          <h3 className="text-sm font-bold text-white">Gemini sedang menyusun materi copywriting terbaik...</h3>
          <p className="text-xs text-slate-400">Merumuskan hook psikologis dan narasi UGC alami.</p>
        </div>
      ) : activeTab === 'tiktok' ? (
        /* TAB 1: TIKTOK */
        <div className="space-y-5">
          {/* 5 Hooks */}
          <div className="p-5 rounded-2xl bg-[#080d22] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                5 Hook Pembuka (3 Detik Pertama Pencegah Scroll):
              </h3>
              <button
                onClick={() => copyToClipboard(content.tiktok.hooks.join('\n'), 'hooks-all')}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                {copiedKey === 'hooks-all' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'hooks-all' ? 'Tersalin' : 'Salin Semua'}</span>
              </button>
            </div>

            <div className="space-y-2">
              {content.tiktok.hooks.map((h, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-slate-100 font-medium">"{h}"</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(h, `hook-${i}`)}
                    className="p-1.5 rounded bg-slate-900 text-slate-400 hover:text-white transition shrink-0"
                  >
                    {copiedKey === `hook-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 5 Titles */}
          <div className="p-5 rounded-2xl bg-[#080d22] border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              5 Judul Video Clickable (Cover Text):
            </h3>
            <div className="space-y-2">
              {content.tiktok.titles.map((t, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-slate-200 font-medium">{t}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(t, `title-${i}`)}
                    className="p-1.5 rounded bg-slate-900 text-slate-400 hover:text-white transition shrink-0"
                  >
                    {copiedKey === `title-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 3 UGC Video Scripts */}
          <div className="p-5 rounded-2xl bg-[#080d22] border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              3 Format Naskah Video UGC Lengkap:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {content.tiktok.ugcScripts.map((s, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col justify-between space-y-3 text-xs">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="font-bold text-indigo-300">{s.title}</span>
                      <button
                        onClick={() => copyToClipboard(`${s.title}\n\nScene: ${s.scene}\n\nDialog:\n"${s.spokenText}"\n\nVisual Cue: ${s.visualCue}`, `ugc-${i}`)}
                        className="text-slate-400 hover:text-white"
                      >
                        {copiedKey === `ugc-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="mt-2 space-y-2">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Scene Opening:</span>
                        <p className="text-[11px] text-slate-300 mt-0.5">{s.scene}</p>
                      </div>

                      <div>
                        <span className="text-[10px] text-indigo-400 uppercase font-semibold">Teks Dibacakan:</span>
                        <p className="text-[11px] text-slate-100 font-medium mt-0.5 bg-slate-900/80 p-2 rounded border border-slate-800 leading-relaxed">
                          "{s.spokenText}"
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Instruksi Visual (B-Roll):</span>
                        <p className="text-[11px] text-slate-400 mt-0.5 italic">{s.visualCue}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Caption & CTA & Hashtags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#080d22] border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-300">Caption TikTok Engaging</span>
                <button
                  onClick={() => copyToClipboard(content.tiktok.caption, 'tt-caption')}
                  className="text-slate-400 hover:text-white"
                >
                  {copiedKey === 'tt-caption' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-slate-200 bg-slate-950 p-2.5 rounded-lg border border-slate-800 leading-relaxed">
                {content.tiktok.caption}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#080d22] border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-300">Call To Action (CTA) & Hashtags</span>
                <button
                  onClick={() => copyToClipboard(`${content.tiktok.cta}\n\n${content.tiktok.hashtags.join(' ')}`, 'tt-cta')}
                  className="text-slate-400 hover:text-white"
                >
                  {copiedKey === 'tt-cta' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-emerald-400 font-semibold bg-slate-950 p-2 rounded border border-slate-800">
                "{content.tiktok.cta}"
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {content.tiktok.hashtags.map((h, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-mono border border-indigo-500/20">
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'shopee' ? (
        /* TAB 2: SHOPEE */
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#080d22] border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 uppercase">Judul Produk SEO Shopee</span>
              <button
                onClick={() => copyToClipboard(content.shopee.seoTitle, 'shopee-title')}
                className="text-[#ff6b4a] hover:underline flex items-center gap-1"
              >
                {copiedKey === 'shopee-title' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Salin Judul</span>
              </button>
            </div>
            <p className="p-3 rounded-lg bg-slate-950 text-white font-medium border border-slate-800">
              {content.shopee.seoTitle}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#080d22] border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 uppercase">Deskripsi Singkat / Pitch</span>
              <button
                onClick={() => copyToClipboard(content.shopee.shortPitch, 'shopee-pitch')}
                className="text-[#ff6b4a] hover:underline flex items-center gap-1"
              >
                {copiedKey === 'shopee-pitch' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Salin Pitch</span>
              </button>
            </div>
            <p className="p-3 rounded-lg bg-slate-950 text-slate-200 leading-relaxed border border-slate-800">
              {content.shopee.shortPitch}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#080d22] border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 uppercase">Caption Promosi Shopee Video / Feed</span>
              <button
                onClick={() => copyToClipboard(content.shopee.promotionalCaption, 'shopee-promo')}
                className="text-[#ff6b4a] hover:underline flex items-center gap-1"
              >
                {copiedKey === 'shopee-promo' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Salin Caption</span>
              </button>
            </div>
            <p className="p-3 rounded-lg bg-slate-950 text-slate-200 leading-relaxed border border-slate-800">
              {content.shopee.promotionalCaption}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#080d22] border border-slate-800 space-y-2 text-xs">
            <span className="font-bold text-slate-300">Kata Kunci SEO & Tags</span>
            <div className="flex flex-wrap gap-1.5">
              {content.shopee.keywords.map((kw, i) => (
                <span key={i} className="px-2.5 py-1 rounded bg-[#EE4D2D]/10 text-[#ff6b4a] border border-[#EE4D2D]/20 font-medium">
                  {kw}
                </span>
              ))}
              {content.shopee.hashtags.map((h, i) => (
                <span key={i} className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono">
                  {h}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* TAB 3: VOICEOVER */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#080d22] border border-slate-800 flex flex-col justify-between space-y-3 text-xs">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  Script 10 Detik (Express)
                </span>
                <button
                  onClick={() => copyToClipboard(content.voiceovers.duration10s, 'vo-10')}
                  className="text-slate-400 hover:text-white"
                >
                  {copiedKey === 'vo-10' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="mt-3 p-3 rounded-xl bg-slate-950 text-slate-200 leading-relaxed border border-slate-800">
                "{content.voiceovers.duration10s}"
              </p>
            </div>
            <span className="text-[10px] text-slate-400">Cocok untuk video singkat transisi atau reaction clip.</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#080d22] border border-slate-800 flex flex-col justify-between space-y-3 text-xs">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  Script 15 Detik (Reels/Story)
                </span>
                <button
                  onClick={() => copyToClipboard(content.voiceovers.duration15s, 'vo-15')}
                  className="text-slate-400 hover:text-white"
                >
                  {copiedKey === 'vo-15' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="mt-3 p-3 rounded-xl bg-slate-950 text-slate-200 leading-relaxed border border-slate-800">
                "{content.voiceovers.duration15s}"
              </p>
            </div>
            <span className="text-[10px] text-slate-400">Format standar iklan & video komisi tinggi.</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#080d22] border border-slate-800 flex flex-col justify-between space-y-3 text-xs">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  Script 30 Detik (Storytelling)
                </span>
                <button
                  onClick={() => copyToClipboard(content.voiceovers.duration30s, 'vo-30')}
                  className="text-slate-400 hover:text-white"
                >
                  {copiedKey === 'vo-30' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="mt-3 p-3 rounded-xl bg-slate-950 text-slate-200 leading-relaxed border border-slate-800">
                "{content.voiceovers.duration30s}"
              </p>
            </div>
            <span className="text-[10px] text-slate-400">Review mendalam dengan penjelasan problem & testimoni.</span>
          </div>
        </div>
      )}
    </div>
  );
};
