import { Trade } from './trade';

export interface UserAccount {
  id: string;
  email: string;
  username: string;
  password?: string;
  fullName?: string;
  avatarUrl?: string;
  broker?: string;
  accountType?: 'Real' | 'Demo';
  initialBalance?: number;
  currency?: string;
  leverage?: string;
  createdAt: string;
  trades: Trade[];
  authProvider?: 'google' | 'local';
  googleId?: string;
}

export interface AuthState {
  currentUser: UserAccount | null;
  isAuthenticated: boolean;
}

