import React, { useState } from 'react';
import { CITIES } from './constants';
import ClockCard from './components/ClockCard';
import { Globe2, Info } from 'lucide-react';

const App: React.FC = () => {
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white relative overflow-x-hidden selection:bg-fuchsia-500/30">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-[#1a103c] to-slate-900 animate-gradient-xy -z-10"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_50%)] pointer-events-none -z-10"></div>

      {/* Main Container */}
      <main className="container mx-auto px-4 py-8 md:py-12 min-h-screen flex flex-col">
        
        {/* Header Section */}
        <header className="mb-12 md:mb-16 text-center relative">
          <div className="inline-flex items-center justify-center p-3 mb-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl">
            <Globe2 className="w-6 h-6 text-fuchsia-300 mr-2" />
            <span className="text-xs font-bold tracking-[0.3em] text-fuchsia-100 uppercase">Global Chronometer</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/60 drop-shadow-2xl mb-4">
            Terra Tempus
          </h1>
          <p className="text-lg md:text-xl text-white/50 font-serif-display italic max-w-2xl mx-auto">
            "Time is the most valuable thing a man can spend."
          </p>
        </header>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 pb-20">
          {CITIES.map((city) => (
            <ClockCard key={city.id} city={city} />
          ))}
        </div>

        {/* Footer / About (Sticky) */}
        <div className={`fixed bottom-0 left-0 w-full bg-slate-900/80 backdrop-blur-xl border-t border-white/10 transition-transform duration-500 ease-in-out z-50 ${isFooterVisible ? 'translate-y-0' : 'translate-y-[calc(100%-3rem)]'}`}>
           <div className="container mx-auto px-4">
             <button 
                onClick={() => setIsFooterVisible(!isFooterVisible)}
                className="w-full flex justify-center pt-3 pb-3 group cursor-pointer outline-none"
             >
               <div className="w-12 h-1 bg-white/20 rounded-full group-hover:bg-white/40 transition-colors"></div>
             </button>
             
             <div className="py-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-white/60 text-sm">
                <div>
                  <h3 className="text-white font-cinzel text-lg mb-2">About Chronos</h3>
                  <p>A conceptual high-fidelity world clock dashboard designed for ambient displays. Synchronized with IANA timezones.</p>
                </div>
                <div>
                   <h3 className="text-white font-cinzel text-lg mb-2">Philosophy</h3>
                   <p>Combining utilitarian data with high-end digital art aesthetics to create a calming, informative visual experience.</p>
                </div>
                <div className="flex flex-col items-start md:items-end">
                   <div className="flex items-center gap-2 mb-2">
                     <Info className="w-4 h-4" />
                     <span>Version 1.0.0</span>
                   </div>
                   <p className="text-xs">Built with React, TypeScript & Tailwind</p>
                </div>
             </div>
           </div>
        </div>

      </main>
    </div>
  );
};

export default App;
