import React, { useEffect, useState, useMemo } from 'react';
import { CityConfig, TimeData } from '../types';
import { Clock, Moon, Sun, Calendar } from 'lucide-react';

interface ClockCardProps {
  city: CityConfig;
}

const ClockCard: React.FC<ClockCardProps> = ({ city }) => {
  const [timeData, setTimeData] = useState<TimeData | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      // Formatting options
      const timeFormatter = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: city.timezone,
      });

      const dateFormatter = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        timeZone: city.timezone,
      });

      const weekdayFormatter = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        timeZone: city.timezone,
      });

      // Calculate Day/Night roughly based on hour (simple heuristic)
      // For more accuracy we'd need lat/long and suncalc, but this suffices for a visual toy
      const hourFormatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        hour12: false,
        timeZone: city.timezone,
      });
      
      const hour = parseInt(hourFormatter.format(now), 10);
      const isDaytime = hour >= 6 && hour < 18;

      setTimeData({
        time: timeFormatter.format(now),
        date: dateFormatter.format(now),
        dayOfWeek: weekdayFormatter.format(now),
        isDaytime,
        rawDate: now,
      });
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, [city.timezone]);

  // Split time into HH:MM and SS for styling
  const { mainTime, seconds } = useMemo(() => {
    if (!timeData) return { mainTime: '--:--', seconds: '--' };
    const parts = timeData.time.split(':');
    return {
      mainTime: `${parts[0]}:${parts[1]}`,
      seconds: parts[2]
    };
  }, [timeData]);

  if (!timeData) return null;

  return (
    <div className={`relative overflow-hidden group rounded-3xl border border-white/10 bg-gradient-to-br ${city.accentColor} backdrop-blur-md hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/5`}>
      {/* Abstract Background Noise/Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      
      {/* Glow Effect */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors duration-700"></div>

      <div className="relative p-8 h-full flex flex-col justify-between min-h-[220px]">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-serif-display font-medium text-white tracking-wide">{city.name}</h2>
            <p className="text-xs uppercase tracking-[0.2em] text-white/60 mt-1 font-medium">{city.country}</p>
          </div>
          <div className="p-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            {timeData.isDaytime ? (
              <Sun className="w-5 h-5 text-amber-300 animate-pulse-slow" />
            ) : (
              <Moon className="w-5 h-5 text-blue-200" />
            )}
          </div>
        </div>

        {/* Time Display */}
        <div className="mt-8">
          <div className="flex items-baseline gap-2">
            <span className="text-6xl md:text-7xl font-light tracking-tighter text-white drop-shadow-lg font-mono">
              {mainTime}
            </span>
            <span className="text-xl md:text-2xl font-light text-white/50 font-mono w-8">
              {seconds}
            </span>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex items-center gap-4 mt-6 text-sm text-white/70 border-t border-white/5 pt-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 opacity-70" />
            <span className="uppercase tracking-wider text-xs font-semibold">{timeData.dayOfWeek}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/30"></div>
          <span className="font-serif-display italic text-lg">{timeData.date}</span>
        </div>
      </div>
    </div>
  );
};

export default ClockCard;
