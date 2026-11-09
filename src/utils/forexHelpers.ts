import { TradingSession, EconomicEvent, LotCalculatorResult } from '../types/realtime';

export function getTradingSessions(now: Date = new Date()): TradingSession[] {
  const utcHours = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
  const utcTime = utcHours + utcMinutes / 60;

  const rawSessions = [
    { name: 'Sydney', city: 'Australia', flag: '🇦🇺', openUtc: 21, closeUtc: 6, tzName: 'AEST (UTC+10)' },
    { name: 'Tokyo', city: 'Asia', flag: '🇯🇵', openUtc: 0, closeUtc: 9, tzName: 'JST (UTC+9)' },
    { name: 'London', city: 'Eropa', flag: '🇬🇧', openUtc: 8, closeUtc: 16, tzName: 'BST/GMT (UTC+1)' },
    { name: 'New York', city: 'Amerika', flag: '🇺🇸', openUtc: 13, closeUtc: 22, tzName: 'EST/EDT (UTC-4)' },
  ];

  return rawSessions.map((s) => {
    let isOpen = false;
    let progress = 0;
    let closesIn = '';
    let opensIn = '';

    if (s.openUtc > s.closeUtc) {
      isOpen = utcTime >= s.openUtc || utcTime < s.closeUtc;
      const totalDuration = 24 - s.openUtc + s.closeUtc;
      if (isOpen) {
        const elapsed = utcTime >= s.openUtc ? utcTime - s.openUtc : 24 - s.openUtc + utcTime;
        progress = Math.min(100, Math.round((elapsed / totalDuration) * 100));
        const remHours = s.closeUtc > utcTime ? s.closeUtc - utcTime : 24 - utcTime + s.closeUtc;
        closesIn = `${Math.floor(remHours)}j ${Math.round((remHours % 1) * 60)}m`;
      } else {
        const waitHours = s.openUtc - utcTime;
        opensIn = `${Math.floor(waitHours)}j ${Math.round((waitHours % 1) * 60)}m`;
      }
    } else {
      isOpen = utcTime >= s.openUtc && utcTime < s.closeUtc;
      const totalDuration = s.closeUtc - s.openUtc;
      if (isOpen) {
        const elapsed = utcTime - s.openUtc;
        progress = Math.min(100, Math.round((elapsed / totalDuration) * 100));
        const remHours = s.closeUtc - utcTime;
        closesIn = `${Math.floor(remHours)}j ${Math.round((remHours % 1) * 60)}m`;
      } else {
        const waitHours = utcTime < s.openUtc ? s.openUtc - utcTime : 24 - utcTime + s.openUtc;
        opensIn = `${Math.floor(waitHours)}j ${Math.round((waitHours % 1) * 60)}m`;
      }
    }

    return {
      name: s.name,
      city: s.city,
      flag: s.flag,
      openUtc: s.openUtc,
      closeUtc: s.closeUtc,
      tzName: s.tzName,
      status: isOpen ? 'OPEN' : 'CLOSED',
      progress,
      closesIn,
      opensIn,
    };
  });
}

export const SAMPLE_ECONOMIC_EVENTS: EconomicEvent[] = [
  {
    id: 'eco-1',
    time: '14:30',
    currency: 'USD',
    country: 'United States',
    flag: '🇺🇸',
    title: 'Core CPI (MoM) / Inflasi Inti AS',
    impact: 'HIGH',
    actual: '0.3%',
    forecast: '0.3%',
    previous: '0.3%',
  },
  {
    id: 'eco-2',
    time: '19:00',
    currency: 'USD',
    country: 'United States',
    flag: '🇺🇸',
    title: 'FOMC Meeting Minutes / Risalah The Fed',
    impact: 'HIGH',
    actual: 'Hawkish',
    forecast: '-',
    previous: '-',
  },
  {
    id: 'eco-3',
    time: '13:00',
    currency: 'GBP',
    country: 'United Kingdom',
    flag: '🇬🇧',
    title: 'BOE Gov Bailey Speaks / Pidato Gubernur BOE',
    impact: 'HIGH',
    actual: '-',
    forecast: '-',
    previous: '-',
  },
  {
    id: 'eco-4',
    time: '10:00',
    currency: 'EUR',
    country: 'European Union',
    flag: '🇪🇺',
    title: 'ECB President Lagarde Speech',
    impact: 'MEDIUM',
    actual: '-',
    forecast: '-',
    previous: '-',
  },
  {
    id: 'eco-5',
    time: '06:30',
    currency: 'JPY',
    country: 'Japan',
    flag: '🇯🇵',
    title: 'BoJ Core CPI (YoY)',
    impact: 'MEDIUM',
    actual: '2.1%',
    forecast: '2.0%',
    previous: '2.0%',
  },
  {
    id: 'eco-6',
    time: '20:30',
    currency: 'USD',
    country: 'United States',
    flag: '🇺🇸',
    title: 'Crude Oil Inventories',
    impact: 'LOW',
    actual: '+2.1M',
    forecast: '+1.5M',
    previous: '-1.8M',
  },
];

export function calculateLotSize(
  accountBalance: number,
  riskPercent: number,
  stopLossPips: number,
  pair: string = 'EUR/USD'
): LotCalculatorResult {
  const riskAmount = (accountBalance * riskPercent) / 100;

  if (stopLossPips <= 0 || riskAmount <= 0) {
    return {
      riskAmount: 0,
      stopLossPips: 0,
      standardLots: 0,
      miniLots: 0,
      microLots: 0,
      centLots: 0,
      units: 0,
      pipValue: 0,
      recommendedLot: '0.01 Lot',
      isSmallAccount: false,
    };
  }

  // 1 pip value in USD per 1 Standard Lot (100,000 units):
  let pipValuePerStandardLot = 10;
  const cleanPair = pair.toUpperCase();
  if (cleanPair.includes('JPY')) {
    pipValuePerStandardLot = 6.6; // approx on USD/JPY 150+
  }

  // Raw lot calculation
  const rawStandard = riskAmount / (stopLossPips * pipValuePerStandardLot);
  
  // Format with high precision to prevent $10 balance from rounding to 0.00
  const standardLots = rawStandard < 0.01 
    ? parseFloat(rawStandard.toFixed(4))
    : parseFloat(rawStandard.toFixed(2));
    
  const miniLots = parseFloat((rawStandard * 10).toFixed(3));
  const microLots = parseFloat((rawStandard * 100).toFixed(2));
  const centLots = parseFloat((rawStandard * 100).toFixed(2)); // Cent account standard
  const units = Math.max(1, Math.round(rawStandard * 100000));
  const pipValue = parseFloat((rawStandard * pipValuePerStandardLot).toFixed(4));

  const isSmallAccount = rawStandard < 0.01;
  let recommendedLot = '';
  let brokerMinNote = '';

  if (isSmallAccount) {
    // Pada modal kecil seperti $10:
    recommendedLot = '0.01 Lot';
    brokerMinNote = `Untuk modal $${accountBalance}, lot matematis adalah ${rawStandard.toFixed(4)} Lot. Pada broker standar MT4/MT5, minimum order adalah 0.01 Lot ($0.10/pip). Jika menggunakan Akun Cent (USC), gunakan ${centLots > 0 ? centLots : '0.10'} Cent Lot agar risiko tetap presisi ${riskPercent}% ($${riskAmount.toFixed(2)})!`;
  } else {
    recommendedLot = `${standardLots} Lot`;
  }

  return {
    riskAmount: parseFloat(riskAmount.toFixed(2)),
    stopLossPips,
    standardLots,
    miniLots,
    microLots,
    centLots,
    units,
    pipValue,
    recommendedLot,
    brokerMinNote,
    isSmallAccount,
  };
}
