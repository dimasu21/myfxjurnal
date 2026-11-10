import React, { useState } from 'react';
import { ArrowUp, X, Shield, Globe, ExternalLink, Mail, Copy, Check } from 'lucide-react';

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
      const containers = document.querySelectorAll('.overflow-y-auto, .overflow-auto');
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
      <footer className="w-full bg-[#f8fafc] dark:bg-[#0b1120] text-gray-600 dark:text-slate-400 border-t border-gray-200 dark:border-slate-800/80 px-4 py-8 sm:px-6 transition-colors select-none">
        <div className="max-w-4xl mx-auto space-y-5">

          {/* 1. TOP NAV LINKS: Terms | Privacy | About Us | Support / Contact Us */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:text-sm font-medium">
            <button
              onClick={() => setActiveModal('terms')}
              className="text-gray-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Terms of Service
            </button>
            <span className="text-gray-300 dark:text-slate-700">|</span>
            <button
              onClick={() => setActiveModal('privacy')}
              className="text-gray-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Privacy Policy
            </button>
            <span className="text-gray-300 dark:text-slate-700">|</span>
            <button
              onClick={() => setActiveModal('about')}
              className="text-gray-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              About Us
            </button>
            <span className="text-gray-300 dark:text-slate-700">|</span>
            <button
              onClick={() => setActiveModal('contact')}
              className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline transition-colors"
            >
              Support / Contact Us
            </button>
          </div>

          {/* 2. BRAND & ATTRIBUTION */}
          <div className="text-center text-xs space-y-1">
            <p className="font-semibold text-gray-800 dark:text-slate-200">
              MyFX Journal &copy; {currentYear} &mdash; Platform Jurnal & Analitik Forex
            </p>
            <p className="text-gray-500 dark:text-slate-400">
              Dibuat secara independen oleh{' '}
              <a
                href="https://dimasu.site/"
                target="_blank"
                rel="noreferrer noopener"
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-0.5"
              >
                dimasu.site
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </p>
          </div>

          {/* 3. HIGH RISK WARNING / DISCLAIMER */}
          <div className="text-[11px] leading-relaxed text-gray-500 dark:text-slate-400 text-justify sm:text-left bg-white dark:bg-[#111827] p-4 rounded-xl border border-gray-200 dark:border-slate-800 shadow-xs">
            <strong className="text-gray-800 dark:text-slate-200 block mb-1 font-semibold uppercase tracking-wider text-[10px]">
              Peringatan Risiko Tinggi:
            </strong>
            Perdagangan valuta asing (Forex) dan instrumen ber-leverage memiliki tingkat risiko tinggi dan mungkin tidak cocok untuk semua investor. Anda dapat mengalami kerugian sebagian atau seluruh modal yang diinvestasikan. Sebelum memutuskan untuk berdagang, pertimbangkan tujuan keuangan, tingkat keahlian, dan toleransi risiko Anda dengan matang. Seluruh data, catatan trading, dan kalkulator pada platform ini disediakan semata-mata untuk kebutuhan dokumentasi pribadi dan edukasi mandiri, bukan merupakan rekomendasi investasi atau anjuran perdagangan. Kinerja masa lalu tidak menjamin hasil di masa depan.
          </div>

          {/* 4. FOOTER BOTTOM: Badges & Scroll to Top */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
                <Shield className="w-3.5 h-3.5" />
                Local-First &bull; Privasi Terjaga
              </span>
              <span className="hidden sm:inline text-gray-300 dark:text-slate-700">&bull;</span>
              <span className="hidden sm:inline">Data tersimpan di browser Anda</span>
            </div>

            <button
              onClick={handleScrollTop}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 text-xs font-semibold shadow-xs transition-all active:scale-95"
              aria-label="Kembali ke atas"
              title="Kembali ke atas"
            >
              <span>Atas</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </footer>

      {/* ── MODALS: Terms, Privacy, About Us, Support / Contact Us ────── */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
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
                <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                  {activeModal === 'terms' && 'Syarat & Ketentuan (Terms of Service)'}
                  {activeModal === 'privacy' && 'Kebijakan Privasi (Privacy Policy)'}
                  {activeModal === 'about' && 'Tentang MyFX Journal (About Us)'}
                  {activeModal === 'contact' && 'Support & Contact Us'}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 transition-colors"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 space-y-3 leading-relaxed">
              {activeModal === 'terms' && (
                <>
                  <p>
                    Selamat datang di <strong>MyFX Journal</strong>. Dengan menggunakan platform jurnal ini, Anda memahami dan menyetujui ketentuan berikut:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 pl-1">
                    <li>Platform ini disediakan sebagai sarana pencatatan jurnal transaksi, evaluasi psikologi trading, dan simulasi manajemen risiko mandiri.</li>
                    <li>Kami tidak menyediakan sinyal trading, nasihat finansial, maupun jaminan keuntungan pasar.</li>
                    <li>Seluruh keputusan eksekusi buy/sell, pengaturan stop loss, dan pengelolaan modal sepenuhnya merupakan tanggung jawab pengguna secara pribadi.</li>
                    <li>Data trading Anda dapat diekspor kapan saja ke format spreadsheet Excel (.xlsx), CSV, PDF, maupun file JSON cadangan.</li>
                  </ul>
                </>
              )}

              {activeModal === 'privacy' && (
                <>
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
                    <Shield className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <strong className="block font-bold">100% Local-First Data Privacy</strong>
                      Seluruh data transaksi dan catatan keuangan Anda tersimpan offline di LocalStorage peramban perangkat Anda. Tidak ada data yang dikirim ke server backend kami.
                    </div>
                  </div>
                  <p>
                    Komitmen privasi platform kami:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 pl-1">
                    <li>Bebas dari pelacak analitik pihak ketiga (*no third-party tracking scripts*).</li>
                    <li>Tidak memerlukan login akun pihak ketiga atau penyimpanan credential broker.</li>
                    <li>Pembersihan data total dapat dilakukan kapan saja melalui tombol &ldquo;Kosongkan Seluruh Sheet&rdquo;.</li>
                  </ul>
                </>
              )}

              {activeModal === 'about' && (
                <>
                  <p>
                    <strong>MyFX Journal</strong> adalah platform jurnal perdagangan valuta asing mandiri yang dirancang untuk membantu para trader membangun konsistensi, objektivitas data, dan disiplin trading yang terukur.
                  </p>
                  <p>
                    Platform ini menggabungkan fleksibilitas tabel lembar kerja Microsoft Excel untuk layar desktop dengan kemudahan akses kartu transaksi ringkas ala Myfxbook Mobile untuk perangkat smartphone.
                  </p>
                  <p>
                    Proyek ini dikembangkan secara independen oleh <a href="https://dimasu.site/" target="_blank" rel="noreferrer noopener" className="text-emerald-600 dark:text-emerald-400 font-bold underline">dimasu.site</a> sebagai portofolio solusi pencatatan finansial yang bersih, fungsional, dan berfokus pada privasi pengguna.
                  </p>
                </>
              )}

              {activeModal === 'contact' && (
                <div className="space-y-3.5">
                  <p>
                    Jika Anda memiliki pertanyaan teknis, kendala penggunaan, saran pengembangan fitur, atau ingin terhubung:
                  </p>

                  {/* Email Box */}
                  <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-slate-800/70 border border-gray-200 dark:border-slate-700 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <div>
                          <span className="text-[11px] text-gray-500 dark:text-slate-400 block font-medium">Email Pengembang</span>
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
                      href="mailto:dimsartz021@gmail.com?subject=MyFX%20Journal%20Inquiry"
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
                    className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 dark:bg-slate-800/70 border border-gray-200 dark:border-slate-700 hover:border-emerald-500 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <span className="text-[11px] text-gray-500 dark:text-slate-400 block font-medium">Website Pribadi & Portofolio</span>
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
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-800 dark:text-slate-200 rounded-lg text-xs font-bold transition-colors"
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
