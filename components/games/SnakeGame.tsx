import * as React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { GridPosition } from '../../types';
import { RefreshCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, X, Trophy } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 120;

export const SnakeGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [snake, setSnake] = useState<GridPosition[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<GridPosition>({ x: 15, y: 5 });
  const [direction, setDirection] = useState<GridPosition>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const directionRef = useRef(INITIAL_DIRECTION);

  const generateFood = useCallback((): GridPosition => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood());
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setGameOver(false);
    setScore(0);
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameOver) return;
    switch (e.key) {
      case 'ArrowUp': if (directionRef.current.y !== 1) directionRef.current = { x: 0, y: -1 }; break;
      case 'ArrowDown': if (directionRef.current.y !== -1) directionRef.current = { x: 0, y: 1 }; break;
      case 'ArrowLeft': if (directionRef.current.x !== 1) directionRef.current = { x: -1, y: 0 }; break;
      case 'ArrowRight': if (directionRef.current.x !== -1) directionRef.current = { x: 1, y: 0 }; break;
    }
  }, [gameOver]);

  const handleDirection = (newDir: GridPosition) => {
    if (gameOver) return;
    if (newDir.x !== 0 && directionRef.current.x === -newDir.x) return;
    if (newDir.y !== 0 && directionRef.current.y === -newDir.y) return;
    directionRef.current = newDir;
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (gameOver) return;
    const moveSnake = setInterval(() => {
      setSnake((prevSnake) => {
        const newHead = { x: prevSnake[0].x + directionRef.current.x, y: prevSnake[0].y + directionRef.current.y };
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE ||
            prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }
        const newSnake = [newHead, ...prevSnake];
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 1);
          setFood(generateFood());
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, SPEED);
    return () => clearInterval(moveSnake);
  }, [food, gameOver, generateFood]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-50 p-4 touch-none">
      <div className="relative w-full max-w-md overflow-hidden bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 text-slate-500"><X size={24} /></button>
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-800">贪吃蛇</h2>
            <div className="flex items-center gap-1 justify-center text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full mt-1 text-sm">
                 <Trophy size={14} /> {score}
            </div>
          </div>
          <button onClick={resetGame} className="p-2 rounded-full hover:bg-slate-100 text-slate-500"><RefreshCcw size={24} /></button>
        </div>

        <div className="relative mx-auto aspect-square w-full bg-slate-100 rounded-xl overflow-hidden border-2 border-slate-200"
          style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` }}>
          {snake.map((segment, index) => (
            <div key={`${segment.x}-${segment.y}-${index}`}
              className={`${index === 0 ? 'bg-green-600 rounded-sm z-10' : 'bg-green-400 rounded-sm'} shadow-sm`}
              style={{ gridColumnStart: segment.x + 1, gridRowStart: segment.y + 1, margin: '1px' }} />
          ))}
          <div className="bg-red-500 rounded-full shadow-sm animate-pulse"
            style={{ gridColumnStart: food.x + 1, gridRowStart: food.y + 1, margin: '2px' }} />
          
          {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-20 animate-in fade-in">
              <h3 className="mb-2 text-3xl font-bold text-slate-800">游戏结束</h3>
              <p className="mb-6 text-slate-500 font-medium">最终得分: {score}</p>
              <button onClick={resetGame} className="bg-green-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-green-600 hover:scale-105 transition-all">
                  再玩一次
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3 max-w-[200px] mx-auto">
           <div />
           <button 
             className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 shadow-sm border-b-4 border-slate-200 active:border-b-0 active:translate-y-1 transition-all"
             onPointerDown={(e) => { e.preventDefault(); handleDirection({x: 0, y: -1}); }}
           >
             <ArrowUp size={28} />
           </button>
           <div />
           <button 
             className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 shadow-sm border-b-4 border-slate-200 active:border-b-0 active:translate-y-1 transition-all"
             onPointerDown={(e) => { e.preventDefault(); handleDirection({x: -1, y: 0}); }}
           >
             <ArrowLeft size={28} />
           </button>
           <button 
             className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 shadow-sm border-b-4 border-slate-200 active:border-b-0 active:translate-y-1 transition-all"
             onPointerDown={(e) => { e.preventDefault(); handleDirection({x: 0, y: 1}); }}
           >
             <ArrowDown size={28} />
           </button>
           <button 
             className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 shadow-sm border-b-4 border-slate-200 active:border-b-0 active:translate-y-1 transition-all"
             onPointerDown={(e) => { e.preventDefault(); handleDirection({x: 1, y: 0}); }}
           >
             <ArrowRight size={28} />
           </button>
        </div>
      </div>
    </div>
  );
};