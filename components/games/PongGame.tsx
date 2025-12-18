import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { X as CloseIcon, RefreshCcw } from 'lucide-react';

const WIDTH = 300;
const HEIGHT = 400;
const P_W = 60;
const P_H = 10;
const BALL_R = 6;

export const PongGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [running, setRunning] = useState(false);
  
  const state = useRef({
    ball: { x: WIDTH/2, y: HEIGHT/2, dx: 2, dy: 3 },
    p1: { x: WIDTH/2 - P_W/2 }, // Player (Bottom)
    p2: { x: WIDTH/2 - P_W/2 }  // AI (Top)
  });

  useEffect(() => {
    if(!running) return;
    const ctx = canvasRef.current?.getContext('2d');
    if(!ctx) return;
    
    let animId: number;
    const loop = () => {
       ctx.fillStyle = '#f8fafc'; // Slate-50 background
       ctx.fillRect(0, 0, WIDTH, HEIGHT);
       
       // Net
       ctx.strokeStyle = '#e2e8f0';
       ctx.setLineDash([5, 5]);
       ctx.beginPath();
       ctx.moveTo(0, HEIGHT/2);
       ctx.lineTo(WIDTH, HEIGHT/2);
       ctx.stroke();
       ctx.setLineDash([]);

       const { ball, p1, p2 } = state.current;

       // Move Ball
       ball.x += ball.dx;
       ball.y += ball.dy;

       // Wall Bounce
       if(ball.x <= 0 || ball.x >= WIDTH) ball.dx *= -1;

       // AI Move (Simple tracking)
       const targetX = ball.x - P_W/2;
       p2.x += (targetX - p2.x) * 0.08;
       // Clamp AI
       if(p2.x < 0) p2.x = 0;
       if(p2.x > WIDTH - P_W) p2.x = WIDTH - P_W;

       // Collision Paddles
       // Bottom (Player)
       if(ball.y + BALL_R >= HEIGHT - 20 && ball.x >= p1.x && ball.x <= p1.x + P_W) {
          ball.dy = -Math.abs(ball.dy * 1.05);
       }
       // Top (AI)
       if(ball.y - BALL_R <= 20 && ball.x >= p2.x && ball.x <= p2.x + P_W) {
           ball.dy = Math.abs(ball.dy * 1.05);
       }

       // Scoring
       if(ball.y > HEIGHT) {
           setAiScore(s => s+1);
           resetBall();
       } else if(ball.y < 0) {
           setPlayerScore(s => s+1);
           resetBall();
       }

       // Draw P1 (Player - Blue)
       ctx.fillStyle = '#3b82f6';
       ctx.roundRect(p1.x, HEIGHT - 20, P_W, P_H, 5);
       ctx.fill();
       
       // Draw P2 (AI - Red)
       ctx.fillStyle = '#f43f5e';
       ctx.roundRect(p2.x, 10, P_W, P_H, 5);
       ctx.fill();

       // Draw Ball
       ctx.beginPath();
       ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI*2);
       ctx.fillStyle = '#1e293b';
       ctx.fill();
       ctx.closePath();

       animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [running]);

  const resetBall = () => {
     state.current.ball = { x: WIDTH/2, y: HEIGHT/2, dx: (Math.random()-0.5)*4, dy: Math.random() < 0.5 ? 3 : -3 };
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
     const rect = canvasRef.current?.getBoundingClientRect();
     if(!rect) return;
     let clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
     const scale = WIDTH / rect.width;
     let x = (clientX - rect.left) * scale;
     state.current.p1.x = Math.max(0, Math.min(WIDTH - P_W, x - P_W/2));
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-50 p-4">
       <div className="relative border border-slate-200 bg-white shadow-xl p-1 rounded-2xl overflow-hidden">
          <div className="absolute top-2 left-2 text-rose-500 font-bold font-mono">电脑: {aiScore}</div>
          <div className="absolute bottom-2 left-2 text-blue-500 font-bold font-mono">玩家: {playerScore}</div>
          <button onClick={onBack} className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 z-10"><CloseIcon/></button>
          
          <canvas 
             ref={canvasRef}
             width={WIDTH}
             height={HEIGHT}
             className="cursor-none touch-none bg-slate-50 block w-full h-auto max-h-[70vh] rounded-lg border-2 border-slate-100"
             onMouseMove={handleMove}
             onTouchMove={handleMove}
          />
          
          {!running && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm flex-col">
                  <h2 className="text-3xl font-bold text-slate-800 mb-4">乒乓对战</h2>
                  <button onClick={() => setRunning(true)} className="px-8 py-2 bg-blue-500 text-white rounded-full font-bold shadow-lg hover:bg-blue-600 transition-all">开始游戏</button>
              </div>
          )}
       </div>
       <p className="text-slate-400 text-xs mt-4 font-medium">左右滑动控制下方挡板</p>
    </div>
  );
};