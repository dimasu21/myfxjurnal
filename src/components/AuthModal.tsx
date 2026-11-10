import React, { useState } from 'react';
import { UserAccount } from '../types/user';
import { cloudRegisterUser, cloudLoginUser } from '../services/cloudAuth';
import { importAccountSyncToken } from '../services/syncToken';
import { 
  getSupabaseConfig, 
  saveCustomSupabaseConfig, 
  isSupabaseConfigured, 
  resetSupabaseInstance 
} from '../services/supabaseClient';
import { Cloud, Smartphone, KeyRound, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onSuccess: (user: UserAccount) => void;
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onSuccess }) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'sync-token' | 'supabase-setup'>('register');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [syncTokenInput, setSyncTokenInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // State untuk setup Supabase Cloud
  const currentConfig = getSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(currentConfig.url);
  const [supabaseKey, setSupabaseKey] = useState(currentConfig.anonKey);
  const [supabaseSaved, setSupabaseSaved] = useState(false);

  if (!isOpen) return null;

  // Handle Submit Form Biasa (Daftar / Masuk)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (authMode === 'register') {
      if (!username.trim()) {
        setError('Nama Pengguna harus diisi.');
        return;
      }
      if (!email.trim()) {
        setError('Email harus diisi.');
        return;
      }
      if (!password) {
        setError('Kata Sandi harus diisi.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Ketik ulang kata sandi tidak cocok.');
        return;
      }
      if (!agreeTerms) {
        setError('Harap setujui Ketentuan Layanan & Kebijakan Privasi.');
        return;
      }

      setIsLoading(true);
      try {
        const res = await cloudRegisterUser(username, email, password);
        if (res.success && res.user) {
          onSuccess(res.user);
        } else {
          setError(res.error || 'Gagal mendaftar.');
        }
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan sistem.');
      } finally {
        setIsLoading(false);
      }
    } else if (authMode === 'login') {
      if (!email.trim()) {
        setError('Masukkan Nama Pengguna atau Email Anda.');
        return;
      }
      if (!password) {
        setError('Kata sandi harus diisi.');
        return;
      }

      setIsLoading(true);
      try {
        const res = await cloudLoginUser(email, password);
        if (res.success && res.user) {
          onSuccess(res.user);
        } else {
          setError(res.error || 'Akun tidak ditemukan atau kata sandi salah.');
        }
      } catch (err: any) {
        setError(err.message || 'Gagal masuk.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle Masuk dengan Kode Sinkronisasi dari Device Lain
  const handleImportSyncToken = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!syncTokenInput.trim()) {
      setError('Tempelkan Kode Sinkronisasi yang Anda salin dari perangkat utama.');
      return;
    }

    const res = importAccountSyncToken(syncTokenInput);
    if (res.success && res.user) {
      onSuccess(res.user);
    } else {
      setError(res.error || 'Kode sinkronisasi tidak valid.');
    }
  };

  // Handle Simpan Supabase Kredensial
  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
      setError('Supabase Project URL dan Anon Key harus diisi.');
      return;
    }

    saveCustomSupabaseConfig(supabaseUrl, supabaseKey);
    resetSupabaseInstance();
    setSupabaseSaved(true);
    setError('');
    setTimeout(() => {
      setSupabaseSaved(false);
      setAuthMode('login');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div 
        className="bg-white dark:bg-[#1a2232] text-gray-800 dark:text-gray-100 rounded-sm max-w-[400px] w-full p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Logo FX & Teks Judul */}
        <div className="flex flex-col items-center justify-center mb-5">
          <img 
            src="/fx-logo.png" 
            alt="Fx Logo" 
            className="h-16 w-auto object-contain mb-2" 
          />
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
            {authMode === 'register' && 'Daftar Akun'}
            {authMode === 'login' && 'Masuk Akun'}
            {authMode === 'sync-token' && 'Masuk via Kode Device'}
            {authMode === 'supabase-setup' && 'Database Cloud (Supabase)'}
          </h2>
          <p className="text-[11px] text-gray-500 text-center mt-0.5">
            {isSupabaseConfigured() ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center gap-1">
                <Cloud className="w-3 h-3" /> Cloud Sync Aktif (Multi-Device)
              </span>
            ) : (
              <span>Jurnal Trading Forex Excel</span>
            )}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs text-center font-medium leading-relaxed">
            {error}
          </div>
        )}

        {/* 1. MODE REGISTRASI / LOGIN BIASA */}
        {(authMode === 'register' || authMode === 'login') && (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authMode === 'register' ? (
              <>
                {/* Nama Pengguna */}
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nama Pengguna"
                  disabled={isLoading}
                  className="w-full px-3.5 py-2.5 bg-[#e9eff5] dark:bg-slate-800 border border-[#d6dfe7] dark:border-slate-700 rounded-xs text-slate-800 dark:text-slate-100 placeholder-[#8a9ba8] text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                />

                {/* Email */}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  disabled={isLoading}
                  className="w-full px-3.5 py-2.5 bg-[#e9eff5] dark:bg-slate-800 border border-[#d6dfe7] dark:border-slate-700 rounded-xs text-slate-800 dark:text-slate-100 placeholder-[#8a9ba8] text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                />

                {/* Kata Sandi */}
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kata Sandi"
                  disabled={isLoading}
                  className="w-full px-3.5 py-2.5 bg-[#e9eff5] dark:bg-slate-800 border border-[#d6dfe7] dark:border-slate-700 rounded-xs text-slate-800 dark:text-slate-100 placeholder-[#8a9ba8] text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                />

                {/* Ketik Ulang Kata Sandi */}
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ketik Ulang Kata Sandi Anda"
                  disabled={isLoading}
                  className="w-full px-3.5 py-2.5 bg-[#e9eff5] dark:bg-slate-800 border border-[#d6dfe7] dark:border-slate-700 rounded-xs text-slate-800 dark:text-slate-100 placeholder-[#8a9ba8] text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                />

                {/* Checkbox Ketentuan Layanan */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    disabled={isLoading}
                    className="mt-0.5 w-4 h-4 rounded-xs border-gray-300 text-amber-600 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="agreeTerms" className="text-xs text-gray-600 dark:text-gray-400 leading-tight cursor-pointer">
                    Saya menyetujui{' '}
                    <span className="text-gray-800 dark:text-gray-200 underline">Ketentuan Layanan</span>
                    {' '}&{' '}
                    <span className="text-gray-800 dark:text-gray-200 underline">Kebijakan Privasi</span>.
                  </label>
                </div>
              </>
            ) : (
              <>
                {/* Login mode inputs */}
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nama Pengguna atau Email"
                  disabled={isLoading}
                  className="w-full px-3.5 py-2.5 bg-[#e9eff5] dark:bg-slate-800 border border-[#d6dfe7] dark:border-slate-700 rounded-xs text-slate-800 dark:text-slate-100 placeholder-[#8a9ba8] text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kata Sandi"
                  disabled={isLoading}
                  className="w-full px-3.5 py-2.5 bg-[#e9eff5] dark:bg-slate-800 border border-[#d6dfe7] dark:border-slate-700 rounded-xs text-slate-800 dark:text-slate-100 placeholder-[#8a9ba8] text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </>
            )}

            {/* Bottom Row */}
            <div className="flex items-end justify-between pt-3">
              <div>
                {authMode === 'register' ? (
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Sudah menjadi anggota?
                    </p>
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => {
                        setAuthMode('login');
                        setError('');
                      }}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium block text-left"
                    >
                      Masuk
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Belum menjadi anggota?
                    </p>
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => {
                        setAuthMode('register');
                        setError('');
                      }}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium block text-left"
                    >
                      Daftar
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="px-7 py-2 bg-[#e66a00] hover:bg-[#cf5f00] text-white font-bold rounded text-sm transition-colors cursor-pointer shadow-xs active:scale-98 flex items-center gap-1.5"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{authMode === 'register' ? 'Daftar' : 'Masuk'}</span>
              </button>
            </div>

            {/* Opsi Bantuan Cross-Device */}
            <div className="pt-4 border-t border-gray-100 dark:border-slate-800/80 flex flex-col gap-1.5 text-center">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('sync-token');
                  setError('');
                }}
                className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline flex items-center justify-center gap-1"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Punya akun di device lain? Masuk via Kode Sinkron</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('supabase-setup');
                  setError('');
                }}
                className="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center justify-center gap-1"
              >
                <Cloud className="w-3 h-3" />
                <span>Hubungkan Database Cloud Supabase (Otomatis Multi-Device)</span>
              </button>
            </div>
          </form>
        )}

        {/* 2. MODE MASUK VIA KODE SINKRONISASI (CROSS-DEVICE INSTAN) */}
        {authMode === 'sync-token' && (
          <form onSubmit={handleImportSyncToken} className="space-y-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded text-xs text-emerald-900 dark:text-emerald-300 leading-relaxed">
              <strong>Buka dari HP atau laptop lain?</strong>
              <p className="mt-1 text-[11px] text-emerald-800 dark:text-emerald-300">
                1. Di perangkat utama Anda, buka menu <strong>Profil</strong> &rarr; klik <strong>Salin Kode Sinkronisasi Akun</strong>.<br />
                2. Tempelkan kodenya pada kolom di bawah ini untuk memuat akun dan seluruh jurnal Anda seketika!
              </p>
            </div>

            <div>
              <textarea
                value={syncTokenInput}
                onChange={(e) => setSyncTokenInput(e.target.value)}
                placeholder="Tempelkan Kode Sinkronisasi di sini (berawalan FXSYNC_...)"
                rows={4}
                className="w-full p-2.5 bg-[#e9eff5] dark:bg-slate-800 border border-[#d6dfe7] dark:border-slate-700 rounded text-xs font-mono text-slate-800 dark:text-slate-100 placeholder-[#8a9ba8] focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setError('');
                }}
                className="text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Login</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-[#107c41] hover:bg-[#0e6b37] text-white font-bold rounded text-xs transition-colors shadow-xs"
              >
                Muat Akun & Jurnal
              </button>
            </div>
          </form>
        )}

        {/* 3. MODE SETUP DATABASE CLOUD SUPABASE */}
        {authMode === 'supabase-setup' && (
          <form onSubmit={handleSaveSupabaseConfig} className="space-y-3.5 text-xs">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded text-[11px] text-blue-900 dark:text-blue-300 leading-relaxed">
              Dengan menghubungkan Supabase (100% gratis), Anda cukup mendaftar sekali dan bisa login dari perangkat mana pun di dunia tanpa perlu copy kode.
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-700 dark:text-slate-300 block">Supabase Project URL</label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full px-3 py-2 bg-[#e9eff5] dark:bg-slate-800 border border-[#d6dfe7] dark:border-slate-700 rounded text-xs font-mono text-slate-800 dark:text-slate-100 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-700 dark:text-slate-300 block">Supabase Anon Key</label>
              <input
                type="password"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                className="w-full px-3 py-2 bg-[#e9eff5] dark:bg-slate-800 border border-[#d6dfe7] dark:border-slate-700 rounded text-xs font-mono text-slate-800 dark:text-slate-100 focus:outline-none"
              />
            </div>

            {supabaseSaved && (
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded text-center font-bold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Kredensial Cloud Berhasil Tersambung!
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setError('');
                }}
                className="text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-[#107c41] hover:bg-[#0e6b37] text-white font-bold rounded text-xs transition-colors shadow-xs"
              >
                Simpan & Hubungkan
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
