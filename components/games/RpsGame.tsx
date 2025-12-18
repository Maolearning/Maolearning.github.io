import * as React from 'react';
import { useState } from 'react';
import { X as CloseIcon, Hand, Scissors, Square } from 'lucide-react';

type Choice = 'rock' | 'paper' | 'scissors' | null;

export const RpsGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [playerChoice, setPlayerChoice] = useState<Choice>(null);
  const [cpuChoice, setCpuChoice] = useState<Choice>(null);
  const [result, setResult] = useState<string>('请出拳');
  const [score, setScore] = useState({ p: 0, c: 0 });

  const choices: Choice[] = ['rock', 'paper', 'scissors'];

  const play = (c: Choice) => {
    if(!c) return;
    const cpu = choices[Math.floor(Math.random() * 3)];
    setPlayerChoice(c);
    setCpuChoice(cpu);

    if(c === cpu) {
        setResult('平局');
    } else if (
        (c === 'rock' && cpu === 'scissors') ||
        (c === 'paper' && cpu === 'rock') ||
        (c === 'scissors' && cpu === 'paper')
    ) {
        setResult('你赢了!');
        setScore(s => ({ ...s, p: s.p + 1 }));
    } else {
        setResult('电脑赢了');
        setScore(s => ({ ...s, c: s.c + 1 }));
    }
  };

  const getIcon = (c: Choice) => {
      if(c === 'rock') return <Square className="rotate-45" size={32} />;
      if(c === 'paper') return <Hand size={32} />;
      if(c === 'scissors') return <Scissors size={32} />;
      return <div className="w-8 h-8 animate-pulse bg-slate-200 rounded-full" />;
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-50 p-4 text-slate-800">
       <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
          <div className="flex justify-between items-center mb-8">
             <h2 className="font-bold text-xl text-rose-500">猜拳大战</h2>
             <button onClick={onBack}><CloseIcon className="text-slate-400"/></button>
          </div>

          <div className="flex justify-between items-center mb-8 px-4">
              <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">玩家</span>
                  <div className="w-20 h-20 border-4 border-blue-100 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                      {getIcon(playerChoice)}
                  </div>
                  <span className="font-bold text-xl text-slate-800">{score.p}</span>
              </div>
              <div className="font-bold text-2xl italic text-slate-300">VS</div>
              <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">电脑</span>
                  <div className="w-20 h-20 border-4 border-rose-100 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
                      {getIcon(cpuChoice)}
                  </div>
                  <span className="font-bold text-xl text-slate-800">{score.c}</span>
              </div>
          </div>

          <div className="text-center font-bold text-2xl text-slate-800 mb-8 h-8">{result}</div>

          <div className="grid grid-cols-3 gap-3">
              <button onClick={() => play('rock')} className="p-4 bg-white border-2 border-slate-100 rounded-xl flex justify-center text-slate-600 hover:border-blue-500 hover:text-blue-500 transition-colors shadow-sm"><Square className="rotate-45"/></button>
              <button onClick={() => play('paper')} className="p-4 bg-white border-2 border-slate-100 rounded-xl flex justify-center text-slate-600 hover:border-blue-500 hover:text-blue-500 transition-colors shadow-sm"><Hand/></button>
              <button onClick={() => play('scissors')} className="p-4 bg-white border-2 border-slate-100 rounded-xl flex justify-center text-slate-600 hover:border-blue-500 hover:text-blue-500 transition-colors shadow-sm"><Scissors/></button>
          </div>
       </div>
    </div>
  );
};