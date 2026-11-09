import { Trade } from '../types/trade';

const STORAGE_KEY = 'forex_trading_journal_data_v1';

export const INITIAL_TRADES: Trade[] = [
  {
    id: 'tr-001',
    tanggal: '19/01/2026',
    pair: 'USD/JPY',
    posisi: 'BUY',
    entry: 148.50,
    sl: 148.20,
    tp: 149.10,
    exitPrice: 148.95,
    lot: '1%',
    pips: 45,
    pnl: 45.0,
    status: 'WIN',
    alasan: 'MA50 Cross + News Positif',
    emosi: 'Percaya Diri',
    evaluasi: 'Target TP hampir tercapai sempurna, close manual saat momentum melambat.',
    riskReward: '1:2.00',
  },
  {
    id: 'tr-002',
    tanggal: '19/01/2026',
    pair: 'XAU/USD',
    posisi: 'SELL',
    entry: 2650.0,
    sl: 2655.0,
    tp: 2640.0,
    exitPrice: 2652.0,
    lot: '0.5%',
    pips: -20,
    pnl: -20.0,
    status: 'LOSS',
    alasan: 'RSI Divergence (Lawan Tren)',
    emosi: 'Ragu/Cemas',
    evaluasi: 'Jangan counter-trend saat volume buyer US masih dominan. Disiplin SL terselamatkan.',
    riskReward: '1:2.00',
  },
  {
    id: 'tr-003',
    tanggal: '20/01/2026',
    pair: 'EUR/USD',
    posisi: 'BUY',
    entry: 1.0850,
    sl: 1.0820,
    tp: 1.0900,
    exitPrice: 1.0870,
    lot: '0.1',
    pips: 20,
    pnl: 20.0,
    status: 'WIN',
    alasan: 'Breakout Resistance',
    emosi: 'Tenang',
    evaluasi: 'Eksekusi sangat tenang dan sesuai rule setup 1H.',
    riskReward: '1:1.67',
  },
  {
    id: 'tr-004',
    tanggal: '21/01/2026',
    pair: 'GBP/USD',
    posisi: 'BUY',
    entry: 1.2950,
    sl: 1.2910,
    tp: 1.3030,
    exitPrice: 1.3025,
    lot: '0.5%',
    pips: 75,
    pnl: 75.0,
    status: 'WIN',
    alasan: 'Rejection Key Support + BoS',
    emosi: 'Disiplin',
    evaluasi: 'Entry tepat di demand zone 4H, hold sampai target.',
    riskReward: '1:2.00',
  },
];

export function getSavedTrades(): Trade[] {
  if (typeof window === 'undefined') return INITIAL_TRADES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveTrades(INITIAL_TRADES);
      return INITIAL_TRADES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_TRADES;
  } catch (e) {
    console.error('Error loading trades from storage:', e);
    return INITIAL_TRADES;
  }
}

export function saveTrades(trades: Trade[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
  } catch (e) {
    console.error('Error saving trades to storage:', e);
  }
}
