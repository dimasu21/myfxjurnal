import React, { useEffect } from 'react';
import { Trade } from '../types/trade';
import { ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';

interface TradeTableProps {
  trades: Trade[];
  selectedTradeId: string | null;
  onSelectTrade: (trade: Trade, cellRef: string, value: string) => void;
  onEditTrade: (trade: Trade) => void;
  onDeleteTrade: (id: string) => void;
  onAddNew: () => void;
}

const COLUMN_HEADERS = [
  { col: 'A', name: 'Tanggal', key: 'tanggal', width: 'w-24 min-w-[96px]' },
  { col: 'B', name: 'Pair', key: 'pair', width: 'w-28 min-w-[105px]' },
  { col: 'C', name: 'Posisi', key: 'posisi', width: 'w-24 min-w-[90px]' },
  { col: 'D', name: 'Entry', key: 'entry', width: 'w-24 min-w-[90px]' },
  { col: 'E', name: 'SL', key: 'sl', width: 'w-24 min-w-[90px]' },
  { col: 'F', name: 'TP', key: 'tp', width: 'w-24 min-w-[90px]' },
  { col: 'G', name: 'Lot', key: 'lot', width: 'w-20 min-w-[80px]' },
  { col: 'H', name: 'Pips', key: 'pips', width: 'w-28 min-w-[100px]' },
  { col: 'I', name: 'R:R', key: 'riskReward', width: 'w-20 min-w-[75px]' },
  { col: 'J', name: 'Alasan Eksekusi', key: 'alasan', width: 'w-64 min-w-[220px]' },
  { col: 'K', name: 'Emosi / Psikologi', key: 'emosi', width: 'w-40 min-w-[140px]' },
  { col: 'L', name: 'Evaluasi Akhir', key: 'evaluasi', width: 'w-72 min-w-[260px]' },
];

export const TradeTable: React.FC<TradeTableProps> = ({
  trades,
  selectedTradeId,
  onSelectTrade,
  onEditTrade,
  onDeleteTrade,
  onAddNew,
}) => {
  // Shortcut keyboard Delete untuk menghapus baris yang sedang dipilih
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedTradeId) {
        // Jangan hapus jika sedang mengetik di input text
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
          return;
        }
        const targetTrade = trades.find((t) => t.id === selectedTradeId);
        if (targetTrade && confirm(`Hapus baris trade ${targetTrade.pair} (${targetTrade.tanggal})?`)) {
          onDeleteTrade(selectedTradeId);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTradeId, trades, onDeleteTrade]);

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

  // Jumlah baris minimal untuk menampilkan grid Excel yang realistis
  const minRows = Math.max(15, trades.length + 3);
  const emptyRowsCount = Math.max(0, minRows - trades.length);

  return (
    <div className="flex-1 overflow-auto bg-gray-50 border border-gray-300 select-none relative scrollbar-thin">
      <table className="w-full border-collapse text-xs font-sans text-left">
        {/* Header Baris Kolom Huruf Excel (A, B, C...) */}
        <thead className="bg-[#f3f4f6] sticky top-0 z-20 shadow-xs border-b border-gray-300">
          {/* Row 1: Excel Column Letters */}
          <tr className="border-b border-gray-200 text-gray-500 font-mono text-[11px] leading-tight">
            <th className="w-12 min-w-[48px] p-1 text-center bg-[#eaecee] border-r border-gray-300 sticky left-0 z-20">
              #
            </th>
            {COLUMN_HEADERS.map((h) => (
              <th
                key={h.col}
                className={`p-1 text-center font-normal border-r border-gray-200 ${h.width}`}
              >
                {h.col}
              </th>
            ))}
          </tr>

          {/* Row 2: Actual Column Names */}
          <tr className="text-gray-800 font-semibold bg-[#e9ecef] border-b-2 border-gray-300">
            <th className="p-2 text-center bg-[#dedede] border-r border-gray-300 sticky left-0 z-20">
              Row
            </th>
            {COLUMN_HEADERS.map((h) => (
              <th
                key={h.key}
                className={`p-2 border-r border-gray-300 whitespace-nowrap text-gray-800 font-medium ${h.width}`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span>{h.name}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* Isi Data Tabel */}
        <tbody className="divide-y divide-gray-200 bg-white">
          {/* Baris data trade yang sudah ada */}
          {trades.map((trade, idx) => {
            const rowIndex = idx + 1;
            const isSelected = selectedTradeId === trade.id;
            const isProfit = trade.pips > 0;
            const isLoss = trade.pips < 0;

            return (
              <tr
                key={trade.id}
                onClick={() => onSelectTrade(trade, `A${rowIndex}`, trade.tanggal)}
                onDoubleClick={() => onEditTrade(trade)}
                className={`transition-colors cursor-pointer group ${
                  isSelected
                    ? 'bg-emerald-50/80 ring-2 ring-excel-green ring-inset'
                    : 'hover:bg-blue-50/40'
                }`}
                title="Klik untuk memilih baris, Double-click untuk Edit"
              >
                {/* Sticky Row Number Index */}
                <td
                  className={`p-2 text-center font-mono font-semibold border-r border-gray-300 sticky left-0 z-10 transition-colors ${
                    isSelected
                      ? 'bg-excel-green text-white'
                      : 'bg-[#f8f9fa] text-gray-600 group-hover:bg-gray-200'
                  }`}
                >
                  {rowIndex}
                </td>

                {/* Col A: Tanggal */}
                <td
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTrade(trade, `A${rowIndex}`, trade.tanggal);
                  }}
                  className="p-2 border-r border-gray-200 whitespace-nowrap font-mono text-gray-700"
                >
                  {trade.tanggal}
                </td>

                {/* Col B: Pair */}
                <td
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTrade(trade, `B${rowIndex}`, trade.pair);
                  }}
                  className="p-2 border-r border-gray-200 whitespace-nowrap font-bold text-gray-900"
                >
                  <span className="bg-gray-100 px-1.5 py-0.5 rounded border border-gray-300">
                    {trade.pair}
                  </span>
                </td>

                {/* Col C: Posisi (BUY / SELL) */}
                <td
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTrade(trade, `C${rowIndex}`, trade.posisi);
                  }}
                  className="p-2 border-r border-gray-200 whitespace-nowrap text-center"
                >
                  <span
                    className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-bold text-[11px] border ${
                      trade.posisi === 'BUY'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border-rose-300'
                    }`}
                  >
                    {trade.posisi === 'BUY' ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {trade.posisi}
                  </span>
                </td>

                {/* Col D: Entry */}
                <td
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTrade(trade, `D${rowIndex}`, String(trade.entry));
                  }}
                  className="p-2 border-r border-gray-200 whitespace-nowrap font-mono text-right text-gray-800"
                >
                  {trade.entry}
                </td>

                {/* Col E: SL */}
                <td
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTrade(trade, `E${rowIndex}`, String(trade.sl));
                  }}
                  className="p-2 border-r border-gray-200 whitespace-nowrap font-mono text-right text-rose-700 bg-rose-50/20"
                >
                  {trade.sl}
                </td>

                {/* Col F: TP */}
                <td
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTrade(trade, `F${rowIndex}`, String(trade.tp));
                  }}
                  className="p-2 border-r border-gray-200 whitespace-nowrap font-mono text-right text-emerald-700 bg-emerald-50/20"
                >
                  {trade.tp}
                </td>

                {/* Col G: Lot */}
                <td
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTrade(trade, `G${rowIndex}`, trade.lot);
                  }}
                  className="p-2 border-r border-gray-200 whitespace-nowrap text-center font-medium text-gray-700"
                >
                  {trade.lot}
                </td>

                {/* Col H: Hasil (Pips) */}
                <td
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTrade(
                      trade,
                      `H${rowIndex}`,
                      `${trade.pips > 0 ? '+' : ''}${trade.pips} Pips`
                    );
                  }}
                  className={`p-2 border-r border-gray-200 whitespace-nowrap font-bold text-center ${
                    isProfit
                      ? 'text-emerald-700 bg-emerald-50/50'
                      : isLoss
                      ? 'text-rose-700 bg-rose-50/50'
                      : 'text-gray-600 bg-gray-50'
                  }`}
                >
                  <span className="inline-block px-1.5 py-0.5 rounded">
                    {trade.pips > 0 ? `+${trade.pips}` : trade.pips} Pips
                  </span>
                </td>

                {/* Col I: R:R */}
                <td
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTrade(trade, `I${rowIndex}`, trade.riskReward || '-');
                  }}
                  className="p-2 border-r border-gray-200 whitespace-nowrap text-center font-mono text-gray-700"
                >
                  {trade.riskReward || '-'}
                </td>

                {/* Col J: Alasan Eksekusi */}
                <td
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTrade(trade, `J${rowIndex}`, trade.alasan);
                  }}
                  className="p-2 border-r border-gray-200 max-w-xs truncate text-gray-800"
                  title={trade.alasan}
                >
                  {trade.alasan}
                </td>

                {/* Col K: Emosi / Psikologi */}
                <td
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTrade(trade, `K${rowIndex}`, trade.emosi);
                  }}
                  className="p-2 border-r border-gray-200 whitespace-nowrap"
                >
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[11px] border font-medium ${getEmotionBadge(
                      trade.emosi
                    )}`}
                  >
                    {trade.emosi}
                  </span>
                </td>

                {/* Col L: Evaluasi Akhir */}
                <td
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTrade(trade, `L${rowIndex}`, trade.evaluasi);
                  }}
                  className="p-2 border-r border-gray-200 max-w-sm truncate text-gray-600"
                  title={trade.evaluasi}
                >
                  {trade.evaluasi || '-'}
                </td>
              </tr>
            );
          })}

          {/* Baris Kosong Realistis Khas Lembar Kerja Excel */}
          {Array.from({ length: emptyRowsCount }).map((_, i) => {
            const rowIndex = trades.length + i + 1;
            const isFirstBlank = i === 0;

            return (
              <tr
                key={`empty-row-${rowIndex}`}
                onClick={onAddNew}
                className="hover:bg-emerald-50/30 cursor-pointer text-gray-300"
                title="Klik untuk mengisi data pada baris ini"
              >
                <td className="p-2 text-center font-mono font-medium text-gray-400 bg-[#f8f9fa] border-r border-gray-300 sticky left-0 z-10">
                  {rowIndex}
                </td>
                {isFirstBlank && trades.length === 0 ? (
                  <td
                    colSpan={COLUMN_HEADERS.length}
                    className="p-2 text-gray-400 italic text-left bg-emerald-50/20 border-r border-gray-200"
                  >
                    <span className="flex items-center gap-1 text-emerald-700 font-medium text-xs">
                      <Plus className="w-3.5 h-3.5" /> Lembar sheet masih kosong. Klik di sini untuk mencatat trade...
                    </span>
                  </td>
                ) : (
                  COLUMN_HEADERS.map((h) => (
                    <td
                      key={h.col}
                      className="p-2 border-r border-gray-200 h-8"
                    >
                      &nbsp;
                    </td>
                  ))
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
