export interface ForexTicker {
  pair: string;
  bid: number;
  ask: number;
  change: number; // percentage change
  high: number;
  low: number;
  digits: number;
}

export interface TradingSession {
  name: string;
  city: string;
  flag: string;
  openUtc: number; // UTC hour e.g. 0 = 00:00 UTC
  closeUtc: number;
  tzName: string;
  status: 'OPEN' | 'CLOSED';
  progress: number; // 0 to 100% of session completed
  closesIn: string; // e.g. "3 jam 20 mnt"
  opensIn: string;
}

export interface EconomicEvent {
  id: string;
  dayOffset: number; // 0 = Hari ini, 1 = Besok, 2 = Lusa, 3 = Hari ke-3
  dateLabel: string; // e.g. "Hari Ini (Selasa, 10 Nov)"
  dateFormatted: string; // "10/11/2026"
  time: string; // HH:mm
  currency: string;
  country: string;
  flag: string;
  title: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  actual: string;
  forecast: string;
  previous: string;
  status: 'UPCOMING' | 'RELEASED' | 'IMMINENT';
  countdown: string;
}

export interface LotCalculatorResult {
  riskAmount: number;
  stopLossPips: number;
  standardLots: number;
  miniLots: number;
  microLots: number;
  centLots: number;
  units: number;
  pipValue: number;
  recommendedLot: string;
  brokerMinNote?: string;
  isSmallAccount: boolean;
}
