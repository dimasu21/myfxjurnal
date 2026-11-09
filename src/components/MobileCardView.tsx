import React, { useState, useMemo } from 'react';
import { Trade } from '../types/trade';
import { calculateStats } from '../utils/calculations';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Edit3, 
  Trash2, 
  Clock, 
  Search, 
  Filter,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  BarChart2,
  SlidersHorizontal,
  Plus
} from 'lucide-react';

interface MobileCardViewProps {
  trades: Trade[];
  onEditTrade: (trade: Trade) => void;
  onDeleteTrade: (id: string) => void;
  onSelectTrade: (trade: Trade, cellRef: string, value: string) => void;
  onAddNew?: () => void;
}

export const MobileCardView: React.FC<MobileCardViewProps> = ({
  trades,
  onEditTrade,
  onDeleteTrade,
  onSelectTrade,
  onAddNew,
}) => {
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'WIN' | 'LOSS' | 'BE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPair, setSelectedPair] = useState('ALL');

  // Hitung agregasi performa ala Myfxbook Macro Card
  const stats = useMemo(() => calculateStats(trades), [trades]);

  // Ekstrak pasangan mata uang unik
  const uniquePairs = useMemo(() => {
    const set = new Set<string>();
    trades.forEach((t) => {
      if (t.pair) set.add(t.pair.toUpperCase());
    });
    return Array.from(set);
  }, [trades]);

  // Filter list
  const filteredTrades = useMemo(() => {
    return trades.filter((t) => {
      if (statusFilter === 'WIN' && !(t.status === 'WIN' || t.pips > 0)) return false;
      if (statusFilter === 'LOSS' && !(t.status === 'LOSS' || t.pips < 0)) return false;
      if (statusFilter === 'BE' && !(t.status === 'BE' || t.pips === 0)) return false;
      if (selectedPair !== 'ALL' && t.pair.toUpperCase() !== selectedPair) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          t.pair.toLowerCase().includes(q) ||
          (t.strategi && t.strategi.toLowerCase().includes(q)) ||
          (t.alasan && t.alasan.toLowerCase().includes(q)) ||
          (t.emosi && t.emosi.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [trades, statusFilter, selectedPair, searchQuery]);

  const getEmotionBadge = (emosi: string) => {
    switch (emosi) {
      case 'Percaya Diri':
      case 'Disiplin Sesuai Trading Plan':
      case 'Disiplin':
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'Tenang':
        return 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      case 'Ragu/Cemas':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'FOMO':
        return 'bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-800 font-bold';
      case 'Revenge Trade':
      case 'Balas Dendam (Revenge)':
      case 'Serakah':
        return 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800 font-bold';
      default:
        return 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto w-full max-w-full px-3 py-3 space-y-3 bg-[#f1f5f9] dark:bg-[#0b1120] pb-24 select-none">
      {/* 1. MYFXBOOK MACRO SUMMARY CARD (OVERVIEW PORTOFOLIO) */}
      <div className="bg-gradient-to-br from-[#0e502c] via-[#0b3d22] to-[#082817] text-white rounded-2xl p-4 shadow-md border border-emerald-800/40 relative overflow-hidden">
        {/* Header Summary */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 block">
              Ringkasan Portofolio Trading
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black font-mono tracking-tight text-white">
                {stats.totalPips >= 0 ? `+${stats.totalPips}` : stats.totalPips}
              </span>
              <span className="text-xs font-semibold text-emerald-200">Pips Akumulasi</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-semibold text-emerald-300 block">Est. P&L</span>
            <span className={`text-base font-bold font-mono ${stats.totalPnL >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
              {stats.totalPnL >= 0 ? `+$${stats.totalPnL}` : `-$${Math.abs(stats.totalPnL)}`}
            </span>
          </div>
        </div>

        {/* 4-KPI Grid Strip ala Myfxbook */}
        <div className="grid grid-cols-4 gap-2 pt-3 text-center">
          <div className="bg-white/5 rounded-lg py-1.5 px-1 border border-white/10">
            <span className="text-[9px] text-emerald-200/80 uppercase block">Win Rate</span>
            <span className="text-sm font-bold font-mono text-white mt-0.5 block">{stats.winRate}%</span>
          </div>
          <div className="bg-white/5 rounded-lg py-1.5 px-1 border border-white/10">
            <span className="text-[9px] text-emerald-200/80 uppercase block">Trades</span>
            <span className="text-sm font-bold font-mono text-white mt-0.5 block">{stats.totalTrades}</span>
          </div>
          <div className="bg-white/5 rounded-lg py-1.5 px-1 border border-white/10">
            <span className="text-[9px] text-emerald-200/80 uppercase block">W / L</span>
            <span className="text-sm font-bold font-mono text-emerald-300 mt-0.5 block">
              {stats.winTrades}/{stats.lossTrades}
            </span>
          </div>
          <div className="bg-white/5 rounded-lg py-1.5 px-1 border border-white/10">
            <span className="text-[9px] text-emerald-200/80 uppercase block">Profit F.</span>
            <span className="text-sm font-bold font-mono text-white mt-0.5 block">{stats.profitFactor}</span>
          </div>
        </div>
      </div>

      {/* 2. FILTER & SEARCH STRIP (MYFXBOOK SEGMENTED BAR) */}
      <div className="bg-white dark:bg-[#111827] rounded-xl p-2.5 border border-gray-200 dark:border-slate-800 shadow-xs space-y-2">
        {/* Status Filter Pills */}
        <div className="grid grid-cols-4 gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-semibold">
          {[
            { key: 'ALL', label: `Semua (${trades.length})` },
            { key: 'WIN', label: `Win (${stats.winTrades})` },
            { key: 'LOSS', label: `Loss (${stats.lossTrades})` },
            { key: 'BE', label: `BE (${stats.beTrades})` },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key as any)}
              className={`py-1 text-[11px] rounded transition-all text-center ${
                statusFilter === tab.key
                  ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white font-bold shadow-xs'
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Compact Search & Pair Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pair, strategi, atau catatan..."
              className="w-full pl-8 pr-2.5 py-1 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {uniquePairs.length > 0 && (
            <select
              value={selectedPair}
              onChange={(e) => setSelectedPair(e.target.value)}
              className="px-2 py-1 text-xs font-semibold bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="ALL">Semua Pair</option>
              {uniquePairs.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* 3. TRADE CARDS LIST (VERTICAL FEED ALA MYFXBOOK MOBILE) */}
      {filteredTrades.length === 0 ? (
        <div className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-slate-800 p-8 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 mx-auto flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">Tidak Ada Transaksi</h4>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
              {trades.length === 0
                ? 'Jurnal trading Anda masih bersih. Tekan tombol + di bawah untuk mencatat transaksi pertama.'
                : 'Tidak ada data trade yang sesuai dengan pencarian atau filter yang dipilih.'}
            </p>
          </div>
          {onAddNew && trades.length === 0 && (
            <button
              onClick={onAddNew}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Transaksi Baru</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredTrades.map((trade, idx) => {
            const isWin = trade.pips > 0;
            const isLoss = trade.pips < 0;

            return (
              <div
                key={trade.id}
                onClick={() => onSelectTrade(trade, `Row ${idx + 1}`, trade.pair)}
                className="bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-slate-800 p-3.5 shadow-xs space-y-2.5 active:scale-[0.99] transition-transform"
              >
                {/* Header: Pair, Buy/Sell, Date, and Pips Output */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-base text-gray-900 dark:text-white tracking-tight">
                        {trade.pair}
                      </span>
                      <span
                        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-bold ${
                          trade.posisi === 'BUY'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                        }`}
                      >
                        {trade.posisi === 'BUY' ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        <span>{trade.posisi}</span>
                        <span className="text-[10px] opacity-80 ml-0.5">({trade.lot} Lot)</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-slate-500 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{trade.tanggal}</span>
                      {trade.riskReward && trade.riskReward !== '-' && (
                        <>
                          <span>•</span>
                          <span className="font-bold text-gray-600 dark:text-slate-300">RR {trade.riskReward}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Pips Result Badge (Big & Clear) */}
                  <div className="text-right shrink-0">
                    <div
                      className={`font-mono font-black text-base ${
                        isWin
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : isLoss
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-gray-600 dark:text-slate-400'
                      }`}
                    >
                      {isWin ? `+${trade.pips}` : trade.pips} Pips
                    </div>
                    {trade.pnl !== undefined && trade.pnl !== 0 && (
                      <div className="text-[11px] font-mono text-gray-400 dark:text-slate-500">
                        {trade.pnl > 0 ? `+$${trade.pnl}` : `-$${Math.abs(trade.pnl)}`}
                      </div>
                    )}
                  </div>
                </div>

                {/* Execution Price Metrics (3 Columns: Entry, SL, TP) */}
                <div className="grid grid-cols-3 gap-1.5 py-2 px-2.5 rounded-lg bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800 text-center font-mono">
                  <div>
                    <span className="text-[10px] text-gray-400 dark:text-slate-500 block uppercase">Entry</span>
                    <span className="text-xs font-bold text-gray-800 dark:text-slate-200">{trade.entry || '-'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-rose-500/80 block uppercase">SL</span>
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400">{trade.sl || '-'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-500/80 block uppercase">TP</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{trade.tp || '-'}</span>
                  </div>
                </div>

                {/* Strategy, Emotion, & Reason Notes */}
                {(trade.strategi || trade.emosi || trade.alasan) && (
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] pt-1">
                    {trade.strategi && (
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 font-semibold">
                        {trade.strategi}
                      </span>
                    )}

                    {trade.emosi && (
                      <span className={`px-2 py-0.5 rounded-md border text-[10px] ${getEmotionBadge(trade.emosi)}`}>
                        {trade.emosi}
                      </span>
                    )}

                    {trade.alasan && trade.alasan !== '-' && (
                      <p className="w-full text-[11px] text-gray-500 dark:text-slate-400 italic line-clamp-1 mt-0.5">
                        &ldquo;{trade.alasan}&rdquo;
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons: Edit & Delete */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-slate-800/60">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditTrade(trade);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 text-xs font-semibold transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-blue-500" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Hapus baris trade ${trade.pair} (${trade.tanggal})?`)) {
                        onDeleteTrade(trade.id);
                      }
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/70 text-rose-600 dark:text-rose-400 text-xs font-semibold transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
