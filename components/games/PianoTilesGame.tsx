import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { X, RefreshCcw, Music } from 'lucide-react';

interface Tile {
  id: number;
  lane: number;
  y: number;
}

export const PianoTilesGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const frameRef = useRef(0);
  const lastTimeRef = useRef(0);
  const speedRef = useRef(3);

  const startGame = () => {
    setTiles([]);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    speedRef.current = 3;
    lastTimeRef.current = performance.now();
  };

  const spawnTile = () => {
    const newTile = {
      id: Date.now() + Math.random(),
      lane: Math.floor(Math.random() * 4),
      y: -20
    };
    setTiles(prev => [...prev, newTile]);
  };

  const handleTileClick = (id: number, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (!isPlaying || gameOver) return;
    setTiles(prev => prev.filter(t => t.id !== id));
    setScore(s => s + 1);
    speedRef.current = Math.min(8, speedRef.current + 0.05);
  };

  const handleMiss = () => {
    if (!isPlaying || gameOver) return;
    setGameOver(true);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    let spawnTimer = 0;
    const loop = (time: number) => {
      const delta = (time - lastTimeRef.current) / 16;
      lastTimeRef.current = time;
      
      spawnTimer += delta;
      if (spawnTimer > (60 / speedRef.current)) {
        spawnTile();
        spawnTimer = 0;
      }

      setTiles(prev => {
        const next: Tile[] = [];
        let missed = false;
        prev.forEach(t => {
          const newY = t.y + speedRef.current;
          if (newY > 100) missed = true;
          else next.push({ ...t, y: newY });
        });
        if (missed) handleMiss();
        return next;
      });

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [isPlaying, gameOver]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm h-[600px] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-4 flex justify-between items-center border-b border-slate-100 z-10 bg-white">
          <button onClick={onBack} className="p-2 hover:bg-slate-50 rounded-full"><X className="text-slate-400"/></button>
          <div className="text-center">
             <h2 className="text-xl font-bold text-slate-800">节奏大师</h2>
             <p className="text-blue-500 font-bold">{score}</p>
          </div>
          <button onClick={startGame} className="p-2 hover:bg-slate-50 rounded-full"><RefreshCcw className="text-slate-400"/></button>
        </div>

        <div 
          className="flex-1 relative bg-slate-100 grid grid-cols-4 divide-x divide-slate-200 cursor-pointer"
          onClick={handleMiss}
        >
          {tiles.map(t => (
            <div
              key={t.id}
              onPointerDown={(e) => handleTileClick(t.id, e)}
              className="absolute w-1/4 bg-slate-800 rounded shadow-md transition-none"
              style={{ 
                left: `${t.lane * 25}%`, 
                top: `${t.y}%`, 
                height: '15%',
                padding: '4px'
              }}
            >
              <div className="w-full h-full border-t-2 border-slate-600 rounded opacity-50"></div>
            </div>
          ))}

          {!isPlaying && !gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm">
              <Music size={48} className="text-blue-500 mb-4 animate-bounce" />
              <button onClick={startGame} className="px-10 py-3 bg-blue-500 text-white rounded-full font-bold shadow-lg hover:scale-105 transition-all">开始合奏</button>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm animate-in fade-in">
              <h3 className="text-3xl font-bold text-slate-800 mb-2">漏掉音符了!</h3>
              <p className="text-slate-500 mb-6">最终得分: {score}</p>
              <button onClick={startGame} className="px-10 py-3 bg-slate-800 text-white rounded-full font-bold shadow-lg">重新校准</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};