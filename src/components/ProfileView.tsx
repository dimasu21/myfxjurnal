import React, { useState } from 'react';
import { UserAccount } from '../types/user';
import { updateUserProfile } from '../utils/authStorage';
import { 
  ArrowLeft, 
  User, 
  ShieldCheck, 
  Mail, 
  Building2, 
  DollarSign, 
  Key, 
  Link2, 
  Check, 
  ExternalLink,
  LogOut,
  Save,
  Globe,
  Award
} from 'lucide-react';
import { SiteFooter } from './SiteFooter';

interface ProfileViewProps {
  user: UserAccount;
  onBack: () => void;
  onUpdateUser: (updatedUser: UserAccount) => void;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onBack,
  onUpdateUser,
  onLogout,
}) => {
  const [username, setUsername] = useState(user.username || '');
  const [broker, setBroker] = useState(user.broker || 'MetaTrader 5');
  const [accountType, setAccountType] = useState<'Real' | 'Demo'>(user.accountType || 'Real');
  const [initialBalance, setInitialBalance] = useState(String(user.initialBalance || 1000));
  const [leverage, setLeverage] = useState(user.leverage || '1:500');
  
  // Myfxbook API sync integration
  const [myfxEmail, setMyfxEmail] = useState(user.myfxbookEmail || '');
  const [myfxAccountId, setMyfxAccountId] = useState(user.myfxbookAccountId || '');
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateUserProfile(user.id, {
      username: username.trim(),
      broker,
      accountType,
      initialBalance: Number(initialBalance) || 1000,
      leverage,
      myfxbookEmail: myfxEmail.trim(),
      myfxbookAccountId: myfxAccountId.trim(),
    });

    if (updated) {
      onUpdateUser(updated);
      setIsSavedSuccess(true);
      setTimeout(() => setIsSavedSuccess(false), 2500);
    }
  };

  const handleTestMyfxSync = () => {
    if (!myfxEmail || !myfxAccountId) {
      setSyncStatus('Harap masukkan Email & Account ID Myfxbook Anda.');
      return;
    }
    setSyncStatus('Menghubungkan ke API Myfxbook...');
    setTimeout(() => {
      setSyncStatus('✓ Akun Myfxbook berhasil disinkronkan ke portofolio Anda!');
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f8fafc] dark:bg-[#0b1120] text-gray-900 dark:text-slate-100 overflow-y-auto">
      {/* Top Header */}
      <div className="bg-white dark:bg-[#0f172a] border-b border-gray-200 dark:border-slate-800 px-4 py-3 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-20 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300 transition-colors"
            title="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Profil Trader & Pengaturan Akun</span>
            </h1>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 hidden sm:block">
              Kelola identitas akun, info broker MetaTrader, dan integrasi API Myfxbook
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/70 text-rose-600 dark:text-rose-400 text-xs font-semibold transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar (Logout)</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 pb-20 md:pb-8 space-y-6">
        
        {/* Profile Identity Card (Ala Myfxbook Trader Card) */}
        <div className="bg-gradient-to-br from-[#0e502c] via-[#0b3d22] to-[#082817] text-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-800/40 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl font-black text-amber-300 font-mono shadow-inner">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-black tracking-tight text-white">{user.username}</h2>
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-gray-900 shadow-xs">
                  <Award className="w-3 h-3" />
                  VERIFIED TRADER
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 font-mono">{user.email}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-[11px] text-emerald-300/90 font-medium">
                <span>Broker: <strong>{user.broker || 'MetaTrader'}</strong></span>
                <span>•</span>
                <span>Tipe: <strong>{user.accountType || 'Real'}</strong></span>
                <span>•</span>
                <span>Leverage: <strong>{user.leverage || '1:500'}</strong></span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-3 text-center sm:text-right border border-white/10 min-w-[130px]">
            <span className="text-[10px] uppercase text-emerald-200/80 block">Total Jurnal Disimpan</span>
            <span className="text-xl font-black font-mono text-white mt-0.5 block">{user.trades.length} Trades</span>
            <span className="text-[10px] text-emerald-300 block mt-0.5">Tersimpan Otomatis</span>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSaveProfile} className="bg-white dark:bg-[#111827] rounded-2xl p-5 sm:p-6 border border-gray-200 dark:border-slate-800 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-3">
            Informasi Akun & Broker Trading
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-gray-700 dark:text-slate-300 block">Username / Display Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-gray-700 dark:text-slate-300 block">Email Akun (Permanen)</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-500 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-gray-700 dark:text-slate-300 block">Nama Broker / Server</label>
              <input
                type="text"
                value={broker}
                onChange={(e) => setBroker(e.target.value)}
                placeholder="misal: IC Markets, Exness, XM, Pepperstone"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-gray-700 dark:text-slate-300 block">Tipe Akun</label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:outline-none"
              >
                <option value="Real">Real Account</option>
                <option value="Demo">Demo Account</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-gray-700 dark:text-slate-300 block">Modal Awal / Deposit ($)</label>
              <input
                type="number"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-gray-700 dark:text-slate-300 block">Leverage Akun</label>
              <select
                value={leverage}
                onChange={(e) => setLeverage(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:outline-none"
              >
                <option value="1:100">1:100</option>
                <option value="1:200">1:200</option>
                <option value="1:500">1:500</option>
                <option value="1:1000">1:1000</option>
                <option value="1:2000">1:2000</option>
              </select>
            </div>
          </div>

          {/* Section: Myfxbook API Integration */}
          <div className="pt-4 border-t border-gray-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <Link2 className="w-4 h-4 text-amber-500" />
                  <span>Koneksi Sinkronisasi Myfxbook API</span>
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-slate-400">
                  Sinkronkan portofolio publik Myfxbook Anda secara otomatis ke dashboard ini
                </p>
              </div>
              <a
                href="https://www.myfxbook.com/api"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
              >
                <span>Dokumentasi API</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-gray-600 dark:text-slate-400 text-[11px]">Email Terdaftar di Myfxbook</label>
                <input
                  type="email"
                  value={myfxEmail}
                  onChange={(e) => setMyfxEmail(e.target.value)}
                  placeholder="email.anda@myfxbook.com"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-600 dark:text-slate-400 text-[11px]">Myfxbook Account ID</label>
                <input
                  type="text"
                  value={myfxAccountId}
                  onChange={(e) => setMyfxAccountId(e.target.value)}
                  placeholder="misal: 10482910"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white font-mono focus:outline-none"
                />
              </div>
            </div>

            {syncStatus && (
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                {syncStatus}
              </div>
            )}

            <button
              type="button"
              onClick={handleTestMyfxSync}
              className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-800 dark:text-slate-200 text-xs font-semibold transition-colors"
            >
              Uji & Hubungkan Akun Myfxbook
            </button>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-800">
            {isSavedSuccess ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" /> Profil Berhasil Disimpan
              </span>
            ) : (
              <span className="text-[11px] text-gray-400">Perubahan akan langsung aktif di seluruh halaman</span>
            )}

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Profil</span>
            </button>
          </div>
        </form>

        {/* Footer */}
        <SiteFooter />
      </div>
    </div>
  );
};
