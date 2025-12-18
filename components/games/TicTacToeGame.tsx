import * as React from 'react';
import { useState, useEffect } from 'react';
import { X as CloseIcon, RefreshCcw, Circle, X } from 'lucide-react';

export const TicTacToeGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true); // Player is X
  const [winner, setWinner] = useState<string | null>(null);

  const checkWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (i: number) => {
    if (winner || board[i] || !isXNext) return;
    const nextBoard = [...board];
    nextBoard[i] = 'X';
    setBoard(nextBoard);
    setIsXNext(false);
    
    const w = checkWinner(nextBoard);
    if(w) setWinner(w);
  };

  // AI Move
  useEffect(() => {
    if (!isXNext && !winner && board.includes(null)) {
        const timer = setTimeout(() => {
            const emptyIndices = board.map((v, i) => v === null ? i : -1).filter(i => i !== -1);
            if(emptyIndices.length > 0) {
                const randomIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
                const nextBoard = [...board];
                nextBoard[randomIdx] = 'O';
                setBoard(nextBoard);
                setIsXNext(true);
                const w = checkWinner(nextBoard);
                if(w) setWinner(w);
            }
        }, 500);
        return () => clearTimeout(timer);
    }
  }, [isXNext, winner, board]);

  const reset = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const isDraw = !winner && !board.includes(null);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-50 p-4">
       <div className="w-full max-w-sm aspect-square bg-white p-6 rounded-2xl shadow-xl border border-slate-200 flex flex-col">
          <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-2xl text-indigo-500">井字棋</h2>
              <div className="flex gap-2 text-slate-400">
                  <button onClick={reset} className="hover:text-indigo-500"><RefreshCcw/></button>
                  <button onClick={onBack} className="hover:text-indigo-500"><CloseIcon/></button>
              </div>
          </div>
          
          <div className="flex-1 grid grid-cols-3 gap-3">
             {board.map((val, i) => (
                <div 
                  key={i} 
                  onClick={() => handleClick(i)}
                  className={`flex items-center justify-center text-4xl bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors shadow-inner
                     ${val === 'X' ? 'text-indigo-500' : 'text-rose-500'}
                  `}
                >
                    {val === 'X' && <X size={48} strokeWidth={3} />}
                    {val === 'O' && <Circle size={40} strokeWidth={3} />}
                </div>
             ))}
          </div>

          {(winner || isDraw) && (
              <div className="mt-6 text-center">
                  <h3 className="text-2xl font-bold text-slate-800">
                      {winner ? `${winner === 'X' ? '你赢了!' : 'AI 赢了!'}` : '平局!'}
                  </h3>
              </div>
          )}
       </div>
    </div>
  );
};