'use client';

import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import GameScene from '@/game/scenes/GameScene';
import { LevelConfig } from '@/types/game';

interface GameCanvasProps {
  levelData: LevelConfig;
  onGameResult: (result: { success: boolean; reason: string }) => void;
  gameInstanceRef: React.MutableRefObject<Phaser.Game | null>;
}

export default function GameCanvas({ levelData, onGameResult, gameInstanceRef }: GameCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: 384,
      height: 384,
      backgroundColor: 'fde68a',
      render: {
        pixelArt: true,
        roundPixels: true,
      },
      scene: [GameScene],
    };

    const game = new Phaser.Game(config);
    gameInstanceRef.current = game;

    game.scene.start('GameScene', { levelData });

    const handleResult = (data: { success: boolean; reason: string }) => {
      onGameResult(data);
    };

    game.events.on('GAME_RESULT', handleResult);

    return () => {
      game.events.off('GAME_RESULT', handleResult);
      game.destroy(true);
      gameInstanceRef.current = null;
    };
  }, [levelData]);

  return <div ref={containerRef} className="w-[384px] h-[384px] overflow-hidden" />;
}