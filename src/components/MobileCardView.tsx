import React from 'react';
import { Trade } from '../types/trade';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Edit3, 
  Trash2, 
  ShieldAlert, 
  Target, 
  Smile, 
  Clock, 
  Layers
} from 'lucide-react';

interface MobileCardViewProps {
  trades: Trade[];
  onEditTrade: (trade: Trade) => void;
  onDeleteTrade: (id: string) => void;
  onSelectTrade: (trade: Trade, cellRef: string, value: string) => void;
}

export const MobileCardView: React.FC<MobileCardViewProps> = ({
  trades,
  onEditTrade,
  onDeleteTrade,
  onSelectTrade,
}) => {
  if (trades.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p className="text-sm font-semibold">Tidak ada trade yang sesuai filter.</p>
      </div>
    );
  }

  const getEmotionBadge = (emosi: string) => {
    switch (emosi) {
      case 'Percaya Diri':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Tenang':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Disiplin':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'Ragu/Cemas':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'FOMO':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Revenge Trade':
      case 'Serakah':
        return 'bg-red-100 text-red-800 border-red-300 font-bold';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-100 pb-20">
      {trades.map((trade, idx) => {
        const isWin = trade.pips > 0;
        const isLoss = trade.pips < 0;

        return (
          <div
            key={trade.id}
            onClick={() => onSelectTrade(trade, `Row ${idx + 1}`, trade.pair)}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden active:scale-[0.99] transition-transform"
          >
            {/* Header Card: Pair, Posisi, Tanggal, Hasil */}
            <div className="p-3.5 bg-gray-50/80 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-gray-900 tracking-tight">
                  {trade.pair}
                </span>

                <span
                  className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-xs font-bold border ${
                    trade.posisi === 'BUY'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border-rose-300'
                  }`}
                >
                  {trade.posisi === 'BUY' ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  {trade.posisi}
                </span>

                <span className="text-[11px] text-gray-500 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  {trade.tanggal}
                </span>
              </div>

              {/* Pips Result */}
              <div
                className={`px-2.5 py-1 rounded-lg font-bold text-sm text-right ${
                  isWin
                    ? 'bg-emerald-600 text-white'
                    : isLoss
                    ? 'bg-rose-600 text-white'
                    : 'bg-gray-500 text-white'
                }`}
              >
                {trade.pips > 0 ? `+${trade.pips}` : trade.pips} Pips
              </div>
            </div>

            {/* Price Levels Grid (Entry, SL, TP, RR, Lot) */}
            <div className="p-3 grid grid-cols-4 gap-2 text-center text-xs border-b border-gray-100 bg-white">
              <div className="bg-gray-50 p-1.5 rounded">
                <div className="text-[10px] text-gray-500">Entry</div>
                <div className="font-mono font-bold text-gray-800">{trade.entry}</div>
              </div>

              <div className="bg-rose-50/50 p-1.5 rounded border border-rose-100">
                <div className="text-[10px] text-rose-600 font-medium">SL</div>
                <div className="font-mono font-bold text-rose-700">{trade.sl}</div>
              </div>

              <div className="bg-emerald-50/50 p-1.5 rounded border border-emerald-100">
                <div className="text-[10px] text-emerald-600 font-medium">TP</div>
                <div className="font-mono font-bold text-emerald-700">{trade.tp}</div>
              </div>

              <div className="bg-blue-50/40 p-1.5 rounded border border-blue-100">
                <div className="text-[10px] text-blue-600 font-medium">R:R / Lot</div>
                <div className="font-mono font-bold text-blue-900">
                  {trade.riskReward || '-'} <span className="text-[10px] font-normal text-gray-500">({trade.lot})</span>
                </div>
              </div>
            </div>

            {/* Reasoning & Psychology */}
            <div className="p-3 text-xs space-y-2">
              <div>
                <span className="text-gray-400 font-medium block text-[10px]">ALASAN EKSEKUSI:</span>
                <p className="text-gray-800 font-medium">{trade.alasan}</p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-gray-400 font-medium text-[10px]">EMOSI:</span>
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[11px] border font-medium ${getEmotionBadge(
                    trade.emosi
                  )}`}
                >
                  {trade.emosi}
                </span>
              </div>

              {trade.evaluasi && (
                <div className="bg-amber-50/60 p-2 rounded text-amber-900 border border-amber-200/60 text-[11px]">
                  <strong className="block text-[10px] text-amber-800 uppercase tracking-wide">
                    Evaluasi Akhir:
                  </strong>
                  {trade.evaluasi}
                </div>
              )}
            </div>

            {/* Card Footer Actions */}
            <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-gray-400 font-mono">
                ID: #{trade.id.replace('tr-', '')}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditTrade(trade);
                  }}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 font-medium"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Hapus catatan trade ${trade.pair}?`)) {
                      onDeleteTrade(trade.id);
                    }
                  }}
                  className="flex items-center gap-1 text-rose-600 hover:text-rose-800 px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
