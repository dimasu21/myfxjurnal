import { UserAccount } from '../types/user';
import { Trade } from '../types/trade';
import { getAllUsers, saveUsers, saveTradesForCurrentUser, setCurrentSessionUser } from '../utils/authStorage';

export interface SyncPayload {
  version: number;
  user: {
    id: string;
    username: string;
    email: string;
    password?: string;
    avatarUrl?: string;
    broker?: string;
    accountType?: string;
    initialBalance?: number;
    leverage?: string;
    createdAt: string;
  };
  trades: Trade[];
  timestamp: number;
}

// Buat Kode Sinkronisasi Akun (untuk dipaste di HP / perangkat lain)
export function generateAccountSyncToken(user: UserAccount, trades: Trade[]): string {
  const payload: SyncPayload = {
    version: 1,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
      avatarUrl: user.avatarUrl,
      broker: user.broker,
      accountType: user.accountType,
      initialBalance: user.initialBalance,
      leverage: user.leverage,
      createdAt: user.createdAt,
    },
    trades: trades,
    timestamp: Date.now(),
  };

  const jsonStr = JSON.stringify(payload);
  const base64 = btoa(encodeURIComponent(jsonStr));
  return `FXSYNC_${base64}`;
}

// Buka dan simpan Kode Sinkronisasi di perangkat baru
export function importAccountSyncToken(
  tokenString: string
): { success: boolean; user?: UserAccount; trades?: Trade[]; error?: string } {
  try {
    const cleanToken = tokenString.trim();
    if (!cleanToken.startsWith('FXSYNC_')) {
      return { success: false, error: 'Format Kode Sinkronisasi tidak valid. Kode harus berawalan "FXSYNC_"' };
    }

    const base64 = cleanToken.replace('FXSYNC_', '');
    const jsonStr = decodeURIComponent(atob(base64));
    const payload: SyncPayload = JSON.parse(jsonStr);

    if (!payload.user || !payload.user.email) {
      return { success: false, error: 'Isi kode sinkronisasi tidak lengkap atau korup.' };
    }

    const user: UserAccount = {
      id: payload.user.id || `usr_${Date.now()}`,
      username: payload.user.username || 'Trader',
      email: payload.user.email,
      password: payload.user.password,
      avatarUrl: payload.user.avatarUrl,
      broker: payload.user.broker,
      accountType: payload.user.accountType as any,
      initialBalance: payload.user.initialBalance,
      leverage: payload.user.leverage,
      createdAt: payload.user.createdAt || new Date().toISOString(),
      trades: payload.trades || [],
    };

    // Simpan ke storage perangkat ini
    const localUsers = getAllUsers().filter((u) => u.id !== user.id && u.email.toLowerCase() !== user.email.toLowerCase());
    localUsers.push(user);
    saveUsers(localUsers);

    saveTradesForCurrentUser(user.id, user.trades);
    setCurrentSessionUser(user.id);

    return { success: true, user, trades: user.trades };
  } catch (err: any) {
    console.error('Error importing sync token:', err);
    return { success: false, error: 'Gagal memproses kode sinkronisasi. Pastikan kode disalin lengkap.' };
  }
}
