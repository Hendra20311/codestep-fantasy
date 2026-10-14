import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fdf6e3] text-amber-950 font-sans relative overflow-x-hidden selection:bg-amber-300 selection:text-amber-950 flex flex-col">
      {/* 1. Background Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(to right, #d97706 1px, transparent 1px),
            linear-gradient(to bottom, #d97706 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px'
        }}
      />

      {/* 2. NAVBAR ATAS */}
      <header className="relative md:sticky md:top-0 z-50 border-b-4 border-amber-900 bg-[#fdf6e3]/95 backdrop-blur-sm shadow-[0_4px_0_0_#78350f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Kiri: Logo & Badge */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/" className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xl sm:text-2xl" aria-hidden="true">⚔️</span>
                <span className="text-xl sm:text-2xl font-black tracking-tighter uppercase drop-shadow-[2px_2px_0px_#fcd34d]">
                  CodeStep Fantasy
                </span>
              </Link>
              <div className="hidden md:flex items-center px-3 py-1 bg-amber-900 text-amber-50 text-[10px] font-bold uppercase tracking-wider rounded-full border-2 border-amber-700">
                Kurikulum Merdeka • Fase E SMK
              </div>
            </div>

            {/* Kanan: Navigasi & CTA */}
            <nav className="flex items-center gap-6">
              <div className="hidden lg:flex items-center gap-6 text-sm font-bold text-amber-900">
                <Link href="#beranda" className="hover:text-amber-600 transition-colors">Beranda</Link>
                <Link href="#kompetensi" className="hover:text-amber-600 transition-colors">Capaian Pembelajaran</Link>
                <Link href="/about" className="hover:text-amber-600 transition-colors">Panduan & Riset</Link>
              </div>
              
              <Link 
                href="/play"
                className="inline-flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs sm:text-sm uppercase tracking-wide border-2 border-emerald-950 shadow-[3px_3px_0px_0px_#064e3b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#064e3b] transition-all rounded-md whitespace-nowrap"
              >
                <span className="sm:hidden">[ Masuk ]</span>
                <span className="hidden sm:inline">[ Masuk Sesi Bermain ]</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-20 flex-grow">
        {/* 3. HERO SECTION */}
        <section id="beranda" className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center mb-16 sm:mb-20">
          {/* Kolom Kiri: Teks & CTA */}
          <div className="flex flex-col items-start gap-5 sm:gap-6">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 border-2 border-blue-900 rounded-full shadow-[2px_2px_0px_0px_#1e3a8a]">
                <span className="text-sm">📘</span>
                <span className="text-[10px] sm:text-xs font-bold text-blue-900 uppercase tracking-widest">
                  Media Pembelajaran Informatika
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-200/80 border-2 border-amber-900 rounded-full text-[10px] sm:text-xs font-bold text-amber-950">
                <span>📱</span>
                <span>Mobile Web / LAN Lab Ready</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight drop-shadow-[3px_3px_0px_#fcd34d]">
              Kuasai Logika Algoritma Lewat Petualangan Dungeon!
            </h1>

            <p className="text-base sm:text-lg text-amber-900/80 font-medium leading-relaxed max-w-xl">
              Bantu ksatria menembus 8 rintangan labirin dengan menyusun <strong className="text-amber-950">runtunan perintah</strong> dan <strong className="text-amber-950">percabangan kondisi JIKA-MAKA</strong>. Belajar berpikir komputasional jadi lebih seru dan mandiri!
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-2 w-full sm:w-auto">
              <Link 
                href="/play"
                className="inline-flex justify-center items-center gap-2 px-6 py-3.5 sm:py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm sm:text-base uppercase tracking-widest border-4 border-emerald-950 shadow-[6px_6px_0px_0px_#064e3b] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[2px_2px_0px_0px_#064e3b] transition-all rounded-md whitespace-nowrap"
              >
                [ ⚔️ Mulai Petualangan ▶ ]
              </Link>
              <Link 
                href="/about"
                className="inline-flex justify-center items-center gap-2 px-6 py-3.5 sm:py-4 bg-[#fdf6e3] hover:bg-amber-100 text-amber-950 font-bold text-sm sm:text-base border-4 border-amber-900 shadow-[6px_6px_0px_0px_#78350f] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[2px_2px_0px_0px_#78350f] transition-all rounded-md whitespace-nowrap"
              >
                📜 Pelajari Mekanisme (How to Play)
              </Link>
            </div>
          </div>

          {/* Kolom Kanan: Mockup Gambar Asli */}
          <div className="relative w-full max-w-xl mx-auto lg:ml-auto">
            <div className="border-4 border-amber-950 shadow-[6px_6px_0px_0px_rgba(120,53,15,1)] rounded-lg overflow-hidden relative aspect-video bg-amber-900/10">
              <Image
                src="/Gambar_Mockup.jpg"
                alt="Mockup Visual CodeStep Fantasy"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                className="object-cover object-center"
                priority
              />
            </div>
          </div>
        </section>

        {/* 4. FITUR PEMBELAJARAN & EVALUASI BELAJAR */}
        <section id="kompetensi" className="mb-8">
          <div className="flex items-center gap-3 mb-6 border-b-2 border-amber-900/20 pb-2">
            <span className="text-xl" aria-hidden="true">🎯</span>
            <h2 className="text-sm sm:text-base font-black text-amber-950 uppercase tracking-widest">
              Fokus Kompetensi & Evaluasi Belajar
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {/* Kartu 1 */}
            <div className="bg-[#fdf6e3] border-4 border-amber-900 rounded-xl p-5 shadow-[6px_6px_0px_0px_#78350f] flex gap-4 items-start hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#78350f] transition-all">
              <div className="text-3xl sm:text-4xl drop-shadow-sm flex-shrink-0" aria-hidden="true">📜</div>
              <div>
                <h3 className="font-black text-amber-950 text-base sm:text-lg mb-1">Algoritma Runtunan</h3>
                <p className="text-xs sm:text-sm text-amber-900/80 font-medium leading-snug">
                  Visualisasi eksekusi instruksi sekuensial secara deterministik berbasis konsep <em>Notional Machine</em>[cite: 1].
                </p>
              </div>
            </div>

            {/* Kartu 2 */}
            <div className="bg-[#fdf6e3] border-4 border-amber-900 rounded-xl p-5 shadow-[6px_6px_0px_0px_#78350f] flex gap-4 items-start hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#78350f] transition-all">
              <div className="text-3xl sm:text-4xl drop-shadow-sm flex-shrink-0" aria-hidden="true">🔀</div>
              <div>
                <h3 className="font-black text-amber-950 text-base sm:text-lg mb-1">Logika Percabangan</h3>
                <p className="text-xs sm:text-sm text-amber-900/80 font-medium leading-snug">
                  Latih evaluasi kondisi (IF-ELSE) untuk mengambil keputusan saat menghadapi rintangan dinamis labirin[cite: 1].
                </p>
              </div>
            </div>

            {/* Kartu 3 */}
            <div className="bg-[#fdf6e3] border-4 border-amber-900 rounded-xl p-5 shadow-[6px_6px_0px_0px_#78350f] flex gap-4 items-start hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#78350f] transition-all">
              <div className="text-3xl sm:text-4xl drop-shadow-sm flex-shrink-0" aria-hidden="true">📊</div>
              <div>
                <h3 className="font-black text-amber-950 text-base sm:text-lg mb-1">Learning Analytics</h3>
                <p className="text-xs sm:text-sm text-amber-900/80 font-medium leading-snug">
                  Proses berpikir dan pola kesalahan tercatat otomatis ke dalam sistem telemetri untuk evaluasi riset.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 5. FOOTER AKADEMIK */}
      <footer className="relative z-10 border-t-4 border-amber-900/20 bg-[#fdf6e3] py-6 sm:py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-[10px] sm:text-xs md:text-sm font-bold text-amber-900/70 uppercase tracking-wider">
            Dikembangkan untuk Penelitian Skripsi • Pendidikan Teknologi Informasi • Universitas Negeri Surabaya
          </p>
          <Link 
            href="/admin" 
            className="text-[10px] sm:text-xs font-bold text-amber-900/50 hover:text-amber-900 transition-colors uppercase tracking-widest whitespace-nowrap"
          >
            🔒 Portal Evaluator
          </Link>
        </div>
      </footer>
    </div>
  );
}