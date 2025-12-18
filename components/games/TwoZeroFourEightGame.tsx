import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { X as CloseIcon, RefreshCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const SIZE = 4;

export const TwoZeroFourEightGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [board, setBoard] = useState<number[]>(Array(SIZE * SIZE).fill(0));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const initGame = useCallback(() => {
    const newBoard = Array(SIZE * SIZE).fill(0);
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const addRandomTile = (currentBoard: number[]) => {
    const emptyIndices = currentBoard.map((val, idx) => val === 0 ? idx : -1).filter(i => i !== -1);
    if (emptyIndices.length === 0) return;
    const idx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    currentBoard[idx] = Math.random() < 0.9 ? 2 : 4;
  };

  const move = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver) return;
    let newBoard = [...board];
    let moved = false;
    let addedScore = 0;

    const getIdx = (r: number, c: number) => r * SIZE + c;

    const process = (line: number[]) => {
        // Filter zeros
        let filtered = line.filter(v => v !== 0);
        // Merge
        for(let i=0; i<filtered.length-1; i++) {
            if(filtered[i] === filtered[i+1]) {
                filtered[i] *= 2;
                addedScore += filtered[i];
                filtered.splice(i+1, 1);
            }
        }
        // Pad zeros
        while(filtered.length < SIZE) filtered.push(0);
        return filtered;
    };

    if (direction === 'left' || direction === 'right') {
        for(let r=0; r<SIZE; r++) {
            let row = [];
            for(let c=0; c<SIZE; c++) row.push(newBoard[getIdx(r, c)]);
            if(direction === 'right') row.reverse();
            
            let newRow = process(row);
            if(direction === 'right') newRow.reverse();
            
            for(let c=0; c<SIZE; c++) {
                if(newBoard[getIdx(r, c)] !== newRow[c]) moved = true;
                newBoard[getIdx(r, c)] = newRow[c];
            }
        }
    } else {
        for(let c=0; c<SIZE; c++) {
            let col = [];
            for(let r=0; r<SIZE; r++) col.push(newBoard[getIdx(r, c)]);
            if(direction === 'down') col.reverse();

            let newCol = process(col);
            if(direction === 'down') newCol.reverse();

            for(let r=0; r<SIZE; r++) {
                if(newBoard[getIdx(r, c)] !== newCol[r]) moved = true;
                newBoard[getIdx(r, c)] = newCol[r];
            }
        }
    }

    if (moved) {
        addRandomTile(newBoard);
        setBoard(newBoard);
        setScore(s => s + addedScore);
        if(!newBoard.includes(0)) {
            setGameOver(true); 
        }
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if(e.key === 'ArrowUp') move('up');
    if(e.key === 'ArrowDown') move('down');
    if(e.key === 'ArrowLeft') move('left');
    if(e.key === 'ArrowRight') move('right');
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [board, gameOver]);

  const getTileColor = (val: number) => {
      const colors: {[key: number]: string} = {
          2: 'bg-orange-100 text-orange-800',
          4: 'bg-orange-200 text-orange-800',
          8: 'bg-orange-300 text-white',
          16: 'bg-orange-400 text-white',
          32: 'bg-orange-500 text-white',
          64: 'bg-orange-600 text-white',
          128: 'bg-yellow-500 text-white',
          256: 'bg-yellow-600 text-white',
          512: 'bg-red-500 text-white',
          1024: 'bg-red-600 text-white',
          2048: 'bg-purple-600 text-white'
      }
      return colors[val] || 'bg-slate-900 text-white';
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-50 p-4 touch-none">
       <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
          <div className="flex justify-between items-center mb-6">
             <div>
                <h2 className="font-bold text-2xl text-orange-500">2048</h2>
                <p className="text-sm text-slate-500 font-bold">得分: {score}</p>
             </div>
             <div className="flex gap-2">
                 <button onClick={initGame} className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><RefreshCcw /></button>
                 <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><CloseIcon /></button>
             </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2 bg-slate-200 p-2 rounded-xl aspect-square">
             {board.map((val, i) => (
                <div key={i} className={`flex items-center justify-center font-bold text-2xl rounded-lg transition-all duration-200
                    ${val === 0 ? 'bg-slate-300' : getTileColor(val)}
                `}>
                    {val !== 0 && val}
                </div>
             ))}
          </div>
          
          {gameOver && <div className="text-center mt-4 text-rose-500 font-bold bg-rose-50 p-2 rounded-lg">游戏结束 - 无法移动</div>}
          
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-[200px] mx-auto">
             <div />
             <button className="h-14 w-14 flex items-center justify-center bg-orange-100 text-orange-600 rounded-xl shadow-sm active:bg-orange-200" onClick={()=>move('up')}><ArrowUp/></button>
             <div />
             <button className="h-14 w-14 flex items-center justify-center bg-orange-100 text-orange-600 rounded-xl shadow-sm active:bg-orange-200" onClick={()=>move('left')}><ArrowLeft/></button>
             <button className="h-14 w-14 flex items-center justify-center bg-orange-100 text-orange-600 rounded-xl shadow-sm active:bg-orange-200" onClick={()=>move('down')}><ArrowDown/></button>
             <button className="h-14 w-14 flex items-center justify-center bg-orange-100 text-orange-600 rounded-xl shadow-sm active:bg-orange-200" onClick={()=>move('right')}><ArrowRight/></button>
          </div>
       </div>
    </div>
  );
};