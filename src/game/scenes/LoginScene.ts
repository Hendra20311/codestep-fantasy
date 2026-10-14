// src/game/scenes/LoginScene.ts
import Phaser from 'phaser';

export default class LoginScene extends Phaser.Scene {
    constructor() {
        super('LoginScene');
    }

    // Tempat load asset (ideal di BootScene, tapi untuk contoh di sini)
    preload() {
        // Load background, frame, spritesheet obor, slime, dll
        this.load.image('bg_dungeon', '/assets/bg_dungeon.png');
        this.load.image('ui_frame', '/assets/ui_frame.png');
        this.load.image('input_scroll', '/assets/input_scroll.png');
        this.load.image('btn_adventure', '/assets/btn_adventure.png');
        this.load.image('icon_quill', '/assets/icon_quill.png');
        
        // Load Bitmap Font untuk teks pixel yang tajam
        this.load.bitmapFont('pixelFont', '/assets/fonts/pixel_font.png', '/assets/fonts/pixel_font.xml');
        
        // Load spritesheet untuk animasi (obor, slime, dll)
        this.load.spritesheet('torch', '/assets/sprites/torch_anim.png', { frameWidth: 16, frameHeight: 32 });
        this.load.spritesheet('knight', '/assets/sprites/knight_idle.png', { frameWidth: 24, frameHeight: 24 });
    }

    create() {
        // 1. Tampilkan Background
        this.add.image(0, 0, 'bg_dungeon').setOrigin(0, 0);

        // 2. Tambahkan Elemen Dekoratif Animasi (Obor, Slime)
        // (Asumsi animasi sudah dibuat di BootScene)
        this.add.sprite(50, 100, 'torch').play('torch_flicker');
        this.add.sprite(334, 100, 'torch').play('torch_flicker');
        this.add.sprite(300, 300, 'slime').play('slime_idle');

        // 3. Tampilkan UI Frame Utama (Tengah)
        const frame = this.add.image(192, 192, 'ui_frame').setOrigin(0.5);

        // 4. Tampilkan Judul Game (Menggunakan BitmapFont)
        this.add.bitmapText(192, 60, 'pixelFont', 'CODESTEP FANTASY', 24).setOrigin(0.5).setTint(0xffcc00);
        this.add.bitmapText(192, 85, 'pixelFont', 'Game Edukasi CT & Algoritma', 10).setOrigin(0.5);

        // 5. Tampilkan Label & Latar Belakang Input (Scroll)
        this.add.image(192, 140, 'icon_quill').setScale(2); // Ikon Bulu
        this.add.bitmapText(192, 160, 'pixelFont', 'NAMA LENGKAP SISWA', 12).setOrigin(0.5);
        this.add.image(192, 185, 'input_scroll').setOrigin(0.5); // BG Input Nama

        // 6. Tampilkan Sprites Karakter di bawah
        this.add.sprite(150, 330, 'knight').setScale(2).play('knight_idle');
        this.add.sprite(234, 330, 'wizard').setScale(2).play('wizard_idle');

        // 7. Tampilkan Tombol (Bisa di-klik)
        const startBtn = this.add.image(192, 330, 'btn_adventure')
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        this.add.bitmapText(192, 330, 'pixelFont', 'MULAI PETUALANGAN ->', 14)
            .setOrigin(0.5)
            .setCenterAlign();

        // Event Klik Tombol
        startBtn.on('pointerdown', () => {
            // Logika validasi input HTML dan pindah scene
            console.log("Tombol diklik, validasi data di Next.js");
            // eventemitter ke Next.js atau panggil fungsi validasi
        });
    }
}