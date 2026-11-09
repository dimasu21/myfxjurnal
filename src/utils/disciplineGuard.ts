import { Trade } from '../types/trade';

export interface DisciplineWarning {
  id: string;
  type: 'OVERTRADING' | 'REVENGE_TRADING' | 'LOSS_STREAK' | 'HIGH_RISK';
  severity: 'DANGER' | 'WARNING';
  title: string;
  message: string;
  tradeCount?: number;
}

export function evaluateDiscipline(trades: Trade[]): DisciplineWarning[] {
  const warnings: DisciplineWarning[] = [];
  if (trades.length === 0) return warnings;

  // 1. Deteksi Overtrading (lebih dari 4 trade pada tanggal yang sama)
  const tradesByDate: { [date: string]: number } = {};
  trades.forEach((t) => {
    tradesByDate[t.tanggal] = (tradesByDate[t.tanggal] || 0) + 1;
  });

  Object.entries(tradesByDate).forEach(([date, count]) => {
    if (count >= 5) {
      warnings.push({
        id: `overtrading-${date}`,
        type: 'OVERTRADING',
        severity: 'DANGER',
        title: `Peringatan Overtrading (${count} Trade pada ${date})`,
        message: `Anda membuka ${count} posisi dalam 1 hari. Trader pro membatasi 1-3 setup A+ per hari untuk menjaga kejernihan analisa.`,
        tradeCount: count,
      });
    } else if (count >= 4) {
      warnings.push({
        id: `overtrading-warn-${date}`,
        type: 'OVERTRADING',
        severity: 'WARNING',
        title: `Batas Harian Tercapai (${count} Trade pada ${date})`,
        message: `Sudah mencapai 4 trade dalam sehari. Pertimbangkan untuk menutup chart hari ini.`,
        tradeCount: count,
      });
    }
  });

  // 2. Deteksi Loss Streak (3x Loss beruntun)
  let currentLossStreak = 0;
  for (let i = 0; i < Math.min(trades.length, 5); i++) {
    if (trades[i].pips < 0 || trades[i].status === 'LOSS') {
      currentLossStreak++;
    } else if (trades[i].pips > 0) {
      break;
    }
  }

  if (currentLossStreak >= 3) {
    warnings.push({
      id: 'loss-streak-alert',
      type: 'LOSS_STREAK',
      severity: 'DANGER',
      title: `Loss Streak: ${currentLossStreak}x Berturut-turut!`,
      message: `Terjadi ${currentLossStreak} kekalahan beruntun. Segera STOP trading, matikan chart, dan lakukan evaluasi psikologi sebelum membuka posisi baru.`,
    });
  }

  // 3. Deteksi Emosi Berbahaya (Revenge / FOMO)
  const recentEmotionalTrades = trades.slice(0, 3).filter(
    (t) => t.emosi === 'Revenge Trade' || t.emosi === 'FOMO' || t.emosi === 'Serakah'
  );

  if (recentEmotionalTrades.length > 0) {
    warnings.push({
      id: 'revenge-alert',
      type: 'REVENGE_TRADING',
      severity: 'DANGER',
      title: `Deteksi Emosi Berbahaya: ${recentEmotionalTrades[0].emosi}`,
      message: `Trade terakhir dicatat dengan status psikologis "${recentEmotionalTrades[0].emosi}". Hindari membuka posisi baru sampai kondisi emosi kembali tenang.`,
    });
  }

  return warnings;
}
