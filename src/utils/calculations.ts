import { Trade } from '../types/trade';

/**
 * Menghitung selisih pips berdasarkan jenis pair forex
 */
export function calculatePips(
  pair: string,
  posisi: 'BUY' | 'SELL',
  entry: number,
  exit: number
): number {
  if (!entry || !exit) return 0;

  const cleanPair = pair.toUpperCase().trim();
  const isJpy = cleanPair.includes('JPY');
  const isGold = cleanPair.includes('XAU') || cleanPair.includes('GOLD');
  const isCrypto = cleanPair.includes('BTC') || cleanPair.includes('ETH');

  const diff = posisi === 'BUY' ? exit - entry : entry - exit;

  if (isJpy) {
    // 1 pip = 0.01 JPY
    return parseFloat((diff * 100).toFixed(1));
  } else if (isGold) {
    // 1 pip = 0.10 USD pada Gold (atau 10 pips = $1)
    return parseFloat((diff * 10).toFixed(1));
  } else if (isCrypto) {
    // Untuk crypto tampilkan persentase atau poin
    return parseFloat(diff.toFixed(2));
  } else {
    // Mayoritas pair standar (EUR/USD, GBP/USD dll) 1 pip = 0.0001
    return parseFloat((diff * 10000).toFixed(1));
  }
}

/**
 * Menghitung rasio Risk : Reward (R:R) dari Entry, SL, dan TP
 */
export function calculateRR(
  posisi: 'BUY' | 'SELL',
  entry: number,
  sl: number,
  tp: number
): string {
  if (!entry || !sl || !tp) return '-';

  const risk = posisi === 'BUY' ? entry - sl : sl - entry;
  const reward = posisi === 'BUY' ? tp - entry : entry - tp;

  if (risk <= 0 || reward <= 0) return '-';

  const ratio = (reward / risk).toFixed(2);
  return `1:${ratio}`;
}

/**
 * Hitung ringkasan statistik trading
 */
export function calculateStats(trades: Trade[]) {
  const totalTrades = trades.length;
  if (totalTrades === 0) {
    return {
      totalTrades: 0,
      winTrades: 0,
      lossTrades: 0,
      beTrades: 0,
      winRate: 0,
      totalPips: 0,
      totalPnL: 0,
      avgPipsPerTrade: 0,
      profitFactor: 0,
      bestTradePips: 0,
      worstTradePips: 0,
    };
  }

  const winTrades = trades.filter((t) => t.status === 'WIN' || t.pips > 0).length;
  const lossTrades = trades.filter((t) => t.status === 'LOSS' || t.pips < 0).length;
  const beTrades = trades.filter((t) => t.status === 'BE' || t.pips === 0).length;

  const winRate = totalTrades > 0 ? ((winTrades / totalTrades) * 100).toFixed(1) : '0';

  const totalPips = trades.reduce((acc, curr) => acc + (Number(curr.pips) || 0), 0);
  const totalPnL = trades.reduce((acc, curr) => acc + (Number(curr.pnl) || 0), 0);

  const avgPipsPerTrade = (totalPips / totalTrades).toFixed(1);

  const winPips = trades
    .filter((t) => t.pips > 0)
    .reduce((acc, curr) => acc + curr.pips, 0);
  const lossPips = Math.abs(
    trades.filter((t) => t.pips < 0).reduce((acc, curr) => acc + curr.pips, 0)
  );

  const profitFactor = lossPips > 0 ? (winPips / lossPips).toFixed(2) : winPips > 0 ? '∞' : '0';

  const allPips = trades.map((t) => t.pips);
  const bestTradePips = allPips.length > 0 ? Math.max(...allPips) : 0;
  const worstTradePips = allPips.length > 0 ? Math.min(...allPips) : 0;

  return {
    totalTrades,
    winTrades,
    lossTrades,
    beTrades,
    winRate: Number(winRate),
    totalPips: parseFloat(totalPips.toFixed(1)),
    totalPnL: parseFloat(totalPnL.toFixed(2)),
    avgPipsPerTrade: Number(avgPipsPerTrade),
    profitFactor,
    bestTradePips,
    worstTradePips,
  };
}

