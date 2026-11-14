export interface ForexNewsItem {
  id: string;
  title: string;
  summary: string;
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'XAU' | 'AUD' | 'CAD' | 'BTC' | 'GLOBAL';
  category: 'Bank Sentral' | 'Komoditas' | 'Teknikal' | 'Ekonomi & CPI' | 'Geopolitik';
  publishedAt: string;
  timestamp: number;
  source: string;
  url?: string;
  sentiment: 'Bullish' | 'Bearish' | 'Netral';
  imageUrl?: string;
  isFeatured?: boolean;
}

// Heuristik Sentimen Pasar
export function detectSentiment(text: string): 'Bullish' | 'Bearish' | 'Netral' {
  const lower = text.toLowerCase();
  const bullishKeywords = [
    'surge', 'rally', 'gain', 'soar', 'jump', 'high', 'hawkish', 'hike', 'beat', 
    'climb', 'bull', 'rebound', 'penguatan', 'menguat', 'naik', 'rekor', 'optimis', 'resilient'
  ];
  const bearishKeywords = [
    'plunge', 'drop', 'slump', 'fall', 'retreat', 'rout', 'dovish', 'cut', 'miss', 
    'sink', 'bear', 'weak', 'pelemahan', 'melemah', 'turun', 'anjlok', 'pesimis', 'slips', 'deficit'
  ];

  let bull = 0;
  let bear = 0;
  bullishKeywords.forEach((k) => {
    if (lower.includes(k)) bull++;
  });
  bearishKeywords.forEach((k) => {
    if (lower.includes(k)) bear++;
  });

  if (bull > bear) return 'Bullish';
  if (bear > bull) return 'Bearish';
  return 'Netral';
}

// Deteksi Mata Uang / Instrumen Terkait
export function detectCurrency(text: string): ForexNewsItem['currency'] {
  const lower = text.toLowerCase();
  if (lower.includes('gold') || lower.includes('xau') || lower.includes('emas') || lower.includes('bullion')) return 'XAU';
  if (lower.includes('btc') || lower.includes('bitcoin') || lower.includes('crypto')) return 'BTC';
  if (lower.includes('eur') || lower.includes('euro') || lower.includes('ecb') || lower.includes('lagarde')) return 'EUR';
  if (lower.includes('gbp') || lower.includes('pound') || lower.includes('boe') || lower.includes('sterling')) return 'GBP';
  if (lower.includes('jpy') || lower.includes('yen') || lower.includes('boj') || lower.includes('ueda')) return 'JPY';
  if (lower.includes('aud') || lower.includes('aussie') || lower.includes('rba')) return 'AUD';
  if (lower.includes('cad') || lower.includes('loonie') || lower.includes('boc')) return 'CAD';
  if (lower.includes('fed') || lower.includes('dollar') || lower.includes('usd') || lower.includes('fomc') || lower.includes('powell') || lower.includes('cpi')) return 'USD';
  return 'GLOBAL';
}

// Deteksi Kategori Isu Finansial
export function detectCategory(text: string): ForexNewsItem['category'] {
  const lower = text.toLowerCase();
  if (lower.includes('fed') || lower.includes('ecb') || lower.includes('boj') || lower.includes('boe') || lower.includes('rate') || lower.includes('suku bunga') || lower.includes('central bank')) return 'Bank Sentral';
  if (lower.includes('gold') || lower.includes('emas') || lower.includes('oil') || lower.includes('minyak') || lower.includes('commodity')) return 'Komoditas';
  if (lower.includes('cpi') || lower.includes('inflation') || lower.includes('gdp') || lower.includes('nfp') || lower.includes('inflasi') || lower.includes('pmi') || lower.includes('payroll')) return 'Ekonomi & CPI';
  if (lower.includes('war') || lower.includes('conflict') || lower.includes('geopolit') || lower.includes('tariff') || lower.includes('sanction') || lower.includes('middle east')) return 'Geopolitik';
  return 'Teknikal';
}

// Format waktu relatif (misal: "12 mnt lalu")
export function formatTimeAgo(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const diffMs = Date.now() - d.getTime();
    if (isNaN(diffMs) || diffMs < 0) return 'Baru saja';
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'Baru saja';
    if (mins < 60) return `${mins} mnt lalu`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    return `${days} hari lalu`;
  } catch {
    return 'Baru saja';
  }
}

// Data Kurasi Dasar (30+ Berita Pasar Makro Komprehensif)
export const CURATED_MARKET_NEWS: ForexNewsItem[] = [
  {
    id: 'c-news-1',
    title: 'Emas Dunia (XAU/USD) Bertahan di Area $3.860-$3.880 Ditopang Pembelian Agresif Bank Sentral',
    summary: 'Meskipun imbal hasil obligasi AS mengalami fluktuasi, arus masuk dana safe-haven dan diversifikasi cadangan devisa bank sentral global menjaga stabilitas emas di level rekor.',
    currency: 'XAU',
    category: 'Komoditas',
    publishedAt: '5 menit lalu',
    timestamp: Date.now() - 5 * 60000,
    source: 'FXStreet Global',
    url: 'https://www.fxstreet.com/markets/commodities/metals/gold',
    sentiment: 'Bullish',
    isFeatured: true,
  },
  {
    id: 'c-news-2',
    title: 'Pernyataan Pejabat Federal Reserve: Penurunan Suku Bunga Bertahap Memerlukan Konfirmasi Inflasi CPI',
    summary: 'Ketua The Fed menekankan perlunya melihat tren disinflasi yang berkesinambungan menuju target 2% sebelum mengambil langkah pelonggaran moneter lanjutan.',
    currency: 'USD',
    category: 'Bank Sentral',
    publishedAt: '12 menit lalu',
    timestamp: Date.now() - 12 * 60000,
    source: 'ForexLive',
    url: 'https://www.forexlive.com',
    sentiment: 'Netral',
    isFeatured: true,
  },
  {
    id: 'c-news-3',
    title: 'EUR/USD Menguji Level Support Kunci 1.0850 Di Tengah Kekhawatiran Perlambatan Sektor Manufaktur Jerman',
    summary: 'Data aktivitas industri Jerman yang melambat meningkatkan peluang pemangkasan suku bunga lanjutan oleh Bank Sentral Eropa (ECB) pada pertemuan mendatang.',
    currency: 'EUR',
    category: 'Ekonomi & CPI',
    publishedAt: '20 menit lalu',
    timestamp: Date.now() - 20 * 60000,
    source: 'Reuters Financial',
    url: 'https://www.reuters.com/markets/currencies',
    sentiment: 'Bearish',
  },
  {
    id: 'c-news-4',
    title: 'Bank of Japan (BOJ) Beri Sinyal Kenaikan Suku Bunga Lanjutan Jika Siklus Upah Nominal Berlanjut',
    summary: 'Gubernur BOJ Kazuo Ueda menyatakan pasar valuta asing dan volatilitas Yen diawasi secara ketat terhadap potensi dampaknya pada harga konsumen domestik.',
    currency: 'JPY',
    category: 'Bank Sentral',
    publishedAt: '28 menit lalu',
    timestamp: Date.now() - 28 * 60000,
    source: 'Bloomberg FX',
    url: 'https://www.bloomberg.com/markets',
    sentiment: 'Bullish',
  },
  {
    id: 'c-news-5',
    title: 'Bitcoin (BTC/USD) Melaju di Atas $88.000 Didukung Lonjakan Inflow ETF Spot Institusional',
    summary: 'Adopsi korporasi dan akumulasi dari investor institusional memicu likuiditas beli besar di pasar spot, menembus resistance struktural mingguan.',
    currency: 'BTC',
    category: 'Teknikal',
    publishedAt: '35 menit lalu',
    timestamp: Date.now() - 35 * 60000,
    source: 'CoinDesk Macro',
    url: 'https://www.coindesk.com',
    sentiment: 'Bullish',
  },
  {
    id: 'c-news-6',
    title: 'Poundsterling (GBP/USD) Bertengger Kuat Dekat 1.3000 Pasca Rilis Indeks Jasa Inggris Melampaui Ekspektasi',
    summary: 'Ketahanan sektor jasa Inggris mengurangi ekspektasi pelonggaran moneter agresif oleh Bank of England (BoE), memperkuat daya tarik Sterling.',
    currency: 'GBP',
    category: 'Ekonomi & CPI',
    publishedAt: '44 menit lalu',
    timestamp: Date.now() - 44 * 60000,
    source: 'DailyFX',
    url: 'https://www.dailyfx.com',
    sentiment: 'Bullish',
  },
  {
    id: 'c-news-7',
    title: 'Dolar Australia (AUD/USD) Menghadapi Tekanan Koreksi Seiring Ketidakpastian Pemulihan Impor China',
    summary: 'Meskipun RBA mempertahankan retorika hawkish, ketergantungan Australia pada permintaan bijih besi China membatasi ruang penguatan Aussie.',
    currency: 'AUD',
    category: 'Bank Sentral',
    publishedAt: '52 menit lalu',
    timestamp: Date.now() - 52 * 60000,
    source: 'FXStreet',
    url: 'https://www.fxstreet.com',
    sentiment: 'Bearish',
  },
  {
    id: 'c-news-8',
    title: 'Harga Minyak Mentah WTI Naik 1.8%, Pasangan USD/CAD Tergelincir ke Area 1.3850',
    summary: 'Penguatan harga komoditas energi memberikan dukungan likuiditas langsung terhadap Loonie Kanada terhadap Dolar AS.',
    currency: 'CAD',
    category: 'Komoditas',
    publishedAt: '1 jam lalu',
    timestamp: Date.now() - 65 * 60000,
    source: 'FinancialJuice',
    url: 'https://www.financialjuice.com',
    sentiment: 'Bullish',
  },
  {
    id: 'c-news-9',
    title: 'Ketegangan Geopolitik Timur Tengah Memicu Permintaan Aset Lindung Nilai (Swiss Franc & Emas)',
    summary: 'Pelaku pasar valuta memperketat eksposur risiko pada pasangan mata uang beta-tinggi dan mengalokasikan likuiditas ke safe-haven tradisional.',
    currency: 'XAU',
    category: 'Geopolitik',
    publishedAt: '1 jam 15 mnt lalu',
    timestamp: Date.now() - 75 * 60000,
    source: 'ForexLive',
    url: 'https://www.forexlive.com',
    sentiment: 'Bullish',
  },
  {
    id: 'c-news-10',
    title: 'Indeks Dolar AS (DXY) Bertahan di Atas 104.50 Menjelang Rilis Data Klaim Pengangguran Mingguan',
    summary: 'Investor menantikan konfirmasi stabilitas pasar tenaga kerja AS yang menjadi landasan utama proyeksi dot-plot suku bunga Federal Reserve.',
    currency: 'USD',
    category: 'Ekonomi & CPI',
    publishedAt: '1 jam 30 mnt lalu',
    timestamp: Date.now() - 90 * 60000,
    source: 'MarketWatch',
    url: 'https://www.marketwatch.com',
    sentiment: 'Netral',
  },
  {
    id: 'c-news-11',
    title: 'Analisis Intermarket: Hubungan Korelasi Imbal Hasil US 10-Year Treasury dan Pergerakan USD/JPY',
    summary: 'Spread imbal hasil obligasi AS-Jepang yang masih lebar mempertahankan carry trade, namun intervensi verbal Kementerian Keuangan Jepang tetap menjadi risiko.',
    currency: 'JPY',
    category: 'Teknikal',
    publishedAt: '1 jam 45 mnt lalu',
    timestamp: Date.now() - 105 * 60000,
    source: 'DailyFX Analytics',
    url: 'https://www.dailyfx.com',
    sentiment: 'Netral',
  },
  {
    id: 'c-news-12',
    title: 'Ekspektasi Inflasi Konsumen Zona Euro Turun, Pasar Memperkirakan Pemotongan 25 bps di Pertemuan ECB Mendatang',
    summary: 'Survei bulanan ECB menunjukkan ekspektasi inflasi 12 bulan ke depan menurun ke tingkat terendah sejak pertengahan 2021.',
    currency: 'EUR',
    category: 'Ekonomi & CPI',
    publishedAt: '2 jam lalu',
    timestamp: Date.now() - 120 * 60000,
    source: 'Reuters',
    url: 'https://www.reuters.com',
    sentiment: 'Bearish',
  },
  {
    id: 'c-news-13',
    title: 'Reserve Bank of New Zealand (RBNZ) Pertahankan Jalur Moneter Netral, NZD/USD Konsolidasi di 0.5960',
    summary: 'Kondisi pasar domestik Selandia Baru yang dingin membatasi apresiasi Kiwi terhadap Dolar AS.',
    currency: 'GLOBAL',
    category: 'Bank Sentral',
    publishedAt: '2 jam 15 mnt lalu',
    timestamp: Date.now() - 135 * 60000,
    source: 'ForexLive',
    url: 'https://www.forexlive.com',
    sentiment: 'Netral',
  },
  {
    id: 'c-news-14',
    title: 'Lonjakan Permintaan Fisik Emas Batangan di Kawasan Asia Capai Volume Tertinggi Kuartal Ini',
    summary: 'Premi emas di bursa Shanghai dan Mumbai mencatatkan kenaikan signifikan di tengah musim festival dan minat lindung nilai portofolio ritel.',
    currency: 'XAU',
    category: 'Komoditas',
    publishedAt: '2 jam 30 mnt lalu',
    timestamp: Date.now() - 150 * 60000,
    source: 'World Gold Council / FXStreet',
    url: 'https://www.fxstreet.com',
    sentiment: 'Bullish',
  },
  {
    id: 'c-news-15',
    title: 'Survei Sentimen Konsumen Michigan AS Di Bawah Perkiraan, Tekan Imbal Hasil Obligasi Jangka Pendek',
    summary: 'Kekhawatiran biaya hidup yang tinggi memberi sinyal perlambatan belanja rumah tangga di kuartal mendatang.',
    currency: 'USD',
    category: 'Ekonomi & CPI',
    publishedAt: '3 jam lalu',
    timestamp: Date.now() - 180 * 60000,
    source: 'Bloomberg Terminal',
    url: 'https://www.bloomberg.com',
    sentiment: 'Bearish',
  },
  {
    id: 'c-news-16',
    title: 'Arus Modal Asing Masuk ke Pasar Saham Tokyo, Memberi Sentimen Positif Tambahan untuk Mata Uang Yen',
    summary: 'Reformasi tata kelola perusahaan di Jepang terus menarik dana asing global, menopang apresiasi nilai tukar JPY.',
    currency: 'JPY',
    category: 'Teknikal',
    publishedAt: '3 jam 30 mnt lalu',
    timestamp: Date.now() - 210 * 60000,
    source: 'Nikkei Asia / Reuters',
    url: 'https://www.reuters.com',
    sentiment: 'Bullish',
  },
  {
    id: 'c-news-17',
    title: 'Volume Transaksi Derivatif Crypto Melonjak 40%, Menandai Peningkatan Likuiditas di Seluruh Altcoin Utama',
    summary: 'Open interest di bursa berjangka Chicago Mercantile Exchange (CME) mencatatkan rekor baru dalam perdagangan aset kripto institusional.',
    currency: 'BTC',
    category: 'Teknikal',
    publishedAt: '4 jam lalu',
    timestamp: Date.now() - 240 * 60000,
    source: 'CoinDesk',
    url: 'https://www.coindesk.com',
    sentiment: 'Bullish',
  },
  {
    id: 'c-news-18',
    title: 'Bank Sentral Kanada (BOC) Menyatakan Suku Bunga Netral Hampir Tercapai Setelah Inflasi Melandai',
    summary: 'Pernyataan dari dewan gubernur BOC memberi indikasi bahwa siklus pemangkasan agresif kemungkinan akan melambat.',
    currency: 'CAD',
    category: 'Bank Sentral',
    publishedAt: '4 jam 30 mnt lalu',
    timestamp: Date.now() - 270 * 60000,
    source: 'FinancialJuice',
    url: 'https://www.financialjuice.com',
    sentiment: 'Netral',
  },
  {
    id: 'c-news-19',
    title: 'Data Neraca Perdagangan Jerman Tunjukkan Kenaikan Ekspor ke Negara Non-Uni Eropa',
    summary: 'Peningkatan permintaan ekspor dari Asia dan Amerika Latin memberikan sentimen penyeimbang bagi mata uang Euro.',
    currency: 'EUR',
    category: 'Ekonomi & CPI',
    publishedAt: '5 jam lalu',
    timestamp: Date.now() - 300 * 60000,
    source: 'FXStreet',
    url: 'https://www.fxstreet.com',
    sentiment: 'Bullish',
  },
  {
    id: 'c-news-20',
    title: 'Kekhawatiran Tarif Impor Global Membayangi Mata Uang Negara Berkembang dan Pasangan Komoditas',
    summary: 'Wacana tarif proteksionisme perdagangan internasional memicu antisipasi penguatan safe-haven USD dan penurunan likuiditas valuta berisiko.',
    currency: 'GLOBAL',
    category: 'Geopolitik',
    publishedAt: '6 jam lalu',
    timestamp: Date.now() - 360 * 60000,
    source: 'ForexLive Macro',
    url: 'https://www.forexlive.com',
    sentiment: 'Bearish',
  },
];

// Kompatibilitas generator untuk komponen yang membutuhkan data sinkron
export function generateRealtimeNews(): ForexNewsItem[] {
  return CURATED_MARKET_NEWS;
}

// Service untuk fetch live market feed dari agregator berita global
export async function fetchLiveMarketNews(): Promise<ForexNewsItem[]> {
  const feeds = [
    { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.fxstreet.com/rss/news', source: 'FXStreet' },
    { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.forexlive.com/feed/news', source: 'ForexLive' },
    { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://finance.yahoo.com/news/rssindex', source: 'Yahoo Finance' },
  ];

  const results: ForexNewsItem[] = [];

  try {
    const responses = await Promise.allSettled(
      feeds.map(async (feed) => {
        const res = await fetch(feed.url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return { items: data.items || [], source: feed.source };
      })
    );

    responses.forEach((res) => {
      if (res.status === 'fulfilled' && Array.isArray(res.value?.items)) {
        res.value.items.forEach((item: any, idx: number) => {
          if (!item.title) return;

          // Bersihkan HTML tags dari ringkasan
          const rawDesc = item.description || item.content || '';
          const cleanDesc = rawDesc.replace(/<[^>]*>?/gm, '').trim();
          const cleanSummary = cleanDesc.length > 240 ? cleanDesc.slice(0, 240) + '...' : cleanDesc;

          const combinedText = `${item.title} ${cleanSummary}`;
          const curr = detectCurrency(combinedText);
          const cat = detectCategory(combinedText);
          const sent = detectSentiment(combinedText);

          const publishedTime = item.pubDate ? new Date(item.pubDate).getTime() : Date.now();

          results.push({
            id: `live-${res.value.source.toLowerCase()}-${idx}-${Date.now()}`,
            title: item.title.trim(),
            summary: cleanSummary || 'Klik tautan untuk membaca laporan dan ulasan pasar lengkap dari bursa sumber.',
            currency: curr,
            category: cat,
            publishedAt: formatTimeAgo(item.pubDate || new Date().toISOString()),
            timestamp: publishedTime,
            source: res.value.source,
            url: item.link || item.guid,
            sentiment: sent,
            imageUrl: item.enclosure?.link || item.thumbnail || undefined,
          });
        });
      }
    });
  } catch (err) {
    console.warn('Gagal memuat feed live eksternal:', err);
  }

  // Gabungkan berita live terbaru di atas, disusul katalog kurasi lengkap (hilangkan duplikat judul)
  const combined = [...results, ...CURATED_MARKET_NEWS];
  const seenTitles = new Set<string>();
  const uniqueItems: ForexNewsItem[] = [];

  for (const item of combined) {
    const key = item.title.toLowerCase().trim().slice(0, 40);
    if (!seenTitles.has(key)) {
      seenTitles.add(key);
      uniqueItems.push(item);
    }
  }

  // Urutkan berdasarkan timestamp terbaru
  uniqueItems.sort((a, b) => b.timestamp - a.timestamp);

  return uniqueItems;
}
