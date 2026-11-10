import React, { useState } from 'react';
import { UserAccount } from '../types/user';
import { registerUser, loginUser } from '../utils/authStorage';

interface AuthModalProps {
  isOpen: boolean;
  onSuccess: (user: UserAccount) => void;
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onSuccess }) => {
  const [isRegister, setIsRegister] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
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

      const res = registerUser(username, email, 'MetaTrader 5', 1000, password);
      if (res.success && res.user) {
        onSuccess(res.user);
      } else {
        setError(res.error || 'Gagal mendaftar.');
      }
    } else {
      if (!email.trim()) {
        setError('Masukkan Nama Pengguna atau Email Anda.');
        return;
      }
      const res = loginUser(email, password);
      if (res.success && res.user) {
        onSuccess(res.user);
      } else {
        setError(res.error || 'Akun tidak ditemukan atau kata sandi salah.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div 
        className="bg-white dark:bg-[#1a2232] text-gray-800 dark:text-gray-100 rounded-sm max-w-[390px] w-full p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Logo FX & Teks Judul */}
        <div className="flex flex-col items-center justify-center mb-6">
          <img 
            src="/fx-logo.png" 
            alt="Fx Logo" 
            className="h-16 w-auto object-contain mb-2" 
          />
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
            {isRegister ? 'Daftar' : 'Masuk'}
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister ? (
            <>
              {/* Nama Pengguna */}
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nama Pengguna"
                className="w-full px-3.5 py-2.5 bg-[#e9eff5] dark:bg-slate-800 border border-[#d6dfe7] dark:border-slate-700 rounded-xs text-slate-800 dark:text-slate-100 placeholder-[#8a9ba8] text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              />

              {/* Email */}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-3.5 py-2.5 bg-[#e9eff5] dark:bg-slate-800 border border-[#d6dfe7] dark:border-slate-700 rounded-xs text-slate-800 dark:text-slate-100 placeholder-[#8a9ba8] text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              />

              {/* Kata Sandi */}
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kata Sandi"
                className="w-full px-3.5 py-2.5 bg-[#e9eff5] dark:bg-slate-800 border border-[#d6dfe7] dark:border-slate-700 rounded-xs text-slate-800 dark:text-slate-100 placeholder-[#8a9ba8] text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              />

              {/* Ketik Ulang Kata Sandi */}
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ketik Ulang Kata Sandi Anda"
                className="w-full px-3.5 py-2.5 bg-[#e9eff5] dark:bg-slate-800 border border-[#d6dfe7] dark:border-slate-700 rounded-xs text-slate-800 dark:text-slate-100 placeholder-[#8a9ba8] text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              />

              {/* Checkbox Ketentuan Layanan */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
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
                className="w-full px-3.5 py-2.5 bg-[#e9eff5] dark:bg-slate-800 border border-[#d6dfe7] dark:border-slate-700 rounded-xs text-slate-800 dark:text-slate-100 placeholder-[#8a9ba8] text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kata Sandi"
                className="w-full px-3.5 py-2.5 bg-[#e9eff5] dark:bg-slate-800 border border-[#d6dfe7] dark:border-slate-700 rounded-xs text-slate-800 dark:text-slate-100 placeholder-[#8a9ba8] text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </>
          )}

          {/* Bottom Row */}
          <div className="flex items-end justify-between pt-3">
            <div>
              {isRegister ? (
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Sudah menjadi anggota?
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegister(false);
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
                    onClick={() => {
                      setIsRegister(true);
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
              className="px-7 py-2 bg-[#e66a00] hover:bg-[#cf5f00] text-white font-bold rounded text-sm transition-colors cursor-pointer shadow-xs active:scale-98"
            >
              {isRegister ? 'Daftar' : 'Masuk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
