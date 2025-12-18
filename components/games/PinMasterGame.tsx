import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { X, RefreshCcw, Circle } from 'lucide-react';

interface Pin {
  angle: number;
}

export const PinMasterGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [pins, setPins] = useState<Pin[]>([]);
  const [remainingPins, setRemainingPins] = useState(12);
  const [rotation, setRotation] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [level, setLevel] = useState(1);

  const requestRef = useRef<number>(0);
  const rotationRef = useRef(0);
  const pinsRef = useRef<Pin[]>([]);

  // 游戏配置
  const CENTER_SIZE = 80;
  const PIN_LENGTH = 120;
  const COLLISION_THRESHOLD = 8; // 角度碰撞阈值

  const initGame = (nextLevel: number = 1) => {
    setPins([]);
    pinsRef.current = [];
    setRemainingPins(10 + nextLevel * 2);
    setGameOver(false);
    setWin(false);
    setLevel(nextLevel);
    rotationRef.current = 0;
  };

  const shootPin = () => {
    if (gameOver || win || remainingPins <= 0) return;

    // 当前针相对于圆盘的绝对角度 (考虑到圆盘正在旋转，我们需要计算相对于圆盘0度位置的角度)
    // 针总是从正下方(90度)射入圆心
    const currentAngle = (90 - rotationRef.current) % 360;

    // 碰撞检测
    const hasCollision = pinsRef.current.some(pin => {
      const diff = Math.abs((pin.angle % 360) - (currentAngle % 360));
      const wrappedDiff = Math.min(diff, 360 - diff);
      return wrappedDiff < COLLISION_THRESHOLD;
    });

    if (hasCollision) {
      setGameOver(true);
      return;
    }

    const newPin = { angle: currentAngle };
    const newPins = [...pinsRef.current, newPin];
    pinsRef.current = newPins;
    setPins(newPins);
    
    const nextRemaining = remainingPins - 1;
    setRemainingPins(nextRemaining);

    if (nextRemaining === 0) {
      setWin(true);
    }
  };

  const animate = (time: number) => {
    const speed = 1.5 + level * 0.3;
    rotationRef.current = (rotationRef.current + speed) % 360;
    setRotation(rotationRef.current);
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [level]);

  useEffect(() => {
    initGame(1);
  }, []);

  const handleNextLevel = () => {
    initGame(level + 1);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-50 p-4 touch-none">
      <div 
        className="relative w-full max-w-md h-[600px] bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col items-center select-none"
        onClick={shootPin}
      >
        {/* Header */}
        <div className="w-full p-6 flex justify-between items-center z-10">
          <button onClick={(e) => { e.stopPropagation(); onBack(); }} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <X className="text-slate-400" />
          </button>
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-800">见缝插针</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">第 {level} 关</p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); initGame(level); }} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <RefreshCcw className="text-slate-400" />
          </button>
        </div>

        {/* Game Area */}
        <div className="flex-1 w-full relative flex flex-col items-center justify-center">
          
          {/* Main Circle and Pins */}
          <div className="relative mb-20">
             {/* Center Circle */}
             <div 
               className="rounded-full bg-slate-800 shadow-lg flex items-center justify-center text-white font-black text-3xl z-20 relative"
               style={{ 
                 width: CENTER_SIZE, 
                 height: CENTER_SIZE,
                 transform: `rotate(${rotation}deg)` 
               }}
             >
                {remainingPins}
             </div>

             {/* Pins already on the circle */}
             {pins.map((pin, i) => (
               <div 
                 key={i}
                 className="absolute top-1/2 left-1/2 origin-left z-10"
                 style={{ 
                   transform: `translate(0, -50%) rotate(${pin.angle + rotation}deg)`,
                   width: PIN_LENGTH,
                   height: '2px'
                 }}
               >
                 <div className="w-full h-full bg-slate-400 relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-800 rounded-full shadow-sm"></div>
                 </div>
               </div>
             ))}
          </div>

          {/* Shooting Pin UI */}
          {!gameOver && !win && remainingPins > 0 && (
            <div className="absolute bottom-20 flex flex-col items-center animate-bounce">
              <div className="w-0.5 h-16 bg-slate-200"></div>
              <div className="w-4 h-4 bg-blue-500 rounded-full shadow-md"></div>
              <p className="mt-4 text-xs font-bold text-blue-500 uppercase">点击发射</p>
            </div>
          )}
        </div>

        {/* Status Overlays */}
        {gameOver && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm animate-in fade-in zoom-in duration-300">
            <div className="bg-rose-50 p-4 rounded-full mb-4">
                <X size={48} className="text-rose-500" />
            </div>
            <h3 className="text-3xl font-bold text-slate-800">挑战失败!</h3>
            <p className="text-slate-500 mt-2 mb-8">别灰心，差一点点就成功了。</p>
            <button 
              onClick={(e) => { e.stopPropagation(); initGame(level); }}
              className="px-10 py-3 bg-slate-800 text-white rounded-full font-bold shadow-lg hover:scale-105 transition-all"
            >
              重新挑战
            </button>
          </div>
        )}

        {win && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm animate-in fade-in zoom-in duration-300">
            <div className="bg-emerald-50 p-4 rounded-full mb-4">
                <Circle size={48} className="text-emerald-500" fill="currentColor" />
            </div>
            <h3 className="text-3xl font-bold text-slate-800">完美通关!</h3>
            <p className="text-slate-500 mt-2 mb-8">你的时机掌握得恰到好处。</p>
            <button 
              onClick={(e) => { e.stopPropagation(); handleNextLevel(); }}
              className="px-10 py-3 bg-emerald-500 text-white rounded-full font-bold shadow-lg hover:scale-105 transition-all"
            >
              下一关卡
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
