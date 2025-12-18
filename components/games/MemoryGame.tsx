import * as React from 'react';
import { useState, useEffect } from 'react';
import { X as CloseIcon, RefreshCcw, Cpu, Disc, Globe, Server, Shield, Wifi, Radio, Zap } from 'lucide-react';

const ICONS = [Cpu, Disc, Globe, Server, Shield, Wifi, Radio, Zap];
const CARD_PAIRS = [...ICONS, ...ICONS];

export const MemoryGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [cards, setCards] = useState<{id: number, icon: any, matched: boolean, flipped: boolean}[]>([]);
  const [flippedIndex, setFlippedIndex] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    shuffleCards();
  }, []);

  const shuffleCards = () => {
    const shuffled = [...CARD_PAIRS]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({ id: index, icon, matched: false, flipped: false }));
    setCards(shuffled);
    setFlippedIndex([]);
    setMoves(0);
  };

  const handleCardClick = (index: number) => {
    if (flippedIndex.length === 2 || cards[index].flipped || cards[index].matched) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    
    const newFlipped = [...flippedIndex, index];
    setFlippedIndex(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].icon === cards[second].icon) {
        newCards[first].matched = true;
        newCards[second].matched = true;
        setCards(newCards);
        setFlippedIndex([]);
      } else {
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[first].flipped = false;
          resetCards[second].flipped = false;
          setCards(resetCards);
          setFlippedIndex([]);
        }, 1000);
      }
    }
  };

  const isWon = cards.length > 0 && cards.every(c => c.matched);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-50 p-4 text-slate-800">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
        <div className="mb-6 flex justify-between border-b border-slate-100 pb-4 items-center">
          <button onClick={onBack} className="p-2 hover:bg-slate-50 rounded-full"><CloseIcon className="text-slate-500" /></button>
          <div className="text-center">
            <h2 className="text-xl font-bold text-yellow-500">记忆翻牌</h2>
            <p className="text-sm font-medium text-slate-400">步数: {moves}</p>
          </div>
          <button onClick={shuffleCards} className="p-2 hover:bg-slate-50 rounded-full"><RefreshCcw className="text-slate-500" /></button>
        </div>

        <div className="grid grid-cols-4 gap-3 aspect-square">
          {cards.map((card, index) => (
            <div 
              key={index}
              onClick={() => handleCardClick(index)}
              className={`relative flex items-center justify-center cursor-pointer transition-all duration-500 rounded-xl shadow-sm border-b-4 transform
                 ${card.flipped || card.matched 
                 ? 'bg-yellow-100 border-yellow-300 rotate-y-180' 
                 : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {(card.flipped || card.matched) ? (
                 <card.icon className="text-yellow-500 w-8 h-8 animate-in zoom-in duration-300" />
              ) : (
                 <div className="text-slate-300 font-bold text-2xl">?</div>
              )}
            </div>
          ))}
        </div>
        
        {isWon && (
          <div className="mt-6 text-center animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">挑战成功!</h3>
            <button onClick={shuffleCards} className="px-8 py-2 bg-yellow-400 text-white font-bold rounded-full shadow-lg hover:bg-yellow-500 transition-colors">再来一局</button>
          </div>
        )}
      </div>
    </div>
  );
};