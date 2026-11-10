import React, { useState } from 'react';
import { UserAccount } from '../types/user';
import { registerUser, loginUser } from '../utils/authStorage';
import { Check } from 'lucide-react';

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
  const [isRobotChecked, setIsRobotChecked] = useState(false);
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
      if (!isRobotChecked) {
        setError('Silakan centang verifikasi "I\'m not a robot".');
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

        <form onSubmit={handleSubmit} className="space-y-3">
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

              {/* reCAPTCHA Box */}
              <div 
                onClick={() => setIsRobotChecked(!isRobotChecked)}
                className="cursor-pointer bg-[#f9f9f9] dark:bg-slate-800/60 border border-gray-300 dark:border-slate-700 rounded p-3 flex items-center justify-between select-none hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-xs border-2 flex items-center justify-center transition-colors ${
                    isRobotChecked 
                      ? 'border-emerald-600 bg-emerald-600 text-white' 
                      : 'border-gray-400 bg-white dark:bg-slate-700'
                  }`}>
                    {isRobotChecked && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                  <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                    I'm not a robot
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg viewBox="0 0 48 48" className="w-6 h-6 text-blue-500 fill-current">
                      <path d="M24 8V2l-8 8 8 8v-6c6.63 0 12 5.37 12 12 0 2.03-.51 3.93-1.39 5.61l2.92 2.92C39.08 29.85 40 27.05 40 24c0-8.84-7.16-16-16-16zm-8 8c0-2.03.51-3.93 1.39-5.61l-2.92-2.92C12.92 10.15 12 12.95 12 16c0 8.84 7.16 16 16 16v6l8-8-8-8v6c-6.63 0-12-5.37-12-12z" />
                    </svg>
                  </div>
                  <span className="text-[9px] text-gray-400 tracking-tighter uppercase font-semibold">reCAPTCHA</span>
                </div>
              </div>

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
          <div className="flex items-end justify-between pt-4">
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
