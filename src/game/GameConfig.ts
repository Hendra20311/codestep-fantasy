// src/game/GameConfig.ts
import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import LoginScene from './scenes/LoginScene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 384, // Sesuai spesifikasi GDD (6x6 * 64px)
    height: 384, // Kita sesuaikan canvas utama dengan ukuran grid
    parent: 'game-container',
    backgroundColor: '#1a1a2e',
    
    // --- KUNCI PIXEL ART ---
    render: {
        pixelArt: true, // Mematikan anti-aliasing, pixel jadi tajam
        roundPixels: true // Membulatkan koordinat posisi agar pixel pas
    },
    // -----------------------

    scene: [BootScene, LoginScene], // Daftarkan scene
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
};

export default config;