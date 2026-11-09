import React, { useState } from 'react';
import { SAMPLE_ECONOMIC_EVENTS } from '../utils/forexHelpers';
import { EconomicEvent } from '../types/realtime';
import { Calendar, AlertCircle, Clock, X, Filter } from 'lucide-react';

interface EconomicCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EconomicCalendarModal: React.FC<EconomicCalendarModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [filterImpact, setFilterImpact] = useState<string>('ALL');

  if (!isOpen) return null;

  const filteredEvents = SAMPLE_ECONOMIC_EVENTS.filter((ev) => {
    if (filterImpact === 'ALL') return true;
    return ev.impact === filterImpact;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl border border-gray-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 text-xs">
        {/* Header */}
        <div className="bg-excel-green px-4 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-200" />
            <div>
              <h3 className="font-bold text-sm sm:text-base">Kalender Ekonomi Forex (Hari Ini)</h3>
              <p className="text-[11px] text-emerald-100">
                Pantau rilis berita fundamental berdampak tinggi (High Impact News)
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

        {/* Filter Bar */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-medium text-gray-700">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <span>Filter Dampak:</span>
          </div>
          <div className="flex gap-1">
            {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterImpact(lvl)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-colors ${
                  filterImpact === lvl
                    ? 'bg-excel-green text-white border-excel-green'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {lvl === 'ALL'
                  ? 'Semua'
                  : lvl === 'HIGH'
                  ? '🔴 Tinggi'
                  : lvl === 'MEDIUM'
                  ? '🟠 Sedang'
                  : '🟡 Rendah'}
              </button>
            ))}
          </div>
        </div>

        {/* Events Table */}
        <div className="p-4 overflow-y-auto max-h-[65vh]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-[11px] font-semibold">
                <th className="pb-2">Waktu</th>
                <th className="pb-2">Mata Uang</th>
                <th className="pb-2">Dampak</th>
                <th className="pb-2">Berita / Event</th>
                <th className="pb-2 text-right">Rilis</th>
                <th className="pb-2 text-right">Prediksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEvents.map((ev) => (
                <tr key={ev.id} className="hover:bg-gray-50/80">
                  <td className="py-2.5 font-mono text-gray-700 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      {ev.time}
                    </span>
                  </td>
                  <td className="py-2.5 font-bold text-gray-900 whitespace-nowrap">
                    <span className="mr-1">{ev.flag}</span>
                    {ev.currency}
                  </td>
                  <td className="py-2.5 whitespace-nowrap">
                    {ev.impact === 'HIGH' ? (
                      <span className="bg-rose-100 text-rose-800 border border-rose-300 font-bold px-1.5 py-0.5 rounded text-[10px]">
                        HIGH
                      </span>
                    ) : ev.impact === 'MEDIUM' ? (
                      <span className="bg-amber-100 text-amber-800 border border-amber-300 font-medium px-1.5 py-0.5 rounded text-[10px]">
                        MED
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-700 border border-gray-300 px-1.5 py-0.5 rounded text-[10px]">
                        LOW
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 font-medium text-gray-800 pr-2">
                    {ev.title}
                  </td>
                  <td className="py-2.5 text-right font-mono font-bold text-gray-900">
                    {ev.actual}
                  </td>
                  <td className="py-2.5 text-right font-mono text-gray-500">
                    {ev.forecast}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Warning */}
        <div className="bg-rose-50 border-t border-rose-200 p-3 text-[11px] text-rose-900 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <p>
            <strong>Peringatan Trader Forex:</strong> Hindari membuka posisi beberapa menit sebelum rilis berita <strong>HIGH IMPACT</strong> karena pelebaran spread dan volatilitas tinggi (slippage).
          </p>
        </div>
      </div>
    </div>
  );
};

