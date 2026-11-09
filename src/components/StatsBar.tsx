import React from 'react';
import { TrendingUp, TrendingDown, Trophy, Zap, Activity } from 'lucide-react';
import { Trade } from '../types/trade';
import { calculateStats } from '../utils/calculations';

interface StatsBarProps {
  trades: Trade[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ trades }) => {
  const stats = calculateStats(trades);
  const isPipsPositive = stats.totalPips >= 0;

  return (
    <div className="bg-white dark:bg-[#111827] border-b border-gray-300 dark:border-slate-800 px-3 py-2 transition-colors">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
        {/* Total Trades */}
        <div className="bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded p-2 flex flex-col justify-between">
          <div className="text-gray-500 dark:text-slate-400 flex items-center justify-between">
            <span>Total Trades</span>
            <Activity className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
          </div>
          <div className="text-base font-bold text-gray-800 dark:text-slate-100 mt-1">
            {stats.totalTrades}{' '}
            <span className="text-[10px] font-normal text-gray-500 dark:text-slate-400">
              ({stats.winTrades}W / {stats.lossTrades}L)
            </span>
          </div>
        </div>

        {/* Win Rate dengan Icon Piala (Trophy) */}
        <div className="bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded p-2 flex flex-col justify-between">
          <div className="text-emerald-700 dark:text-emerald-400 flex items-center justify-between font-medium">
            <span>Win Rate</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-300">
              {stats.winRate}%
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
              ({stats.winTrades} menang)
            </span>
          </div>
        </div>

        {/* Total Pips */}
        <div
          className={`border rounded p-2 flex flex-col justify-between ${
            isPipsPositive
              ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60'
              : 'bg-rose-50/60 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60'
          }`}
        >
          <div
            className={`flex items-center justify-between font-medium ${
              isPipsPositive ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
            }`}
          >
            <span>Total Pips</span>
            {isPipsPositive ? (
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            )}
          </div>
          <div className="text-base font-bold mt-1">
            <span
              className={
                isPipsPositive ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
              }
            >
              {isPipsPositive ? `+${stats.totalPips}` : stats.totalPips}{' '}
              <span className="text-[10px] font-normal">Pips</span>
            </span>
          </div>
        </div>

        {/* Est. P&L */}
        <div className="bg-blue-50/50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded p-2 flex flex-col justify-between">
          <div className="text-blue-700 dark:text-blue-400 flex items-center justify-between font-medium">
            <span>Est. P&L</span>
            <Zap className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-base font-bold text-blue-700 dark:text-blue-300 mt-1">
            {stats.totalPnL >= 0 ? `+$${stats.totalPnL}` : `-$${Math.abs(stats.totalPnL)}`}
          </div>
        </div>

        {/* Profit Factor */}
        <div className="bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded p-2 flex flex-col justify-between">
          <div className="text-gray-500 dark:text-slate-400">Profit Factor</div>
          <div className="text-base font-bold text-gray-800 dark:text-slate-100 mt-1">
            {stats.profitFactor}
          </div>
        </div>

        {/* Average / Trade */}
        <div className="bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded p-2 flex flex-col justify-between">
          <div className="text-gray-500 dark:text-slate-400">Rata-rata / Trade</div>
          <div className="text-base font-bold text-gray-800 dark:text-slate-100 mt-1">
            {stats.avgPipsPerTrade >= 0
              ? `+${stats.avgPipsPerTrade}`
              : stats.avgPipsPerTrade}{' '}
            <span className="text-[10px] font-normal text-gray-500 dark:text-slate-400">Pips</span>
          </div>
        </div>
      </div>
    </div>
  );
};
