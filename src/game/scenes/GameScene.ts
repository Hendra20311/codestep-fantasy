import Phaser from 'phaser';
import { LevelConfig, Direction, CardType, TileType } from '@/types/game';

export default class GameScene extends Phaser.Scene {
  private levelData!: LevelConfig;
  private currentGrid: TileType[][] = [];
  private playerPos: [number, number] = [0, 0];
  private playerDir: Direction = 'NORTH';
  private playerSprite!: Phaser.GameObjects.Rectangle;
  private playerIndicator!: Phaser.GameObjects.Triangle;
  private shieldVisual?: Phaser.GameObjects.Arc;
  
  private tileSize = 64;
  private isExecuting = false;
  private hasHerb = false;
  private isShieldActive = false;

  // Koleksi objek visual untuk interaksi dinamis (monster/herb)
  private dynamicTileObjects: Map<string, Phaser.GameObjects.GameObject> = new Map();

  constructor() {
    super('GameScene');
  }

  init(data: { levelData: LevelConfig }) {
    this.levelData = data.levelData;
    // Kloning matriks grid awal agar tidak merusak data konfigurasi asli
    this.currentGrid = this.levelData.grid.map((row) => [...row]);
    this.playerPos = [...this.levelData.startPos];
    this.playerDir = this.levelData.startDirection;
    this.hasHerb = false;
    this.isShieldActive = false;
    this.isExecuting = false;
    this.dynamicTileObjects.clear();
  }

  create() {
    this.drawGrid();
    this.createPlayer();

    // Registrasi Event dari React UI
    this.game.events.on('RUN_CARDS', this.executeInstructions, this);
    this.game.events.on('RESET_LEVEL', this.resetPosition, this);
  }

  private drawGrid() {
    // Bersihkan objek dinamis lama jika ada
    this.dynamicTileObjects.forEach((obj) => obj.destroy());
    this.dynamicTileObjects.clear();

    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        const x = c * this.tileSize + this.tileSize / 2;
        const y = r * this.tileSize + this.tileSize / 2;
        const tileType = this.currentGrid[r][c];

        // Palet warna terang dan kontras tinggi
        let fillColor = 0xfef3c7; // Jalur biasa: krem batu pasir
        if (tileType === 'WALL') fillColor = 0xb45309;    // Tembok: cokelat bata
        else if (tileType === 'GATE') fillColor = 0x86efac; // Gerbang: hijau muda terang
        else if (tileType === 'SPIKE') fillColor = 0xfecaca; // Duri rintangan: merah muda
        else if (tileType === 'MONSTER') fillColor = 0xe9d5ff; // Monster: ungu muda
        else if (tileType === 'HERB') fillColor = 0xfef08a; // Bunga herbal: kuning

        // Petak dasar
        const tile = this.add.rectangle(x, y, this.tileSize - 2, this.tileSize - 2, fillColor);
        tile.setStrokeStyle(1.5, 0xd97706);

        // Ikon identitas petak
        const key = `${r}_${c}`;
        if (tileType === 'GATE') {
          const gateIcon = this.add.text(x, y, '🚪', { fontSize: '24px' }).setOrigin(0.5);
          this.dynamicTileObjects.set(key, gateIcon);
        } else if (tileType === 'SPIKE') {
          const spikeIcon = this.add.text(x, y, '▲', { fontSize: '20px', color: '#b91c1c' }).setOrigin(0.5);
          this.dynamicTileObjects.set(key, spikeIcon);
        } else if (tileType === 'MONSTER') {
          const monsterIcon = this.add.text(x, y, '👾', { fontSize: '24px' }).setOrigin(0.5);
          this.dynamicTileObjects.set(key, monsterIcon);
        } else if (tileType === 'HERB') {
          const herbIcon = this.add.text(x, y, '🌿', { fontSize: '24px' }).setOrigin(0.5);
          this.dynamicTileObjects.set(key, herbIcon);
        }
      }
    }
  }

  private createPlayer() {
    const [pRow, pCol] = this.playerPos;
    const px = pCol * this.tileSize + this.tileSize / 2;
    const py = pRow * this.tileSize + this.tileSize / 2;

    // Sprite karakter petualang
    this.playerSprite = this.add.rectangle(px, py, 38, 38, 0x1d4ed8);
    this.playerSprite.setStrokeStyle(2, 0x1e3a8a);
    this.playerSprite.setDepth(10);

    // Penunjuk orientasi arah hadap (segitiga emas)
    this.playerIndicator = this.add.triangle(px, py - 12, 0, 8, 8, 8, 4, 0, 0xfacc15);
    this.playerIndicator.setDepth(11);
    this.updateIndicatorRotation();
  }

  private updateIndicatorRotation() {
    const angleMap: Record<Direction, number> = {
      NORTH: 0,
      EAST: 90,
      SOUTH: 180,
      WEST: 270,
    };
    this.playerIndicator.setAngle(angleMap[this.playerDir]);
  }

  // Notional Machine: Jalankan instruksi satu per satu tiap 600ms
  private async executeInstructions(cards: CardType[]) {
    if (this.isExecuting) return;
    this.isExecuting = true;

    for (const card of cards) {
      const stepSuccess = await this.executeSingleCard(card);
      
      // JIKA SATU LANGKAH MENABRAK ATAU GAGAL
      if (!stepSuccess) {
        // Efek visual gagal: merah sejenak
        this.playerSprite.setFillStyle(0xef4444);
        await new Promise((res) => setTimeout(res, 450));

        // Kembalikan posisi karakter ke posisi start semula
        this.resetPosition();

        this.game.events.emit('GAME_RESULT', { 
          success: false, 
          reason: '❌ Gagal! Menabrak rintangan atau keluar jalur. Posisi dikembalikan ke awal!' 
        });
        this.isExecuting = false;
        return;
      }

      // Jeda 600 ms untuk visual tracing siswa
      await new Promise((res) => setTimeout(res, 600));
    }

    // Evaluasi posisi akhir setelah seluruh kartu selesai
    const [curR, curC] = this.playerPos;
    if (this.currentGrid[curR][curC] === 'GATE') {
      if (this.levelData.requiresHerb && !this.hasHerb) {
        this.resetPosition();
        this.game.events.emit('GAME_RESULT', { 
          success: false, 
          reason: '🚪 Gerbang terkunci! Bunga Herbal belum diambil.' 
        });
      } else {
        this.game.events.emit('GAME_RESULT', { 
          success: true, 
          reason: '🎉 Berhasil! Algoritma sukses memandu pahlawan ke gerbang!' 
        });
      }
    } else {
      // Kehabisan kartu sebelum sampai gerbang -> otomatis kembalikan ke awal
      this.resetPosition();
      this.game.events.emit('GAME_RESULT', { 
        success: false, 
        reason: '⚠️ Antrean kartu habis sebelum pahlawan mencapai gerbang finish. Posisi dikembalikan ke awal!' 
      });
    }

    this.isExecuting = false;
  }

  private executeSingleCard(card: CardType): Promise<boolean> {
    return new Promise((resolve) => {
      let [r, c] = this.playerPos;

      // 1. ROTASI BELOK KIRI
      if (card === 'BELOK_KIRI') {
        const turnMap: Record<Direction, Direction> = { 
          NORTH: 'WEST', 
          WEST: 'SOUTH', 
          SOUTH: 'EAST', 
          EAST: 'NORTH' 
        };
        this.playerDir = turnMap[this.playerDir];
        this.updateIndicatorRotation();
        return resolve(true);
      }

      // 2. ROTASI BELOK KANAN
      if (card === 'BELOK_KANAN') {
        const turnMap: Record<Direction, Direction> = { 
          NORTH: 'EAST', 
          EAST: 'SOUTH', 
          SOUTH: 'WEST', 
          WEST: 'NORTH' 
        };
        this.playerDir = turnMap[this.playerDir];
        this.updateIndicatorRotation();
        return resolve(true);
      }

      // 3. TRANSLASI MAJU LANGKAH
      if (card === 'MAJU_LANGKAH') {
        if (this.playerDir === 'NORTH') r -= 1;
        if (this.playerDir === 'SOUTH') r += 1;
        if (this.playerDir === 'EAST') c += 1;
        if (this.playerDir === 'WEST') c -= 1;

        // Validasi Batas Matriks 6x6 (0-5)
        if (r < 0 || r >= 6 || c < 0 || c >= 6) return resolve(false);

        const targetTile = this.currentGrid[r][c];
        if (targetTile === 'WALL') return resolve(false);
        if (targetTile === 'MONSTER') return resolve(false); // Tabrak monster langsung
        if (targetTile === 'SPIKE') {
          if (!this.isShieldActive) {
            return resolve(false); // Duri membunuh tanpa tameng
          }
          // Tameng sekali pakai (single use)
          this.isShieldActive = false;
          if (this.shieldVisual) {
            this.shieldVisual.destroy();
            this.shieldVisual = undefined;
          }
        }

        this.playerPos = [r, c];
        const nx = c * this.tileSize + this.tileSize / 2;
        const ny = r * this.tileSize + this.tileSize / 2;

        // Pindahkan posisi tameng jika sedang aktif
        if (this.shieldVisual) {
          this.shieldVisual.setPosition(nx, ny);
        }

        this.tweens.add({
          targets: [this.playerSprite, this.playerIndicator],
          x: nx,
          y: ny,
          duration: 250,
          onComplete: () => resolve(true),
        });
        return;
      }

      // 4. AMBIL ITEM HERBAL
      if (card === 'AMBIL_ITEM') {
        if (this.currentGrid[r][c] === 'HERB') {
          this.hasHerb = true;
          this.currentGrid[r][c] = 'EMPTY';
          const herbObj = this.dynamicTileObjects.get(`${r}_${c}`);
          if (herbObj) herbObj.destroy();
        }
        return resolve(true);
      }

      // 5. EVALUASI IF SPIKE SHIELD
      if (card === 'IF_SPIKE_SHIELD') {
        const [frontR, frontC] = this.getFrontCoord();
        if (frontR >= 0 && frontR < 6 && frontC >= 0 && frontC < 6) {
          if (this.currentGrid[frontR][frontC] === 'SPIKE') {
            this.isShieldActive = true;
            if (!this.shieldVisual) {
              const [curR, curC] = this.playerPos;
              const px = curC * this.tileSize + this.tileSize / 2;
              const py = curR * this.tileSize + this.tileSize / 2;
              this.shieldVisual = this.add.circle(px, py, 26, 0x38bdf8, 0.4);
              this.shieldVisual.setStrokeStyle(2, 0x0284c7);
              this.shieldVisual.setDepth(9);
            }
          }
        }
        return resolve(true);
      }

      // 6. EVALUASI IF MONSTER SLASH
      if (card === 'IF_MONSTER_SLASH') {
        const [frontR, frontC] = this.getFrontCoord();
        if (frontR >= 0 && frontR < 6 && frontC >= 0 && frontC < 6) {
          if (this.currentGrid[frontR][frontC] === 'MONSTER') {
            this.currentGrid[frontR][frontC] = 'EMPTY';
            const monsterObj = this.dynamicTileObjects.get(`${frontR}_${frontC}`);
            if (monsterObj) {
              this.tweens.add({
                targets: monsterObj,
                alpha: 0,
                scale: 1.5,
                duration: 250,
                onComplete: () => monsterObj.destroy(),
              });
            }
          }
        }
        return resolve(true);
      }

      resolve(true);
    });
  }

  private getFrontCoord(): [number, number] {
    let [r, c] = this.playerPos;
    if (this.playerDir === 'NORTH') r -= 1;
    if (this.playerDir === 'SOUTH') r += 1;
    if (this.playerDir === 'EAST') c += 1;
    if (this.playerDir === 'WEST') c += 1;
    return [r, c];
  }

  // Method reset posisi dan pemulihan status permainan
  public resetPosition() {
    // 1. Reset state logika
    this.playerPos = [...this.levelData.startPos];
    this.playerDir = this.levelData.startDirection;
    this.hasHerb = false;
    this.isShieldActive = false;
    this.isExecuting = false;

    // 2. Hancurkan visual tameng jika ada
    if (this.shieldVisual) {
      this.shieldVisual.destroy();
      this.shieldVisual = undefined;
    }

    // 3. Kembalikan posisi fisik sprite pemain
    const [r, c] = this.playerPos;
    const px = c * this.tileSize + this.tileSize / 2;
    const py = r * this.tileSize + this.tileSize / 2;

    this.playerSprite.setPosition(px, py);
    this.playerSprite.setFillStyle(0x1d4ed8); // Kembalikan ke warna biru
    this.playerIndicator.setPosition(px, py - 12);
    this.updateIndicatorRotation();

    // 4. Pulihkan matriks petak semula dan gambar ulang objek (monster/herbal yang hilang)
    this.currentGrid = this.levelData.grid.map((row) => [...row]);
    this.drawGrid();
  }

  destroy() {
    this.game.events.off('RUN_CARDS', this.executeInstructions, this);
    this.game.events.off('RESET_LEVEL', this.resetPosition, this);
  }
}