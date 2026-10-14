'use client';

import React, { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { LEVELS } from '@/data/levels';
import { CardType } from '@/types/game';

// Dynamic import GameCanvas sisi client
const GameCanvas = dynamic(() => import('@/components/game/GameCanvas'), { ssr: false });

// NAMA KARTU TELAH DIPERBARUI
const AVAILABLE_CARDS: { type: CardType; label: string; icon: string }[] = [
  { type: 'MAJU_LANGKAH', label: 'Maju', icon: '⬆️' },
  { type: 'BELOK_KANAN', label: 'Hadap Kanan', icon: '↪️' },
  { type: 'BELOK_KIRI', label: 'Hadap Kiri', icon: '↩️' },
  { type: 'AMBIL_ITEM', label: 'Ambil', icon: '🌿' },
  { type: 'IF_SPIKE_SHIELD', label: 'Hindar', icon: '🛡️' },
  { type: 'IF_MONSTER_SLASH', label: 'Serang', icon: '⚔️' },
];

export default function LevelPage() {
  const params = useParams();
  const router = useRouter();
  const levelId = Number(params.id) || 1;
  const currentLevel = LEVELS[levelId];
  const nextLevelId = levelId + 1;
  const hasNextLevel = Boolean(LEVELS[nextLevelId]);

  const [cards, setCards] = useState<CardType[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const phaserGameRef = useRef<Phaser.Game | null>(null);

  if (!currentLevel) {
    return (
      <main className="min-h-screen bg-[#faeec7] flex flex-col items-center justify-center font-sans p-4">
        <h1 className="text-xl font-bold text-[#45210c] mb-4">Level tidak ditemukan!</h1>
        <button 
          onClick={() => router.push('/')} 
          className="px-4 py-2 bg-[#5c3317] text-[#fbf2d5] border-4 border-[#3a1f0d] font-bold shadow-[4px_4px_0_0_#241206]"
        >
          Kembali ke Beranda
        </button>
      </main>
    );
  }

  const handleAddCard = (card: CardType) => {
    if (cards.length >= currentLevel.cardLimit || isRunning) return;
    setCards([...cards, card]);
  };

  const handleRemoveCard = (index: number) => {
    if (isRunning) return;
    setCards(cards.filter((_, i) => i !== index));
  };

  const handleRun = () => {
    if (cards.length === 0 || isRunning || !phaserGameRef.current) return;
    
    phaserGameRef.current.events.emit('RESET_LEVEL');
    setIsRunning(true);
    setFeedback(null);
    
    setTimeout(() => {
      phaserGameRef.current?.events.emit('RUN_CARDS', cards);
    }, 50);
  };

  const handleReset = () => {
    if (!phaserGameRef.current) return;
    phaserGameRef.current.events.emit('RESET_LEVEL');
    setCards([]);
    setIsRunning(false);
    setFeedback(null);
  };

  const handleGameResult = (result: { success: boolean; reason: string }) => {
    setIsRunning(false);
    setFeedback({ success: result.success, message: result.reason });
  };

  const handleNextLevel = () => {
    setCards([]);
    setFeedback(null);
    setIsRunning(false);
    router.push(`/level/${nextLevelId}`);
  };

  const getCardInfo = (type: CardType) => AVAILABLE_CARDS.find((c) => c.type === type);

  return (
    // STRICT 100dvh & overflow-hidden UNTUK MENCEGAH SCROLLING
    <main className="h-[100dvh] w-screen bg-[#faeec7] p-2 md:p-4 font-sans flex flex-col items-center overflow-hidden">
      
      <div className="w-full max-w-5xl h-full flex flex-col gap-2 md:gap-3">
        
        {/* 1. HEADER */}
        <header className="relative w-full bg-[#fbf2d5] border-4 border-[#5c3317] p-2 shadow-[2px_2px_0_0_#45210c] md:shadow-[4px_4px_0_0_#45210c] flex justify-between items-center shrink-0 rounded-sm">
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 min-w-0">
            <span className="text-[9px] md:text-xs bg-[#c2410c] text-[#fffbeb] px-1.5 py-0.5 font-bold uppercase rounded-sm border border-[#7c2d12] w-fit">
              {currentLevel.concept}
            </span>
            <h2 className="text-[11px] md:text-lg font-black text-[#45210c] truncate">
              {currentLevel.title}
            </h2>
          </div>
          
          <div className="flex flex-col md:flex-row items-end md:items-center gap-0.5 md:gap-2 shrink-0">
            <span className="text-[8px] md:text-[10px] text-[#6b3e1b] font-bold uppercase tracking-wider">
              Batas Register:
            </span>
            <div className="text-[10px] md:text-sm font-black text-[#45210c] bg-[#e6d5a1] px-1.5 py-0.5 md:px-2 md:py-1 rounded border-2 border-[#8b5a2b] flex items-center gap-1 shadow-inner">
              <span className="text-[#8b5a2b]">▢</span>
              {cards.length} / {currentLevel.cardLimit} <span className="hidden md:inline">Kartu</span>
            </div>
          </div>
        </header>

        {/* 2. AREA UTAMA */}
        {/* PENAMBAHAN md:items-start PENTING AGAR KOLOM KANAN TIDAK STRETCH RAKSASA DI DESKTOP */}
        <div className="flex flex-col md:flex-row w-full flex-1 min-h-0 gap-2 md:gap-4 md:items-start">
          
          {/* KIRI: CANVAS PHASER */}
          <div className="shrink-0 flex justify-center md:block">
            {/* 
              WRAPPER CANVAS DIPERBESAR DI DESKTOP: 
              - Mobile: 220x220px (Scale 220/384 = 0.5729)
              - Desktop: 400x400px (Scale 400/384 = 1.0417) 
            */}
            <div className="relative w-[220px] h-[220px] md:w-[400px] md:h-[400px] bg-[#2c3e50] border-4 border-[#5c3317] shadow-[2px_2px_0_0_#45210c] md:shadow-[4px_4px_0_0_#45210c] overflow-hidden rounded-sm shrink-0">
              
              <div className="absolute top-0 left-0 w-[384px] h-[384px] origin-top-left scale-[0.5729] md:scale-[1.0417] bg-black">
                <GameCanvas
                  levelData={currentLevel}
                  onGameResult={handleGameResult}
                  gameInstanceRef={phaserGameRef}
                />
              </div>

              {/* OVERLAY TOAST: Mengambang di atas Canvas */}
              {feedback && (
                <div className={`absolute bottom-0 left-0 right-0 p-2 md:p-3 border-t-4 z-10 flex flex-col justify-center
                  ${feedback.success 
                    ? 'bg-[#d1fae5]/95 border-[#065f46] text-[#022c22]' 
                    : 'bg-[#ffe4e6]/95 border-[#9f1239] text-[#4c0519]'
                  }`}
                >
                  {/* Tombol X (Close Toast) */}
                  <button 
                    onClick={() => setFeedback(null)}
                    className="absolute top-1.5 right-2 opacity-50 hover:opacity-100 font-black text-xs md:text-sm p-1 transition-opacity cursor-pointer"
                    aria-label="Tutup notifikasi"
                  >
                    ✕
                  </button>

                  <div className="text-[10px] md:text-xs font-black uppercase text-center mb-1 pr-4">
                    {feedback.success ? '✨ BERHASIL!' : '⚠️ GAGAL!'}
                  </div>
                  <div className="text-[9px] md:text-[11px] font-bold text-center leading-tight mb-2">
                    {feedback.message}
                  </div>
                  {feedback.success && (
                    <div className="flex justify-center">
                      {hasNextLevel ? (
                        <button
                          onClick={handleNextLevel}
                          className="px-3 py-1 bg-[#059669] text-white font-black text-[9px] md:text-xs uppercase border-2 border-[#064e3b] shadow-[2px_2px_0_0_#022c22] rounded-sm active:translate-y-0.5"
                        >
                          Lanjut Level ▶
                        </button>
                      ) : (
                        <div className="text-[9px] md:text-[11px] text-[#065f46] font-black">
                          🎉 Seluruh modul selesai!
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* KANAN: PANEL REGISTER & PILIHAN KARTU */}
          <div className="flex flex-col flex-1 min-h-0 gap-2 md:gap-4 w-full">
            
            {/* PANEL ANTREAN */}
            <div className="flex flex-col flex-1 min-h-0 bg-[#fbf2d5] border-4 border-[#5c3317] p-2 md:p-3 shadow-[2px_2px_0_0_#45210c] md:shadow-[4px_4px_0_0_#45210c] rounded-sm">
              <div className="flex justify-between items-center border-b-2 border-[#8b5a2b] pb-1 mb-1.5 md:mb-2 shrink-0">
                <span className="text-[10px] md:text-xs font-black text-[#5c3317]">
                  ANTREAN REGISTER 🪶
                </span>
                <button 
                  onClick={handleReset} 
                  disabled={isRunning || cards.length === 0}
                  className="text-[#b91c1c] font-black text-[9px] md:text-[11px] uppercase disabled:opacity-30 active:translate-y-[1px]"
                >
                  [reset]
                </button>
              </div>

              {/* Tempat Kartu */}
              <div className="flex-1 overflow-y-auto pr-1">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 md:gap-2">
                  {Array.from({ length: currentLevel.cardLimit }).map((_, idx) => {
                    const cardType = cards[idx];
                    
                    if (cardType) {
                      const cardDetail = getCardInfo(cardType);
                      return (
                        <button
                          key={idx}
                          disabled={isRunning}
                          onClick={() => handleRemoveCard(idx)}
                          className="relative p-1.5 md:p-2 bg-[#e6d5a1] border-2 border-[#8b5a2b] shadow-[2px_2px_0_0_#45210c] rounded flex items-center gap-1.5 hover:bg-[#fca5a5] hover:border-[#9f1239] transition-colors text-left group"
                        >
                          <span className="text-[10px] md:text-[11px] font-black text-[#5c3317] shrink-0">{idx + 1}.</span>
                          <span className="text-[11px] md:text-sm shrink-0">{cardDetail?.icon}</span>
                          <span className="text-[9px] md:text-[10px] font-bold text-[#45210c] leading-tight line-clamp-1">
                            {cardDetail?.label}
                          </span>
                        </button>
                      );
                    }
                    
                    return (
                      <div key={idx} className="h-7 md:h-9 border-2 border-dashed border-[#a8a29e] bg-[#e7e5e4]/50 rounded flex items-center justify-center">
                        <span className="text-[#a8a29e] font-black text-[10px] md:text-xs">?</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* PANEL KARTU */}
            <div className="shrink-0 bg-[#fbf2d5] border-4 border-[#5c3317] p-2 shadow-[2px_2px_0_0_#45210c] md:shadow-[4px_4px_0_0_#45210c] rounded-sm flex flex-col gap-1.5 md:gap-2">
              <span className="text-[9px] md:text-[11px] font-black text-[#5c3317] border-b border-[#5c3317]/20 pb-0.5 uppercase">
                PILIHAN KARTU: 🗝️
              </span>
              
              <div className="grid grid-cols-3 gap-1 md:gap-2">
                {AVAILABLE_CARDS.map((item) => (
                  <button
                    key={item.type}
                    disabled={cards.length >= currentLevel.cardLimit || isRunning}
                    onClick={() => handleAddCard(item.type)}
                    className="p-1 md:p-1.5 bg-[#dce3ea] hover:bg-[#c9d4de] border-2 border-[#546e7a] rounded shadow-[2px_2px_0_0_#37474f] active:translate-y-[1px] disabled:opacity-40 flex items-center gap-1 md:gap-1.5 text-left"
                  >
                    <span className="text-[10px] md:text-sm shrink-0">{item.icon}</span>
                    <span className="text-[8px] md:text-[10px] font-bold text-slate-900 leading-tight">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>

              <button
                onClick={handleRun}
                disabled={cards.length === 0 || isRunning}
                className="w-full mt-1 py-1.5 md:py-2.5 bg-[#059669] hover:bg-[#10b981] disabled:bg-[#064e3b] disabled:text-[#34d399] disabled:opacity-60 text-white font-black text-[10px] md:text-xs uppercase tracking-widest border-2 border-[#064e3b] shadow-[2px_2px_0_0_#022c22] md:shadow-[3px_3px_0_0_#022c22] active:translate-y-[2px] rounded-sm transition-all"
              >
                {isRunning ? 'Eksekusi...' : 'Jalankan ▶'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}