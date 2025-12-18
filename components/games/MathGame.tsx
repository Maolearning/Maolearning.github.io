import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { X as CloseIcon, Calculator } from 'lucide-react';

export const MathGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [problem, setProblem] = useState({ q: '', a: 0 });
  const [options, setOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameOver, setGameOver] = useState(false);

  const generateProblem = useCallback(() => {
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * 3)];
    let a = Math.floor(Math.random() * 20) + 1;
    let b = Math.floor(Math.random() * 20) + 1;
    let ans = 0;
    
    if(op === '+') ans = a + b;
    if(op === '-') { 
        if(a < b) [a, b] = [b, a]; // Ensure positive
        ans = a - b;
    }
    if(op === '*') {
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
        ans = a * b;
    }

    setProblem({ q: `${a} ${op} ${b}`, a: ans });

    // Generate Options
    let opts = new Set<number>();
    opts.add(ans);
    while(opts.size < 4) {
        const offset = Math.floor(Math.random() * 10) - 5;
        const val = ans + offset;
        if(val !== ans && val > 0) opts.add(val);
        if(opts.size < 4) opts.add(ans + Math.floor(Math.random()*20) + 1);
    }
    setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
    setTimeLeft(10); // Reset timer
  }, []);

  useEffect(() => {
    generateProblem();
  }, [generateProblem]);

  useEffect(() => {
    if(gameOver) return;
    const timer = setInterval(() => {
        setTimeLeft(t => {
            if(t <= 0) {
                setGameOver(true);
                return 0;
            }
            return t - 0.1;
        });
    }, 100);
    return () => clearInterval(timer);
  }, [gameOver, score]); // Reset timer on score change via key

  const answer = (val: number) => {
    if(gameOver) return;
    if(val === problem.a) {
        setScore(s => s + 1);
        generateProblem();
    } else {
        setGameOver(true);
    }
  };

  const reset = () => {
      setScore(0);
      setGameOver(false);
      generateProblem();
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-50 p-4">
       <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
          <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-xl text-teal-600">速算挑战</h2>
              <button onClick={onBack}><CloseIcon className="text-slate-400"/></button>
          </div>

          <div className="text-center mb-8">
              <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">请计算</div>
              <div className="text-5xl font-black text-slate-800">{problem.q} = ?</div>
          </div>

          {/* Timer Bar */}
          <div className="w-full h-3 bg-slate-100 rounded-full mb-8 overflow-hidden">
              <div 
                className={`h-full transition-all duration-100 ease-linear rounded-full ${timeLeft < 3 ? 'bg-red-500' : 'bg-teal-500'}`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
          </div>

          {!gameOver ? (
            <div className="grid grid-cols-2 gap-4">
                {options.map((opt, i) => (
                    <button 
                       key={i} 
                       onClick={() => answer(opt)}
                       className="py-4 bg-teal-50 text-teal-700 font-bold text-xl rounded-xl border-2 border-teal-100 hover:bg-teal-100 hover:border-teal-300 transition-all active:scale-95 shadow-sm"
                    >
                        {opt}
                    </button>
                ))}
            </div>
          ) : (
             <div className="text-center">
                 <h3 className="text-rose-500 font-bold text-2xl mb-2">计算错误!</h3>
                 <p className="text-slate-500 mb-6 font-medium">最终得分: {score}</p>
                 <button onClick={reset} className="px-8 py-3 bg-teal-500 text-white font-bold rounded-full shadow-lg hover:bg-teal-600 transition-all">重试</button>
             </div>
          )}
       </div>
    </div>
  );
};