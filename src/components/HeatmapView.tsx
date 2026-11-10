import React, { useEffect } from 'react';
import { Trade } from '../types/trade';
import { 
  ArrowLeft, 
  LayoutGrid, 
  Calendar, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  BarChart3,
  Globe
} from 'lucide-react';
import { SiteFooter } from './SiteFooter';

interface HeatmapViewProps {
  onBack: () => void;
  trades: Trade[];
}

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
const SESSIONS = [
  { name: 'Sesi Asia', hours: '06:00 - 13:00 WIB', key: 'ASIA', desc: 'Volatilitas rendah, pair JPY & AUD aktif' },
  { name: 'Sesi London', hours: '13:00 - 19:00 WIB', key: 'LONDON', desc: 'Volatilitas tinggi, breakout & trend pair EUR/GBP' },
  { name: 'Sesi New York', hours: '19:00 - 03:00 WIB', key: 'NY', desc: 'Likuiditas maksimal, overlap London-NY, rilis US News' },
];

export const HeatmapView: React.FC<HeatmapViewProps> = ({ onBack, trades }) => {
  // Keyboard shortcut Esc to go back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  // Analisis performa per hari dalam seminggu
  const dayStats: { [day: string]: { count: number; wins: number; losses: number; pips: number } } = {
    Senin: { count: 0, wins: 0, losses: 0, pips: 0 },
    Selasa: { count: 0, wins: 0, losses: 0, pips: 0 },
    Rabu: { count: 0, wins: 0, losses: 0, pips: 0 },
    Kamis: { count: 0, wins: 0, losses: 0, pips: 0 },
    Jumat: { count: 0, wins: 0, losses: 0, pips: 0 },
  };

  trades.forEach((t) => {
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
      const dayIndex = d.getDay();
      const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const name = dayNames[dayIndex];
      if (dayStats[name]) {
        dayStats[name].count += 1;
        if (t.pips > 0 || t.status === 'WIN') {
          dayStats[name].wins += 1;
        } else if (t.pips < 0 || t.status === 'LOSS') {
          dayStats[name].losses += 1;
        }
        dayStats[name].pips += Number(t.pips) || 0;
      }
    }
  });

  // Cari hari terbaik & terburuk
  const activeDays = DAYS.map((day) => ({
    day,
    ...dayStats[day],
    winRate: dayStats[day].count > 0 ? (dayStats[day].wins / dayStats[day].count) * 100 : 0,
  }));

  const tradedDays = activeDays.filter((d) => d.count > 0);
  const bestDay = tradedDays.length > 0 ? [...tradedDays].sort((a, b) => b.winRate - a.winRate)[0] : null;
  const worstDay = tradedDays.length > 0 ? [...tradedDays].sort((a, b) => a.winRate - b.winRate)[0] : null;
  const totalNetPips = tradedDays.reduce((acc, d) => acc + d.pips, 0);

  return (
    <div className="flex-1 flex flex-col bg-[#f8fafc] dark:bg-[#0b1120] text-gray-800 dark:text-slate-100 overflow-y-auto">
      {/* Top Bar Navigation */}
      <div className="bg-white dark:bg-[#0f172a] border-b border-gray-200 dark:border-slate-800 px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 transition-colors"
            title="Kembali ke lembar kerja Excel (Esc)"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Sheet</span>
          </button>
          <div className="h-5 w-[1px] bg-gray-300 dark:bg-slate-700 hidden sm:block" />
          <div>
            <h1 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-amber-500" />
              <span>Heatmap Waktu & Hari Trading</span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-slate-400 hidden sm:block">
              Analisis statistik hari dan sesi paling menguntungkan dari rekam jejak jurnal Anda
            </p>
          </div>
        </div>

        <div className="text-xs text-gray-500 dark:text-slate-400 font-mono">
          Sampel Jurnal: <strong className="text-gray-900 dark:text-white">{trades.length} Baris</strong>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
            <span className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider block">
              Hari Performa Terbaik
            </span>
            <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {bestDay && bestDay.count > 0 ? bestDay.day : 'Belum Cukup Data'}
            </div>
            <span className="text-xs text-gray-500 dark:text-slate-400">
              {bestDay && bestDay.count > 0 ? `Win Rate ${bestDay.winRate.toFixed(0)}% (${bestDay.count} trade)` : 'Catat trade di jurnal'}
            </span>
          </div>

          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
            <span className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider block">
              Hari Perlu Waspada
            </span>
            <div className="text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
              {worstDay && worstDay.count > 0 ? worstDay.day : 'Aman / Nihil'}
            </div>
            <span className="text-xs text-gray-500 dark:text-slate-400">
              {worstDay && worstDay.count > 0 ? `Win Rate ${worstDay.winRate.toFixed(0)}% (${worstDay.count} trade)` : 'Belum ada hari loss'}
            </span>
          </div>

          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
            <span className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider block">
              Total Akumulasi Pips
            </span>
            <div className={`text-xl sm:text-2xl font-bold font-mono mt-1 ${totalNetPips >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {totalNetPips >= 0 ? `+${totalNetPips.toFixed(1)}` : totalNetPips.toFixed(1)}
            </div>
            <span className="text-xs text-gray-500 dark:text-slate-400">Seluruh sesi & hari aktif</span>
          </div>

          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
            <span className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider block">
              Sesi Utama Rekomendasi
            </span>
            <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
              London & NY
            </div>
            <span className="text-xs text-gray-500 dark:text-slate-400">Overlap 19:00 - 22:00 WIB</span>
          </div>
        </div>

        {/* Day-of-Week Matrix */}
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-600 dark:text-slate-300" />
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                Distribusi & Win Rate Hari Trading (Senin - Jumat)
              </h2>
            </div>
            <span className="text-xs text-gray-400">Berdasarkan tanggal eksekusi</span>
          </div>

          <div className="space-y-3">
            {activeDays.map((d) => (
              <div
                key={d.day}
                className="p-3 rounded-lg border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="w-28 shrink-0">
                  <span className="font-bold text-xs text-gray-900 dark:text-white block">{d.day}</span>
                  <span className="text-[11px] text-gray-500 dark:text-slate-400">
                    {d.count} Transaksi
                  </span>
                </div>

                {/* Progress Bar Win Rate */}
                <div className="flex-1 min-w-[150px]">
                  <div className="flex justify-between text-[11px] font-semibold mb-1">
                    <span className="text-gray-600 dark:text-slate-400">Win Rate</span>
                    <span className="text-gray-900 dark:text-white font-mono">{d.winRate.toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        d.winRate >= 60
                          ? 'bg-emerald-500'
                          : d.winRate >= 45
                          ? 'bg-amber-500'
                          : d.count === 0
                          ? 'bg-transparent'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${d.winRate}%` }}
                    />
                  </div>
                </div>

                {/* Wins & Losses Counts */}
                <div className="flex items-center gap-4 text-xs shrink-0 font-mono">
                  <div className="text-emerald-600 dark:text-emerald-400">
                    <span className="font-bold">{d.wins}</span> Win
                  </div>
                  <div className="text-rose-600 dark:text-rose-400">
                    <span className="font-bold">{d.losses}</span> Loss
                  </div>
                  <div className={`font-bold w-20 text-right ${d.pips >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {d.pips >= 0 ? `+${d.pips.toFixed(1)}` : d.pips.toFixed(1)} pips
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Forex Market Sessions Guide */}
        <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-slate-800 pb-3">
            <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
              Karakteristik Sesi Pasar Forex Global
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SESSIONS.map((sess) => (
              <div
                key={sess.key}
                className="p-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs text-gray-900 dark:text-white">{sess.name}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300">
                    {sess.hours}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                  {sess.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Informative Note */}
        <div className="p-4 rounded-xl bg-gray-100 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 text-xs text-gray-600 dark:text-slate-300 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-gray-500 dark:text-slate-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Catatan Transparansi:</strong> Seluruh statistik di halaman Heatmap ini dihitung murni dari baris transaksi yang telah Anda simpan di Jurnal Trading ini. Sistem tidak menghubungkan API diam-diam ke broker MetaTrader manapun, menjaga privasi dan keamanan akun Anda 100%.
          </p>
        </div>

        {/* Footer */}
        <SiteFooter />
      </div>
    </div>
  );
};

