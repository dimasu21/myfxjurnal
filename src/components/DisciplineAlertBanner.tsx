import React from 'react';
import { DisciplineWarning } from '../utils/disciplineGuard';
import { ShieldAlert, AlertTriangle, X } from 'lucide-react';

interface DisciplineAlertBannerProps {
  warnings: DisciplineWarning[];
  onDismiss?: (id: string) => void;
}

export const DisciplineAlertBanner: React.FC<DisciplineAlertBannerProps> = ({
  warnings,
}) => {
  const [dismissed, setDismissed] = React.useState<string[]>([]);

  const activeWarnings = warnings.filter((w) => !dismissed.includes(w.id));
  if (activeWarnings.length === 0) return null;

  return (
    <div className="space-y-1.5 px-3 py-1.5 bg-rose-950/10 border-b border-rose-200">
      {activeWarnings.map((w) => (
        <div
          key={w.id}
          className={`flex items-start justify-between gap-2 p-2.5 rounded-lg border text-xs animate-in fade-in slide-in-from-top-1 ${
            w.severity === 'DANGER'
              ? 'bg-rose-50 border-rose-300 text-rose-900 ring-1 ring-rose-400'
              : 'bg-amber-50 border-amber-300 text-amber-900'
          }`}
        >
          <div className="flex items-start gap-2">
            {w.severity === 'DANGER' ? (
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5 animate-bounce" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <strong className="font-bold block text-[11px] uppercase tracking-wide">
                {w.title}
              </strong>
              <p className="text-[11px] opacity-90 mt-0.5">{w.message}</p>
            </div>
          </div>

          <button
            onClick={() => setDismissed((prev) => [...prev, w.id])}
            className="text-gray-400 hover:text-gray-600 p-0.5 rounded"
            title="Tutup pesan ini"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
