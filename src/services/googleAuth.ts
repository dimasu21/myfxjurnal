import { UserAccount } from '../types/user';
import { Trade } from '../types/trade';
import { getAllUsers, saveUsers, setCurrentSessionUser, saveTradesForCurrentUser } from '../utils/authStorage';

const GOOGLE_CLIENT_ID_STORAGE_KEY = 'myfx_google_custom_client_id';

// Ambil Google Client ID dari env atau custom localStorage
export function getGoogleClientId(): string {
  const metaEnv = (import.meta as any).env || {};
  const envId = metaEnv.VITE_GOOGLE_CLIENT_ID || '';
  const storedId = typeof window !== 'undefined' ? localStorage.getItem(GOOGLE_CLIENT_ID_STORAGE_KEY) || '' : '';
  return envId || storedId;
}

export function saveGoogleClientId(clientId: string): void {
  if (typeof window === 'undefined') return;
  if (clientId.trim()) {
    localStorage.setItem(GOOGLE_CLIENT_ID_STORAGE_KEY, clientId.trim());
  } else {
    localStorage.removeItem(GOOGLE_CLIENT_ID_STORAGE_KEY);
  }
}

// Decode Google JWT Credential dari Google Identity Services
export function decodeGoogleCredential(credential: string): {
  sub: string;
  name: string;
  email: string;
  picture: string;
} | null {
  try {
    const parts = credential.split('.');
    if (parts.length !== 3) return null;
    const payload = decodeURIComponent(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(payload);
    return {
      sub: parsed.sub || `g_${Date.now()}`,
      name: parsed.name || parsed.email.split('@')[0],
      email: parsed.email.toLowerCase(),
      picture: parsed.picture || '',
    };
  } catch (e) {
    console.error('Error decoding Google JWT:', e);
    return null;
  }
}

// Proses Login / Registrasi Otomatis dengan Profil Akun Google
export function handleGoogleAuthSuccess(googleProfile: {
  sub: string;
  name: string;
  email: string;
  picture?: string;
}): UserAccount {
  const cleanEmail = googleProfile.email.trim().toLowerCase();
  const users = getAllUsers();
  
  let existingUser = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (existingUser) {
    // Update data profil terbaru dari Google
    existingUser.username = googleProfile.name || existingUser.username;
    existingUser.fullName = googleProfile.name;
    if (googleProfile.picture) {
      existingUser.avatarUrl = googleProfile.picture;
    }
    existingUser.authProvider = 'google';
    existingUser.googleId = googleProfile.sub;

    saveUsers(users);
    setCurrentSessionUser(existingUser.id);
    return existingUser;
  }

  // Akun baru via Google
  const newUser: UserAccount = {
    id: `usr_g_${googleProfile.sub || Date.now()}`,
    username: googleProfile.name || cleanEmail.split('@')[0],
    fullName: googleProfile.name,
    email: cleanEmail,
    avatarUrl: googleProfile.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(googleProfile.name)}&background=0D8ABC&color=fff`,
    authProvider: 'google',
    googleId: googleProfile.sub,
    createdAt: new Date().toISOString(),
    trades: [],
  };

  users.push(newUser);
  saveUsers(users);
  setCurrentSessionUser(newUser.id);
  return newUser;
}

