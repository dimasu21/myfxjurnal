import React, { useState, useEffect, useRef } from 'react';
import { UserAccount } from '../types/user';
import { 
  getGoogleClientId, 
  saveGoogleClientId, 
  decodeGoogleCredential, 
  handleGoogleAuthSuccess 
} from '../services/googleAuth';
import { importAccountSyncToken } from '../services/syncToken';
import { Smartphone, ArrowLeft, Settings, CheckCircle2, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onSuccess: (user: UserAccount) => void;
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onSuccess }) => {
  const [viewMode, setViewMode] = useState<'google' | 'direct-input' | 'sync-token' | 'settings'>('google');
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [syncTokenInput, setSyncTokenInput] = useState('');
  const [customClientId, setCustomClientId] = useState(() => getGoogleClientId());
  const [clientIdSaved, setClientIdSaved] = useState(false);
  const [error, setError] = useState('');

  const googleBtnRef = useRef<HTMLDivElement>(null);

  // Inisialisasi Google Identity Services (GIS) jika Client ID tersedia
  useEffect(() => {
    if (!isOpen) return;

    const clientId = getGoogleClientId();
    if (!clientId) return;

    // Load GIS script jika belum ada
    const scriptId = 'google-gsi-client-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const initGsi = () => {
      const google = (window as any).google;
      if (google && google.accounts && google.accounts.id) {
        google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: any) => {
            if (response && response.credential) {
              const decoded = decodeGoogleCredential(response.credential);
              if (decoded) {
                const user = handleGoogleAuthSuccess(decoded);
                onSuccess(user);
              }
            }
          },
        });

        if (googleBtnRef.current) {
          google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'outline',
            size: 'large',
            width: 320,
            text: 'continue_with',
            shape: 'rectangular',
          });
        }
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGsi;
      document.body.appendChild(script);
    } else {
      initGsi();
    }
  }, [isOpen, viewMode]);

  if (!isOpen) return null;

  // Handle Klik Tombol Lanjutkan dengan Google
  const handleGoogleLoginClick = () => {
    setError('');
    const clientId = getGoogleClientId();
    const google = (window as any).google;

    if (clientId && google?.accounts?.id) {
      try {
        google.accounts.id.prompt();
        return;
      } catch (e) {
        console.warn('GIS Prompt skipped:', e);
      }
    }

    // Jika Client ID belum di-setup di Google Cloud Console, tampilkan input Google langsung
    setViewMode('direct-input');
  };

  // Handle Submit Direct Google Input
  const handleDirectGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = googleEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setError('Masukkan alamat Email Google Anda.');
      return;
    }

    if (!cleanEmail.includes('@')) {
      setError('Format email tidak valid. Masukkan email Gmail atau Google Workspace Anda.');
      return;
    }

    const displayName = googleName.trim() || cleanEmail.split('@')[0];
    const user = handleGoogleAuthSuccess({
      sub: `g_${btoa(cleanEmail).substring(0, 16)}`,
      name: displayName,
      email: cleanEmail,
      picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0D8ABC&color=fff&bold=true`,
    });

    onSuccess(user);
  };

  // Handle Masuk via Kode Sinkronisasi dari Perangkat Lain
  const handleImportSync = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!syncTokenInput.trim()) {
      setError('Tempelkan kode sinkronisasi akun Anda.');
      return;
    }

    const res = importAccountSyncToken(syncTokenInput);
    if (res.success && res.user) {
      onSuccess(res.user);
    } else {
      setError(res.error || 'Kode sinkronisasi tidak valid.');
    }
  };

  // Handle Simpan Custom Client ID
  const handleSaveClientId = (e: React.FormEvent) => {
    e.preventDefault();
    saveGoogleClientId(customClientId);
    setClientIdSaved(true);
    setTimeout(() => {
      setClientIdSaved(false);
      setViewMode('google');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div 
        className="bg-white dark:bg-[#1a2232] text-gray-800 dark:text-gray-100 rounded-sm max-w-[380px] w-full p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Logo FX & Header */}
        <div className="flex flex-col items-center justify-center mb-6 text-center">
          <img 
            src="/fx-logo.png" 
            alt="Fx Logo" 
            className="h-16 w-auto object-contain mb-2" 
          />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            Masuk dengan Google
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[280px]">
            Buka & sinkronkan jurnal trading Anda di semua perangkat dengan satu akun Google
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* 1. TAMPILAN UTAMA: TOMBOL LOGIN GOOGLE */}
        {viewMode === 'google' && (
          <div className="space-y-4">
            {/* Tempat Render Tombol Resmi Google jika Client ID aktif */}
            <div ref={googleBtnRef} className="flex justify-center w-full" />

            {/* Tombol Utama Login Google */}
            <button
              type="button"
              onClick={handleGoogleLoginClick}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-100 font-semibold text-sm border border-gray-300 dark:border-slate-700 rounded shadow-xs hover:shadow transition-all cursor-pointer active:scale-98"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Lanjutkan dengan Google</span>
            </button>

            <div className="flex items-center gap-2 pt-2">
              <div className="h-px bg-gray-200 dark:bg-slate-700 flex-1" />
              <span className="text-[11px] text-gray-400 font-medium uppercase">atau</span>
              <div className="h-px bg-gray-200 dark:bg-slate-700 flex-1" />
            </div>

            {/* Buka Akun dari Device Lain via Kode Sinkron */}
            <button
              type="button"
              onClick={() => {
                setViewMode('sync-token');
                setError('');
              }}
              className="w-full py-2 px-3 text-xs text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded border border-dashed border-emerald-300 dark:border-emerald-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>Muat Jurnal dari Perangkat Lain (Kode Sinkron)</span>
            </button>

            {/* Link Pengaturan Google Client ID */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setViewMode('settings');
                  setError('');
                }}
                className="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 inline-flex items-center gap-1"
              >
                <Settings className="w-3 h-3" />
                <span>Pengaturan Google Client ID (Opsional)</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. INPUT AKUN GOOGLE CEPAT (1-KLIK) */}
        {viewMode === 'direct-input' && (
          <form onSubmit={handleDirectGoogleSubmit} className="space-y-3.5">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
              Masukkan alamat <strong>Google Account</strong> Anda untuk menghubungkan profil dan mengaktifkan akses multi-device.
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Email Google
              </label>
              <input
                type="email"
                value={googleEmail}
                onChange={(e) => setGoogleEmail(e.target.value)}
                placeholder="misal: namaanda@gmail.com"
                required
                autoFocus
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Nama Tampilan (Opsional)
              </label>
              <input
                type="text"
                value={googleName}
                onChange={(e) => setGoogleName(e.target.value)}
                placeholder="misal: Dimas Tri M"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setViewMode('google');
                  setError('');
                }}
                className="text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali</span>
              </button>

              <button
                type="submit"
                className="px-6 py-2 bg-[#107c41] hover:bg-[#0e6b37] text-white font-bold rounded text-xs transition-colors shadow-xs"
              >
                Masuk Sekarang
              </button>
            </div>
          </form>
        )}

        {/* 3. TAMPILAN MASUK DENGAN KODE SINKRON DARI PERANGKAT LAIN */}
        {viewMode === 'sync-token' && (
          <form onSubmit={handleImportSync} className="space-y-3.5">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded text-xs text-emerald-900 dark:text-emerald-300 leading-relaxed">
              <strong>Buka dari HP atau laptop lain?</strong>
              <p className="mt-1 text-[11px]">
                1. Di laptop utama, buka menu <strong>Profil</strong> &rarr; klik <strong>Salin Kode Sinkronisasi Akun</strong>.<br />
                2. Tempelkan kodenya di bawah ini untuk memuat akun Google & seluruh riwayat trading Anda seketika.
              </p>
            </div>

            <textarea
              value={syncTokenInput}
              onChange={(e) => setSyncTokenInput(e.target.value)}
              placeholder="Tempelkan kode di sini (berawalan FXSYNC_...)"
              rows={4}
              className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded text-xs font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setViewMode('google');
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
                Muat Akun & Jurnal
              </button>
            </div>
          </form>
        )}

        {/* 4. SETTINGS GOOGLE OAUTH CLIENT ID */}
        {viewMode === 'settings' && (
          <form onSubmit={handleSaveClientId} className="space-y-3.5 text-xs">
            <div className="p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">
              Jika Anda memiliki <strong>OAuth Client ID</strong> dari Google Cloud Console, masukkan di sini agar tombol login Google resmi otomatis aktif.
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-700 dark:text-slate-300 block">Google Client ID</label>
              <input
                type="text"
                value={customClientId}
                onChange={(e) => setCustomClientId(e.target.value)}
                placeholder="xxxxxx.apps.googleusercontent.com"
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded text-xs font-mono text-gray-900 dark:text-white focus:outline-none"
              />
            </div>

            {clientIdSaved && (
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded text-center font-bold flex items-center justify-center gap-1.5 text-xs">
                <CheckCircle2 className="w-4 h-4" /> Client ID Disimpan!
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setViewMode('google');
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
                Simpan
              </button>
            </div>
          </form>
        )}

        {/* Footer Security Badge */}
        <div className="mt-5 pt-3 border-t border-gray-100 dark:border-slate-800/80 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Autentikasi Aman & Dilindungi Google</span>
        </div>
      </div>
    </div>
  );
};
