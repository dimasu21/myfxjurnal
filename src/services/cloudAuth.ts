import { getSupabase, isSupabaseConfigured } from './supabaseClient';
import { UserAccount } from '../types/user';
import { Trade } from '../types/trade';
import { 
  getAllUsers, 
  saveUsers, 
  setCurrentSessionUser, 
  saveTradesForCurrentUser, 
  getUserTrades 
} from '../utils/authStorage';

// 1. DAFTAR AKUN BARU
export async function cloudRegisterUser(
  username: string,
  email: string,
  password: string
): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanUsername = username.trim();

  if (!cleanEmail || !cleanUsername || !password) {
    return { success: false, error: 'Nama Pengguna, Email, dan Password wajib diisi.' };
  }

  // Jika Supabase terkonfigurasi, gunakan Supabase Cloud Auth
  const supabase = getSupabase();
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          data: {
            username: cleanUsername,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Buat profil di table profiles jika ada
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            username: cleanUsername,
            created_at: new Date().toISOString(),
          });
        } catch (e) {
          console.warn('Gagal upsert profile di database cloud:', e);
        }

        const newUser: UserAccount = {
          id: data.user.id,
          username: cleanUsername,
          email: cleanEmail,
          createdAt: data.user.created_at || new Date().toISOString(),
          trades: [],
        };

        // Cache lokal
        const localUsers = getAllUsers().filter((u) => u.id !== newUser.id && u.email !== cleanEmail);
        localUsers.push(newUser);
        saveUsers(localUsers);
        setCurrentSessionUser(newUser.id);

        return { success: true, user: newUser };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Terjadi kesalahan pada server cloud.' };
    }
  }

  // Fallback ke penyimpanan lokal jika belum konek ke Supabase
  const localUsers = getAllUsers();
  const existing = localUsers.find(
    (u) => u.email.toLowerCase() === cleanEmail || u.username.toLowerCase() === cleanUsername.toLowerCase()
  );
  if (existing) {
    return { success: false, error: 'Email atau Nama Pengguna sudah terdaftar.' };
  }

  const newUser: UserAccount = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    username: cleanUsername,
    email: cleanEmail,
    password: password,
    createdAt: new Date().toISOString(),
    trades: [],
  };

  localUsers.push(newUser);
  saveUsers(localUsers);
  setCurrentSessionUser(newUser.id);

  return { success: true, user: newUser };
}

// 2. LOGIN USER
export async function cloudLoginUser(
  emailOrUsername: string,
  password?: string
): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
  const cleanKey = emailOrUsername.trim().toLowerCase();

  const supabase = getSupabase();
  if (isSupabaseConfigured() && supabase) {
    if (!password) {
      return { success: false, error: 'Password wajib diisi.' };
    }

    try {
      // Supabase login butuh email
      let loginEmail = cleanKey;
      
      // Jika user menginput username, cari emailnya dari table profiles jika bisa
      if (!cleanKey.includes('@')) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .ilike('username', cleanKey)
          .maybeSingle();

        if (profile) {
          // Tetap coba login jika memungkinkan atau minta email
          return { success: false, error: 'Untuk cloud login, silakan masukkan Email yang Anda daftarkan.' };
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: password,
      });

      if (error) {
        return { success: false, error: 'Email atau password salah.' };
      }

      if (data.user) {
        // Ambil data profile & trades dari cloud
        let username = data.user.user_metadata?.username || cleanKey.split('@')[0];
        let avatarUrl = data.user.user_metadata?.avatar_url || '';

        try {
          const { data: prof } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .maybeSingle();
          if (prof) {
            if (prof.username) username = prof.username;
            if (prof.avatar_url) avatarUrl = prof.avatar_url;
          }
        } catch (e) {
          console.warn('Gagal ambil data profile:', e);
        }

        // Ambil riwayat trade dari cloud
        let cloudTrades: Trade[] = [];
        try {
          const { data: tradesData } = await supabase
            .from('trades')
            .select('*')
            .eq('user_id', data.user.id)
            .order('tanggal', { ascending: false });

          if (tradesData && tradesData.length > 0) {
            cloudTrades = tradesData.map((t: any) => ({
              id: t.id,
              tanggal: t.tanggal,
              pair: t.pair,
              posisi: t.posisi,
              entry: Number(t.entry),
              sl: Number(t.sl),
              tp: Number(t.tp),
              exitPrice: t.exit_price ? Number(t.exit_price) : undefined,
              lot: t.lot,
              pips: Number(t.pips),
              pnl: t.pnl !== null && t.pnl !== undefined ? Number(t.pnl) : undefined,
              status: t.status,
              strategi: t.strategi || '',
              alasan: t.alasan || '',
              emosi: t.emosi || 'Tenang',
              evaluasi: t.evaluasi || '',
              riskReward: t.risk_reward || '',
            }));
          }
        } catch (e) {
          console.warn('Gagal ambil trades cloud:', e);
        }

        const userObj: UserAccount = {
          id: data.user.id,
          username: username,
          email: data.user.email || loginEmail,
          avatarUrl: avatarUrl,
          createdAt: data.user.created_at || new Date().toISOString(),
          trades: cloudTrades,
        };

        // Cache lokal
        const localUsers = getAllUsers().filter((u) => u.id !== userObj.id && u.email !== userObj.email);
        localUsers.push(userObj);
        saveUsers(localUsers);
        saveTradesForCurrentUser(userObj.id, cloudTrades);
        setCurrentSessionUser(userObj.id);

        return { success: true, user: userObj };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Gagal login ke cloud server.' };
    }
  }

  // Fallback lokal
  const users = getAllUsers();
  const found = users.find(
    (u) => u.email.toLowerCase() === cleanKey || u.username.toLowerCase() === cleanKey
  );

  if (!found) {
    return { 
      success: false, 
      error: 'Akun tidak ditemukan pada browser/perangkat ini. Hubungkan Cloud Supabase agar akun bisa login di semua device.' 
    };
  }

  if (found.password && password && found.password !== password) {
    return { success: false, error: 'Kata sandi tidak sesuai.' };
  }

  found.trades = getUserTrades(found.id);
  setCurrentSessionUser(found.id);
  return { success: true, user: found };
}

// 3. SINKRONISASI TRADES KE CLOUD
export async function syncTradesToCloudDatabase(userId: string, trades: Trade[]): Promise<boolean> {
  const supabase = getSupabase();
  if (!isSupabaseConfigured() || !supabase) return false;

  try {
    // Format ke kolom database Supabase
    const payload = trades.map((t) => ({
      id: t.id,
      user_id: userId,
      tanggal: t.tanggal,
      pair: t.pair,
      posisi: t.posisi,
      entry: t.entry,
      sl: t.sl,
      tp: t.tp,
      exit_price: t.exitPrice || null,
      lot: t.lot,
      pips: t.pips,
      pnl: t.pnl !== undefined ? t.pnl : null,
      status: t.status,
      strategi: t.strategi || '',
      alasan: t.alasan || '',
      emosi: t.emosi || '',
      evaluasi: t.evaluasi || '',
      risk_reward: t.riskReward || '',
    }));

    // Upsert semua trade
    if (payload.length > 0) {
      const { error } = await supabase.from('trades').upsert(payload, { onConflict: 'id' });
      if (error) {
        console.error('Gagal sync trades ke cloud:', error);
        return false;
      }
    }
    return true;
  } catch (err) {
    console.error('Error sync trades:', err);
    return false;
  }
}
