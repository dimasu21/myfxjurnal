# Jurnal Trading Forex - Professional Excel Edition

Aplikasi Jurnal Trading Forex web modern dan aman dengan antarmuka spreadsheet khas **Microsoft Excel** yang super ringan, cepat, 100% responsif di semua perangkat (Desktop, Tablet, dan Ponsel HP), serta memenuhi standar keamanan enterprise.

---

## Fitur Utama

### 1. Antarmuka Spreadsheet Excel Interaktif
- Ribbon toolbar hijau khas Microsoft Excel dengan navigasi cepat.
- Formula bar `fx` dengan koordinat cell aktif (`A1`, `B2`, dst.).
- Multi-sheet footer: `Sheet1 - Semua`, `Win Only`, `Loss Only`, `Analisis Psikologi`, dan `History Bulanan`.
- Formula bar status kalkulasi real-time: `COUNT`, `AVERAGE Pips`, dan `SUM Pips`.
- Manual Save (`Ctrl+S`) dengan proteksi peringatan data belum tersimpan (*unsaved changes guard*).

### 2. Tampilan 1 Halaman Penuh (Full Page Workspace)
Fitur pendukung trading dibuka sebagai **halaman kerja penuh 100% viewport** (bukan modal pop-up mengambang), dengan tombol `← Kembali ke Sheet` dan shortcut keyboard `Esc`:
- **Hitung Lot & Manajemen Risiko**: Mendukung modal mikro ($10) hingga akun besar ($100k), akun cent (USC), dan proyeksi target rasio Risk-to-Reward (RRR).
- **Kalender Berita Ekonomi**: Jam real-time WIB, agenda makro ekonomi global (CPI, NFP, Suku Bunga FOMC/ECB), filter dampak (*High/Med/Low*), pencarian instan, dan live feed TradingView.
- **Heatmap Hari & Jam Trading**: Menemukan hari terbaik (Senin–Jumat) dan sesi pasar paling menguntungkan (Asia, London, New York) yang dihitung murni dari catatan jurnal Anda.
- **Simulator Compounding**: Proyeksi pertumbuhan modal eksponensial berdasarkan target profit konsisten per bulan atau per trade.
- **Statistik & Analisis Performa**: Grafik kurva ekuitas (*Equity Curve*) Recharts, rasio profit factor, win rate, breakdown strategi teknikal, dan evaluasi emosi/psikologi.
- **Live Candlestick Chart**: Chart TradingView real-time dengan pilihan timeframe dan tautan langsung untuk login ke akun TradingView pribadi.

### 3. Running Ticker Harga Forex Real-Time
- Ticker harga berjalan (*infinite smooth marquee*) dari kanan ke kiri secara kontinu tanpa jeda.
- Jeda otomatis saat kursor mouse diarahkan atau disentuh (*pause on hover/touch*) untuk mempermudah pengecekan dan pemilihan chart.

### 4. Ekspor, Impor & Backup Data
- **Export Microsoft Excel (.xlsx)**: Spreadsheet resmi siap cetak.
- **Export PDF (.pdf)**: Laporan format Landscape A4 berstandar korporat.
- **Export CSV (.csv)**: Data mentah untuk kompatibilitas ke platform lain.
- **Backup & Restore Database (.json)**: Pencadangan dan pemulihan data lokal yang aman.
- **Arsip History Bulanan Otomatis**: Mendeteksi dan mengarsipkan data trade saat terjadi pergantian bulan kalender.

---

## Standar Keamanan Enterprise (Security Hardened)

Aplikasi ini dirancang dengan pendekatan **Local-First & Zero-Trust Privacy**:
1. **Privasi 100% Tanpa Pelacakan**: Seluruh catatan transaksi disimpan secara lokal di perangkat Anda (`localStorage`), tidak ada transmisi data rahasia ke server luar atau broker meta trader pihak ketiga.
2. **Sanitasi Data Bertingkat (XSS & Injection Protection)**: Input dan file impor (.xlsx, .csv, .json) disaring secara ketat untuk mencegah serangan Cross-Site Scripting (XSS), eksekusi script, dan Prototype Pollution.
3. **HTTP Security Headers (Vercel & Nginx Ready)**:
   - `X-Content-Type-Options: nosniff` (Mencegah sniffing MIME type).
   - `X-Frame-Options: SAMEORIGIN` (Proteksi Clickjacking).
   - `X-XSS-Protection: 1; mode=block`.
   - `Referrer-Policy: strict-origin-when-cross-origin`.
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
   - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` (Enforce HTTPS).
   - Content Security Policy (CSP) compliant.

---

## Responsif di Seluruh Perangkat

- **Desktop & Laptop**: Tampilan spreadsheet lebar dengan freeze-pane, shortcut keyboard, dan visualisasi data luas.
- **Tablet & Ponsel (Mobile)**:
  - Toggle **Mode Kartu HP (Card View)** untuk membaca dan mereview transaksi dengan satu tangan tanpa perlu geser horizontal.
  - Floating Action Button (FAB) `+` untuk mencatat transaksi dengan cepat.
  - Ribbon horizontal scroll yang elastis (*swipe friendly*).

---

## Instalasi & Menjalankan di Lokal

```bash
# 1. Clone repository
git clone https://github.com/dimasu21/myfxjurnal.git
cd myfxjurnal

# 2. Install dependencies
npm install

# 3. Jalankan development server
npm run dev

# 4. Build produksi
npm run build
```

---

## Lisensi
MIT License &copy; 2026. Dibuat untuk kalangan profesional trader forex dan investor mandiri.
