import React from 'react';
import { Trade } from '../types/trade';
import { Flame, X, Calendar, Clock, Sparkles } from 'lucide-react';

interface HeatmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  trades: Trade[];
}

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
const SESSIONS = [
  { name: 'Sesi Asia (06:00 - 13:00)', key: 'ASIA' },
  { name: 'Sesi London (13:00 - 19:00)', key: 'LONDON' },
  { name: 'Sesi New York (19:00 - 03:00)', key: 'NY' },
];

export const HeatmapModal: React.FC<HeatmapModalProps> = ({
  isOpen,
  onClose,
  trades,
}) => {
  if (!isOpen) return null;

  // Analisis performa per hari dalam seminggu
  const dayStats: { [day: string]: { count: number; wins: number; pips: number } } = {
    Senin: { count: 0, wins: 0, pips: 0 },
    Selasa: { count: 0, wins: 0, pips: 0 },
    Rabu: { count: 0, wins: 0, pips: 0 },
    Kamis: { count: 0, wins: 0, pips: 0 },
    Jumat: { count: 0, wins: 0, pips: 0 },
  };

  trades.forEach((t) => {
    // Parse DD/MM/YYYY or YYYY-MM-DD
    let d: Date | null = null;
    if (t.tanggal.includes('/')) {
      const parts = t.tanggal.split('/');
      if (parts.length === 3) {
        d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      } else if (parts.length === 2) {
        d = new Date(2026, parseInt(parts[1]) - 1, parseInt(parts[0]));
      }
    } else if (t.tanggal.includes('-')) {
      d = new Date(t.tanggal);
    }

    if (d && !isNaN(d.getTime())) {
      const dayIndex = d.getDay(); // 0 is Sun, 1 is Mon
      const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const name = dayNames[dayIndex];
      if (dayStats[name]) {
        dayStats[name].count += 1;
        if (t.pips > 0) dayStats[name].wins += 1;
        dayStats[name].pips += t.pips;
      }
    }
  });

  // Cari hari terbaik
  const sortedDays = Object.entries(dayStats).sort((a, b) => b[1].pips - a[1].pips);
  const bestDay = sortedDays[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg border border-gray-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 text-xs">
        {/* Header */}
        <div className="bg-excel-green px-4 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-300" />
            <div>
              <h3 className="font-bold text-sm sm:text-base">Heatmap Hari & Jam Trading Terbaik</h3>
              <p className="text-[11px] text-emerald-100">
                Temukan hari yang paling menguntungkan bagi gaya trading Anda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Best Day Highlight */}
          {bestDay && bestDay[1].count > 0 && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">
                  Hari Paling Menghasilkan (Golden Day):
                </span>
                <span className="text-lg font-extrabold text-emerald-950 font-mono">
                  {bestDay[0]} ({bestDay[1].pips > 0 ? `+${bestDay[1].pips}` : bestDay[1].pips} Pips)
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-800">
                  WR: {((bestDay[1].wins / bestDay[1].count) * 100).toFixed(0)}%
                </span>
                <span className="text-[10px] text-gray-500 block">
                  {bestDay[1].count} kali trade
                </span>
              </div>
            </div>
          )}

          {/* Table Matriks Hari */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 text-gray-600 border-b border-gray-200 font-semibold">
                <tr>
                  <th className="p-2.5">Hari</th>
                  <th className="p-2.5 text-center">Jumlah Trade</th>
                  <th className="p-2.5 text-center">Win Rate</th>
                  <th className="p-2.5 text-right">Net Pips</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {DAYS.map((day) => {
                  const data = dayStats[day];
                  const winrate = data.count > 0 ? ((data.wins / data.count) * 100).toFixed(0) : '0';
                  const isPositive = data.pips > 0;
                  const isNegative = data.pips < 0;

                  return (
                    <tr key={day} className="hover:bg-white transition-colors">
                      <td className="p-2.5 font-bold text-gray-800 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{day}</span>
                      </td>
                      <td className="p-2.5 text-center font-mono text-gray-600">
                        {data.count}
                      </td>
                      <td className="p-2.5 text-center">
                        {data.count === 0 ? (
                          <span className="text-gray-400">-</span>
                        ) : (
                          <span
                            className={`font-mono font-bold ${
                              Number(winrate) >= 50 ? 'text-emerald-700' : 'text-rose-700'
                            }`}
                          >
                            {winrate}%
                          </span>
                        )}
                      </td>
                      <td
                        className={`p-2.5 text-right font-mono font-bold ${
                          isPositive
                            ? 'text-emerald-700'
                            : isNegative
                            ? 'text-rose-700'
                            : 'text-gray-500'
                        }`}
                      >
                        {data.pips > 0 ? `+${data.pips}` : data.pips} Pips
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Sesi Guide */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 space-y-1.5">
            <span className="font-bold text-blue-900 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-600" /> Karakteristik Jam Pasar Forex (WIB):
            </span>
            <ul className="list-disc list-inside space-y-1 text-blue-800 text-[11px]">
              <li><strong>06:00 - 13:00 (Asia)</strong>: Volatilitas cenderung rendah, cocok untuk scalping range bound / pair JPY & AUD.</li>
              <li><strong>13:00 - 19:00 (London)</strong>: Awal tren besar harian untuk EUR/USD & GBP/USD.</li>
              <li><strong>19:00 - 23:00 (Overlap London & New York)</strong>: Jam tersibuk di dunia dengan volume transaksi tertinggi (Gold XAU/USD sangat aktif).</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-excel-green text-white font-bold rounded text-xs hover:bg-excel-darkgreen transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

