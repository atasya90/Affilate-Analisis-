import { GeneratedContent, Product } from '../types';

export async function generateAiContent(product: Product): Promise<GeneratedContent> {
  try {
    const response = await fetch('/api/ai/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productName: product.name,
        category: product.category,
        marketplace: product.marketplace,
        price: product.price,
        commissionRate: product.commissionRate,
        relatedHashtags: product.relatedHashtags,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const json = await response.json();
    return {
      productId: product.id,
      productName: product.name,
      createdAt: new Date().toISOString(),
      tiktok: json.data.tiktok,
      shopee: json.data.shopee,
      voiceovers: json.data.voiceovers,
    };
  } catch (err) {
    console.warn('Backend API request failed, using local generator fallback', err);
    // Client-side fallback generator to ensure UI never breaks
    return {
      productId: product.id,
      productName: product.name,
      createdAt: new Date().toISOString(),
      tiktok: {
        titles: [
          `Jangan beli ${product.name} sebelum tonton video ini!`,
          `Rekomendasi ${product.category} viral paling worth it di 2026`,
          `Spill harga promo cuma Rp ${product.price.toLocaleString('id-ID')}!`,
          `Beneran sebagus itu atau cuma viral doang? Review jujur!`,
          `Creator wajib punya ini buat racun TikTok Shop!`,
        ],
        hooks: [
          `Stop scrolling! Kalau kamu lagi cari ${product.category}, ini solusinya!`,
          `Aku gak nyangka dengan Rp ${product.price.toLocaleString('id-ID')} bisa dapet kualitas sekeren ini!`,
          `Ini rahasia kenapa produk ini sold out terus di live shopping!`,
          `Cuma butuh 3 detik buat sadar kalau produk ini beneran game-changer!`,
          `Nyesel banget baru nemu sekarang, padahal udah viral berbulan-bulan!`,
        ],
        ugcScripts: [
          {
            title: 'Konsep 1: Unboxing & First Impression',
            scene: 'Creator unboxing paket rapi di atas meja estetik.',
            spokenText: `Akhirnya paket yang ditunggu-tunggu sampai juga! Ini dia ${product.name}. Kemasannya aman banget dan pas dibuka, build quality-nya mewah!`,
            visualCue: 'Tunjukkan segel dibuka, detail fisik produk disorot makro.',
          },
          {
            title: 'Konsep 2: Live Demo Penggunaan',
            scene: 'Creator mempraktikkan langsung penggunaan produk.',
            spokenText: `Banyak yang nanya cara pakainya ribet gak? Jawabannya simpel banget. Tinggal aplikasiin kayak gini, hasilnya langsung kerasa!`,
            visualCue: 'Tunjukkan before-after secara natural tanpa filter berlebih.',
          },
          {
            title: 'Konsep 3: Urgensi Flash Sale & Diskon',
            scene: 'Creator menunjuk keranjang kuning di kiri bawah.',
            spokenText: `Kabar baiknya, hari ini lagi ada voucher potongan ekstra dan subsidi gratis ongkir. Jangan nunggu harganya balik normal ya!`,
            visualCue: 'Teks bergerak menunjuk ikon keranjang kuning.',
          },
        ],
        caption: `Kalian wajib cobain ${product.name}! Asli gak kaleng-kaleng. Jangan lupa klaim voucher diskon di keranjang kuning yaa! 👇✨`,
        cta: 'Checkout sekarang di keranjang kuning pojok kiri bawah!',
        hashtags: [
          '#racuntiktok',
          '#spillracun',
          '#affiliatetiktok',
          '#reviewjujur',
          `#${product.category.toLowerCase().replace(/\s+/g, '')}`,
        ],
      },
      shopee: {
        seoTitle: `[ORIGINAL] ${product.name} - Termurah Garansi Resmi Cashback Xtra`,
        shortPitch: `Dapatkan ${product.name} dengan jaminan originalitas dan pengiriman super cepat. Telah dipercaya puluhan ribu pembeli setia di seluruh Indonesia.`,
        promotionalCaption: `Gunakan voucher gratis ongkir dan koin Shopee sekarang juga untuk harga termurah!`,
        keywords: [
          product.name.split(' ').slice(0, 3).join(' '),
          product.category,
          'gratis ongkir',
          'cashback shopee',
          'racun shopee haul',
        ],
        hashtags: ['#racunshopee', '#shopeehaul', '#spillracunshopee', '#shopeeid'],
      },
      voiceovers: {
        duration10s: `Butuh ${product.category} berkualitas tanpa bikin kantong jebol? Cek ${product.name} sekarang!`,
        duration15s: `Ini alasan kenapa ${product.name} jadi pilihan utama ribuan creator. Kualitas terjamin dan bergaransi!`,
        duration30s: `Capek beli barang yang kualitasnya gak sesuai ekspektasi? Cobain ${product.name}. Harga terjangkau, fungsi maksimal, dan udah banyak bintang lima. Klik tombol belanja sekarang!`,
      },
    };
  }
}

export async function explainAiScore(product: Product): Promise<string> {
  try {
    const res = await fetch('/api/ai/score-explanation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productName: product.name,
        score: product.score.total,
        growth7d: product.growth7d || 0,
        commissionRate: product.commissionRate,
        competitionLevel: product.competitionLevel,
      }),
    });
    const json = await res.json();
    return json.explanation || product.score.explanation || '';
  } catch (err) {
    return (
      product.score.explanation ||
      `Produk "${product.name}" memperoleh skor ${product.score.total}/100 dari performa pertumbuhan 7 hari sebesar ${product.growth7d ?? 0}%, margin komisi ${product.commissionRate}%, dan tingkat persaingan ${product.competitionLevel}.`
    );
  }
}

export async function syncAdapterApi(adapterId: string): Promise<string> {
  try {
    const res = await fetch(`/api/data-sources/sync/${adapterId}`, { method: 'POST' });
    const json = await res.json();
    return json.syncedAt || new Date().toLocaleTimeString('id-ID') + ' WIB';
  } catch (err) {
    return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
  }
}
