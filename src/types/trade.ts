export type PositionType = 'BUY' | 'SELL';

export type TradeResultStatus = 'WIN' | 'LOSS' | 'BE' | 'OPEN';

export type EmotionType = 
  | 'Percaya Diri' 
  | 'Tenang' 
  | 'Ragu/Cemas' 
  | 'FOMO' 
  | 'Revenge Trade' 
  | 'Serakah' 
  | 'Disiplin';

export type StrategyType =
  | 'SMC / Market Structure'
  | 'Breakout Resistance/Support'
  | 'SnR / Key Level Rejection'
  | 'FVG (Fair Value Gap)'
  | 'Trend Following / Pullback'
  | 'Reversal / Divergence'
  | 'Scalping Momentum'
  | 'News Trading'
  | 'Lainnya';

export interface Trade {
  id: string;
  tanggal: string; // DD/MM/YYYY atau YYYY-MM-DD
  pair: string; // e.g. USD/JPY, XAU/USD, EUR/USD
  posisi: PositionType; // BUY / SELL
  entry: number; // e.g. 148.50
  sl: number; // Stop Loss e.g. 148.20
  tp: number; // Take Profit e.g. 149.10
  exitPrice?: number; // Exit price if closed
  lot: string; // e.g. "1%", "0.5%", "0.10"
  pips: number; // e.g. +45, -20
  pnl?: number; // Profit/Loss in USD e.g. +120, -50
  status: TradeResultStatus; // WIN, LOSS, BE, OPEN
  strategi?: StrategyType | string; // Setup strategi trading
  alasan: string; // e.g. "MA50 Cross + News Positif"
  emosi: EmotionType | string; // e.g. "Percaya Diri"
  evaluasi: string; // Catatan evaluasi akhir / pelajaran
  riskReward?: string; // e.g. "1:2.5"
}

export interface TradeFilter {
  search: string;
  pair: string;
  status: string;
  strategi?: string;
  emosi: string;
  sortBy: 'tanggal' | 'pips' | 'pnl' | 'pair';
  sortOrder: 'asc' | 'desc';
}

