import * as React from 'react';
import { useState, useEffect } from 'react';
import { X as CloseIcon } from 'lucide-react';

const COLORS = [
  { id: 0, color: 'bg-green-400', active: 'bg-green-300 scale-95 shadow-[0_0_20px_#4ade80]' },
  { id: 1, color: 'bg-rose-400', active: 'bg-rose-300 scale-95 shadow-[0_0_20px_#fb7185]' },
  { id: 2, color: 'bg-yellow-400', active: 'bg-yellow-300 scale-95 shadow-[0_0_20px_#facc15]' },
  { id: 3, color: 'bg-blue-400', active: 'bg-blue-300 scale-95 shadow-[0_0_20px_#60a5fa]' }
];

export const SimonGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playingSeq, setPlayingSeq] = useState(false);
  const [userStep, setUserStep] = useState(0);
  const [activeBtn, setActiveBtn] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const playSequence = async (seq: number[]) => {
    setPlayingSeq(true);
    for (const id of seq) {
      setActiveBtn(id);
      await new Promise(r => setTimeout(r, 400));
      setActiveBtn(null);
      await new Promise(r => setTimeout(r, 200));
    }
    setPlayingSeq(false);
  };

  const nextRound = () => {
    const next = [...sequence, Math.floor(Math.random() * 4)];
    setSequence(next);
    setUserStep(0);
    setTimeout(() => playSequence(next), 500);
  };

  const start = () => {
    setSequence([]);
    setGameOver(false);
    setStarted(true);
    setTimeout(nextRound, 500);
  };

  const handleClick = (id: number) => {
    if (playingSeq || gameOver || !started) return;
    
    // Visual feedback
    setActiveBtn(id);
    setTimeout(() => setActiveBtn(null), 200);

    if (id !== sequence[userStep]) {
      setGameOver(true);
      setStarted(false);
      return;
    }

    if (userStep + 1 === sequence.length) {
      setUserStep(0);
      setPlayingSeq(true);
      setTimeout(nextRound, 1000);
    } else {
      setUserStep(s => s + 1);
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-50 p-4">
       <div className="relative w-full max-w-sm aspect-square bg-white rounded-full p-6 shadow-2xl border-4 border-slate-100">
          <button onClick={onBack} className="absolute top-0 right-0 p-4 text-slate-400 hover:text-slate-600 z-20"><CloseIcon/></button>
          
          <div className="grid grid-cols-2 gap-4 h-full w-full">
             {COLORS.map(btn => (
                <button
                   key={btn.id}
                   className={`rounded-2xl transition-all duration-100 ${activeBtn === btn.id ? btn.active : btn.color} hover:brightness-110 shadow-sm`}
                   onClick={() => handleClick(btn.id)}
                />
             ))}
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="w-1/3 h-1/3 bg-white rounded-full flex items-center justify-center border-4 border-slate-100 shadow-inner pointer-events-auto z-10 flex-col">
                {!started && !gameOver && (
                   <button onClick={start} className="text-slate-800 font-bold text-xl hover:text-blue-500">开始</button>
                )}
                {started && <span className="text-3xl font-bold text-slate-800">{sequence.length}</span>}
                {gameOver && (
                    <div className="text-center">
                        <div className="text-rose-500 font-bold mb-1">失败</div>
                        <button onClick={start} className="text-slate-500 text-sm hover:text-blue-500 underline">重试</button>
                    </div>
                )}
             </div>
          </div>
       </div>
    </div>
  );
};