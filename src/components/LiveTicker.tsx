import React from 'react';
import { ForexTicker } from '../types/realtime';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface LiveTickerProps {
  tickers: ForexTicker[];
  isLive: boolean;
  onSelectPair?: (pair: string, price: number) => void;
}

export const LiveTicker: React.FC<LiveTickerProps> = ({ tickers, isLive, onSelectPair }) => {
  // Gandakan array ticker untuk animasi looping mulus tanpa jeda (infinite continuous marquee)
  const duplicatedTickers = [...tickers, ...tickers];

  return (
    <div className="bg-[#0b5a2f] dark:bg-[#072d18] border-b border-emerald-950 text-white text-[11px] overflow-hidden flex items-center select-none shadow-inner">
      {/* Live Badge indicator (Fixed on Left) */}
      <div className="bg-emerald-950 px-2.5 py-1.5 flex items-center gap-1.5 shrink-0 border-r border-emerald-800 z-10 shadow-sm">
        <span className={`w-2 h-2 rounded-full bg-emerald-400 inline-block shrink-0 ${isLive ? 'animate-pulse' : 'opacity-50'}`} />
        <span className="font-bold tracking-wider text-[10px] text-emerald-200 uppercase font-mono">
          LIVE PRICES
        </span>
      </div>

      {/* Marquee ticker container with continuous smooth right-to-left scroll */}
      <div className="overflow-hidden flex-1 relative py-1">
        <div 
          className="animate-ticker-marquee flex items-center gap-6 cursor-pointer"
          title="Arahkan kursor atau sentuh untuk menjeda (Pause on Hover)"
        >
          {duplicatedTickers.map((t, idx) => {
            const isUp = t.change >= 0;
            return (
              <div
                key={`${t.pair}-${idx}`}
                onClick={() => onSelectPair && onSelectPair(t.pair, t.bid)}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded hover:bg-emerald-800/80 transition-colors shrink-0"
                title={`Klik untuk buka chart ${t.pair} (${t.bid})`}
              >
                <span className="font-bold text-gray-100 font-mono">{t.pair}</span>
                <span className="font-mono text-white font-semibold">{t.bid.toFixed(t.digits)}</span>
                <span
                  className={`inline-flex items-center text-[10px] font-semibold font-mono ${
                    isUp ? 'text-emerald-300' : 'text-rose-300'
                  }`}
                >
                  {isUp ? (
                    <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                  ) : (
                    <TrendingDown className="w-2.5 h-2.5 mr-0.5" />
                  )}
                  {isUp ? `+${t.change}%` : `${t.change}%`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
