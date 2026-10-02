'use client';

import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import DungeonScene from '@/game/DungeonScene';

interface Props {
  onSceneReady: (scene: DungeonScene) => void;
}

export default function GameCanvas({ onSceneReady }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) {
      return;
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: 300,
      height: 300,
      backgroundColor: '#0f172a',
      scene: [DungeonScene],
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    game.events.once('ready', () => {
      const scene = game.scene.getScene('DungeonScene') as DungeonScene;
      if (scene) {
        onSceneReady(scene);
      }
    });

    return () => {
      game.destroy(true);
      gameRef.current = null;
    };
  }, [onSceneReady]);

  // Gunakan <div></div> lengkap, BUKAN self-closing <div />
  return (
    <div
      ref={containerRef}
      className="rounded-xl overflow-hidden border-2 border-slate-700 shadow-xl"
    ></div>
  );
}