-- ============================================================================
-- SQL SCHEMA FOR SUPABASE (FOREX EXCEL JOURNAL MULTI-DEVICE CLOUD SYNC)
-- Jalankan query ini di Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ============================================================================

-- 1. Table Profiles Pengguna
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text not null,
  avatar_url text,
  broker text,
  leverage text,
  account_type text,
  initial_balance numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Table Riwayat Transaksi Jurnal (Trades)
create table if not exists public.trades (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  tanggal text not null,
  pair text not null,
  posisi text not null,
  entry numeric not null,
  sl numeric not null,
  tp numeric not null,
  exit_price numeric,
  lot text not null,
  pips numeric not null,
  pnl numeric,
  status text not null,
  strategi text,
  alasan text,
  emosi text,
  evaluasi text,
  risk_reward text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Aktifkan Row Level Security (RLS) agar tiap user hanya bisa akses datanya sendiri
alter table public.profiles enable row level security;
alter table public.trades enable row level security;

-- Policies Profiles
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Policies Trades
drop policy if exists "Users can view own trades" on public.trades;
create policy "Users can view own trades" on public.trades for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own trades" on public.trades;
create policy "Users can insert own trades" on public.trades for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own trades" on public.trades;
create policy "Users can update own trades" on public.trades for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own trades" on public.trades;
create policy "Users can delete own trades" on public.trades for delete using (auth.uid() = user_id);
