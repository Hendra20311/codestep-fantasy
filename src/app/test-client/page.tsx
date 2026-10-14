'use client';

import React, { useState } from 'react';

export default function TestClientPage() {
  const [studentName, setStudentName] = useState('Budi Santoso');
  const [isEngineOn, setIsEngineOn] = useState(false);
  const [attemptCount, setAttemptCount] = useState(1);
  const [statusMessage, setStatusMessage] = useState('');

  const sendTelemetry = async (actionType: 'VALIDASI' | 'ULANGI') => {
    // Aturan Sistem: Mesin harus ON sebelum validasi/kirim data
    if (!isEngineOn) {
      setStatusMessage('⚠️ Mesin/Game harus ON sebelum melakukan aksi!');
      return;
    }

    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          attemptCount,
          isEngineOn,
          actionType,
        }),
      });

      if (response.ok) {
        setStatusMessage(`✅ Log ${actionType} berhasil terkirim ke laptop!`);
        if (actionType === 'ULANGI') {
          setAttemptCount((prev) => prev + 1); // Tambah hitungan percobaan
        }
      } else {
        setStatusMessage('❌ Gagal mengirim telemetri.');
      }
    } catch {
      setStatusMessage('❌ Koneksi terputus. Pastikan 1 jaringan Wi-Fi!');
    }
  };

  return (
    <main className="min-h-screen bg-amber-100 p-4 font-mono flex flex-col items-center justify-center">
      <div className="w-full max-w-sm bg-amber-50 border-4 border-amber-900 p-5 shadow-[6px_6px_0px_#78350f]">
        <h2 className="text-lg font-black text-amber-950 border-b-2 border-amber-900 pb-2 mb-4">
          📱 Remote Client Telemetri
        </h2>

        {/* Status Notifikasi */}
        {statusMessage && (
          <div className="mb-4 p-2 bg-amber-200 border-2 border-amber-900 text-xs font-bold text-amber-950">
            {statusMessage}
          </div>
        )}

        {/* Input Nama Siswa */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-amber-900 mb-1">Nama Petualang:</label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="w-full p-2 bg-amber-100 border-2 border-amber-900 font-bold text-xs"
          />
        </div>

        {/* Kontrol Status Percobaan & Saklar ON/OFF */}
        <div className="bg-amber-200/50 p-3 border-2 border-amber-900 mb-4 flex justify-between items-center">
          <div>
            <span className="text-[11px] font-bold block text-amber-900">Percobaan Ke:</span>
            <span className="text-xl font-black text-amber-950">#{attemptCount}</span>
          </div>

          <button
            onClick={() => setIsEngineOn(!isEngineOn)}
            className={`px-3 py-2 text-xs font-black border-2 border-amber-900 shadow-[2px_2px_0px_#78350f] active:translate-y-0.5 ${
              isEngineOn ? 'bg-emerald-500 text-emerald-950' : 'bg-rose-400 text-rose-950'
            }`}
          >
            {isEngineOn ? 'STATUS: ON 🟢' : 'STATUS: OFF 🔴'}
          </button>
        </div>

        {/* Tombol Aksi Learning Analytics */}
        <div className="space-y-3">
          <button
            onClick={() => sendTelemetry('VALIDASI')}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase border-2 border-emerald-950 shadow-[3px_3px_0px_#064e3b] active:translate-y-0.5"
          >
            Validasi Algoritma
          </button>

          <button
            onClick={() => sendTelemetry('ULANGI')}
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-black text-xs uppercase border-2 border-amber-950 shadow-[3px_3px_0px_#78350f] active:translate-y-0.5"
          >
            Ulangi / Reset Percobaan
          </button>
        </div>
      </div>
    </main>
  );
}