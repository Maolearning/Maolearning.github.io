import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { X as CloseIcon, Zap } from 'lucide-react';

const LANES = [-1, 0, 1];
const SPAWN_RATE_MS = 1200;
const SPEED_BASE = 1.5;

interface Obstacle { id: number; lane: number; y: number; type: 'train' | 'barrier'; }

export const RunnerGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [playerLane, setPlayerLane] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const frameId = useRef<number>(0);
  const lastSpawnTime = useRef<number>(0);
  const scoreRef = useRef(0);
  const speedRef = useRef(SPEED_BASE);

  const startGame = () => {
    setPlayerLane(0);
    setObstacles([]);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    scoreRef.current = 0;
    speedRef.current = SPEED_BASE;
    lastSpawnTime.current = Date.now();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isPlaying || gameOver) return;
    if (e.key === 'ArrowLeft') setPlayerLane(prev => Math.max(prev - 1, -1));
    if (e.key === 'ArrowRight') setPlayerLane(prev => Math.min(prev + 1, 1));
  };
  
  const moveLane = (dir: -1 | 1) => {
    if (!isPlaying || gameOver) return;
    setPlayerLane(prev => { const n = prev + dir; return n < -1 || n > 1 ? prev : n; });
  }

  useEffect(() => { window.addEventListener('keydown', handleKeyDown); return () => window.removeEventListener('keydown', handleKeyDown); }, [isPlaying, gameOver]);

  useEffect(() => {
    if (!isPlaying || gameOver) { if (frameId.current) cancelAnimationFrame(frameId.current); return; }
    const loop = () => {
      const now = Date.now();
      if (now - lastSpawnTime.current > (SPAWN_RATE_MS / (speedRef.current * 0.8))) {
        setObstacles(prev => [...prev, { id: now, lane: LANES[Math.floor(Math.random() * 3)], y: -20, type: Math.random() > 0.7 ? 'train' : 'barrier' }]);
        lastSpawnTime.current = now;
        speedRef.current = Math.min(3.5, speedRef.current + 0.005);
      }
      setObstacles(prev => {
        const next: Obstacle[] = [];
        let hit = false;
        prev.forEach(obs => {
          const newY = obs.y + speedRef.current;
          if (obs.lane === playerLane && newY > 80 && newY < 95) hit = true;
          if (newY < 120) next.push({ ...obs, y: newY });
        });
        if (hit) { setGameOver(true); setIsPlaying(false); }
        return next;
      });
      scoreRef.current += 1;
      if (scoreRef.current % 10 === 0) setScore(Math.floor(scoreRef.current / 10));
      frameId.current = requestAnimationFrame(loop);
    };
    frameId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId.current);
  }, [isPlaying, gameOver, playerLane]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-50 p-4 touch-none">
      <div className="relative w-full max-w-md h-[600px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl flex flex-col">
        {/* Header Overlay */}
        <div className="absolute top-0 z-50 p-4 w-full flex justify-between items-center bg-gradient-to-b from-white/90 to-transparent">
          <div>
              <h2 className="text-xl font-bold text-slate-800 italic">极速跑酷</h2>
              <p className="font-mono text-xl text-blue-500 font-bold">{score}m</p>
          </div>
          <button onClick={onBack} className="bg-white/50 p-2 rounded-full backdrop-blur-sm shadow-sm"><CloseIcon className="text-slate-600" /></button>
        </div>
        
        {/* Sky / Horizon */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-200 to-indigo-100"></div>

        {/* 3D Perspective Plane */}
        <div className="relative flex-1 w-full overflow-hidden [perspective:500px]">
          {/* Ground Plane */}
          <div className="absolute inset-0 bg-white origin-bottom [transform:rotateX(20deg)] top-1/2">
             {/* Lane Dividers */}
             <div className="absolute inset-0 flex justify-center">
                <div className="w-[2px] h-full bg-slate-200"></div>
                <div className="w-[2px] h-full bg-slate-200 mx-24"></div>
             </div>
          </div>
          
          <div className="absolute inset-0 flex justify-center opacity-30">
              <div className="w-1/3 h-full border-r-2 border-dashed border-slate-400"></div>
              <div className="w-1/3 h-full border-r-2 border-dashed border-slate-400"></div>
          </div>

          {obstacles.map(obs => (
            <div key={obs.id} className="absolute transition-none flex justify-center" style={{ left: `${(obs.lane + 1) * 33.33}%`, top: `${obs.y}%`, width: '33.33%', height: obs.type === 'train' ? '20%' : '5%' }}>
              <div className={`w-[80%] h-full rounded shadow-lg border-b-4 
                  ${obs.type === 'train' ? 'bg-red-500 border-red-700' : 'bg-amber-400 border-amber-600'}`} 
              />
            </div>
          ))}
          
          <div className="absolute transition-all duration-100 ease-linear flex justify-center" style={{ bottom: '5%', left: `${(playerLane + 1) * 33.33}%`, width: '33.33%', height: '10%' }}>
            <div className="w-[60%] h-full bg-blue-500 rounded-full shadow-lg border-b-4 border-blue-700 relative">
                <div className="absolute top-1 right-2 w-2 h-2 bg-white rounded-full opacity-50"></div>
            </div>
          </div>
          
          {(!isPlaying || gameOver) && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm">
              {gameOver && <h3 className="text-3xl font-bold text-rose-500 mb-2">撞击!</h3>}
              <button onClick={startGame} className="mt-4 px-8 py-3 bg-blue-500 text-white rounded-full font-bold shadow-lg hover:bg-blue-600 flex items-center gap-2 transition-all hover:scale-105">
                <Zap size={20} /> {gameOver ? "重试" : "开始奔跑"}
              </button>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="h-24 bg-slate-50 w-full grid grid-cols-2 gap-4 p-4 border-t border-slate-200">
            <button 
                className="bg-white rounded-xl shadow-sm border-b-4 border-slate-200 text-slate-500 text-2xl active:border-b-0 active:translate-y-1 transition-all" 
                onPointerDown={(e) => { e.preventDefault(); moveLane(-1); }}
            >←</button>
            <button 
                className="bg-white rounded-xl shadow-sm border-b-4 border-slate-200 text-slate-500 text-2xl active:border-b-0 active:translate-y-1 transition-all" 
                onPointerDown={(e) => { e.preventDefault(); moveLane(1); }}
            >→</button>
        </div>
      </div>
    </div>
  );
};