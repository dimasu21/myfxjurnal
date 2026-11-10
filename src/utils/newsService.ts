export interface ForexNewsItem {
  id: string;
  title: string;
  summary: string;
  currency: string;
  category: 'Breaking' | 'Central Bank' | 'Technical' | 'Economic';
  publishedAt: string;
  source: string;
  url?: string;
  sentiment?: 'Bullish' | 'Bearish' | 'Neutral';
}

// Data generator simulasi berita real-time dengan update dinamis
export function generateRealtimeNews(baseDate = new Date()): ForexNewsItem[] {
  const now = baseDate.getTime();

  return [
    {
      id: 'news-1',
      title: 'Pernyataan Pejabat The Fed: Suku Bunga AS Masih Dipantau Ketat Terhadap Data Inflasi CPI',
      summary: 'Ketua Federal Reserve menegaskan bahwa kebijakan moneter berikutnya akan sangat bergantung pada rilis data ketenagakerjaan dan inflasi.',
      currency: 'USD',
      category: 'Central Bank',
      publishedAt: '3 menit lalu',
      source: 'ForexLive',
      sentiment: 'Neutral',
    },
    {
      id: 'news-2',
      title: 'Ekspektasi Pemangkasan Suku Bunga ECB Memicu Tekanan Jual Bertahap pada Pasangan EUR/USD',
      summary: 'Pertumbuhan zona euro yang moderat meningkatkan spekulasi penurunan suku bunga lanjutan oleh Bank Sentral Eropa (ECB).',
      currency: 'EUR',
      category: 'Breaking',
      publishedAt: '8 menit lalu',
      source: 'FXStreet',
      sentiment: 'Bearish',
    },
    {
      id: 'news-3',
      title: 'Harga Emas Dunia (XAU/USD) Berada Dekat Level Tertinggi Seiring Permintaan Safe-Haven',
      summary: 'Ketidakpastian geopolitik global dan diversifikasi cadangan devisa bank sentral terus menopang minat beli emas batangan.',
      currency: 'XAU',
      category: 'Technical',
      publishedAt: '15 menit lalu',
      source: 'DailyFX',
      sentiment: 'Bullish',
    },
    {
      id: 'news-4',
      title: 'Bank of Japan (BOJ) Beri Isyarat Pengetatan Moneter Tambahan Jika Pertumbuhan Upah Stabil',
      summary: 'Gubernur BOJ Ueda menyatakan bahwa ruang kenaikan suku bunga acuan Jepang masih terbuka jika target inflasi 2% tercapai konsisten.',
      currency: 'JPY',
      category: 'Central Bank',
      publishedAt: '28 menit lalu',
      source: 'Reuters FX',
      sentiment: 'Bullish',
    },
    {
      id: 'news-5',
      title: 'Poundsterling (GBP/USD) Bertahan Menguat Ditopang Data Ketahanan Sektor Jasa Inggris',
      summary: 'Aktivitas bisnis sektor jasa Inggris di atas ekspektasi konsensus mengurangi tekanan kekhawatiran resesi teknikal.',
      currency: 'GBP',
      category: 'Economic',
      publishedAt: '42 menit lalu',
      source: 'Bloomberg Terminal',
      sentiment: 'Bullish',
    },
    {
      id: 'news-6',
      title: 'Minyak Mentah Menguat Mendorong Kenaikan Dolar Kanada (CAD) Terhadap Mayoritas Mata Uang',
      summary: 'Kenaikan harga minyak WTI memberi angin segar bagi mata uang komoditas khususnya Loonie Kanada.',
      currency: 'CAD',
      category: 'Technical',
      publishedAt: '1 jam lalu',
      source: 'ForexFactory',
      sentiment: 'Bullish',
    },
    {
      id: 'news-7',
      title: 'Reserve Bank of Australia (RBA) Mempertahankan Suku Bunga Tinggi Lebih Lama Dari Perkiraan',
      summary: 'Inflasi inti Australia yang masih persisten membuat RBA bersikap hawkish dibanding bank sentral negara maju lainnya.',
      currency: 'AUD',
      category: 'Central Bank',
      publishedAt: '2 jam lalu',
      source: 'FinancialJuice',
      sentiment: 'Neutral',
    },
  ];
}
