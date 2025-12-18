import * as React from 'react';
import { useState } from 'react';
import { GameConfig } from '../types';
import { Gamepad2, AlertCircle, Play } from 'lucide-react';

interface GameCardProps {
  game: GameConfig;
  onClick: (gameId: string) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onClick }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div 
      onClick={() => onClick(game.id)}
      className="group relative flex flex-col overflow-hidden bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer h-80 border border-slate-100 hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        {!imgError ? (
          <img 
            src={game.imageUrl} 
            alt={game.title} 
            onError={() => setImgError(true)}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className={`h-full w-full ${game.color} bg-opacity-20 flex items-center justify-center`}>
             <Gamepad2 size={48} className="text-slate-400 opacity-50" />
          </div>
        )}
        
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                <Play size={24} className="text-arcade-primary ml-1" fill="currentColor" />
            </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 bg-white">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-slate-800 group-hover:text-arcade-primary transition-colors">
                {game.title}
            </h3>
            <div className={`w-2 h-2 rounded-full mt-2 ${game.color.replace('bg-', 'bg-').replace('500', '400')}`}></div>
        </div>
        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {game.description}
        </p>
      </div>
    </div>
  );
};