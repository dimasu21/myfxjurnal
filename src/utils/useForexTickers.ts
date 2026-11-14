import { useState, useEffect, useRef } from 'react';
import { ForexTicker } from '../types/realtime';

// Akurat sesuai harga pasar spot terkini
const INITIAL_TICKERS: ForexTicker[] = [
  { pair: 'XAU/USD', bid: 3862.80, ask: 3863.30, change: 1.15, high: 3885.00, low: 3840.20, digits: 2 },
  { pair: 'EUR/USD', bid: 1.1038, ask: 1.1040, change: 0.12, high: 1.1085, low: 1.1010, digits: 4 },
  { pair: 'GBP/USD', bid: 1.3220, ask: 1.3223, change: -0.15, high: 1.3270, low: 1.3190, digits: 4 },
  { pair: 'USD/JPY', bid: 159.80, ask: 159.83, change: 0.35, high: 160.20, low: 159.20, digits: 2 },
  { pair: 'AUD/USD', bid: 0.6779, ask: 0.6781, change: -0.20, high: 0.6820, low: 0.6750, digits: 4 },
  { pair: 'USD/CAD', bid: 1.4260, ask: 1.4263, change: 0.08, high: 1.4295, low: 1.4220, digits: 4 },
  { pair: 'USD/CHF', bid: 0.8386, ask: 0.8389, change: 0.05, high: 0.8420, low: 0.8350, digits: 4 },
  { pair: 'NZD/USD', bid: 0.5527, ask: 0.5530, change: -0.28, high: 0.5570, low: 0.5500, digits: 4 },
  { pair: 'BTC/USD', bid: 66330.0, ask: 66350.0, change: 2.45, high: 67200.0, low: 65100.0, digits: 1 },
];

export function useForexTickers() {
  const [tickers, setTickers] = useState<ForexTicker[]>(INITIAL_TICKERS);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // 1. Fetch harga pasar riil dari server API publik (Binance & Open Exchange API)
  useEffect(() => {
    let isMounted = true;

    async function syncRealMarketPrices() {
      try {
        const [goldRes, btcRes, forexRes] = await Promise.allSettled([
          fetch('https://api.binance.com/api/v3/ticker/price?symbol=PAXGUSDT').then((r) => r.json()),
          fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT').then((r) => r.json()),
          fetch('https://open.er-api.com/v6/latest/USD').then((r) => r.json()),
        ]);

        if (!isMounted) return;

        setTickers((prev) => {
          return prev.map((item) => {
            // Gold Spot (PAXG 1:1 Troy Ounce Emas Murni)
            if (item.pair === 'XAU/USD' && goldRes.status === 'fulfilled' && goldRes.value?.price) {
              const liveGold = parseFloat(goldRes.value.price);
              if (liveGold > 1000) {
                const ask = parseFloat((liveGold + 0.5).toFixed(2));
                return { ...item, bid: parseFloat(liveGold.toFixed(2)), ask };
              }
            }

            // Bitcoin (BTC/USD)
            if (item.pair === 'BTC/USD' && btcRes.status === 'fulfilled' && btcRes.value?.price) {
              const liveBtc = parseFloat(btcRes.value.price);
              if (liveBtc > 5000) {
                const ask = parseFloat((liveBtc + 20).toFixed(1));
                return { ...item, bid: parseFloat(liveBtc.toFixed(1)), ask };
              }
            }

            // Forex Pairs dari ExchangeRate API
            if (forexRes.status === 'fulfilled' && forexRes.value?.rates) {
              const rates = forexRes.value.rates;
              if (item.pair === 'EUR/USD' && rates.EUR) {
                const bid = parseFloat((1 / rates.EUR).toFixed(4));
                return { ...item, bid, ask: parseFloat((bid + 0.0002).toFixed(4)) };
              }
              if (item.pair === 'GBP/USD' && rates.GBP) {
                const bid = parseFloat((1 / rates.GBP).toFixed(4));
                return { ...item, bid, ask: parseFloat((bid + 0.0003).toFixed(4)) };
              }
              if (item.pair === 'USD/JPY' && rates.JPY) {
                const bid = parseFloat(rates.JPY.toFixed(2));
                return { ...item, bid, ask: parseFloat((bid + 0.03).toFixed(2)) };
              }
              if (item.pair === 'AUD/USD' && rates.AUD) {
                const bid = parseFloat((1 / rates.AUD).toFixed(4));
                return { ...item, bid, ask: parseFloat((bid + 0.0002).toFixed(4)) };
              }
              if (item.pair === 'USD/CAD' && rates.CAD) {
                const bid = parseFloat(rates.CAD.toFixed(4));
                return { ...item, bid, ask: parseFloat((bid + 0.0003).toFixed(4)) };
              }
              if (item.pair === 'USD/CHF' && rates.CHF) {
                const bid = parseFloat(rates.CHF.toFixed(4));
                return { ...item, bid, ask: parseFloat((bid + 0.0003).toFixed(4)) };
              }
              if (item.pair === 'NZD/USD' && rates.NZD) {
                const bid = parseFloat((1 / rates.NZD).toFixed(4));
                return { ...item, bid, ask: parseFloat((bid + 0.0003).toFixed(4)) };
              }
            }

            return item;
          });
        });

        setLastUpdated(new Date());
      } catch (err) {
        console.warn('Sync live market prices error:', err);
      }
    }

    syncRealMarketPrices();
    // Sinkronkan harga pasar riil setiap 45 detik
    const fetchInterval = setInterval(syncRealMarketPrices, 45000);

    return () => {
      isMounted = false;
      clearInterval(fetchInterval);
    };
  }, []);

  // 2. Real-time micro-tick jitter simulator setiap 2 detik agar grafik dan running ticker terasa dinamis
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setTickers((prev) =>
        prev.map((item) => {
          if (Math.random() > 0.45) return item;

          const pipScale = item.digits === 4 ? 0.0001 : item.digits === 2 ? 0.01 : 1.0;
          const delta = (Math.floor(Math.random() * 5) - 2) * pipScale;
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
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive]);

  return { tickers, isLive, setIsLive, lastUpdated };
}
