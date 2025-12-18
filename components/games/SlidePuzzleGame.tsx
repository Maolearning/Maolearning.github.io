import * as React from 'react';
import { useState, useEffect } from 'react';
import { X, RefreshCcw, Trophy } from 'lucide-react';

export const SlidePuzzleGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [win, setWin] = useState(false);

  const initGame = () => {
    // 创建 1-8 和一个空位(0)
    let newTiles = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    // 打乱算法：进行足够多次的合法移动
    for (let i = 0; i < 200; i++) {
      const emptyIdx = newTiles.indexOf(0);
      const possibleMoves = getValidMoves(emptyIdx);
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      [newTiles[emptyIdx], newTiles[randomMove]] = [newTiles[randomMove], newTiles[emptyIdx]];
    }
    setTiles(newTiles);
    setMoves(0);
    setWin(false);
  };

  const getValidMoves = (idx: number) => {
    const moves = [];
    if (idx >= 3) moves.push(idx - 3); // 上
    if (idx < 6) moves.push(idx + 3);  // 下
    if (idx % 3 !== 0) moves.push(idx - 1); // 左
    if (idx % 3 !== 2) moves.push(idx + 1); // 右
    return moves;
  };

  const handleTileClick = (idx: number) => {
    if (win) return;
    const emptyIdx = tiles.indexOf(0);
    const validMoves = getValidMoves(emptyIdx);
    if (validMoves.includes(idx)) {
      const newTiles = [...tiles];
      [newTiles[emptyIdx], newTiles[idx]] = [newTiles[idx], newTiles[emptyIdx]];
      setTiles(newTiles);
      setMoves(m => m + 1);
      
      // 检查是否获胜
      if (newTiles.slice(0, 8).every((val, i) => val === i + 1)) {
        setWin(true);
      }
    }
  };

  useEffect(() => {
    initGame();
  }, []);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full"><X className="text-slate-500" /></button>
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-800">数字华容道</h2>
            <p className="text-sm text-slate-400">步数: {moves}</p>
          </div>
          <button onClick={initGame} className="p-2 hover:bg-slate-100 rounded-full"><RefreshCcw className="text-slate-500" /></button>
        </div>

        <div className="grid grid-cols-3 gap-2 aspect-square bg-slate-100 p-2 rounded-xl">
          {tiles.map((val, i) => (
            <div
              key={i}
              onClick={() => handleTileClick(i)}
              className={`flex items-center justify-center text-3xl font-bold rounded-lg transition-all duration-200 shadow-sm
                ${val === 0 
                  ? 'bg-transparent' 
                  : 'bg-white text-blue-500 border-b-4 border-slate-200 cursor-pointer hover:bg-blue-50 hover:scale-95'
                }
              `}
            >
              {val !== 0 && val}
            </div>
          ))}
        </div>

        {win && (
          <div className="mt-6 text-center animate-bounce">
            <h3 className="text-2xl font-bold text-green-500 flex items-center justify-center gap-2">
              <Trophy /> 拼图完成!
            </h3>
            <button onClick={initGame} className="mt-2 px-6 py-2 bg-blue-500 text-white rounded-full font-bold shadow-lg">再挑战一次</button>
          </div>
        )}
      </div>
    </div>
  );
};