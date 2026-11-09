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

export function generateMultiDayEconomicCalendar(now: Date = new Date()): EconomicEvent[] {
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  const getDayInfo = (offset: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + offset);
    const dayName = dayNames[d.getDay()];
    const dateNum = d.getDate();
    const monthName = monthNames[d.getMonth()];
    const year = d.getFullYear();
    const dateFormatted = `${String(dateNum).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${year}`;
    
    let label = '';
    if (offset === 0) label = `Hari Ini (${dayName}, ${dateNum} ${monthName})`;
    else if (offset === 1) label = `Besok (${dayName}, ${dateNum} ${monthName})`;
    else if (offset === 2) label = `Lusa (${dayName}, ${dateNum} ${monthName})`;
    else label = `${dayName} (${dateNum} ${monthName})`;

    return { offset, d, dayName, dateNum, monthName, year, dateFormatted, label };
  };

  const day0 = getDayInfo(0);
  const day1 = getDayInfo(1);
  const day2 = getDayInfo(2);
  const day3 = getDayInfo(3);

  // Helper to compute event status & countdown
  const getEventTiming = (offset: number, timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const eventDate = new Date(now);
    eventDate.setDate(eventDate.getDate() + offset);
    eventDate.setHours(hours, minutes, 0, 0);

    const diffMs = eventDate.getTime() - now.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < -120) {
      return { status: 'RELEASED' as const, countdown: 'Sudah Rilis' };
    } else if (diffMinutes < 0) {
      return { status: 'RELEASED' as const, countdown: `Rilis ${Math.abs(diffMinutes)}m lalu` };
    } else if (diffMinutes <= 30) {
      return { status: 'IMMINENT' as const, countdown: `⚡ Rilis dalam ${diffMinutes} mnt!` };
    } else if (diffMinutes < 1440 && offset === 0) {
      const h = Math.floor(diffMinutes / 60);
      const m = diffMinutes % 60;
      return { status: 'UPCOMING' as const, countdown: `Rilis dalam ${h}j ${m}m` };
    } else if (offset === 1) {
      return { status: 'UPCOMING' as const, countdown: `Besok jam ${timeStr}` };
    } else {
      return { status: 'UPCOMING' as const, countdown: `${dayNames[eventDate.getDay()]} ${timeStr}` };
    }
  };

  const rawEvents = [
    // HARI INI
    {
      id: 'eco-0-1',
      day: day0,
      time: '14:00',
      currency: 'GBP',
      country: 'United Kingdom',
      flag: '🇬🇧',
      title: 'Claimant Count Change / Data Pengangguran UK',
      impact: 'HIGH' as const,
      actual: '16.5K',
      forecast: '19.2K',
      previous: '22.0K',
    },
    {
      id: 'eco-0-2',
      day: day0,
      time: '16:00',
      currency: 'EUR',
      country: 'European Union',
      flag: '🇪🇺',
      title: 'ZEW Economic Sentiment (Sentimen Ekonomi Jerman)',
      impact: 'MEDIUM' as const,
      actual: '12.8',
      forecast: '13.2',
      previous: '13.1',
    },
    {
      id: 'eco-0-3',
      day: day0,
      time: '19:30',
      currency: 'USD',
      country: 'United States',
      flag: '🇺🇸',
      title: 'Core CPI (MoM & YoY) / Inflasi Konsumen Inti AS',
      impact: 'HIGH' as const,
      actual: '0.3%',
      forecast: '0.3%',
      previous: '0.3%',
    },
    {
      id: 'eco-0-4',
      day: day0,
      time: '21:00',
      currency: 'USD',
      country: 'United States',
      flag: '🇺🇸',
      title: 'Fed Chair Powell Speech / Pidato Ketua The Fed Jerome Powell',
      impact: 'HIGH' as const,
      actual: 'Live Broadcast',
      forecast: '-',
      previous: '-',
    },
    {
      id: 'eco-0-5',
      day: day0,
      time: '22:30',
      currency: 'USD',
      country: 'United States',
      flag: '🇺🇸',
      title: '10-Year Note Auction',
      impact: 'LOW' as const,
      actual: '4.42%',
      forecast: '-',
      previous: '4.35%',
    },

    // BESOK
    {
      id: 'eco-1-1',
      day: day1,
      time: '07:30',
      currency: 'AUD',
      country: 'Australia',
      flag: '🇦🇺',
      title: 'Wage Price Index q/q (Indeks Pertumbuhan Upah)',
      impact: 'MEDIUM' as const,
      actual: '-',
      forecast: '0.8%',
      previous: '0.8%',
    },
    {
      id: 'eco-1-2',
      day: day1,
      time: '13:00',
      currency: 'GBP',
      country: 'United Kingdom',
      flag: '🇬🇧',
      title: 'GDP Monthly Estimate / Estimasi Pertumbuhan Ekonomi',
      impact: 'HIGH' as const,
      actual: '-',
      forecast: '0.2%',
      previous: '0.1%',
    },
    {
      id: 'eco-1-3',
      day: day1,
      time: '19:30',
      currency: 'USD',
      country: 'United States',
      flag: '🇺🇸',
      title: 'Core PPI (MoM) / Indeks Harga Produsen Inti',
      impact: 'HIGH' as const,
      actual: '-',
      forecast: '0.2%',
      previous: '0.2%',
    },
    {
      id: 'eco-1-4',
      day: day1,
      time: '20:30',
      currency: 'USD',
      country: 'United States',
      flag: '🇺🇸',
      title: 'Crude Oil Inventories (Cadangan Minyak Mentah EIA)',
      impact: 'MEDIUM' as const,
      actual: '-',
      forecast: '+1.8M',
      previous: '+2.1M',
    },
    {
      id: 'eco-1-5',
      day: day1,
      time: '01:00',
      currency: 'USD',
      country: 'United States',
      flag: '🇺🇸',
      title: 'FOMC Meeting Minutes / Risalah Rapat Suku Bunga The Fed',
      impact: 'HIGH' as const,
      actual: '-',
      forecast: '-',
      previous: '-',
    },

    // LUSA
    {
      id: 'eco-2-1',
      day: day2,
      time: '06:30',
      currency: 'JPY',
      country: 'Japan',
      flag: '🇯🇵',
      title: 'BOJ Core CPI (YoY) / Inflasi Inti Bank of Japan',
      impact: 'MEDIUM' as const,
      actual: '-',
      forecast: '2.1%',
      previous: '2.0%',
    },
    {
      id: 'eco-2-2',
      day: day2,
      time: '14:45',
      currency: 'EUR',
      country: 'European Union',
      flag: '🇪🇺',
      title: 'ECB President Lagarde Speech / Konferensi Pers ECB',
      impact: 'HIGH' as const,
      actual: '-',
      forecast: '-',
      previous: '-',
    },
    {
      id: 'eco-2-3',
      day: day2,
      time: '19:30',
      currency: 'USD',
      country: 'United States',
      flag: '🇺🇸',
      title: 'Initial Jobless Claims (Klaim Pengangguran Awal AS)',
      impact: 'HIGH' as const,
      actual: '-',
      forecast: '215K',
      previous: '217K',
    },
    {
      id: 'eco-2-4',
      day: day2,
      time: '19:30',
      currency: 'USD',
      country: 'United States',
      flag: '🇺🇸',
      title: 'Core Retail Sales (MoM) / Penjualan Ritel AS',
      impact: 'HIGH' as const,
      actual: '-',
      forecast: '0.4%',
      previous: '0.4%',
    },

    // HARI KE-3 (JUMAT / AKHIR PEKAN)
    {
      id: 'eco-3-1',
      day: day3,
      time: '13:00',
      currency: 'GBP',
      country: 'United Kingdom',
      flag: '🇬🇧',
      title: 'UK Retail Sales m/m',
      impact: 'MEDIUM' as const,
      actual: '-',
      forecast: '0.3%',
      previous: '0.2%',
    },
    {
      id: 'eco-3-2',
      day: day3,
      time: '19:30',
      currency: 'USD',
      country: 'United States',
      flag: '🇺🇸',
      title: 'Non-Farm Employment Change (NFP) & Unemployment Rate',
      impact: 'HIGH' as const,
      actual: '-',
      forecast: '185K',
      previous: '223K',
    },
    {
      id: 'eco-3-3',
      day: day3,
      time: '21:00',
      currency: 'USD',
      country: 'United States',
      flag: '🇺🇸',
      title: 'Prelim UoM Consumer Sentiment (Sentimen Konsumen Michigan)',
      impact: 'HIGH' as const,
      actual: '-',
      forecast: '72.5',
      previous: '70.5',
    },
  ];

  return rawEvents.map((ev) => {
    const timing = getEventTiming(ev.day.offset, ev.time);
    return {
      id: ev.id,
      dayOffset: ev.day.offset,
      dateLabel: ev.day.label,
      dateFormatted: ev.day.dateFormatted,
      time: ev.time,
      currency: ev.currency,
      country: ev.country,
      flag: ev.flag,
      title: ev.title,
      impact: ev.impact,
      actual: ev.actual,
      forecast: ev.forecast,
      previous: ev.previous,
      status: timing.status,
      countdown: timing.countdown,
    };
  });
}

export const SAMPLE_ECONOMIC_EVENTS: EconomicEvent[] = generateMultiDayEconomicCalendar();

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
