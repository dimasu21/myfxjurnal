import React from 'react';
import { ForexTicker } from '../types/realtime';
import { TrendingUp, TrendingDown, Radio } from 'lucide-react';

interface LiveTickerProps {
  tickers: ForexTicker[];
  isLive: boolean;
  onSelectPair?: (pair: string, price: number) => void;
}

export const LiveTicker: React.FC<LiveTickerProps> = ({ tickers, isLive, onSelectPair }) => {
  return (
    <div className="bg-[#0b5a2f] border-b border-emerald-950 text-white text-[11px] overflow-hidden flex items-center select-none shadow-inner">
      {/* Live Badge indicator */}
      <div className="bg-emerald-950/80 px-2.5 py-1.5 flex items-center gap-1.5 shrink-0 border-r border-emerald-800 z-10">
        <Radio className={`w-3 h-3 text-red-400 ${isLive ? 'animate-pulse' : 'opacity-40'}`} />
        <span className="font-bold tracking-wider text-[10px] text-emerald-200 uppercase">
          LIVE PRICES
        </span>
      </div>

      {/* Marquee ticker container with continuous CSS smooth scroll */}
      <div className="overflow-x-auto scrollbar-none flex items-center gap-4 px-3 py-1 flex-1 whitespace-nowrap">
        {tickers.map((t) => {
          const isUp = t.change >= 0;
          return (
            <div
              key={t.pair}
              onClick={() => onSelectPair && onSelectPair(t.pair, t.bid)}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-emerald-800/80 cursor-pointer transition-colors"
              title={`Klik untuk gunakan harga ${t.pair} (${t.bid})`}
            >
              <span className="font-bold text-gray-100">{t.pair}</span>
              <span className="font-mono text-white font-medium">{t.bid.toFixed(t.digits)}</span>
              <span
                className={`inline-flex items-center text-[10px] font-semibold px-1 py-0.2 rounded ${
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
  );
};

