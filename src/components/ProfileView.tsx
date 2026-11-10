import React, { useState, useRef } from 'react';
import { UserAccount } from '../types/user';
import { updateUserProfile } from '../utils/authStorage';
import { 
  ArrowLeft, 
  Camera, 
  Check, 
  Save, 
  LogOut, 
  ExternalLink,
  Link2,
  Trash2
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
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const [broker, setBroker] = useState(user.broker || '');
  const [accountType, setAccountType] = useState<string>(user.accountType || '');
  const [initialBalance, setInitialBalance] = useState(user.initialBalance ? String(user.initialBalance) : '');
  const [leverage, setLeverage] = useState(user.leverage || '');
  
  // Myfxbook link / account ID
  const [myfxEmail, setMyfxEmail] = useState(user.myfxbookEmail || '');
  const [myfxAccountId, setMyfxAccountId] = useState(user.myfxbookAccountId || '');
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle upload foto dari komputer / HP
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran foto maksimal 2 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateUserProfile(user.id, {
      username: username.trim(),
      avatarUrl: avatarUrl.trim(),
      broker: broker.trim() || undefined,
      accountType: (accountType as any) || undefined,
      initialBalance: initialBalance ? Number(initialBalance) : undefined,
      leverage: leverage.trim() || undefined,
      myfxbookEmail: myfxEmail.trim() || undefined,
      myfxbookAccountId: myfxAccountId.trim() || undefined,
    });

    if (updated) {
      onUpdateUser(updated);
      setIsSavedSuccess(true);
      setTimeout(() => setIsSavedSuccess(false), 2500);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f4f7f9] dark:bg-[#0f172a] text-gray-900 dark:text-slate-100 overflow-y-auto">
      {/* Hidden File Input for Photo Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoUpload}
      />

      {/* Main Container Terpusat (Tanpa Header Banner Norak) */}
      <div className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 pb-20 space-y-6">

        {/* Back Link */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-[#107c41] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>

          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/70 text-rose-600 dark:text-rose-400 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Akun</span>
          </button>
        </div>

        {/* Form Edit Profil Bersih */}
        <form onSubmit={handleSaveProfile} className="bg-white dark:bg-[#1a2232] rounded border border-gray-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-6">
          
          {/* SECTION: FOTO PROFIL (Bisa Upload Foto) */}
          <div className="flex flex-col sm:flex-row items-center gap-5 pb-5 border-b border-gray-100 dark:border-slate-800">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-emerald-800 border-2 border-emerald-600 text-white flex items-center justify-center text-3xl font-bold shadow-md">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Foto Profil" className="w-full h-full object-cover" />
                ) : (
                  <span>{username.charAt(0).toUpperCase() || 'U'}</span>
                )}
              </div>

              {/* Tombol Kamera untuk Upload */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-[#107c41] hover:bg-[#0e6b37] text-white shadow-md transition-transform active:scale-90 cursor-pointer"
                title="Ganti Foto Profil"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center sm:text-left space-y-1">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {username || 'Trader'}
              </h2>
              <p className="text-xs text-gray-500 font-mono">
                {user.email}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-800 dark:text-white rounded text-xs font-semibold transition-colors"
                >
                  Unggah Foto Baru
                </button>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setAvatarUrl('')}
                    className="p-1 text-gray-400 hover:text-rose-500 transition-colors"
                    title="Hapus Foto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* SECTION: INFORMASI AKUN & BROKER */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Pengaturan Akun Trading
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 dark:text-slate-300 block">
                  Nama Pengguna / Display Name
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 dark:text-slate-300 block">
                  Email Akun
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded text-gray-500 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 dark:text-slate-300 block">
                  Platform Broker
                </label>
                <input
                  type="text"
                  value={broker}
                  onChange={(e) => setBroker(e.target.value)}
                  placeholder="misal: MetaTrader 5, Exness, IC Markets"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 dark:text-slate-300 block">
                  Tipe Akun (Opsional)
                </label>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded text-gray-900 dark:text-white focus:outline-none"
                >
                  <option value="">-- Pilih Tipe Akun --</option>
                  <option value="Real">Real Account</option>
                  <option value="Demo">Demo Account</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 dark:text-slate-300 block">
                  Modal Awal ($) (Opsional)
                </label>
                <input
                  type="number"
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(e.target.value)}
                  placeholder="misal: 500"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded text-gray-900 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-gray-700 dark:text-slate-300 block">
                  Leverage Akun (Opsional)
                </label>
                <select
                  value={leverage}
                  onChange={(e) => setLeverage(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded text-gray-900 dark:text-white focus:outline-none"
                >
                  <option value="">-- Pilih Leverage --</option>
                  <option value="1:100">1:100</option>
                  <option value="1:200">1:200</option>
                  <option value="1:500">1:500</option>
                  <option value="1:1000">1:1000</option>
                  <option value="1:2000">1:2000</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION: INTEGRASI MYFXBOOK (OPSIONAL) */}
          <div className="pt-4 border-t border-gray-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <Link2 className="w-4 h-4 text-emerald-600" />
                  <span>Akun Myfxbook (Opsional)</span>
                </h4>
                <p className="text-[11px] text-gray-500">
                  Tautkan info akun Myfxbook publik Anda jika ada
                </p>
              </div>
              <a
                href="https://www.myfxbook.com/api"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#107c41] dark:text-emerald-400 hover:underline flex items-center gap-0.5"
              >
                <span>Dokumentasi API</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-gray-600 dark:text-slate-400 text-[11px]">Email Myfxbook</label>
                <input
                  type="email"
                  value={myfxEmail}
                  onChange={(e) => setMyfxEmail(e.target.value)}
                  placeholder="email@myfxbook.com"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded text-gray-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-600 dark:text-slate-400 text-[11px]">Myfxbook Account ID</label>
                <input
                  type="text"
                  value={myfxAccountId}
                  onChange={(e) => setMyfxAccountId(e.target.value)}
                  placeholder="misal: 10482910"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded text-gray-900 dark:text-white font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800">
            {isSavedSuccess ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" /> Perubahan Profil Berhasil Disimpan
              </span>
            ) : (
              <span className="text-[11px] text-gray-400">Foto profil dan info akun otomatis tersimpan</span>
            )}

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#107c41] hover:bg-[#0e6b37] text-white font-bold rounded text-xs sm:text-sm transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>

        {/* Footer */}
        <SiteFooter />
      </div>
    </div>
  );
};
