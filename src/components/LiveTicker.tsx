import React from 'react';
import { ForexTicker } from '../types/realtime';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface LiveTickerProps {
  tickers: ForexTicker[];
  isLive: boolean;
  onSelectPair?: (pair: string, price: number) => void;
}

export const LiveTicker: React.FC<LiveTickerProps> = ({ tickers, isLive, onSelectPair }) => {
  const duplicatedTickers = [...tickers, ...tickers];

  return (
    <div className="bg-[#0e1624] dark:bg-[#080d18] border-b border-[#1e293b] text-slate-200 text-xs overflow-hidden flex items-center select-none shadow-xs">
      {/* Label Kiri Terminal (Dark Compact) */}
      <div className="bg-[#090d16] px-3 py-2 flex items-center gap-2 shrink-0 border-r border-[#1e293b] z-10">
        <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
        <span className="font-bold tracking-widest text-[10px] text-slate-300 uppercase font-mono">
          MARKETS
        </span>
      </div>

      {/* Marquee ticker berkesinambungan */}
      <div className="overflow-hidden flex-1 relative py-1.5">
        <div 
          className="animate-ticker-marquee flex items-center gap-7 cursor-pointer"
          title="Arahkan kursor untuk menjeda"
        >
          {duplicatedTickers.map((t, idx) => {
            const isUp = t.change >= 0;
            return (
              <div
                key={`${t.pair}-${idx}`}
                onClick={() => onSelectPair && onSelectPair(t.pair, t.bid)}
                className="inline-flex items-center gap-2 px-2 py-0.5 rounded hover:bg-slate-800/80 transition-colors shrink-0 group"
                title={`Buka live chart ${t.pair} (${t.bid.toFixed(t.digits)})`}
              >
                <span className="font-bold text-slate-300 font-mono text-[11px] group-hover:text-white">
                  {t.pair}
                </span>
                
                {/* Angka Mono & Tabular */}
                <span className="font-mono tabular-nums text-white font-bold text-xs tracking-tight text-right min-w-[58px]">
                  {t.bid.toFixed(t.digits)}
                </span>

                {/* Perubahan % dengan Panah Berwarna Kontras */}
                <span
                  className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tabular-nums ${
                    isUp 
                      ? 'text-emerald-400 bg-emerald-950/70 border border-emerald-800/60' 
                      : 'text-rose-400 bg-rose-950/70 border border-rose-800/60'
                  }`}
                >
                  {isUp ? (
                    <ArrowUpRight className="w-3 h-3 text-emerald-400 shrink-0 stroke-[2.5]" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-rose-400 shrink-0 stroke-[2.5]" />
                  )}
                  <span>{isUp ? `+${t.change}%` : `${t.change}%`}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
