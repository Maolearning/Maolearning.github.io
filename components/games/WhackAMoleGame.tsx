import * as React from 'react';
import { useState, useEffect } from 'react';
import { X as CloseIcon, Bug } from 'lucide-react';

export const WhackAMoleGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [score, setScore] = useState(0);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if(gameOver) return;
    const timer = setInterval(() => {
        setTimeLeft(t => {
            if(t <= 1) {
                setGameOver(true);
                return 0;
            }
            return t - 1;
        });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameOver]);

  useEffect(() => {
    if(gameOver) return;
    const moleTimer = setInterval(() => {
        setActiveIdx(Math.floor(Math.random() * 9));
    }, 800);
    return () => clearInterval(moleTimer);
  }, [gameOver]);

  const whack = (idx: number) => {
    if(gameOver || idx !== activeIdx) return;
    setScore(s => s + 1);
    setActiveIdx(null); // Hide immediately
  };

  const restart = () => {
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-50 p-4">
       <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
          <div className="flex justify-between items-center mb-6 text-lime-600">
             <div>
                 <h2 className="text-2xl font-bold">打地鼠</h2>
                 <div className="flex gap-4 font-bold text-sm text-slate-500 mt-1">
                    <span>得分: {score}</span>
                    <span>时间: {timeLeft}s</span>
                 </div>
             </div>
             <button onClick={onBack} className="p-2 hover:bg-slate-50 rounded-full"><CloseIcon/></button>
          </div>

          <div className="grid grid-cols-3 gap-4 aspect-square mb-4">
             {Array(9).fill(0).map((_, i) => (
                <div 
                   key={i}
                   onPointerDown={(e) => { e.preventDefault(); whack(i); }}
                   className={`rounded-2xl bg-slate-100 flex items-center justify-center cursor-pointer relative overflow-hidden shadow-inner active:scale-95 transition-transform`}
                >
                    {activeIdx === i && (
                        <div className="absolute inset-0 flex items-center justify-center bg-lime-100 animate-in zoom-in duration-100">
                           <Bug size={48} className="text-lime-500" />
                        </div>
                    )}
                </div>
             ))}
          </div>

          {gameOver && (
              <div className="text-center">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">时间到!</h3>
                  <button onClick={restart} className="px-8 py-2 bg-lime-500 text-white font-bold rounded-full hover:bg-lime-600 shadow-lg transition-all">重新开始</button>
              </div>
          )}
       </div>
    </div>
  );
};