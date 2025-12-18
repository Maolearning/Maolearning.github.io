import * as React from 'react';
import { useState, useEffect } from 'react';
import { X, RefreshCcw, Eye } from 'lucide-react';

export const ColorPickerGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [score, setScore] = useState(0);
  const [gridSize, setGridSize] = useState(2);
  const [targetIdx, setTargetIdx] = useState(0);
  const [baseColor, setBaseColor] = useState({ h: 0, s: 0, l: 0 });
  const [diffColor, setDiffColor] = useState({ h: 0, s: 0, l: 0 });
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);

  const generateLevel = (currentScore: number) => {
    const size = Math.min(6, Math.floor(currentScore / 5) + 2);
    setGridSize(size);
    setTargetIdx(Math.floor(Math.random() * (size * size)));
    
    const h = Math.floor(Math.random() * 360);
    const s = 60 + Math.random() * 20;
    const l = 40 + Math.random() * 20;
    setBaseColor({ h, s, l });

    // 随着分数增加，色差越来越小
    const diff = Math.max(2, 15 - Math.floor(currentScore / 3));
    setDiffColor({ h, s, l: l + (Math.random() > 0.5 ? diff : -diff) });
  };

  const handleClick = (idx: number) => {
    if (gameOver) return;
    if (idx === targetIdx) {
      const newScore = score + 1;
      setScore(newScore);
      setTimeLeft(15);
      generateLevel(newScore);
    } else {
      setTimeLeft(t => Math.max(0, t - 2));
    }
  };

  const restart = () => {
    setScore(0);
    setTimeLeft(15);
    setGameOver(false);
    generateLevel(0);
  };

  useEffect(() => {
    generateLevel(0);
  }, []);

  useEffect(() => {
    if (gameOver || timeLeft <= 0) {
      setGameOver(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameOver]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full"><X className="text-slate-500" /></button>
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-800">找不同</h2>
            <div className="flex gap-4 font-bold text-sm text-slate-400">
              <span>分数: {score}</span>
              <span className={timeLeft < 5 ? 'text-red-500 animate-pulse' : ''}>时间: {timeLeft}s</span>
            </div>
          </div>
          <button onClick={restart} className="p-2 hover:bg-slate-100 rounded-full"><RefreshCcw className="text-slate-500" /></button>
        </div>

        <div 
          className="grid gap-2 aspect-square bg-slate-50 p-3 rounded-xl"
          style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        >
          {Array(gridSize * gridSize).fill(0).map((_, i) => (
            <div
              key={i}
              onClick={() => handleClick(i)}
              className="rounded-lg cursor-pointer transition-transform active:scale-95 shadow-sm"
              style={{ 
                backgroundColor: i === targetIdx 
                  ? `hsl(${diffColor.h}, ${diffColor.s}%, ${diffColor.l}%)` 
                  : `hsl(${baseColor.h}, ${baseColor.s}%, ${baseColor.l}%)`
              }}
            />
          ))}
        </div>

        {gameOver && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm rounded-2xl m-4">
            <Eye size={48} className="text-cyan-500 mb-4" />
            <h3 className="text-3xl font-bold text-slate-800">眼睛累了？</h3>
            <p className="text-slate-500 my-2 font-medium">最终得分: {score}</p>
            <button onClick={restart} className="px-8 py-2 bg-cyan-500 text-white rounded-full font-bold shadow-lg">再来一局</button>
          </div>
        )}
      </div>
    </div>
  );
};