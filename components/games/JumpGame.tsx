import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { X as CloseIcon } from 'lucide-react';

const GRAVITY = 0.6;
const JUMP = -8;
const GAP = 150;
const PIPE_WIDTH = 50;
const SPEED = 3;

export const JumpGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [birdY, setBirdY] = useState(250);
  const [pipes, setPipes] = useState<{x: number, topH: number}[]>([]);
  
  const birdVelocity = useRef(0);
  const gameLoop = useRef<number>(0);

  const jump = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.preventDefault();
    if(!playing) {
      setPlaying(true);
      setPipes([{ x: 400, topH: 100 + Math.random() * 200 }]);
      birdVelocity.current = JUMP;
    } else if (!gameOver) {
      birdVelocity.current = JUMP;
    } else {
        // Reset
        setPlaying(true);
        setGameOver(false);
        setScore(0);
        setBirdY(250);
        birdVelocity.current = JUMP;
        setPipes([{ x: 400, topH: 100 + Math.random() * 200 }]);
    }
  };

  useEffect(() => {
    if(!playing || gameOver) {
        if(gameLoop.current) cancelAnimationFrame(gameLoop.current);
        return;
    }
    
    const loop = () => {
      // Physics
      birdVelocity.current += GRAVITY;
      setBirdY(y => {
          const next = y + birdVelocity.current;
          if(next > 500 || next < 0) setGameOver(true);
          return next;
      });

      // Pipes
      setPipes(currentPipes => {
        let newPipes = currentPipes.map(p => ({...p, x: p.x - SPEED}));
        
        // Remove offscreen
        if(newPipes.length > 0 && newPipes[0].x < -PIPE_WIDTH) {
            newPipes.shift();
            setScore(s => s + 1);
        }

        // Add new pipe
        if(newPipes.length > 0 && newPipes[newPipes.length - 1].x < 250) {
            newPipes.push({ x: 400, topH: 50 + Math.random() * 250 });
        }
        
        // Collision
        newPipes.forEach(p => {
             // Bird X is fixed at 100, width 30
             // Bird Y is birdY, height 30
             if(
                (100 + 30 > p.x && 100 < p.x + PIPE_WIDTH) && 
                (birdY < p.topH || birdY + 30 > p.topH + GAP)
             ) {
                 setGameOver(true);
             }
        });

        return newPipes;
      });

      gameLoop.current = requestAnimationFrame(loop);
    };

    gameLoop.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(gameLoop.current);
  }, [playing, gameOver, birdY]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-50 p-4 touch-none">
       <div 
         onPointerDown={jump}
         className="relative w-full max-w-md h-[500px] overflow-hidden bg-sky-100 rounded-2xl shadow-xl border border-slate-200 cursor-pointer select-none"
       >
          {/* Background Clouds */}
          <div className="absolute top-10 left-10 w-20 h-8 bg-white/50 rounded-full blur-sm"></div>
          <div className="absolute top-20 right-20 w-32 h-12 bg-white/50 rounded-full blur-sm"></div>

          <div className="absolute top-4 left-4 z-10 text-slate-800 font-bold text-3xl drop-shadow-sm">{score}</div>
          <button onClick={(e) => {e.stopPropagation(); onBack();}} className="absolute top-4 right-4 z-10 p-2 bg-white/50 rounded-full hover:bg-white"><CloseIcon className="text-slate-600"/></button>
          
          {/* Bird */}
          <div 
             className="absolute left-[100px] w-[30px] h-[30px] bg-yellow-400 rounded-lg shadow-md border-2 border-yellow-500"
             style={{ top: birdY }}
          >
             {/* Eye */}
             <div className="absolute top-1 right-1 w-2 h-2 bg-black rounded-full"></div>
             {/* Wing */}
             <div className="absolute top-3 left-0 w-4 h-2 bg-white/50 rounded-r-full"></div>
          </div>

          {/* Pipes */}
          {pipes.map((p, i) => (
             <React.Fragment key={i}>
                <div className="absolute top-0 bg-green-500 border-2 border-green-700 rounded-b-lg" style={{ left: p.x, width: PIPE_WIDTH, height: p.topH }} />
                <div className="absolute bottom-0 bg-green-500 border-2 border-green-700 rounded-t-lg" style={{ left: p.x, width: PIPE_WIDTH, top: p.topH + GAP }} />
             </React.Fragment>
          ))}
          
          {!playing && !gameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm">
                  <h2 className="text-slate-800 font-bold text-2xl animate-bounce bg-white px-6 py-2 rounded-full shadow-lg">点击屏幕跳跃</h2>
              </div>
          )}
          
          {gameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm flex-col">
                  <div className="bg-white p-6 rounded-2xl shadow-2xl text-center">
                      <h2 className="text-rose-500 font-bold text-3xl mb-2">哎呀，撞到了!</h2>
                      <p className="text-slate-500 mb-6 font-medium">得分: {score}</p>
                      <div className="px-6 py-2 bg-sky-500 text-white font-bold rounded-full cursor-pointer hover:bg-sky-600">点击重试</div>
                  </div>
              </div>
          )}
       </div>
    </div>
  );
};