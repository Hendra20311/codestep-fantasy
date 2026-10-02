'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import DungeonScene, { Command } from '@/game/DungeonScene';

// Panggil GameCanvas tanpa SSR agar tidak error window
const GameCanvas = dynamic(() => import('@/components/GameCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-[300px] h-[300px] bg-slate-800 rounded-xl flex items-center justify-center text-sm text-gray-400">
      Memuat Arena Dungeon...
    </div>
  ),
});

export default function Home() {
  const [scene, setScene] = useState<DungeonScene | null>(null);
  const [commands, setCommands] = useState<Command[]>([]);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>(
    'Bantu petualang mencapai pintu keluar dengan menyusun instruksi logika!'
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Variabel Telemetri
  const attempts = useRef(0);
  const startTime = useRef(Date.now());

  const addCommand = (type: 'MOVE' | 'SHIELD') => {
    if (isRunning) return;
    setCommands((prev) => [
      ...prev,
      { id: Math.random().toString(36).substring(7), type },
    ]);
  };

  const removeCommand = (index: number) => {
    if (isRunning) return;
    setCommands((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRun = () => {
    if (!scene || commands.length === 0 || isRunning) return;

    setIsRunning(true);
    attempts.current += 1;
    setStatusMessage('Petualang sedang menjalankan instruksi...');

    scene.runInstructions(
      commands,
      (stepIndex) => setActiveStep(stepIndex),
      (result) => {
        setIsRunning(false);
        setActiveStep(null);
        const durationSec = Math.floor((Date.now() - startTime.current) / 1000);

        // Objek Telemetri Kognitif yang siap dikirim
        const telemetryPayload = {
          game_title: 'CodeStep Fantasy',
          level_id: 1,
          total_attempts: attempts.current,
          duration_seconds: durationSec,
          commands_count: commands.length,
          commands_sequence: commands.map((c) => c.type),
          is_success: result.success,
          error_detail: result.reason || null,
          failed_at_step: result.failedStep || null,
          timestamp: new Date().toISOString(),
        };

        console.log('📌 [DATA TELEMETRI TERCATAT]:', telemetryPayload);

        if (result.success) {
          setStatusMessage(
            `🎉 Berhasil! Pintu keluar tercapai dalam ${durationSec} detik (${attempts.current} percobaan).`
          );
        } else {
          setStatusMessage(`❌ Gagal: ${result.reason}`);
        }
      }
    );
  };

  const handleReset = () => {
    if (isRunning) return;
    setCommands([]);
    setActiveStep(null);
    scene?.resetPlayer();
    setStatusMessage('Instruksi dikosongkan. Susun ulang langkahmu.');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-6 font-sans">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-black tracking-wide text-amber-400">
          CodeStep Fantasy <span className="text-xs bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">MVP Demo</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Materi: Runtunan & Percabangan Sederhana (Level 1)
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 max-w-4xl w-full justify-center items-start">
        {/* Kolom Kiri: Layar Labirin */}
        <div className="flex flex-col items-center bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md">
          <GameCanvas onSceneReady={setScene} />
          <div className="flex gap-4 mt-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-blue-500 rounded-sm inline-block"></span> Petualang
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-red-500 rounded-sm inline-block"></span> Paku (Jebakan)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-green-500 rounded-sm inline-block"></span> Tangga Keluar
            </span>
          </div>
        </div>

        {/* Kolom Kanan: Panel Logika & Kode */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl w-full lg:w-80 shadow-md flex flex-col gap-4">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Palet Kartu Instruksi
            </span>
            <div className="grid grid-cols-1 gap-2 mt-2">
              <button
                disabled={isRunning}
                onClick={() => addCommand('MOVE')}
                className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs py-2 px-3 rounded-lg font-medium text-left transition disabled:opacity-50"
              >
                + Langkah Maju (1 Petak)
              </button>
              <button
                disabled={isRunning}
                onClick={() => addCommand('SHIELD')}
                className="bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 text-xs py-2 px-3 rounded-lg font-medium text-left transition disabled:opacity-50"
              >
                + JIKA Depan Ada Bahaya ➔ Siapkan Tameng
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Alur Rencana ({commands.length})
              </span>
              <button
                onClick={handleReset}
                disabled={isRunning}
                className="text-[11px] text-red-400 hover:underline disabled:opacity-50"
              >
                Hapus Semua
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-2 min-h-[140px] max-h-48 overflow-y-auto flex flex-col gap-1.5">
              {commands.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-600 text-xs">
                  Belum ada kartu instruksi...
                </div>
              ) : (
                commands.map((cmd, idx) => (
                  <div
                    key={cmd.id}
                    className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-md font-mono transition ${
                      activeStep === idx
                        ? 'bg-amber-500 text-slate-950 font-bold shadow'
                        : 'bg-slate-900 border border-slate-800 text-slate-300'
                    }`}
                  >
                    <span>
                      {idx + 1}. {cmd.type === 'SHIELD' ? 'IF (Paku) ➔ TAMENG' : 'MAJU_LANGKAH'}
                    </span>
                    {!isRunning && (
                      <button
                        onClick={() => removeCommand(idx)}
                        className="text-slate-500 hover:text-red-400 ml-2"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={handleRun}
            disabled={isRunning || commands.length === 0}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-lg shadow-emerald-950"
          >
            {isRunning ? 'Mengeksekusi...' : '▶ Jalankan Rencana'}
          </button>
        </div>
      </div>

      {/* Kotak Status Umpan Balik */}
      <div className="mt-5 max-w-4xl w-full bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-center text-xs text-slate-300 shadow">
        {statusMessage}
      </div>
    </main>
  );
}