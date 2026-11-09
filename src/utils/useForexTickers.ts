import { useState, useEffect, useRef } from 'react';
import { ForexTicker } from '../types/realtime';

// Base real prices across top forex & commodities
const INITIAL_TICKERS: ForexTicker[] = [
  { pair: 'EUR/USD', bid: 1.0852, ask: 1.0854, change: 0.18, high: 1.0890, low: 1.0830, digits: 4 },
  { pair: 'GBP/USD', bid: 1.2965, ask: 1.2968, change: -0.12, high: 1.3010, low: 1.2940, digits: 4 },
  { pair: 'USD/JPY', bid: 154.35, ask: 154.38, change: 0.42, high: 154.80, low: 153.90, digits: 2 },
  { pair: 'XAU/USD', bid: 2685.40, ask: 2685.90, change: 0.85, high: 2698.00, low: 2670.50, digits: 2 },
  { pair: 'AUD/USD', bid: 0.6580, ask: 0.6582, change: -0.25, high: 0.6620, low: 0.6565, digits: 4 },
  { pair: 'USD/CAD', bid: 1.3910, ask: 1.3913, change: 0.05, high: 1.3950, low: 1.3880, digits: 4 },
  { pair: 'USD/CHF', bid: 0.8845, ask: 0.8848, change: 0.11, high: 0.8880, low: 0.8820, digits: 4 },
  { pair: 'NZD/USD', bid: 0.5960, ask: 0.5963, change: -0.30, high: 0.6010, low: 0.5940, digits: 4 },
  { pair: 'BTC/USD', bid: 88450.0, ask: 88470.0, change: 3.40, high: 89900.0, low: 85200.0, digits: 1 },
];

export function useForexTickers() {
  const [tickers, setTickers] = useState<ForexTicker[]>(INITIAL_TICKERS);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const changedPairsRef = useRef<Set<string>>(new Set());

  // Real-time market tick jitter simulator (subtle realistic pip tick changes every 2.5s)
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setTickers((prev) =>
        prev.map((item) => {
          // 40% chance of ticking this turn
          if (Math.random() > 0.45) return item;

          const pipScale = item.digits === 4 ? 0.0001 : item.digits === 2 ? 0.01 : 1.0;
          const delta = (Math.floor(Math.random() * 5) - 2) * pipScale; // -2 to +2 pips
          const newBid = Math.max(0.0001, parseFloat((item.bid + delta).toFixed(item.digits)));
          const spread = item.digits === 4 ? 0.0002 : item.digits === 2 ? 0.03 : 15;
          const newAsk = parseFloat((newBid + spread).toFixed(item.digits));

          return {
            ...item,
            bid: newBid,
            ask: newAsk,
            high: Math.max(item.high, newBid),
            low: Math.min(item.low, newBid),
          };
        })
      );
      setLastUpdated(new Date());
    }, 2500);

    return () => clearInterval(interval);
  }, [isLive]);

  return { tickers, isLive, setIsLive, lastUpdated };
}

