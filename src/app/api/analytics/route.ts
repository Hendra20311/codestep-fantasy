import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface TelemetryLog {
  id: string;
  studentName: string;
  attemptCount: number;
  isEngineOn: boolean;
  actionType: 'VALIDASI' | 'ULANGI';
  deviceInfo: string;
  timestamp: string;
}

// Lokasi penyimpanan file permanen di root project
const dataDir = path.join(process.cwd(), 'data');
const filePath = path.join(dataDir, 'telemetry.json');

// Helper membaca data dari file fisik
function readLogsFromFile(): TelemetryLog[] {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]), 'utf-8');
      return [];
    }
    const fileData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileData || '[]');
  } catch (err) {
    console.error('Gagal membaca telemetry.json:', err);
    return [];
  }
}

// Helper menyimpan data ke file fisik
function writeLogsToFile(logs: TelemetryLog[]) {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(logs, null, 2), 'utf-8');
  } catch (err) {
    console.error('Gagal menulis ke telemetry.json:', err);
  }
}

// GET: Dipanggil oleh Dashboard Admin
export async function GET() {
  const logs = readLogsFromFile();
  return NextResponse.json({ logs });
}

// POST: Dipanggil oleh Remote HP Siswa
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const newLog: TelemetryLog = {
      id: `LOG-${Date.now()}`,
      studentName: body.studentName || 'Siswa Uji Coba',
      attemptCount: Number(body.attemptCount) || 1,
      isEngineOn: Boolean(body.isEngineOn),
      actionType: body.actionType,
      deviceInfo: req.headers.get('user-agent') || 'Mobile Device',
      timestamp: new Date().toLocaleTimeString('id-ID'),
    };

    const currentLogs = readLogsFromFile();
    currentLogs.unshift(newLog); // Letakkan log terbaru di paling atas

    // Simpan permanen ke file JSON
    writeLogsToFile(currentLogs);

    return NextResponse.json({ success: true, log: newLog });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Format data salah' }, { status: 400 });
  }
}