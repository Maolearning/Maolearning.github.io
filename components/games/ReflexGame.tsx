import * as React from 'react';
import { useState, useRef } from 'react';
import { X as CloseIcon, Zap } from 'lucide-react';

type State = 'waiting' | 'ready' | 'go' | 'result' | 'early';

export const ReflexGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [gameState, setGameState] = useState<State>('waiting');
  const [result, setResult] = useState(0);
  const startTimeRef = useRef(0);
  const timeoutRef = useRef<number>(0);

  const startTest = () => {
    setGameState('ready');
    const delay = 1000 + Math.random() * 3000;
    timeoutRef.current = window.setTimeout(() => {
      setGameState('go');
      startTimeRef.current = Date.now();
    }, delay);
  };

  const handleClick = () => {
    if (gameState === 'waiting' || gameState === 'result' || gameState === 'early') {
      startTest();
    } else if (gameState === 'ready') {
      clearTimeout(timeoutRef.current);
      setGameState('early');
    } else if (gameState === 'go') {
      const time = Date.now() - startTimeRef.current;
      setResult(time);
      setGameState('result');
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-50 p-4">
      <div 
        onClick={handleClick}
        className={`relative w-full max-w-lg aspect-square flex flex-col items-center justify-center rounded-3xl shadow-xl cursor-pointer transition-all duration-200 select-none overflow-hidden
          ${gameState === 'waiting' ? 'bg-white hover:bg-slate-50' : ''}
          ${gameState === 'ready' ? 'bg-rose-100' : ''}
          ${gameState === 'go' ? 'bg-emerald-400' : ''}
          ${gameState === 'result' ? 'bg-blue-50' : ''}
          ${gameState === 'early' ? 'bg-amber-50' : ''}
        `}
      >
        <button onClick={(e) => { e.stopPropagation(); onBack(); }} className="absolute top-6 right-6 p-2 bg-white/50 rounded-full hover:bg-white shadow-sm z-10"><CloseIcon className="text-slate-600"/></button>
        
        {gameState === 'waiting' && (
           <div className="text-center p-8">
             <div className="bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap size={48} className="text-blue-500"/>
             </div>
             <h2 className="text-3xl font-bold text-slate-800 mb-2">反应力测试</h2>
             <p className="text-slate-500 text-lg">点击屏幕开始。<br/>看到绿色背景时立即点击。</p>
           </div>
        )}
        {gameState === 'ready' && <h2 className="text-4xl font-bold text-rose-500 tracking-wider animate-pulse">等待...</h2>}
        {gameState === 'go' && <h2 className="text-6xl font-black text-white">点我!!!</h2>}
        {gameState === 'result' && (
          <div className="text-center">
             <h2 className="text-6xl font-black text-slate-800 mb-2">{result} ms</h2>
             <p className="text-slate-500 text-xl font-medium">你的反应速度</p>
             <div className="mt-8 px-6 py-2 bg-blue-500 text-white rounded-full inline-block font-bold">点击重试</div>
          </div>
        )}
        {gameState === 'early' && (
          <div className="text-center">
             <h2 className="text-4xl font-bold text-amber-500 mb-2">太快了!</h2>
             <p className="text-slate-500">要在变绿之后再点击哦。</p>
             <div className="mt-8 px-6 py-2 bg-amber-500 text-white rounded-full inline-block font-bold">点击重试</div>
          </div>
        )}
      </div>
    </div>
  );
};