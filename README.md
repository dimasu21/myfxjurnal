# 📊 Jurnal Trading Forex (Excel Edition)

Aplikasi Jurnal Trading Forex modern dengan tampilan spreadsheet khas **Microsoft Excel**, super ringan (Vite + React, bukan Next.js), cepat, responsif di HP/Mobile mau pun Desktop, dan siap dideploy langsung ke **Vercel**.

---

## ✨ Fitur Utama

1. **Tampilan Antarmuka Khas Excel**:
   - Header Ribbon hijau khas Excel lengkap dengan formula bar `fx` (menampilkan alamat cell seperti `A1`, `B2`).
   - Penomoran baris 1, 2, 3... dan kolom A, B, C...
   - Kolom identik dengan contoh: **Tanggal**, **Pair**, **Posisi (Buy/Sell)**, **Entry**, **SL**, **TP**, **Lot**, **Hasil (Pips)**, **Alasan Eksekusi**, **Emosi/Psikologi**, **Evaluasi Akhir**.
   - Tab Sheet di bawah: `Sheet1 - Semua`, `Win Only`, `Loss Only`, `Analisis Psikologi`.
   - Status bar Excel: `COUNT`, `AVERAGE Pips`, `SUM Pips`.

2. **Responsif & Nyaman di Akses lewat HP (Mobile)**:
   - **Mode Sheet Excel**: Dilengkapi sticky freeze column (nomor baris tetap terkunci saat scroll horizontal di layar kecil).
   - **Mode Kartu HP (Card View)**: Tampilan ringkas kartu trade yang dibuat khusus agar sangat nyaman dibaca dengan satu tangan di layar smartphone tanpa perlu geser kiri-kanan.
   - Tombol **Floating Action Button (FAB) `+`** di pojok kanan bawah layar HP untuk mencatat trade dengan cepat.

3. **Kalkulator & Analisis Psikologis**:
   - Auto kalkulasi pips untuk Pair Mata Uang, Emas (XAU/USD), dan Crypto.
   - Auto kalkulasi rasio **Risk : Reward (R:R)** dari Entry, SL, dan TP.
   - Evaluasi aspek psikologis & pendeteksian trade akibat **FOMO** atau **Revenge Trading**.
   - Modal Statistik lengkap (Win Rate %, Profit Factor, Trade Terbaik, Rekap Performa per Pair dan Emosi).

4. **Simpan Data & Ekspor/Impor**:
   - Data otomatis tersimpan di `localStorage` HP/Laptop (aman dan tidak hilang saat refresh).
   - **Export ke File Excel Asli (.xlsx)** dan **CSV**.
   - **Import dari file Excel (.xlsx / .csv)**.

---

## 🚀 Cara Menjalankan di Lokal (Laptop/PC)

```bash
# 1. Masuk ke direktori
cd d:\portofolio_2026\jurnal

# 2. Jalankan mode pengembangan
npm run dev
```

Buka URL yang muncul di browser (biasanya `http://localhost:5173`).

---

## 🌐 Cara Deploy ke Vercel (Biar Bisa Diakses Lewat HP)

### Opsi A: Lewat GitHub (Paling Direkomendasikan & Otomatis)
1. Buat repository baru di akun **[GitHub](https://github.com/new)** (misal namanya: `jurnal-trading-forex`).
2. Push kode project ini ke GitHub:
   ```bash
   git add .
   git commit -m "feat: forex excel trading journal ready for vercel"
   git branch -M main
   git remote add origin https://github.com/USERNAME-ANDA/jurnal-trading-forex.git
   git push -u origin main
   ```
3. Buka **[Vercel](https://vercel.com)** dan klik tombol **"Add New Project"**.
4. Pilih repository `jurnal-trading-forex`.
5. Vercel akan otomatis mengenali Vite:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Klik **"Deploy"**! Dalam 30 detik website Anda akan aktif dengan domain publik seperti `https://jurnal-trading-forex.vercel.app` dan bisa dibuka langsung dari browser HP Anda.

### Opsi B: Lewat Vercel CLI (Langsung dari Terminal)
```bash
# Install vercel cli
npm i -g vercel

# Deploy langsung
vercel
```
Ikuti instruksi singkat di terminal, website langsung live!
