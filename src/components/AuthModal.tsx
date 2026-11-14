import React, { useState, useEffect, useRef, useCallback } from 'react';
import { UserAccount } from '../types/user';
import { 
  getGoogleClientId, 
  decodeGoogleCredential, 
  handleGoogleAuthSuccess 
} from '../services/googleAuth';
import { importAccountSyncToken } from '../services/syncToken';
import { Smartphone, ArrowLeft, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onSuccess: (user: UserAccount) => void;
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onSuccess }) => {
  const [viewMode, setViewMode] = useState<'google' | 'sync-token'>('google');
  const [syncTokenInput, setSyncTokenInput] = useState('');
  const [error, setError] = useState('');
  const [isGsiLoading, setIsGsiLoading] = useState(true);

  const googleBtnRef = useRef<HTMLDivElement>(null);
  const gsiInitialized = useRef(false);

  const onGoogleResponse = useCallback((response: any) => {
    if (response?.credential) {
      const decoded = decodeGoogleCredential(response.credential);
      if (decoded) {
        const user = handleGoogleAuthSuccess(decoded);
        onSuccess(user);
      } else {
        setError('Gagal membaca respons dari Google. Silakan coba lagi.');
      }
    }
  }, [onSuccess]);

  // Load & init Google Identity Services
  useEffect(() => {
    if (!isOpen || viewMode !== 'google') return;

    const clientId = getGoogleClientId();
    if (!clientId) {
      setIsGsiLoading(false);
      setError('Google Client ID belum dikonfigurasi.');
      return;
    }

    const initGsi = () => {
      const g = (window as any).google;
      if (!g?.accounts?.id) return;

      g.accounts.id.initialize({
        client_id: clientId,
        callback: onGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Render tombol resmi Google di container
      if (googleBtnRef.current) {
        googleBtnRef.current.innerHTML = '';
        g.accounts.id.renderButton(googleBtnRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: Math.min(320, window.innerWidth - 64),
        });
      }

      gsiInitialized.current = true;
      setIsGsiLoading(false);
    };

    const scriptId = 'google-gsi-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        // GIS needs a tiny tick after script load
        setTimeout(initGsi, 100);
      };
      script.onerror = () => {
        setIsGsiLoading(false);
        setError('Gagal memuat Google Sign-In. Periksa koneksi internet Anda.');
      };
      document.head.appendChild(script);
    } else {
      // Script sudah ada, langsung init
      setTimeout(initGsi, 50);
    }
  }, [isOpen, viewMode, onGoogleResponse]);

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div 
        className="bg-white dark:bg-[#1a2232] text-gray-800 dark:text-gray-100 rounded-lg max-w-[380px] w-full p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Logo & Header */}
        <div className="flex flex-col items-center justify-center mb-6 text-center">
          <img 
            src="/fx-logo.png" 
            alt="Fx Logo" 
            className="h-14 w-auto object-contain mb-3" 
          />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {viewMode === 'google' ? 'Masuk ke FX Journal' : 'Masuk dari Perangkat Lain'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {viewMode === 'google'
              ? 'Gunakan akun Google untuk mengakses jurnal trading Anda'
              : 'Tempelkan kode sinkronisasi dari perangkat utama'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* MODE 1: GOOGLE SIGN-IN */}
        {viewMode === 'google' && (
          <div className="space-y-5">
            {/* Container untuk tombol Google resmi */}
            <div className="flex justify-center min-h-[44px]">
              {isGsiLoading ? (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memuat Google Sign-In…</span>
                </div>
              ) : null}
              <div ref={googleBtnRef} className="flex justify-center" />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <div className="h-px bg-gray-200 dark:bg-slate-700 flex-1" />
              <span className="text-[11px] text-gray-400">atau</span>
              <div className="h-px bg-gray-200 dark:bg-slate-700 flex-1" />
            </div>

            {/* Link ke Kode Sinkronisasi */}
            <button
              type="button"
              onClick={() => {
                setViewMode('sync-token');
                setError('');
              }}
              className="w-full py-2.5 px-3 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 rounded border border-gray-200 dark:border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-gray-400" />
              <span>Muat jurnal dari perangkat lain</span>
            </button>
          </div>
        )}

        {/* MODE 2: KODE SINKRONISASI */}
        {viewMode === 'sync-token' && (
          <form onSubmit={handleImportSync} className="space-y-4">
            <div className="p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
              <p className="text-[11px]">
                1. Di perangkat utama, buka <strong>Profil</strong> lalu klik <strong>Salin Kode Sinkronisasi Akun</strong>.<br />
                2. Tempelkan kodenya di bawah ini.
              </p>
            </div>

            <textarea
              value={syncTokenInput}
              onChange={(e) => setSyncTokenInput(e.target.value)}
              placeholder="Tempelkan kode di sini (berawalan FXSYNC_...)"
              rows={4}
              className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded text-xs font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />

            <div className="flex items-center justify-between">
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
                Muat Akun
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
