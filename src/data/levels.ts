import { LevelConfig } from '@/types/game';

export const LEVELS: Record<number, LevelConfig> = {
  // ==========================================
  // LEVEL 1: Runtunan Linier Murni (Sequence)
  // Solusi ideal: MAJU, MAJU, MAJU (3 kartu)
  // ==========================================
  1: {
    id: 1,
    title: "Level 1: Langkah Perdana",
    concept: "Runtunan Linier (Sequence)",
    cardLimit: 4,
    startPos: [4, 1],
    startDirection: 'NORTH',
    requiresHerb: false,
    grid: [
      ['WALL',  'WALL',  'WALL',  'WALL',  'WALL',  'WALL'],
      ['WALL',  'GATE',  'WALL',  'WALL',  'WALL',  'WALL'],
      ['WALL',  'EMPTY', 'WALL',  'WALL',  'WALL',  'WALL'],
      ['WALL',  'EMPTY', 'WALL',  'WALL',  'WALL',  'WALL'],
      ['WALL',  'EMPTY', 'WALL',  'WALL',  'WALL',  'WALL'],
      ['WALL',  'WALL',  'WALL',  'WALL',  'WALL',  'WALL'],
    ]
  },

  // ==========================================
  // LEVEL 2: Navigasi Egosentris (Belokan L-Path)
  // Solusi ideal: MAJU, MAJU, MAJU, BELOK_KANAN, MAJU, MAJU (6 kartu)
  // ==========================================
  2: {
    id: 2,
    title: "Level 2: Tikungan Berliku",
    concept: "Navigasi Egosentris (Belokan L-Path)",
    cardLimit: 6,
    startPos: [4, 1],
    startDirection: 'NORTH',
    requiresHerb: false,
    grid: [
      ['WALL',  'WALL',  'WALL',  'WALL',  'WALL',  'WALL'],
      ['WALL',  'EMPTY', 'EMPTY', 'GATE',  'WALL',  'WALL'],
      ['WALL',  'EMPTY', 'WALL',  'WALL',  'WALL',  'WALL'],
      ['WALL',  'EMPTY', 'WALL',  'WALL',  'WALL',  'WALL'],
      ['WALL',  'EMPTY', 'WALL',  'WALL',  'WALL',  'WALL'],
      ['WALL',  'WALL',  'WALL',  'WALL',  'WALL',  'WALL'],
    ]
  },

  // ==========================================
  // LEVEL 3: Single IF (Evaluasi Sensor Paku)
  // Solusi ideal: MAJU, IF_SPIKE_SHIELD, MAJU, MAJU (4 kartu)
  // ==========================================
  3: {
    id: 3,
    title: "Level 3: Jebakan Paku Berduri",
    concept: "Percabangan Tunggal (IF Spike)",
    cardLimit: 5,
    startPos: [4, 2],
    startDirection: 'NORTH',
    requiresHerb: false,
    grid: [
      ['WALL',  'WALL',  'WALL',  'WALL',  'WALL',  'WALL'],
      ['WALL',  'WALL',  'GATE',  'WALL',  'WALL',  'WALL'],
      ['WALL',  'WALL',  'SPIKE', 'WALL',  'WALL',  'WALL'],
      ['WALL',  'WALL',  'EMPTY', 'WALL',  'WALL',  'WALL'],
      ['WALL',  'WALL',  'EMPTY', 'WALL',  'WALL',  'WALL'],
      ['WALL',  'WALL',  'WALL',  'WALL',  'WALL',  'WALL'],
    ]
  },

  // ==========================================
  // LEVEL 4: Single IF (Evaluasi Sensor Monster)
  // Solusi ideal: MAJU, IF_MONSTER_SLASH, MAJU, MAJU (4 kartu)
  // ==========================================
  4: {
    id: 4,
    title: "Level 4: Penjaga Bayangan",
    concept: "Percabangan Tunggal (IF Monster)",
    cardLimit: 5,
    startPos: [4, 3],
    startDirection: 'NORTH',
    requiresHerb: false,
    grid: [
      ['WALL',  'WALL',  'WALL',  'WALL',    'WALL', 'WALL'],
      ['WALL',  'WALL',  'WALL',  'GATE',    'WALL', 'WALL'],
      ['WALL',  'WALL',  'WALL',  'MONSTER', 'WALL', 'WALL'],
      ['WALL',  'WALL',  'WALL',  'EMPTY',   'WALL', 'WALL'],
      ['WALL',  'WALL',  'WALL',  'EMPTY',   'WALL', 'WALL'],
      ['WALL',  'WALL',  'WALL',  'WALL',    'WALL', 'WALL'],
    ]
  },

  // ==========================================
  // LEVEL 5: Multi-IF Linier (Paku + Monster Berturut)
  // Solusi ideal: MAJU, IF_SPIKE_SHIELD, MAJU, IF_MONSTER_SLASH, MAJU, MAJU (6 kartu)
  // ==========================================
  5: {
    id: 5,
    title: "Level 5: Lorong Rintangan Ganda",
    concept: "Multi-Kondisi Linier (IF Spike & IF Monster)",
    cardLimit: 7,
    startPos: [4, 2],
    startDirection: 'NORTH',
    requiresHerb: false,
    grid: [
      ['WALL',  'GATE',    'WALL',  'WALL',  'WALL',  'WALL'],
      ['WALL',  'EMPTY',   'WALL',  'WALL',  'WALL',  'WALL'],
      ['WALL',  'MONSTER', 'WALL',  'WALL',  'WALL',  'WALL'],
      ['WALL',  'SPIKE',   'WALL',  'WALL',  'WALL',  'WALL'],
      ['WALL',  'EMPTY',   'EMPTY', 'WALL',  'WALL',  'WALL'],
      ['WALL',  'WALL',    'WALL',  'WALL',  'WALL',  'WALL'],
    ]
  },

  // ==========================================
  // LEVEL 6: Multi-IF dengan Belokan Siku (Z-Path / Corner Logic)
  // Solusi: MAJU, IF_MONSTER_SLASH, MAJU, BELOK_KANAN, IF_SPIKE_SHIELD, MAJU, MAJU (7 kartu)
  // ==========================================
  6: {
    id: 6,
    title: "Level 6: Labirin Pengawal",
    concept: "Kombinasi Navigasi & Percabangan Rintangan",
    cardLimit: 8,
    startPos: [3, 1],
    startDirection: 'NORTH',
    requiresHerb: false,
    grid: [
      ['WALL',  'WALL',    'WALL',  'WALL',  'WALL',  'WALL'],
      ['WALL',  'EMPTY',   'SPIKE', 'GATE',  'WALL',  'WALL'],
      ['WALL',  'MONSTER', 'WALL',  'WALL',  'WALL',  'WALL'],
      ['WALL',  'EMPTY',   'WALL',  'WALL',  'WALL',  'WALL'],
      ['WALL',  'WALL',    'WALL',  'WALL',  'WALL',  'WALL'],
      ['WALL',  'WALL',    'WALL',  'WALL',  'WALL',  'WALL'],
    ]
  },

  // ==========================================
  // LEVEL 7: Pengambilan Item Herbal (Pre-condition Gate)
  // Solusi: MAJU, AMBIL_ITEM, BELOK_KANAN, MAJU, BELOK_KIRI, MAJU, MAJU (7 kartu)
  // Syarat: requiresHerb = true
  // ==========================================
  7: {
    id: 7,
    title: "Level 7: Bunga Penawar Lembah",
    concept: "Prasyarat Kondisional (Pre-condition Item)",
    cardLimit: 8,
    startPos: [4, 1],
    startDirection: 'NORTH',
    requiresHerb: true,
    grid: [
      ['WALL',  'WALL',  'WALL',  'WALL',  'WALL',  'WALL'],
      ['WALL',  'WALL',  'WALL',  'GATE',  'WALL',  'WALL'],
      ['WALL',  'WALL',  'WALL',  'EMPTY', 'WALL',  'WALL'],
      ['WALL',  'HERB',  'EMPTY', 'EMPTY', 'WALL',  'WALL'],
      ['WALL',  'EMPTY', 'WALL',  'WALL',  'WALL',  'WALL'],
      ['WALL',  'WALL',  'WALL',  'WALL',  'WALL',  'WALL'],
    ]
  },

  // ==========================================
  // LEVEL 8: Integrasi Komprehensif (Spike, Monster, Herbal, Kuota Ketat)
  // Rute: Evaluasi duri, ambil obat herbal, tebas monster pengawal gerbang
  // Kuota register: 10 kartu
  // ==========================================
  8: {
    id: 8,
    title: "Level 8: Gerbang Benteng Terakhir",
    concept: "Sintesis Algoritma Lengkap (Grand Challenge)",
    cardLimit: 20,
    startPos: [4, 1],
    startDirection: 'NORTH',
    requiresHerb: true,
    grid: [
      ['WALL',  'WALL',  'WALL',    'WALL',  'WALL',  'WALL'],
      ['WALL',  'WALL',  'GATE',    'WALL',  'WALL',  'WALL'],
      ['WALL',  'HERB',  'MONSTER', 'WALL',  'WALL',  'WALL'],
      ['WALL',  'SPIKE', 'WALL',    'WALL',  'WALL',  'WALL'],
      ['WALL',  'EMPTY', 'WALL',    'WALL',  'WALL',  'WALL'],
      ['WALL',  'WALL',  'WALL',    'WALL',  'WALL',  'WALL'],
    ]
  }
};