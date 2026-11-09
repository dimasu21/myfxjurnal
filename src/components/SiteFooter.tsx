import React, { useState } from 'react';
import { ArrowUp, X, Shield, Globe, ExternalLink, Mail, Send, Copy, Check } from 'lucide-react';

interface SiteFooterProps {
  onScrollToTop?: () => void;
}

type ModalType = 'terms' | 'privacy' | 'about' | 'contact' | null;

export const SiteFooter: React.FC<SiteFooterProps> = ({ onScrollToTop }) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleScrollTop = () => {
    if (onScrollToTop) {
      onScrollToTop();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const containers = document.querySelectorAll('.overflow-y-auto');
      containers.forEach((c) => c.scrollTo({ top: 0, behavior: 'smooth' }));
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('dimsartz021@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <>
      <footer className="w-full bg-[#181d28] text-slate-300 border-t border-slate-800 px-4 py-8 sm:px-6 mt-8 select-none">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* 1. TOP NAV LINKS: Terms | Privacy | About Us | Support / Contact Us */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs sm:text-sm text-slate-400 font-medium">
            <button
              onClick={() => setActiveModal('terms')}
              className="hover:text-white transition-colors"
            >
              Terms
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => setActiveModal('privacy')}
              className="hover:text-white transition-colors"
            >
              Privacy
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => setActiveModal('about')}
              className="hover:text-white transition-colors"
            >
              About Us
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => setActiveModal('contact')}
              className="hover:text-emerald-400 text-slate-300 font-semibold transition-colors"
            >
              Support / Contact Us
            </button>
          </div>

          {/* 2. APP BADGES GRID (MYFXBOOK 2x2 ON MOBILE, 4 COLS ON DESKTOP) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-xl mx-auto pt-1">
            {/* Download on the App Store */}
            <div className="flex items-center gap-2.5 px-3 py-2 bg-[#0d1117] hover:bg-[#131922] border border-slate-700/80 rounded-lg transition-colors cursor-pointer group">
              <svg className="w-5 h-5 text-white shrink-0 group-hover:scale-105 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.72-.93 2.74 1.01.08 2.03-.53 2.63-1.24z"/>
              </svg>
              <div className="text-left min-w-0">
                <span className="text-[8px] uppercase tracking-wider text-slate-400 block leading-tight">Download on the</span>
                <strong className="text-[11px] text-white font-bold block leading-tight truncate">App Store</strong>
              </div>
            </div>

            {/* Get it On Google Play */}
            <div className="flex items-center gap-2.5 px-3 py-2 bg-[#0d1117] hover:bg-[#131922] border border-slate-700/80 rounded-lg transition-colors cursor-pointer group">
              <svg className="w-5 h-5 text-emerald-400 shrink-0 group-hover:scale-105 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a1.99 1.99 0 0 1-.61-1.42V3.235c0-.54.22-1.03.609-1.421zm11.237 11.237l2.25 2.25-11.9 6.84 9.65-9.09zm0-2.102L5.196 1.86l11.9 6.84-2.25 2.25zm1.463.725l3.528 2.03c.895.515.895 1.355 0 1.87l-3.528 2.03-2.39-2.39 2.39-2.54z"/>
              </svg>
              <div className="text-left min-w-0">
                <span className="text-[8px] uppercase tracking-wider text-slate-400 block leading-tight">Get it On</span>
                <strong className="text-[11px] text-white font-bold block leading-tight truncate">Google Play</strong>
              </div>
            </div>

            {/* Explore It On App Gallery */}
            <div className="flex items-center gap-2.5 px-3 py-2 bg-[#0d1117] hover:bg-[#131922] border border-slate-700/80 rounded-lg transition-colors cursor-pointer group">
              <div className="w-5 h-5 rounded bg-rose-600 flex items-center justify-center text-white text-[10px] font-black shrink-0 group-hover:scale-105 transition-transform">
                H
              </div>
              <div className="text-left min-w-0">
                <span className="text-[8px] uppercase tracking-wider text-slate-400 block leading-tight">Explore It On</span>
                <strong className="text-[11px] text-white font-bold block leading-tight truncate">App Gallery</strong>
              </div>
            </div>

            {/* Chrome Extension */}
            <a
              href="https://dimasu.site/"
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-2.5 px-3 py-2 bg-[#0d1117] hover:bg-[#131922] border border-slate-700/80 rounded-lg transition-colors group"
            >
              <svg className="w-5 h-5 text-amber-400 shrink-0 group-hover:scale-105 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              <div className="text-left min-w-0">
                <span className="text-[8px] uppercase tracking-wider text-slate-400 block leading-tight">Install Chrome</span>
                <strong className="text-[11px] text-white font-bold block leading-tight truncate">Extension</strong>
              </div>
            </a>
          </div>

          {/* 3. SOCIAL MEDIA ICONS ROW (f, X, Telegram, Globe) */}
          <div className="flex items-center justify-center gap-3 pt-1">
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded bg-[#242b3a] hover:bg-[#323c52] text-slate-300 hover:text-white flex items-center justify-center font-bold text-base transition-colors"
            >
              f
            </a>

            {/* X */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
              className="w-9 h-9 rounded bg-[#242b3a] hover:bg-[#323c52] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            {/* Telegram */}
            <a
              href="https://t.me"
              target="_blank"
              rel="noreferrer"
              aria-label="Telegram"
              className="w-9 h-9 rounded bg-[#242b3a] hover:bg-[#323c52] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <Send className="w-4 h-4 -rotate-12 translate-x-[-1px] translate-y-[-1px]" />
            </a>

            {/* Portfolio dimasu.site */}
            <a
              href="https://dimasu.site/"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="dimasu.site"
              className="w-9 h-9 rounded bg-emerald-950/70 border border-emerald-600/50 hover:bg-emerald-900 text-emerald-400 hover:text-white flex items-center justify-center transition-colors"
              title="Website Pribadi dimasu.site"
            >
              <Globe className="w-4 h-4" />
            </a>
          </div>

          {/* 4. COPYRIGHT & MADE BY DIMASU.SITE */}
          <div className="pt-2 text-center text-xs text-slate-400 space-y-1">
            <p>
              &copy; {currentYear} Myfxbook Ltd. Semua Hak Dilindungi Undang-Undang.
            </p>
            <p>
              Platform Jurnal & Analitik Forex dibuat oleh{' '}
              <a
                href="https://dimasu.site/"
                target="_blank"
                rel="noreferrer noopener"
                className="font-bold text-emerald-400 hover:text-emerald-300 underline inline-flex items-center gap-1"
              >
                https://dimasu.site/
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>

          {/* 5. PERINGATAN RISIKO TINGGI (HIGH RISK WARNING EXACT COPY) */}
          <div className="text-[11px] leading-relaxed text-slate-400 text-justify sm:text-left bg-[#11151e] p-4 rounded-xl border border-slate-800/90 shadow-inner">
            <strong className="text-slate-200 block mb-1 font-semibold uppercase tracking-wide">
              PERINGATAN RISIKO TINGGI:
            </strong>
            Perdagangan valuta asing membawa tingkat risiko tinggi yang mungkin tidak cocok untuk semua investor. Leverage menciptakan risiko tambahan dan eksposur kerugian. Sebelum Anda memutuskan untuk memperdagangkan valuta asing, pertimbangkan dengan cermat tujuan investasi, tingkat pengalaman, dan toleransi risiko Anda. Anda bisa kehilangan sebagian atau seluruh investasi awal Anda. Jangan menginvestasikan uang yang Anda tidak mampu kehilangan. Didik diri Anda sendiri tentang risiko yang terkait dengan perdagangan valuta asing, dan mintalah saran dari penasihat keuangan atau pajak independen jika Anda memiliki pertanyaan. Setiap data dan informasi diberikan &lsquo;sebagaimana adanya&rsquo; semata-mata untuk tujuan informasi, dan tidak dimaksudkan untuk tujuan perdagangan atau saran. Kinerja masa lalu tidak menunjukkan hasil di masa depan.
          </div>

          {/* 6. SCROLL TO TOP BUTTON (MYFXBOOK FLOATING/BOTTOM CIRCLE) */}
          <div className="flex justify-end pt-1 pb-2">
            <button
              onClick={handleScrollTop}
              className="w-10 h-10 rounded-full bg-[#242b3a] hover:bg-[#323c52] border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-md active:scale-95"
              aria-label="Kembali ke atas"
              title="Kembali ke atas"
            >
              <ArrowUp className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </footer>

      {/* ── MODALS: Terms, Privacy, About Us, Support / Contact Us ────── */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-white dark:bg-[#111827] text-gray-900 dark:text-slate-100 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-gray-200 dark:border-slate-800 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="font-bold text-sm sm:text-base">
                  {activeModal === 'terms' && 'Syarat & Ketentuan (Terms of Service)'}
                  {activeModal === 'privacy' && 'Kebijakan Privasi (Privacy Policy)'}
                  {activeModal === 'about' && 'Tentang MyFX Journal (About Us)'}
                  {activeModal === 'contact' && 'Support & Contact Us'}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 space-y-3 leading-relaxed">
              {activeModal === 'terms' && (
                <>
                  <p>
                    Selamat datang di <strong>MyFX Journal</strong>. Dengan mengakses dan menggunakan aplikasi jurnal trading ini, Anda menyetujui ketentuan berikut:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 pl-1">
                    <li>Platform ini adalah sarana evaluasi, rekapitulasi data historis, kalkulator manajemen risiko, dan analitik performa trading forex mandiri.</li>
                    <li>Kami tidak menyediakan sinyal perdagangan berbayar, rekomendasi broker tertentu, atau jaminan keuntungan finansial.</li>
                    <li>Segala keputusan entri, stop loss, take profit, untung, maupun rugi di pasar valuta asing sepenuhnya merupakan tanggung jawab trader secara pribadi.</li>
                    <li>Pengguna memiliki hak penuh untuk mencadangkan (backup) atau mengekspor data ke Excel, CSV, PDF, dan JSON kapan pun tanpa batasan.</li>
                  </ul>
                </>
              )}

              {activeModal === 'privacy' && (
                <>
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
                    <Shield className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold">100% Local-First Data Privacy</strong>
                      Data trading Anda tidak pernah dikirim atau disimpan di server eksternal. Seluruh catatan tersimpan aman secara offline di LocalStorage browser perangkat Anda.
                    </div>
                  </div>
                  <p>
                    Prinsip privasi dan keamanan standar enterprise:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 pl-1">
                    <li>Nol pelacakan analitik pihak ketiga (*zero third-party tracking*).</li>
                    <li>Tidak ada server database yang menampung saldo atau riwayat transaksi Anda.</li>
                    <li>Fitur sanitasi teks XSS melindungi berkas yang diimpor dari file spreadsheet eksternal.</li>
                  </ul>
                </>
              )}

              {activeModal === 'about' && (
                <>
                  <p>
                    <strong>MyFX Journal</strong> dirancang untuk trader valuta asing yang mengutamakan disiplin, ketelitian evaluasi teknikal, dan psikologi trading objektif.
                  </p>
                  <p>
                    Dikembangkan secara independen oleh <a href="https://dimasu.site/" target="_blank" rel="noreferrer noopener" className="text-emerald-600 dark:text-emerald-400 font-bold underline">dimasu.site</a> dengan memadukan keunggulan antarmuka spreadsheet Microsoft Excel di desktop serta keluwesan kartu ringkas ala Myfxbook Mobile di ponsel cerdas.
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-2 text-center text-xs">
                    <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                      <strong className="block text-emerald-600 dark:text-emerald-400 font-bold">Zero AI Slop</strong>
                      <span>Desain bersih, minim ornamen berlebihan</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                      <strong className="block text-blue-600 dark:text-blue-400 font-bold">Enterprise Ready</strong>
                      <span>Kalkulasi lot presisi & kurva ekuitas</span>
                    </div>
                  </div>
                </>
              )}

              {activeModal === 'contact' && (
                <div className="space-y-3">
                  <p>
                    Ada pertanyaan, kendala teknis, masukan fitur, atau ingin berkolaborasi? Hubungi saya langsung melalui kontak berikut:
                  </p>

                  {/* Email Box */}
                  <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <div>
                          <span className="text-[11px] text-gray-500 dark:text-slate-400 block">Email Pengembang</span>
                          <strong className="font-mono text-xs sm:text-sm text-gray-900 dark:text-white select-all">
                            dimsartz021@gmail.com
                          </strong>
                        </div>
                      </div>

                      <button
                        onClick={handleCopyEmail}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-xs font-semibold text-gray-700 dark:text-slate-200 hover:bg-gray-100 transition-colors"
                        title="Salin alamat email"
                      >
                        {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedEmail ? 'Tersalin' : 'Salin'}</span>
                      </button>
                    </div>

                    <a
                      href="mailto:dimsartz021@gmail.com?subject=MyFX%20Journal%20Support%20Inquiry"
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Kirim Email Langsung</span>
                    </a>
                  </div>

                  {/* Website Portfolio Box */}
                  <a
                    href="https://dimasu.site/"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-emerald-500 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <span className="text-[11px] text-gray-500 dark:text-slate-400 block">Website Pribadi & Portofolio</span>
                        <strong className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                          https://dimasu.site/
                        </strong>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-emerald-500" />
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-800 dark:text-slate-200 rounded-lg text-xs font-bold transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
