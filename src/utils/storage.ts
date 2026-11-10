import { Trade } from '../types/trade';

export const STORAGE_KEY = 'forex_trading_journal_data_v2';

export const INITIAL_TRADES: Trade[] = [];

// Fallback jika tidak ada user login
export function getSavedTrades(): Trade[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
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
  } catch (e) {
    console.error('Error clearing storage:', e);
  }
}
