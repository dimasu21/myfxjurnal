import { Trade } from '../types/trade';

const STORAGE_KEY = 'forex_trading_journal_data_v2';

// Lembar kosong awal (bersih tanpa dummy data)
export const INITIAL_TRADES: Trade[] = [];

export function getSavedTrades(): Trade[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error loading trades from storage:', e);
    return [];
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

export function clearSavedTrades(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('forex_trading_journal_data_v1'); // Bersihkan v1 lama jika ada
  } catch (e) {
    console.error('Error clearing storage:', e);
  }
}
