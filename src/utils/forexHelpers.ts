import { TradingSession, EconomicEvent, LotCalculatorResult } from '../types/realtime';

export function getTradingSessions(now: Date = new Date()): TradingSession[] {
  // Get current UTC hour & minute
  const utcHours = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
  const utcTime = utcHours + utcMinutes / 60;

  // Session definition in UTC:
  // Sydney: 21:00 UTC - 06:00 UTC (Next day)
  // Tokyo: 00:00 UTC - 09:00 UTC
  // London: 08:00 UTC - 16:00 UTC (or 07-15 / 08-16 standard)
  // New York: 13:00 UTC - 22:00 UTC
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
      // Over midnight UTC (e.g., Sydney 21:00 - 06:00)
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
      // Normal range within same UTC day
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
      units: 0,
      pipValue: 0,
    };
  }

  // 1 pip value in USD per 1 Standard Lot (100,000 units):
  // EUR/USD, GBP/USD, AUD/USD, NZD/USD = $10 per pip per lot
  // USD/JPY = ~$6.50 - $10 depending on rate
  // XAU/USD = $10 per pip (0.10 price move = $10 on 100oz standard lot)
  let pipValuePerStandardLot = 10;
  const cleanPair = pair.toUpperCase();
  if (cleanPair.includes('JPY')) {
    pipValuePerStandardLot = 6.6; // approx on USD/JPY 150+
  }

  // riskAmount = standardLots * stopLossPips * pipValuePerStandardLot
  const standardLots = riskAmount / (stopLossPips * pipValuePerStandardLot);
  const roundedStandard = parseFloat(standardLots.toFixed(2));
  const miniLots = parseFloat((standardLots * 10).toFixed(2));
  const microLots = parseFloat((standardLots * 100).toFixed(2));
  const units = Math.round(standardLots * 100000);
  const pipValue = parseFloat((standardLots * pipValuePerStandardLot).toFixed(2));

  return {
    riskAmount: parseFloat(riskAmount.toFixed(2)),
    stopLossPips,
    standardLots: roundedStandard,
    miniLots,
    microLots,
    units,
    pipValue,
  };
}
