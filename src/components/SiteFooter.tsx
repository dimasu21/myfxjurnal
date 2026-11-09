import React from 'react';
import { TrendingUp, Shield, Database, ExternalLink } from 'lucide-react';

export const SiteFooter: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="hidden md:block bg-white dark:bg-[#0f172a] border-t border-gray-200 dark:border-slate-800 text-xs text-gray-500 dark:text-slate-400 select-none transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">

        {/* Left: brand + tagline */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold text-gray-700 dark:text-slate-200 text-[11px] tracking-wide">
              MyFX Journal
            </span>
          </div>
          <span className="text-gray-300 dark:text-slate-700">|</span>
          <span className="text-[11px] hidden sm:inline">
            Jurnal trading forex profesional — local-first, privasi terjaga
          </span>
        </div>

        {/* Center: trust badges */}
        <div className="flex items-center gap-4 text-[10px] font-semibold">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <Shield className="w-3 h-3" />
            Data Tersimpan Lokal
          </span>
          <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
            <Database className="w-3 h-3" />
            No Server · No Tracking
          </span>
        </div>

        {/* Right: made by + copyright */}
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-gray-400 dark:text-slate-500">
            &copy; {year} &nbsp;
            <a
              href="https://dimasu.site/"
              target="_blank"
              rel="noreferrer noopener"
              className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-0.5"
            >
              dimasu.site
              <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
            </a>
          </span>
          <span className="text-gray-300 dark:text-slate-700">·</span>
          <span className="text-[10px] text-gray-400 dark:text-slate-500">
            All data stored in your browser only
          </span>
        </div>
      </div>
    </footer>
  );
};
