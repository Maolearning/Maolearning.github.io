import * as React from 'react';
import { useState } from 'react';
import { RefreshCcw, X as CloseIcon } from 'lucide-react';

const BOARD_SIZE = 15;
type Player = 'black' | 'white' | null;

export const GomokuGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [board, setBoard] = useState<Player[][]>(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState<'black' | 'white'>('black');
  const [winner, setWinner] = useState<Player>(null);

  const checkWin = (x: number, y: number, player: Player, currentBoard: Player[][]) => {
    const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
    for (const [dx, dy] of directions) {
      let count = 1;
      for (let i = 1; i < 5; i++) {
        const nx = x + dx * i, ny = y + dy * i;
        if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE && currentBoard[ny][nx] === player) count++; else break;
      }
      for (let i = 1; i < 5; i++) {
        const nx = x - dx * i, ny = y - dy * i;
        if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE && currentBoard[ny][nx] === player) count++; else break;
      }
      if (count >= 5) return true;
    }
    return false;
  };

  const handleCellClick = (x: number, y: number) => {
    if (board[y][x] || winner) return;
    const newBoard = board.map(row => [...row]);
    newBoard[y][x] = currentPlayer;
    setBoard(newBoard);
    if (checkWin(x, y, currentPlayer, newBoard)) setWinner(currentPlayer);
    else setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black');
  };

  const resetGame = () => {
    setBoard(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null)));
    setCurrentPlayer('black');
    setWinner(null);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-50 p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
        <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 text-slate-500"><CloseIcon size={24} /></button>
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-800">五子棋</h2>
            <p className="text-sm font-medium mt-1">
                {winner ? 
                    <span className="text-rose-500 font-bold">{winner === 'black' ? '黑棋' : '白棋'} 获胜!</span> : 
                    <>当前回合: <span className={`font-bold px-2 py-0.5 rounded ${currentPlayer === 'black' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-800 border'}`}>{currentPlayer === 'black' ? '黑棋' : '白棋'}</span></>
                }
            </p>
          </div>
          <button onClick={resetGame} className="p-2 rounded-full hover:bg-slate-100 text-slate-500"><RefreshCcw size={24} /></button>
        </div>

        <div className="relative w-full pb-[100%] rounded-lg bg-[#f0d9b5] border-4 border-[#e3c193] shadow-inner">
          <div className="absolute inset-0 p-2 sm:p-4 grid" style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`, gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)` }}>
            {board.map((row, y) => row.map((cell, x) => (
              <div key={`${x}-${y}`} onClick={() => handleCellClick(x, y)} className="relative z-10 flex items-center justify-center cursor-pointer">
                {/* Board Lines */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-full h-[1px] bg-slate-800/40"></div>
                  <div className="h-full w-[1px] bg-slate-800/40 absolute"></div>
                </div>
                
                {/* Pieces */}
                {cell && (
                    <div className={`w-[85%] h-[85%] rounded-full shadow-md transition-all duration-300 transform scale-100
                        ${cell === 'black' 
                            ? 'bg-gradient-to-br from-slate-700 to-black' 
                            : 'bg-gradient-to-br from-white to-slate-200'
                        }
                    `} />
                )}
                
                {/* Ghost Piece (Hover) */}
                {!cell && !winner && (
                    <div className={`w-[60%] h-[60%] rounded-full opacity-0 hover:opacity-40 transition-opacity z-10 
                        ${currentPlayer === 'black' ? 'bg-black' : 'bg-white'}
                    `} />
                )}
              </div>
            )))}
          </div>
        </div>
      </div>
    </div>
  );
};