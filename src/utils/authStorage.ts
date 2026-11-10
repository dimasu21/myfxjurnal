import { UserAccount } from '../types/user';
import { Trade } from '../types/trade';

const USERS_STORAGE_KEY = 'myfx_users_database_v1';
const SESSION_STORAGE_KEY = 'myfx_active_session_user_id';

// Ambil semua akun user dari storage lokal
export function getAllUsers(): UserAccount[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error getting users:', e);
    return [];
  }
}

// Simpan list akun
export function saveUsers(users: UserAccount[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Error saving users:', e);
  }
}

// Dapatkan user yang sedang login saat ini
export function getCurrentSessionUser(): UserAccount | null {
  if (typeof window === 'undefined') return null;
  try {
    const activeId = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!activeId) return null;
    const users = getAllUsers();
    return users.find((u) => u.id === activeId) || null;
  } catch (e) {
    console.error('Error getting active session:', e);
    return null;
  }
}

// Set session user yang sedang aktif
export function setCurrentSessionUser(userId: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (userId) {
      localStorage.setItem(SESSION_STORAGE_KEY, userId);
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Error setting session:', e);
  }
}

// Register user baru
export function registerUser(
  username: string, 
  email: string, 
  broker = 'MetaTrader 5', 
  initialBalance = 1000,
  password?: string
): { success: boolean; user?: UserAccount; error?: string } {
  const users = getAllUsers();
  const cleanEmail = email.trim().toLowerCase();
  const cleanUsername = username.trim();

  if (!cleanEmail || !cleanUsername) {
    return { success: false, error: 'Nama Pengguna dan Email wajib diisi.' };
  }

  const existing = users.find((u) => u.email.toLowerCase() === cleanEmail || u.username.toLowerCase() === cleanUsername.toLowerCase());
  if (existing) {
    return { success: false, error: 'Email atau Nama Pengguna sudah terdaftar. Silakan langsung masuk.' };
  }

  const newUser: UserAccount = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    username: cleanUsername,
    email: cleanEmail,
    password: password || undefined,
    broker: broker || 'MetaTrader 5',
    accountType: 'Real',
    initialBalance: Number(initialBalance) || 1000,
    currency: 'USD',
    leverage: '1:500',
    createdAt: new Date().toISOString(),
    trades: [], // Bersih kosong untuk user baru
  };

  users.push(newUser);
  saveUsers(users);
  setCurrentSessionUser(newUser.id);

  return { success: true, user: newUser };
}

// Login user
export function loginUser(emailOrUsername: string, password?: string): { success: boolean; user?: UserAccount; error?: string } {
  const users = getAllUsers();
  const query = emailOrUsername.trim().toLowerCase();

  const user = users.find(
    (u) => u.email.toLowerCase() === query || u.username.toLowerCase() === query
  );

  if (!user) {
    return { success: false, error: 'Akun tidak ditemukan. Silakan daftar terlebih dahulu.' };
  }

  if (user.password && password && user.password !== password) {
    return { success: false, error: 'Kata sandi tidak sesuai.' };
  }

  setCurrentSessionUser(user.id);
  return { success: true, user };
}

// Simpan data trades khusus untuk user yang sedang aktif (OTOMATIS TERSIMPAN PERMANEN)
export function saveTradesForCurrentUser(userId: string, trades: Trade[]): void {
  const users = getAllUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index !== -1) {
    users[index].trades = trades;
    saveUsers(users);
  }
}

// Update detail profile user
export function updateUserProfile(userId: string, updates: Partial<UserAccount>): UserAccount | null {
  const users = getAllUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    saveUsers(users);
    return users[index];
  }
  return null;
}

// Logout
export function logoutUser(): void {
  setCurrentSessionUser(null);
}

