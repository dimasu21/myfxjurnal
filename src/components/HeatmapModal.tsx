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
      <div className="bg-white dark:bg-[#111827] rounded-xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-slate-800 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 text-xs text-gray-800 dark:text-slate-100 transition-colors">
        {/* Header */}
        <div className="bg-excel-green px-4 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-300" />
            <div>
              <h3 className="font-bold text-sm">Heatmap Hari & Jam Trading Terbaik</h3>
              <p className="text-[10px] text-emerald-100">Temukan golden time dan hari dengan win rate tertinggi Anda</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Highlight Hari Terbaik */}
          <div className="bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-transparent p-3 rounded-xl border border-emerald-500/30 dark:border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-400 text-gray-900 rounded-lg font-extrabold shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-slate-400 tracking-wider block">
                  Hari Paling Menguntungkan
                </span>
                <strong className="text-sm font-extrabold text-emerald-800 dark:text-emerald-300">
                  {bestDay && bestDay[1].pips > 0 ? `${bestDay[0]} (+${bestDay[1].pips} Pips)` : 'Data belum cukup'}
                </strong>
              </div>
            </div>
            {bestDay && bestDay[1].count > 0 && (
              <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold bg-white dark:bg-slate-800 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                Win Rate: {Math.round((bestDay[1].wins / bestDay[1].count) * 100)}%
              </span>
            )}
          </div>

          {/* Grid Hari dalam Seminggu */}
          <div>
            <h4 className="text-xs font-bold text-gray-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-excel-green dark:text-emerald-400" />
              <span>Performa Berdasarkan Hari Eksekusi</span>
            </h4>

            <div className="grid grid-cols-5 gap-2">
              {DAYS.map((day) => {
                const stat = dayStats[day];
                const wr = stat.count > 0 ? Math.round((stat.wins / stat.count) * 100) : 0;
                const isPositive = stat.pips > 0;
                const isNegative = stat.pips < 0;

                // Hitung warna heatmap
                let bgStyle = 'bg-gray-50 dark:bg-slate-800/80 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400';
                if (stat.count > 0) {
                  if (wr >= 60) {
                    bgStyle = 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-400 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200';
                  } else if (wr >= 40) {
                    bgStyle = 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200';
                  } else {
                    bgStyle = 'bg-rose-100 dark:bg-rose-950/80 border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-200';
                  }
                }

                return (
                  <div
                    key={day}
                    className={`p-2.5 rounded-lg border text-center transition-all ${bgStyle}`}
                  >
                    <span className="font-bold block text-xs">{day}</span>
                    <span className="text-[10px] opacity-75 font-mono block mt-0.5">
                      {stat.count} trade
                    </span>

                    <div className="my-1.5">
                      <span className="text-sm font-extrabold font-mono block">
                        {stat.count > 0 ? `${wr}%` : '-'}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider block opacity-75">
                        Win Rate
                      </span>
                    </div>

                    <div
                      className={`text-[10px] font-mono font-bold pt-1 border-t border-black/10 dark:border-white/10 ${
                        isPositive ? 'text-emerald-700 dark:text-emerald-300' : isNegative ? 'text-rose-700 dark:text-rose-300' : 'text-gray-500'
                      }`}
                    >
                      {stat.count > 0 ? (isPositive ? `+${stat.pips}p` : `${stat.pips}p`) : '0p'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Matrix Jam / Sesi Trading */}
          <div>
            <h4 className="text-xs font-bold text-gray-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Pedoman Waktu Volatilitas & Likuiditas Pasar</span>
            </h4>

            <div className="space-y-2">
              {SESSIONS.map((sess, idx) => (
                <div
                  key={sess.key}
                  className="p-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/60 flex items-center justify-between"
                >
                  <div>
                    <strong className="block text-xs font-bold text-gray-800 dark:text-slate-100">{sess.name}</strong>
                    <span className="text-[10px] text-gray-500 dark:text-slate-400">
                      {idx === 0 && 'Karakter: Sideways, cocok untuk scalping range sempit (Asia)'}
                      {idx === 1 && 'Karakter: Breakout dan awal tren harian besar (Eropa / London)'}
                      {idx === 2 && 'Karakter: Volatilitas tertinggi saat overlap London-NY + Berita US'}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    A+ Prime
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-excel-green hover:bg-excel-darkgreen text-white font-bold rounded text-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
