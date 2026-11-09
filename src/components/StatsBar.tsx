import React from 'react';
import { TrendingUp, TrendingDown, Target, Zap, Activity } from 'lucide-react';
import { Trade } from '../types/trade';
import { calculateStats } from '../utils/calculations';

interface StatsBarProps {
  trades: Trade[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ trades }) => {
  const stats = calculateStats(trades);
  const isPipsPositive = stats.totalPips >= 0;

  return (
    <div className="bg-white border-b border-gray-300 px-3 py-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
        {/* Total Trades */}
        <div className="bg-gray-50 border border-gray-200 rounded p-2 flex flex-col justify-between">
          <div className="text-gray-500 flex items-center justify-between">
            <span>Total Trades</span>
            <Activity className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <div className="text-base font-bold text-gray-800 mt-1">
            {stats.totalTrades}{' '}
            <span className="text-[10px] font-normal text-gray-500">
              ({stats.winTrades}W / {stats.lossTrades}L)
            </span>
          </div>
        </div>

        {/* Win Rate */}
        <div className="bg-emerald-50/60 border border-emerald-200 rounded p-2 flex flex-col justify-between">
          <div className="text-emerald-700 flex items-center justify-between font-medium">
            <span>Win Rate</span>
            <Target className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-base font-extrabold text-emerald-700">
              {stats.winRate}%
            </span>
            <span className="text-[10px] text-emerald-600">
              ({stats.winTrades} menang)
            </span>
          </div>
        </div>

        {/* Total Pips */}
        <div
          className={`border rounded p-2 flex flex-col justify-between ${
            isPipsPositive
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
              : 'bg-red-50/70 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">Total Pips</span>
            {isPipsPositive ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-red-600" />
            )}
          </div>
          <div className="text-base font-extrabold mt-1">
            {stats.totalPips > 0 ? `+${stats.totalPips}` : stats.totalPips}
            <span className="text-[10px] font-normal ml-1">Pips</span>
          </div>
        </div>

        {/* Total P&L ($) */}
        <div
          className={`border rounded p-2 flex flex-col justify-between ${
            stats.totalPnL >= 0
              ? 'bg-blue-50/60 border-blue-200 text-blue-900'
              : 'bg-orange-50/60 border-orange-200 text-orange-900'
          }`}
        >
          <div className="flex items-center justify-between text-gray-600">
            <span>Est. P&L</span>
            <Zap className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-base font-extrabold mt-1">
            {stats.totalPnL >= 0 ? `+$${stats.totalPnL}` : `-$${Math.abs(stats.totalPnL)}`}
          </div>
        </div>

        {/* Profit Factor */}
        <div className="bg-gray-50 border border-gray-200 rounded p-2 flex flex-col justify-between">
          <div className="text-gray-500">Profit Factor</div>
          <div className="text-base font-bold text-gray-800 mt-1">
            {stats.profitFactor}
          </div>
        </div>

        {/* Avg Pips per Trade */}
        <div className="bg-gray-50 border border-gray-200 rounded p-2 flex flex-col justify-between">
          <div className="text-gray-500">Rata-rata / Trade</div>
          <div className="text-base font-bold text-gray-800 mt-1">
            {stats.avgPipsPerTrade > 0 ? `+${stats.avgPipsPerTrade}` : stats.avgPipsPerTrade}
            <span className="text-[10px] font-normal ml-1 text-gray-500">Pips</span>
          </div>
        </div>
      </div>
    </div>
  );
};
