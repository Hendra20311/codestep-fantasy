'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PlayRegistrationPage() {
  // Hanya menyimpan state untuk UI feedback, bukan untuk value input
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStartGame = (e: React.FormEvent<HTMLFormElement>) => {
    // Cegah reload halaman bawaan form HTML
    e.preventDefault();
    setErrorMessage('');

    // Baca data langsung dari DOM (Uncontrolled Native Fallback)
    const formData = new FormData(e.currentTarget);
    const name = (formData.get('fullName') as string || '').trim();
    const studentClass = formData.get('studentClass') as string;
    const absentStr = formData.get('absentNumber') as string;
    const absent = parseInt(absentStr, 10);

    // Validasi Manual (Tanpa atribut 'required' di HTML agar tidak diblokir diam-diam oleh browser mobile)
    if (!name) {
      setErrorMessage('⚠️ Silakan isi Nama Lengkap terlebih dahulu!');
      return;
    }
    if (!studentClass) {
      setErrorMessage('⚠️ Silakan pilih Rombel / Kelas!');
      return;
    }
    if (!absentStr || isNaN(absent) || absent < 1 || absent > 36) {
      setErrorMessage('⚠️ Nomor presensi harus angka antara 1 sampai 36!');
      return;
    }

    setIsLoading(true);

    try {
      const uniqueSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      const studentSession = {
        session_id: uniqueSessionId,
        name: name,
        class: studentClass,
        absentNumber: absent,
        startedAt: new Date().toISOString(),
      };

      // 1. Simpan ke localStorage
      try {
        window.localStorage.setItem('codestep_student', JSON.stringify(studentSession));
      } catch (err) {
        console.warn('localStorage error:', err);
      }

      // 2. Simpan ke Cookie sebagai cadangan
      try {
        document.cookie = `codestep_student=${encodeURIComponent(JSON.stringify(studentSession))}; path=/; max-age=86400`;
      } catch (err) {
        console.warn('cookie error:', err);
      }

      // 3. Navigasi Paksa ke Level 1
      window.location.href = '/level/1';
    } catch (err) {
      alert('Terjadi kesalahan: ' + String(err));
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fdf6e3] flex flex-col items-center justify-center p-4 selection:bg-amber-300 selection:text-amber-900 font-sans relative overflow-hidden">
      {/* Background grid */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #d97706 1px, transparent 1px),
            linear-gradient(to bottom, #d97706 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Frame Kartu Utama */}
      <div className="relative z-10 w-full max-w-lg bg-[#fffdfa] border-4 border-amber-950 shadow-[8px_8px_0px_0px_rgba(120,53,15,1)] p-6 sm:p-8 rounded-lg">
        
        {/* Navigasi Balik ke Beranda */}
        <div className="mb-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 hover:text-amber-700 transition-colors uppercase tracking-wider"
          >
            <span aria-hidden="true">&larr;</span> Kembali ke Beranda
          </Link>
        </div>

        {/* Sudut Hiasan Piksel */}
        <div className="absolute top-2 left-2 w-2.5 h-2.5 bg-amber-950" />
        <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-amber-950" />
        <div className="absolute bottom-2 left-2 w-2.5 h-2.5 bg-amber-950" />
        <div className="absolute bottom-2 right-2 w-2.5 h-2.5 bg-amber-950" />

        {/* Header Identitas Sesi */}
        <div className="text-center mb-6">
          <div className="inline-block bg-amber-900 text-amber-50 text-[11px] px-3 py-1 font-bold rounded-full border border-amber-700 uppercase tracking-wider mb-2">
            Registrasi Sesi Siswa • Fase E SMK
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight drop-shadow-[2px_2px_0px_#fed7aa]">
            CODESTEP FANTASY
          </h1>
          <div className="h-1 w-20 bg-amber-900/30 mx-auto my-2 rounded-full" />
          <p className="text-xs sm:text-sm text-amber-900/80 font-medium">
            Laboratorium Algoritma &amp; Berpikir Komputasional
          </p>
        </div>

        {/* Kotak Error */}
        {errorMessage && (
          <div className="mb-5 p-3 bg-rose-100 border-2 border-rose-800 text-rose-900 text-xs font-bold rounded shadow-[2px_2px_0px_#9f1239]">
            {errorMessage}
          </div>
        )}

        {/* Menggunakan tag <form> standar HTML5 */}
        <form onSubmit={handleStartGame} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-xs font-bold text-amber-950 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
              <span>📜</span> Nama Lengkap Siswa
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              defaultValue=""
              placeholder="Contoh: Budi Santoso"
              className="w-full px-3.5 py-2.5 bg-amber-50/80 border-2 border-amber-900 text-amber-950 font-semibold placeholder:text-amber-900/40 text-sm rounded focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-600 shadow-[2px_2px_0px_0px_#78350f]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="studentClass" className="block text-xs font-bold text-amber-950 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <span>🛡️</span> Rombel / Kelas
              </label>
              <select
                id="studentClass"
                name="studentClass"
                defaultValue=""
                className="w-full px-3 py-2.5 bg-amber-50/80 border-2 border-amber-900 text-amber-950 font-semibold text-sm rounded focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-600 shadow-[2px_2px_0px_0px_#78350f] cursor-pointer"
              >
                <option value="">Pilih Kelas</option>
                <option value="X-RPL-1">X RPL 1</option>
                <option value="X-RPL-2">X RPL 2</option>
                <option value="X-TKJ-1">X TKJ 1</option>
                <option value="X-TKJ-2">X TKJ 2</option>
              </select>
            </div>

            <div>
              <label htmlFor="absentNumber" className="block text-xs font-bold text-amber-950 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <span>🔢</span> No. Presensi
              </label>
              <input
                type="number"
                id="absentNumber"
                name="absentNumber"
                defaultValue=""
                placeholder="1 - 36"
                className="w-full px-3 py-2.5 bg-amber-50/80 border-2 border-amber-900 text-amber-950 font-semibold placeholder:text-amber-900/40 text-sm rounded focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-600 shadow-[2px_2px_0px_0px_#78350f]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase tracking-widest border-2 border-emerald-950 shadow-[4px_4px_0px_0px_#064e3b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#064e3b] transition-all rounded flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap"
          >
            {isLoading ? <span>MENYIAPKAN ARENA...</span> : (
              <><span>⚔️ MULAI PETUALANGAN</span><span aria-hidden="true">&gt;&gt;</span></>
            )}
          </button>
        </form>

        {/* Catatan Etika */}
        <div className="mt-6 pt-4 border-t-2 border-dashed border-amber-900/20 text-center">
          <p className="text-[11px] text-amber-900/70 leading-relaxed font-medium">
            🔒 <strong>Pemberitahuan Penelitian:</strong> Data interaksi dan penyelesaian algoritma dicatat untuk keperluan evaluasi media pembelajaran. Identitas peserta didik dijaga kerahasiaannya untuk analisis akademik.
          </p>
        </div>
      </div>
    </main>
  );
}