import React, { useState } from 'react';
import { UserAccount } from '../types/user';
import { registerUser, loginUser } from '../utils/authStorage';
import { Mail, User, ShieldCheck, ArrowRight, Lock, Sparkles, TrendingUp } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onSuccess: (user: UserAccount) => void;
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onSuccess, onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [broker, setBroker] = useState('MetaTrader 5');
  const [initialBalance, setInitialBalance] = useState('1000');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      if (!username.trim() || !email.trim()) {
        setError('Harap isi username dan email Anda.');
        return;
      }
      const res = registerUser(username, email, broker, Number(initialBalance) || 1000);
      if (res.success && res.user) {
        onSuccess(res.user);
      } else {
        setError(res.error || 'Gagal mendaftar.');
      }
    } else {
      if (!email.trim()) {
        setError('Harap masukkan email atau username Anda.');
        return;
      }
      const res = loginUser(email);
      if (res.success && res.user) {
        onSuccess(res.user);
      } else {
        setError(res.error || 'Akun tidak ditemukan.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-[#111827] text-gray-900 dark:text-slate-100 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-slate-800 space-y-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Brand & Logo Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <img 
            src="/fx-logo.png" 
            alt="Fx" 
            className="h-10 w-auto object-contain mb-1" 
          />
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
            {isRegister ? 'Buat Akun Trader Baru' : 'Masuk ke Akun Jurnal'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-slate-400 max-w-xs">
            {isRegister 
              ? 'Data jurnal Anda akan otomatis tersimpan permanen di profil akun Anda tanpa takut hilang.'
              : 'Akses portofolio, analitik performa, dan riwayat jurnal trading pribadi Anda.'}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider block">
                Username / Panggilan
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="misal: Dimas Trader"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider block">
              {isRegister ? 'Alamat Email' : 'Email atau Username'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isRegister ? 'trader@domain.com' : 'Masukkan email atau username'}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {isRegister && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider block">
                  Platform Broker
                </label>
                <select
                  value={broker}
                  onChange={(e) => setBroker(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:outline-none"
                >
                  <option value="MetaTrader 5">MetaTrader 5 (MT5)</option>
                  <option value="MetaTrader 4">MetaTrader 4 (MT4)</option>
                  <option value="cTrader">cTrader</option>
                  <option value="TradingView Paper">TradingView</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider block">
                  Modal Awal ($)
                </label>
                <input
                  type="number"
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(e.target.value)}
                  placeholder="1000"
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:outline-none font-mono"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 mt-2"
          >
            <span>{isRegister ? 'Daftar & Buat Akun Baru' : 'Masuk ke Beranda'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Register / Login */}
        <div className="text-center pt-2 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-500 dark:text-slate-400">
          {isRegister ? (
            <p>
              Sudah punya akun?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setError('');
                }}
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline ml-1"
              >
                Langsung Masuk
              </button>
            </p>
          ) : (
            <p>
              Belum punya akun?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setError('');
                }}
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline ml-1"
              >
                Daftar Gratis Di Sini
              </button>
            </p>
          )}
        </div>

        {/* Guarantee Info */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 dark:text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Akun tersimpan otomatis, aman, dan privasi terjaga</span>
        </div>
      </div>
    </div>
  );
};
