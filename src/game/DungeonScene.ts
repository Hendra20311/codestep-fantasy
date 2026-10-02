import Phaser from 'phaser';

export interface Command {
  id: string;
  type: 'MOVE' | 'SHIELD';
}

export default class DungeonScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle;
  private readonly tileSize = 50;
  private currentX = 1;
  private currentY = 1;

  constructor() {
    super('DungeonScene');
  }

  create() {
    // 1. Buat Lantai Dungeon Grid 6x6
    for (let x = 0; x < 6; x++) {
      for (let y = 0; y < 6; y++) {
        this.add.rectangle(
          x * this.tileSize + 25,
          y * this.tileSize + 25,
          48,
          48,
          0x1e293b // Warna slate gelap untuk dungeon
        );
      }
    }

    // 2. Rintangan Jebakan Paku di Petak (3, 1)
    const spike = this.add.rectangle(
      3 * this.tileSize + 25,
      1 * this.tileSize + 25,
      40,
      40,
      0xef4444 // Merah
    );
    // Label teks petak paku
    this.add.text(spike.x - 12, spike.y - 8, 'PAKU', {
      fontSize: '10px',
      color: '#ffffff',
      fontStyle: 'bold',
    });

    // 3. Titik Pintu Keluar / Tangga Finish di Petak (5, 1)
    const exit = this.add.rectangle(
      5 * this.tileSize + 25,
      1 * this.tileSize + 25,
      40,
      40,
      0x22c55e // Hijau
    );
    this.add.text(exit.x - 14, exit.y - 8, 'EXIT', {
      fontSize: '10px',
      color: '#ffffff',
      fontStyle: 'bold',
    });

    // 4. Karakter Petualang di Petak Start (1, 1)
    this.player = this.add.rectangle(
      1 * this.tileSize + 25,
      1 * this.tileSize + 25,
      36,
      36,
      0x3b82f6 // Biru
    );
  }

  // Fungsi mengeksekusi runtunan perintah logika dari React
  async runInstructions(
    commands: Command[],
    onStep: (stepIndex: number) => void,
    onFinish: (result: { success: boolean; reason?: string; failedStep?: number }) => void
  ) {
    this.resetPlayer();
    let isShieldActive = false;

    for (let i = 0; i < commands.length; i++) {
      const cmd = commands[i];
      onStep(i); // Beri tahu React baris mana yang sedang aktif
      await new Promise((res) => setTimeout(res, 600)); // Delay agar animasi per langkah terlihat

      if (cmd.type === 'SHIELD') {
        isShieldActive = true;
        this.player.setFillStyle(0xf59e0b); // Warna emas saat tameng aktif
      } else if (cmd.type === 'MOVE') {
        this.currentX += 1;
        this.player.setPosition(
          this.currentX * this.tileSize + 25,
          this.currentY * this.tileSize + 25
        );

        // Evaluasi kondisi: Terkena petak paku di (3, 1)
        if (this.currentX === 3 && this.currentY === 1) {
          if (!isShieldActive) {
            this.player.setFillStyle(0x991b1b); // Karakter pingsan (merah gelap)
            onFinish({
              success: false,
              reason: 'Karakter tertusuk jebakan paku karena tidak menyiapkan tameng!',
              failedStep: i + 1,
            });
            return;
          }
        }
      }
    }

    // Evaluasi apakah sampai di titik Exit (5, 1)
    if (this.currentX === 5 && this.currentY === 1) {
      this.player.setFillStyle(0x10b981);
      onFinish({ success: true });
    } else {
      onFinish({
        success: false,
        reason: 'Langkah instruksi berhenti sebelum menyentuh pintu keluar.',
      });
    }
  }

  resetPlayer() {
    this.currentX = 1;
    this.currentY = 1;
    this.player.setFillStyle(0x3b82f6);
    this.player.setPosition(
      this.currentX * this.tileSize + 25,
      this.currentY * this.tileSize + 25
    );
  }
}