import * as React from 'react';
import { useState, useEffect } from 'react';
import { X as CloseIcon, Flag, Bomb, Shovel } from 'lucide-react';

const SIZE = 10;
const MINES = 15;

type Cell = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborCount: number;
}

export const MinesweeperGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [mode, setMode] = useState<'dig' | 'flag'>('dig');

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    let newGrid: Cell[][] = Array(SIZE).fill(null).map(() => 
      Array(SIZE).fill(null).map(() => ({
        isMine: false, isRevealed: false, isFlagged: false, neighborCount: 0
      }))
    );

    let minesPlaced = 0;
    while(minesPlaced < MINES) {
       const r = Math.floor(Math.random() * SIZE);
       const c = Math.floor(Math.random() * SIZE);
       if(!newGrid[r][c].isMine) {
           newGrid[r][c].isMine = true;
           minesPlaced++;
       }
    }

    const directions = [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]];
    for(let r=0; r<SIZE; r++) {
      for(let c=0; c<SIZE; c++) {
        if(newGrid[r][c].isMine) continue;
        let count = 0;
        directions.forEach(([dr, dc]) => {
           const nr = r+dr, nc = c+dc;
           if(nr>=0 && nr<SIZE && nc>=0 && nc<SIZE && newGrid[nr][nc].isMine) count++;
        });
        newGrid[r][c].neighborCount = count;
      }
    }
    setGrid(newGrid);
    setGameOver(false);
    setWin(false);
    setMode('dig');
  };

  const reveal = (r: number, c: number) => {
    if(gameOver || win || grid[r][c].isFlagged || grid[r][c].isRevealed) return;

    const newGrid = [...grid.map(row => [...row])];
    
    if(newGrid[r][c].isMine) {
      newGrid[r][c].isRevealed = true;
      setGrid(newGrid);
      setGameOver(true);
      return;
    }

    const floodFill = (row: number, col: number) => {
      if(row<0 || row>=SIZE || col<0 || col>=SIZE || newGrid[row][col].isRevealed || newGrid[row][col].isFlagged) return;
      newGrid[row][col].isRevealed = true;
      if(newGrid[row][col].neighborCount === 0) {
         [[ -1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dr, dc]) => floodFill(row+dr, col+dc));
      }
    };
    
    floodFill(r, c);
    setGrid(newGrid);
    
    const unrevealedNonMines = newGrid.flat().filter(cell => !cell.isMine && !cell.isRevealed).length;
    if(unrevealedNonMines === 0) setWin(true);
  };

  const toggleFlag = (r: number, c: number) => {
    if(gameOver || win || grid[r][c].isRevealed) return;
    const newGrid = [...grid.map(row => [...row])];
    newGrid[r][c].isFlagged = !newGrid[r][c].isFlagged;
    setGrid(newGrid);
  }

  const handleCellClick = (e: React.MouseEvent | React.TouchEvent, r: number, c: number) => {
    e.preventDefault(); 
    if (mode === 'flag') {
      toggleFlag(r, c);
    } else {
      reveal(r, c);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    toggleFlag(r, c);
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-50 p-4">
       <div className="bg-white p-6 shadow-xl rounded-2xl w-full max-w-md border border-slate-200">
          <div className="flex justify-between items-center mb-6 text-slate-800">
             <h2 className="font-bold text-xl text-red-500">扫雷</h2>
             <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full"><CloseIcon className="text-slate-500" /></button>
          </div>
          
          <div className="grid gap-1 bg-slate-200 p-1 aspect-square rounded-lg" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)`}}>
            {grid.map((row, r) => row.map((cell, c) => (
               <div 
                 key={`${r}-${c}`}
                 onClick={(e) => handleCellClick(e, r, c)}
                 onContextMenu={(e) => handleContextMenu(e, r, c)}
                 className={`flex items-center justify-center font-bold cursor-pointer text-sm transition-all duration-200 rounded-sm select-none
                    ${cell.isRevealed 
                       ? (cell.isMine ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600') 
                       : 'bg-slate-300 hover:bg-slate-400 shadow-sm'
                    }
                 `}
               >
                 {cell.isRevealed && cell.isMine && <Bomb size={16} fill="white" />}
                 {cell.isRevealed && !cell.isMine && cell.neighborCount > 0 && (
                   <span style={{ color: ['#3b82f6', '#10b981', '#ef4444', '#8b5cf6'][cell.neighborCount-1] || 'black'}}>
                     {cell.neighborCount}
                   </span>
                 )}
                 {!cell.isRevealed && cell.isFlagged && <Flag size={14} className="text-red-500" fill="currentColor" />}
               </div>
            )))}
          </div>
          
          {/* Controls Bar */}
          <div className="mt-6 flex justify-between items-center">
             <div className="flex bg-slate-100 rounded-lg p-1">
                <button 
                  onClick={() => setMode('dig')}
                  className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-bold transition-all ${mode === 'dig' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'}`}
                >
                  <Shovel size={16} /> 挖掘
                </button>
                <button 
                  onClick={() => setMode('flag')}
                  className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-bold transition-all ${mode === 'flag' ? 'bg-white text-red-500 shadow-sm' : 'text-slate-400'}`}
                >
                  <Flag size={16} /> 标记
                </button>
             </div>
             
             <button onClick={initGame} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg shadow-md transition-colors">
                 重置
             </button>
          </div>

          {(gameOver || win) && (
            <div className={`mt-4 text-center p-3 rounded-xl font-bold ${win ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
               {win ? "排雷成功！" : "触雷了！"}
            </div>
          )}
       </div>
    </div>
  );
};