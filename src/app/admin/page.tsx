'use client';

import React, { useEffect, useState } from 'react';

interface TelemetryLog {
  id: string;
  studentName: string;
  attemptCount: number;
  isEngineOn: boolean;
  actionType: 'VALIDASI' | 'ULANGI';
  deviceInfo: string;
  timestamp: string;
}

export default function AdminDashboardPage() {
  const [logs, setLogs] = useState<TelemetryLog[]>([]);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (err) {
      console.error('Gagal mengambil data telemetri', err);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 2000); // Auto-refresh tiap 2 detik
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-amber-100 p-6 font-mono text-amber-950">
      <div className="max-w-5xl mx-auto">
        {/* Header Dashboard */}
        <header className="bg-amber-50 border-4 border-amber-900 p-4 shadow-[6px_6px_0px_#78350f] mb-6 flex justify-between items-center">
          <div>
            <span className="text-xs bg-amber-700 text-amber-50 px-2 py-0.5 font-bold uppercase">
              Laboratorium Riset
            </span>
            <h1 className="text-2xl font-black mt-1">Live Learning Analytics Dashboard</h1>
          </div>
          <div className="text-right">
            <span className="inline-block w-3 h-3 bg-emerald-500 rounded-full animate-pulse mr-2" />
            <span className="text-xs font-bold text-emerald-800">Menghubungkan ke Jaringan...</span>
          </div>
        </header>

        {/* Tabel Data Telemetri */}
        <div className="bg-amber-50 border-4 border-amber-900 shadow-[6px_6px_0px_#78350f] overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-amber-200 border-b-2 border-amber-900 font-black">
                <th className="p-3">Waktu</th>
                <th className="p-3">Identitas</th>
                <th className="p-3">Percobaan Ke-</th>
                <th className="p-3">Status Mesin</th>
                <th className="p-3">Aksi Terpicu</th>
                <th className="p-3">Perangkat</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-amber-800 italic">
                    Belum ada kiriman data dari HP. Buka URL client di browser HP Anda.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-amber-200 hover:bg-amber-100/60">
                    <td className="p-3 font-bold">{log.timestamp}</td>
                    <td className="p-3 font-semibold">{log.studentName}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-amber-300 border border-amber-900 font-bold rounded">
                        #{log.attemptCount}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 font-bold border rounded ${
                          log.isEngineOn
                            ? 'bg-emerald-200 border-emerald-900 text-emerald-900'
                            : 'bg-rose-200 border-rose-900 text-rose-900'
                        }`}
                      >
                        {log.isEngineOn ? '🟢 ACTIVE' : '🔴 OFF'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`font-black ${
                          log.actionType === 'VALIDASI' ? 'text-emerald-700' : 'text-amber-800'
                        }`}
                      >
                        {log.actionType}
                      </span>
                    </td>
                    <td className="p-3 max-w-xs truncate text-amber-700" title={log.deviceInfo}>
                      {log.deviceInfo}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}