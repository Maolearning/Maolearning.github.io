import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { X as CloseIcon, RefreshCcw } from 'lucide-react';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500;
const PADDLE_WIDTH = 80;
const BALL_RADIUS = 5;

export const BreakoutGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  
  const state = useRef({
    ball: { x: 200, y: 300, dx: 3, dy: -3 },
    paddle: { x: 160 },
    bricks: [] as {x: number, y: number, status: number}[],
    playing: true
  });

  const initBricks = () => {
    const bricks = [];
    for(let c=0; c<7; c++) {
      for(let r=0; r<5; r++) {
        bricks.push({ x: (c*(50+5))+10, y: (r*(20+5))+30, status: 1 });
      }
    }
    state.current.bricks = bricks;
  };

  useEffect(() => {
    initBricks();
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animId: number;

    const draw = () => {
      if (!ctx || !state.current.playing) return;
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // Draw Bricks
      state.current.bricks.forEach(b => {
        if(b.status === 1) {
          ctx.beginPath();
          ctx.roundRect(b.x, b.y, 50, 20, 4);
          ctx.fillStyle = "#f472b6"; // Pink-400
          ctx.fill();
          ctx.closePath();
        }
      });

      // Draw Paddle
      ctx.beginPath();
      ctx.roundRect(state.current.paddle.x, CANVAS_HEIGHT - 20, PADDLE_WIDTH, 10, 5);
      ctx.fillStyle = "#3b82f6"; // Blue-500
      ctx.fill();
      ctx.closePath();

      // Draw Ball
      ctx.beginPath();
      ctx.arc(state.current.ball.x, state.current.ball.y, BALL_RADIUS, 0, Math.PI*2);
      ctx.fillStyle = "#1e293b"; // Slate-800
      ctx.fill();
      ctx.closePath();

      // Logic
      const { ball, paddle, bricks } = state.current;
      
      // Move Ball
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Wall Collision
      if(ball.x + ball.dx > CANVAS_WIDTH - BALL_RADIUS || ball.x + ball.dx < BALL_RADIUS) ball.dx = -ball.dx;
      if(ball.y + ball.dy < BALL_RADIUS) ball.dy = -ball.dy;
      else if(ball.y + ball.dy > CANVAS_HEIGHT - BALL_RADIUS) {
         if(ball.x > paddle.x && ball.x < paddle.x + PADDLE_WIDTH) {
             ball.dy = -ball.dy * 1.05; // Speed up
         } else {
             state.current.playing = false;
             setGameOver(true);
         }
      }

      // Brick Collision
      let activeBricks = 0;
      bricks.forEach(b => {
        if(b.status === 1) {
          activeBricks++;
          if(ball.x > b.x && ball.x < b.x + 50 && ball.y > b.y && ball.y < b.y + 20) {
            ball.dy = -ball.dy;
            b.status = 0;
            setScore(s => s+10);
          }
        }
      });
      
      if(activeBricks === 0) {
        state.current.playing = false;
        setWon(true);
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [won, gameOver]); // Re-run if status changes

  const handleMouseMove = (e: React.MouseEvent) => {
    if(!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const scaleX = CANVAS_WIDTH / rect.width;
    const x = relativeX * scaleX;
    
    if(x > 0 && x < CANVAS_WIDTH) {
      state.current.paddle.x = x - PADDLE_WIDTH/2;
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if(!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const relativeX = e.touches[0].clientX - rect.left;
     const scaleX = CANVAS_WIDTH / rect.width;
    const x = relativeX * scaleX;
    
    if(x > 0 && x < CANVAS_WIDTH) {
      state.current.paddle.x = x - PADDLE_WIDTH/2;
    }
  }

  const reset = () => {
    state.current = {
        ball: { x: 200, y: 300, dx: 3, dy: -3 },
        paddle: { x: 160 },
        bricks: [],
        playing: true
    };
    initBricks();
    setScore(0);
    setGameOver(false);
    setWon(false);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white p-1 rounded-2xl shadow-xl border border-slate-200">
         <div className="flex justify-between items-center p-3 text-slate-800 font-bold mb-2 border-b border-slate-100">
            <span className="text-pink-500">打砖块</span>
            <span className="text-sm bg-slate-100 px-3 py-1 rounded-full">分数: {score}</span>
            <button onClick={onBack}><CloseIcon size={20} className="text-slate-400 hover:text-slate-600" /></button>
         </div>
         <div className="relative w-full aspect-[4/5] bg-slate-50 rounded-lg overflow-hidden cursor-none touch-none border border-slate-100">
            <canvas 
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="w-full h-full block"
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
            />
            {(gameOver || won) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                    <h2 className={`text-3xl font-bold mb-4 ${won ? "text-green-500" : "text-rose-500"}`}>
                        {won ? "关卡清除!" : "任务失败"}
                    </h2>
                    <button onClick={reset} className="px-6 py-2 bg-pink-500 text-white rounded-full font-bold shadow-md hover:bg-pink-600 flex gap-2 items-center">
                        <RefreshCcw size={16}/> 重玩
                    </button>
                </div>
            )}
         </div>
         <div className="p-3 text-center text-xs text-slate-400 font-medium">左右滑动屏幕控制挡板</div>
      </div>
    </div>
  );
};