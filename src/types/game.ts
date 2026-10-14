export type Direction = 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';

export type CardType = 
  | 'MAJU_LANGKAH'
  | 'BELOK_KIRI'
  | 'BELOK_KANAN'
  | 'AMBIL_ITEM'
  | 'IF_SPIKE_SHIELD'
  | 'IF_MONSTER_SLASH';

export type TileType = 
  | 'EMPTY'    // Jalur kosong aman (0)
  | 'WALL'     // Tembok pembatas rute (1)
  | 'SPIKE'    // Paku / duri rintangan (2)
  | 'MONSTER'  // Monster (3)
  | 'HERB'     // Bunga herbal prasyarat (4)
  | 'GATE';    // Gerbang finish (5)

export interface LevelConfig {
  id: number;
  title: string;
  concept: string;               // Konsep CT (Runtunan, Percabangan tunggal, dll.)
  cardLimit: number;             // Kuota kartu register di panel
  startPos: [number, number];    // Koordinat awal [row, col] di grid 6x6 (0-5)
  startDirection: Direction;     // Orientasi awal karakter
  requiresHerb: boolean;         // Apakah butuh bunga herbal untuk membuka gerbang
  grid: TileType[][];            // Matriks seragam 6 baris x 6 kolom
}