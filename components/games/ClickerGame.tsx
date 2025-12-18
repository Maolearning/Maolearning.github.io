import * as React from 'react';
import { useState, useEffect } from 'react';
import { X as CloseIcon, HardDrive, Zap } from 'lucide-react';

export const ClickerGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [bits, setBits] = useState(0);
  const [rate, setRate] = useState(0);
  const [upgradeCost, setUpgradeCost] = useState(10);

  useEffect(() => {
    if(rate === 0) return;
    const timer = setInterval(() => {
        setBits(b => b + rate);
    }, 1000);
    return () => clearInterval(timer);
  }, [rate]);

  const click = () => {
    setBits(b => b + 1);
    // Visual pop effect could go here
  };

  const buyUpgrade = () => {
    if(bits >= upgradeCost) {
        setBits(b => b - upgradeCost);
        setRate(r => r + 1);
        setUpgradeCost(c => Math.floor(c * 1.5));
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-50 p-4 text-slate-800">
       <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-xl border border-slate-200 flex flex-col items-center">
           <div className="w-full flex justify-end mb-4"><button onClick={onBack}><CloseIcon className="text-slate-400"/></button></div>
           
           <h2 className="text-2xl font-bold text-amber-500 mb-2">疯狂矿工</h2>
           <div className="text-4xl font-black text-slate-800 mb-2">{Math.floor(bits)} <span className="text-sm text-slate-400 font-medium">金币</span></div>
           <div className="text-sm font-bold text-amber-500 bg-amber-50 px-3 py-1 rounded-full mb-8">每秒: {rate} 金币</div>

           <button 
             onClick={click}
             className="w-32 h-32 rounded-full border-4 border-amber-100 bg-amber-500 hover:bg-amber-400 active:scale-95 transition-all flex flex-col items-center justify-center shadow-lg hover:shadow-amber-200 mb-8 group"
           >
              <HardDrive size={40} className="text-white mb-1" />
              <span className="text-xs font-bold text-white">点击</span>
           </button>

           <button 
             onClick={buyUpgrade}
             disabled={bits < upgradeCost}
             className={`w-full py-3 px-4 rounded-xl border-2 flex justify-between items-center transition-all shadow-sm
                ${bits >= upgradeCost ? 'border-amber-500 bg-amber-50 text-amber-700 hover:bg-amber-100 cursor-pointer' : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'}
             `}
           >
              <div className="flex items-center gap-2">
                  <Zap size={18} className={bits >= upgradeCost ? 'fill-current' : ''} />
                  <span className="font-bold text-sm">升级设备</span>
              </div>
              <span className="font-medium text-sm">花费: {upgradeCost}</span>
           </button>
       </div>
    </div>
  );
};