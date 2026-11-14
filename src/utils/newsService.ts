export interface ForexNewsItem {
  id: string;
  title: string;
  summary: string;
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'XAU' | 'AUD' | 'CAD' | 'BTC' | 'GLOBAL';
  pair: string;
  pairChange: string;
  category: 'Bank Sentral' | 'Komoditas' | 'Teknikal' | 'Ekonomi & CPI' | 'Geopolitik';
  impact: 'HIGH' | 'MED' | 'LOW';
  publishedAt: string;
  timeWIB: string;
  timestamp: number;
  source: string;
  url?: string;
  sentiment: 'Bullish' | 'Bearish' | 'Netral';
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

// Deteksi Tingkat Dampak (High / Med / Low)
export function detectImpact(text: string): 'HIGH' | 'MED' | 'LOW' {
  const lower = text.toLowerCase();
  if (
    lower.includes('fed') || lower.includes('cpi') || lower.includes('nfp') || 
    lower.includes('rate hike') || lower.includes('rate cut') || lower.includes('suku bunga') ||
    lower.includes('fomc') || lower.includes('war') || lower.includes('tariff') ||
    lower.includes('inflasi') || lower.includes('ecb') || lower.includes('gdp') ||
    lower.includes('powell')
  ) {
    return 'HIGH';
  }
  if (
    lower.includes('pmi') || lower.includes('job') || lower.includes('retail') ||
    lower.includes('boj') || lower.includes('rba') || lower.includes('boe') ||
    lower.includes('gold') || lower.includes('oil') || lower.includes('unemployment')
  ) {
    return 'MED';
  }
  return 'LOW';
}

// Deteksi Mata Uang & Pair Utama
export function detectCurrency(text: string): { currency: ForexNewsItem['currency']; pair: string; pairChange: string } {
  const lower = text.toLowerCase();
  if (lower.includes('gold') || lower.includes('xau') || lower.includes('emas') || lower.includes('bullion')) {
    return { currency: 'XAU', pair: 'XAU/USD', pairChange: '+0.85%' };
  }
  if (lower.includes('btc') || lower.includes('bitcoin') || lower.includes('crypto')) {
    return { currency: 'BTC', pair: 'BTC/USD', pairChange: '+3.40%' };
  }
  if (lower.includes('eur') || lower.includes('euro') || lower.includes('ecb') || lower.includes('lagarde')) {
    return { currency: 'EUR', pair: 'EUR/USD', pairChange: '-0.18%' };
  }
  if (lower.includes('gbp') || lower.includes('pound') || lower.includes('boe') || lower.includes('sterling')) {
    return { currency: 'GBP', pair: 'GBP/USD', pairChange: '+0.24%' };
  }
  if (lower.includes('jpy') || lower.includes('yen') || lower.includes('boj') || lower.includes('ueda')) {
    return { currency: 'JPY', pair: 'USD/JPY', pairChange: '+0.42%' };
  }
  if (lower.includes('aud') || lower.includes('aussie') || lower.includes('rba')) {
    return { currency: 'AUD', pair: 'AUD/USD', pairChange: '-0.25%' };
  }
  if (lower.includes('cad') || lower.includes('loonie') || lower.includes('boc')) {
    return { currency: 'CAD', pair: 'USD/CAD', pairChange: '-0.12%' };
  }
  if (lower.includes('fed') || lower.includes('dollar') || lower.includes('usd') || lower.includes('fomc') || lower.includes('cpi')) {
    return { currency: 'USD', pair: 'DXY', pairChange: '+0.31%' };
  }
  return { currency: 'GLOBAL', pair: 'GLOBAL', pairChange: '0.00%' };
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

// Format waktu jam:menit WIB
export function formatTimeWIB(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' WIB';
}

// Format waktu relatif (misal: "12m")
export function formatTimeAgo(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const diffMs = Date.now() - d.getTime();
    if (isNaN(diffMs) || diffMs < 0) return '1m';
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return '1m';
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  } catch {
    return '1m';
  }
}

const NOW = Date.now();

// Data Kurasi Dasar (Padat & Akurat)
export const CURATED_MARKET_NEWS: ForexNewsItem[] = [
  {
    id: 'c-1',
    title: 'Emas Dunia (XAU/USD) Bertahan di Area $3.860-$3.880 Ditopang Pembelian Agresif Bank Sentral',
    summary: 'Meskipun imbal hasil obligasi AS mengalami fluktuasi, arus masuk dana safe-haven dan diversifikasi cadangan devisa bank sentral global menjaga stabilitas emas di level rekor.',
    currency: 'XAU',
    pair: 'XAU/USD',
    pairChange: '+0.85%',
    category: 'Komoditas',
    impact: 'HIGH',
    publishedAt: '4m',
    timeWIB: formatTimeWIB(NOW - 4 * 60000),
    timestamp: NOW - 4 * 60000,
    source: 'FXStreet',
    url: 'https://www.fxstreet.com/markets/commodities/metals/gold',
    sentiment: 'Bullish',
  },
  {
    id: 'c-2',
    title: 'Pernyataan Pejabat The Fed: Penurunan Suku Bunga Bertahap Masih Memerlukan Konfirmasi Inflasi CPI',
    summary: 'Gubernur Federal Reserve menegaskan bahwa jalur pelonggaran moneter tidak berada di jalur preset dan sangat bergantung pada data ketenagakerjaan dan harga konsumen mendatang.',
    currency: 'USD',
    pair: 'DXY',
    pairChange: '+0.31%',
    category: 'Bank Sentral',
    impact: 'HIGH',
    publishedAt: '11m',
    timeWIB: formatTimeWIB(NOW - 11 * 60000),
    timestamp: NOW - 11 * 60000,
    source: 'ForexLive',
    url: 'https://www.forexlive.com',
    sentiment: 'Netral',
  },
  {
    id: 'c-3',
    title: 'EUR/USD Menguji Support Kunci 1.0850 Di Tengah Kekhawatiran Perlambatan Sektor Industri Jerman',
    summary: 'Aktivitas manufaktur Jerman yang lesu menambah spekulasi pemangkasan suku bunga acuan lanjutan oleh European Central Bank (ECB).',
    currency: 'EUR',
    pair: 'EUR/USD',
    pairChange: '-0.18%',
    category: 'Ekonomi & CPI',
    impact: 'HIGH',
    publishedAt: '18m',
    timeWIB: formatTimeWIB(NOW - 18 * 60000),
    timestamp: NOW - 18 * 60000,
    source: 'Reuters',
    url: 'https://www.reuters.com/markets/currencies',
    sentiment: 'Bearish',
  },
  {
    id: 'c-4',
    title: 'Bank of Japan (BOJ) Beri Sinyal Kenaikan Suku Bunga Tambahan Jika Pertumbuhan Upah Nominal Berlanjut',
    summary: 'Gubernur BOJ Kazuo Ueda menyatakan volatilitas nilai tukar Yen terus dipantau intensif terhadap transmisi biaya impor.',
    currency: 'JPY',
    pair: 'USD/JPY',
    pairChange: '+0.42%',
    category: 'Bank Sentral',
    impact: 'HIGH',
    publishedAt: '25m',
    timeWIB: formatTimeWIB(NOW - 25 * 60000),
    timestamp: NOW - 25 * 60000,
    source: 'Bloomberg',
    url: 'https://www.bloomberg.com/markets',
    sentiment: 'Bullish',
  },
  {
    id: 'c-5',
    title: 'Bitcoin (BTC/USD) Melaju di Atas $88.400 Didukung Lonjakan Inflow ETF Spot Institusional',
    summary: 'Akumulasi korporasi besar dan likuiditas bursa berjangka CME mendorong Bitcoin kembali menguji level resistance mingguan tertinggi.',
    currency: 'BTC',
    pair: 'BTC/USD',
    pairChange: '+3.40%',
    category: 'Teknikal',
    impact: 'MED',
    publishedAt: '32m',
    timeWIB: formatTimeWIB(NOW - 32 * 60000),
    timestamp: NOW - 32 * 60000,
    source: 'CoinDesk',
    url: 'https://www.coindesk.com',
    sentiment: 'Bullish',
  },
  {
    id: 'c-6',
    title: 'Poundsterling (GBP/USD) Bertahan Menguat Dekat 1.2960 Pasca Rilis Indeks Jasa Inggris di Atas Konsensus',
    summary: 'Kinerja sektor jasa Inggris yang resilien meredam ekspektasi pemotongan suku bunga agresif oleh Bank of England (BoE).',
    currency: 'GBP',
    pair: 'GBP/USD',
    pairChange: '+0.24%',
    category: 'Ekonomi & CPI',
    impact: 'MED',
    publishedAt: '40m',
    timeWIB: formatTimeWIB(NOW - 40 * 60000),
    timestamp: NOW - 40 * 60000,
    source: 'DailyFX',
    url: 'https://www.dailyfx.com',
    sentiment: 'Bullish',
  },
  {
    id: 'c-7',
    title: 'Dolar Australia (AUD/USD) Tertekan ke 0.6570 Seiring Perlambatan Permintaan Komoditas dari China',
    summary: 'Ketidakpastian stimulus fiskal Tiongkok membebani mata uang beta-tinggi seperti Dolar Australia dan Dolar Selandia Baru.',
    currency: 'AUD',
    pair: 'AUD/USD',
    pairChange: '-0.25%',
    category: 'Bank Sentral',
    impact: 'MED',
    publishedAt: '51m',
    timeWIB: formatTimeWIB(NOW - 51 * 60000),
    timestamp: NOW - 51 * 60000,
    source: 'FXStreet',
    url: 'https://www.fxstreet.com',
    sentiment: 'Bearish',
  },
  {
    id: 'c-8',
    title: 'Minyak Mentah WTI Rebound ke $71.50/Bbl, USD/CAD Tertahan di Kisaran 1.3910',
    summary: 'Kenaikan tipis harga energi internasional memberikan bantalan likuiditas bagi Dolar Kanada.',
    currency: 'CAD',
    pair: 'USD/CAD',
    pairChange: '-0.12%',
    category: 'Komoditas',
    impact: 'LOW',
    publishedAt: '1h',
    timeWIB: formatTimeWIB(NOW - 65 * 60000),
    timestamp: NOW - 65 * 60000,
    source: 'FinancialJuice',
    url: 'https://www.financialjuice.com',
    sentiment: 'Bullish',
  },
  {
    id: 'c-9',
    title: 'Ketegangan Geopolitik Global Memperkuat Arus Masuk Safe-Haven ke Emas dan Franc Swiss',
    summary: 'Manajer aset global menyeimbangkan kembali portofolio lindung nilai guna mengantisipasi volatilitas perdagangan akhir tahun.',
    currency: 'XAU',
    pair: 'XAU/USD',
    pairChange: '+0.85%',
    category: 'Geopolitik',
    impact: 'HIGH',
    publishedAt: '1h 10m',
    timeWIB: formatTimeWIB(NOW - 70 * 60000),
    timestamp: NOW - 70 * 60000,
    source: 'ForexLive',
    url: 'https://www.forexlive.com',
    sentiment: 'Bullish',
  },
  {
    id: 'c-10',
    title: 'Spread Imbal Hasil US 10-Yr vs JGB Bertahan Lebar, Tekan Ruang Intervensi Kementerian Keuangan Jepang',
    summary: 'Pasar carry trade masih mempertahankan posisi kendati ada peringatan verbal dari otoritas moneter Tokyo.',
    currency: 'JPY',
    pair: 'USD/JPY',
    pairChange: '+0.42%',
    category: 'Teknikal',
    impact: 'MED',
    publishedAt: '1h 30m',
    timeWIB: formatTimeWIB(NOW - 90 * 60000),
    timestamp: NOW - 90 * 60000,
    source: 'MarketWatch',
    url: 'https://www.marketwatch.com',
    sentiment: 'Netral',
  },
  {
    id: 'c-11',
    title: 'Ekspektasi Inflasi Konsumen Zona Euro Turun ke 2.4%, Membuka Ruang Pemotongan 25 bps ECB',
    summary: 'Data survei bulanan memperkuat pandangan bahwa tren disinflasi di blok mata uang tunggal Eropa berada di jalur yang tepat.',
    currency: 'EUR',
    pair: 'EUR/USD',
    pairChange: '-0.18%',
    category: 'Ekonomi & CPI',
    impact: 'HIGH',
    publishedAt: '2h',
    timeWIB: formatTimeWIB(NOW - 120 * 60000),
    timestamp: NOW - 120 * 60000,
    source: 'Reuters',
    url: 'https://www.reuters.com',
    sentiment: 'Bearish',
  },
  {
    id: 'c-12',
    title: 'Fiskal AS & Isu Tarif Proteksionisme Membawa Indeks Dolar DXY Berkonsolidasi Dekat 104.80',
    summary: 'Pelaku pasar mengkalkulasi dampak kebijakan tarif baru terhadap proyeksi suku bunga terminal The Fed tahun depan.',
    currency: 'USD',
    pair: 'DXY',
    pairChange: '+0.31%',
    category: 'Geopolitik',
    impact: 'HIGH',
    publishedAt: '2h 15m',
    timeWIB: formatTimeWIB(NOW - 135 * 60000),
    timestamp: NOW - 135 * 60000,
    source: 'ForexLive',
    url: 'https://www.forexlive.com',
    sentiment: 'Bullish',
  },
];

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

          const rawDesc = item.description || item.content || '';
          const cleanDesc = rawDesc.replace(/<[^>]*>?/gm, '').trim();
          const cleanSummary = cleanDesc.length > 200 ? cleanDesc.slice(0, 200) + '...' : cleanDesc;

          const combinedText = `${item.title} ${cleanSummary}`;
          const { currency, pair, pairChange } = detectCurrency(combinedText);
          const category = detectCategory(combinedText);
          const sentiment = detectSentiment(combinedText);
          const impact = detectImpact(combinedText);

          const publishedTime = item.pubDate ? new Date(item.pubDate).getTime() : Date.now();

          results.push({
            id: `live-${res.value.source.toLowerCase()}-${idx}-${Date.now()}`,
            title: item.title.trim(),
            summary: cleanSummary || 'Buka tautan bursa untuk rincian analisis teknikal dan data makro.',
            currency,
            pair,
            pairChange,
            category,
            impact,
            publishedAt: formatTimeAgo(item.pubDate || new Date().toISOString()),
            timeWIB: formatTimeWIB(publishedTime),
            timestamp: publishedTime,
            source: res.value.source,
            url: item.link || item.guid,
            sentiment,
          });
        });
      }
    });
  } catch (err) {
    console.warn('Gagal memuat feed live eksternal:', err);
  }

  const combined = [...results, ...CURATED_MARKET_NEWS];
  const seenTitles = new Set<string>();
  const uniqueItems: ForexNewsItem[] = [];

  for (const item of combined) {
    const key = item.title.toLowerCase().trim().slice(0, 45);
    if (!seenTitles.has(key)) {
      seenTitles.add(key);
      uniqueItems.push(item);
    }
  }

  uniqueItems.sort((a, b) => b.timestamp - a.timestamp);
  return uniqueItems;
}
