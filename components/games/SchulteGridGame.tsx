import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { X, RefreshCcw, Timer, Trophy } from 'lucide-react';

export const SchulteGridGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState(1);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [time, setTime] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [wrongIdx, setWrongIdx] = useState<number | null>(null);

  const initGame = useCallback(() => {
    const nums = Array.from({ length: 25 }, (_, i) => i + 1);
    const shuffled = nums.sort(() => Math.random() - 0.5);
    setNumbers(shuffled);
    setCurrentNumber(1);
    setStartTime(null);
    setTime(0);
    setIsFinished(false);
    setWrongIdx(null);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    let interval: number;
    if (startTime && !isFinished) {
      interval = window.setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [startTime, isFinished]);

  const handleNumberClick = (num: number, idx: number) => {
    if (isFinished) return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    if (num === currentNumber) {
      if (num === 25) {
        setIsFinished(true);
      } else {
        setCurrentNumber(num + 1);
      }
      setWrongIdx(null);
    } else {
      setWrongIdx(idx);
      // 一秒后清除错误高亮
      setTimeout(() => setWrongIdx(null), 500);
    }
  };

  const formatTime = (ms: number) => {
    return (ms / 1000).toFixed(2);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-3xl shadow-xl border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="text-slate-400" />
          </button>
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-800">舒尔特方格</h2>
            <div className="flex items-center gap-2 justify-center text-indigo-500 font-mono font-bold text-lg mt-1">
              <Timer size={18} /> {formatTime(time)}s
            </div>
          </div>
          <button onClick={initGame} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <RefreshCcw className="text-slate-400" />
          </button>
        </div>

        <div className="mb-4 text-center">
            <span className="text-sm font-bold text-slate-400">请点击数字: </span>
            <span className="text-2xl font-black text-indigo-600">{currentNumber}</span>
        </div>

        <div className="grid grid-cols-5 gap-2 aspect-square bg-slate-100 p-2 rounded-2xl">
          {numbers.map((num, i) => (
            <button
              key={i}
              onClick={() => handleNumberClick(num, i)}
              className={`flex items-center justify-center text-xl font-bold rounded-xl transition-all duration-200 shadow-sm
                ${num < currentNumber 
                  ? 'bg-indigo-100 text-indigo-400 cursor-default' 
                  : wrongIdx === i
                    ? 'bg-rose-500 text-white animate-shake'
                    : 'bg-white text-slate-700 hover:bg-indigo-50 hover:scale-95 active:bg-indigo-100 border-b-4 border-slate-200'
                }
              `}
            >
              {num}
            </button>
          ))}
        </div>

        {isFinished && (
          <div className="mt-6 text-center animate-in fade-in zoom-in duration-500 bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
            <h3 className="text-2xl font-bold text-emerald-600 flex items-center justify-center gap-2 mb-1">
              <Trophy /> 挑战成功!
            </h3>
            <p className="text-emerald-700 font-medium">总用时: {formatTime(time)} 秒</p>
            <button 
              onClick={initGame} 
              className="mt-4 px-8 py-2 bg-emerald-500 text-white rounded-full font-bold shadow-lg hover:bg-emerald-600 transition-colors"
            >
              再测一次
            </button>
          </div>
        )}

        <div className="mt-6 text-xs text-slate-400 text-center leading-relaxed">
            规则：尽快按从 1 到 25 的顺序点击所有数字。<br/>
            该测试常用于训练注意力的集中性和广度。
        </div>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};