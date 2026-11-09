import { Trade } from '../types/trade';
import { calculateStats } from './calculations';
import { exportToExcel, exportToPdf, exportToJson } from './exportImport';

export interface MonthlyArchive {
  monthKey: string; // e.g. "2026-11"
  monthLabel: string; // e.g. "November 2026"
  archivedAt: string; // e.g. "10/11/2026, 05:30"
  isAutoArchived: boolean;
  trades: Trade[];
  stats: {
    totalTrades: number;
    winTrades: number;
    lossTrades: number;
    winRate: number;
    totalPips: number;
    totalPnL: number;
    profitFactor: number | string;
  };
}

const STORAGE_KEY = 'forex_journal_monthly_archives_v1';
const LAST_MONTH_KEY = 'forex_journal_last_active_month_key';

export function getMonthlyArchives(): MonthlyArchive[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load monthly archives:', err);
    return [];
  }
}

export function saveMonthlyArchives(archives: MonthlyArchive[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(archives));
  } catch (err) {
    console.error('Failed to save monthly archives:', err);
  }
}

export function createMonthlyArchive(
  monthKey: string,
  monthLabel: string,
  trades: Trade[],
  isAuto = false
): MonthlyArchive {
  const stats = calculateStats(trades);
  const now = new Date();
  const archivedAt = `${now.toLocaleDateString('id-ID')} ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;

  return {
    monthKey,
    monthLabel,
    archivedAt,
    isAutoArchived: isAuto,
    trades,
    stats: {
      totalTrades: stats.totalTrades,
      winTrades: stats.winTrades,
      lossTrades: stats.lossTrades,
      winRate: stats.winRate,
      totalPips: stats.totalPips,
      totalPnL: stats.totalPnL,
      profitFactor: stats.profitFactor,
    },
  };
}

/**
 * Otomatis mendeteksi pergantian bulan dan mengarsipkan trade bulan lalu
 */
export function checkAndAutoArchiveMonth(currentTrades: Trade[]): {
  archived: boolean;
  archivedMonth?: string;
  totalArchived?: number;
} {
  if (typeof window === 'undefined' || currentTrades.length === 0) {
    return { archived: false };
  }

  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const lastActiveMonthKey = localStorage.getItem(LAST_MONTH_KEY);

  // Jika pertama kali atau belum ada catatan bulan aktif
  if (!lastActiveMonthKey) {
    localStorage.setItem(LAST_MONTH_KEY, currentMonthKey);
    return { archived: false };
  }

  // Jika bulan telah berganti (misal dari 2026-10 ke 2026-11)
  if (lastActiveMonthKey !== currentMonthKey) {
    // Cari trade yang tanggalnya berada di bulan lalu
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const [pastYear, pastMonth] = lastActiveMonthKey.split('-').map(Number);
    const pastMonthLabel = `${monthNames[pastMonth - 1]} ${pastYear}`;

    // Filter trade bulan lalu
    const pastMonthTrades = currentTrades.filter((t) => {
      if (t.tanggal.includes('/')) {
        const parts = t.tanggal.split('/');
        if (parts.length >= 2) {
          const m = parseInt(parts[1], 10);
          const y = parts.length === 3 ? parseInt(parts[2], 10) : now.getFullYear();
          return m === pastMonth && y === pastYear;
        }
      }
      return false;
    });

    const targetTrades = pastMonthTrades.length > 0 ? pastMonthTrades : currentTrades;
    const newArchive = createMonthlyArchive(
      lastActiveMonthKey,
      pastMonthLabel,
      targetTrades,
      true
    );

    const existingArchives = getMonthlyArchives();
    // Cek apakah arsip bulan tersebut sudah ada
    const updated = existingArchives.some((a) => a.monthKey === lastActiveMonthKey)
      ? existingArchives.map((a) => (a.monthKey === lastActiveMonthKey ? newArchive : a))
      : [newArchive, ...existingArchives];

    saveMonthlyArchives(updated);
    localStorage.setItem(LAST_MONTH_KEY, currentMonthKey);

    return {
      archived: true,
      archivedMonth: pastMonthLabel,
      totalArchived: targetTrades.length,
    };
  }

  return { archived: false };
}

/**
 * Buat arsip manual untuk bulan berjalan atau seluruh sheet saat ini
 */
export function manualArchiveCurrentSheet(
  trades: Trade[],
  customLabel?: string
): MonthlyArchive {
  const now = new Date();
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const label = customLabel || `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

  const archive = createMonthlyArchive(monthKey, label, trades, false);
  const archives = getMonthlyArchives();

  const filtered = archives.filter((a) => a.monthKey !== monthKey);
  const updated = [archive, ...filtered];
  saveMonthlyArchives(updated);

  return archive;
}
