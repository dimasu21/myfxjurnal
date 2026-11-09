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
    <div className="space-y-1.5 px-3 py-1.5 bg-rose-950/10 dark:bg-rose-950/30 border-b border-rose-200 dark:border-rose-800 transition-colors">
      {activeWarnings.map((w) => (
        <div
          key={w.id}
          className={`flex items-start justify-between gap-2 p-2.5 rounded-lg border text-xs animate-in fade-in slide-in-from-top-1 ${
            w.severity === 'DANGER'
              ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-200 ring-1 ring-rose-400 dark:ring-rose-600'
              : 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200'
          }`}
        >
          <div className="flex items-start gap-2">
            {w.severity === 'DANGER' ? (
              <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5 animate-bounce" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
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
            className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 p-0.5 rounded"
            title="Tutup pesan ini"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
