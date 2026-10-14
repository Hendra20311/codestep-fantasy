import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // 1. Teks status loading sederhana di tengah viewport (384x384)
    const { width, height } = this.scale;
    const loadingText = this.add.text(width / 2, height / 2, 'Memuat Petualangan...', {
      fontSize: '14px',
      color: '#facc15',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Event listener baris progress loading (opsional)
    this.load.on('progress', (value: number) => {
      loadingText.setText(`Memuat Petualangan... ${Math.round(value * 100)}%`);
    });

    // 2. Preload Aset UI & Lingkungan Dungeon
    this.load.image('bg_dungeon', '/assets/bg_dungeon.png');
    this.load.image('ui_frame', '/assets/ui_frame.png');
    this.load.image('input_scroll', '/assets/input_scroll.png');
    this.load.image('btn_adventure', '/assets/btn_adventure.png');
    this.load.image('icon_quill', '/assets/icon_quill.png');

    // 3. Preload Spritesheet (Ukur frame sesuai aset pixel art Anda)
    // Contoh: obor 16x32px, knight 24x24px, slime 16x16px
    this.load.spritesheet('torch', '/assets/sprites/torch_anim.png', {
      frameWidth: 16,
      frameHeight: 32,
    });

    this.load.spritesheet('knight', '/assets/sprites/knight_idle.png', {
      frameWidth: 24,
      frameHeight: 24,
    });

    this.load.spritesheet('slime', '/assets/sprites/slime_idle.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
  }

  create() {
    // 4. Registrasi Global Animations
    // Obor berkelip (flicker)
    if (!this.anims.exists('torch_flicker')) {
      this.anims.create({
        key: 'torch_flicker',
        frames: this.anims.generateFrameNumbers('torch', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1,
      });
    }

    // Slime melompat / bernapas pelan
    if (!this.anims.exists('slime_idle')) {
      this.anims.create({
        key: 'slime_idle',
        frames: this.anims.generateFrameNumbers('slime', { start: 0, end: 3 }),
        frameRate: 6,
        repeat: -1,
      });
    }

    // Knight idle
    if (!this.anims.exists('knight_idle')) {
      this.anims.create({
        key: 'knight_idle',
        frames: this.anims.generateFrameNumbers('knight', { start: 0, end: 3 }),
        frameRate: 6,
        repeat: -1,
      });
    }

    // 5. Pindah langsung ke LoginScene setelah semua aset siap
    this.scene.start('LoginScene');
  }
}