import { useEffect, useState } from 'react';
import { TrendingUp, Activity, BarChart3 } from 'lucide-react';

export function AnimatedTradingLogo() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(prev => (prev + 1) % 3);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-600 opacity-20 blur-md animate-pulse" />
      
      {/* Main container */}
      <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 p-[2px] overflow-hidden">
        {/* Scanline effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent animate-pulse" />
        
        {/* Inner background */}
        <div className="w-full h-full bg-slate-950 rounded-md flex items-center justify-center relative overflow-hidden">
          {/* Animated chart bars */}
          <div className="absolute inset-0 flex items-end justify-center gap-[2px] px-1.5 pb-1.5">
            <div 
              className="w-1 bg-gradient-to-t from-green-500 to-green-400 rounded-sm transition-all duration-300"
              style={{ height: tick === 0 ? '60%' : tick === 1 ? '40%' : '70%' }}
            />
            <div 
              className="w-1 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-sm transition-all duration-300"
              style={{ height: tick === 0 ? '45%' : tick === 1 ? '75%' : '50%' }}
            />
            <div 
              className="w-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-sm transition-all duration-300"
              style={{ height: tick === 0 ? '80%' : tick === 1 ? '55%' : '65%' }}
            />
            <div 
              className="w-1 bg-gradient-to-t from-purple-500 to-purple-400 rounded-sm transition-all duration-300"
              style={{ height: tick === 0 ? '50%' : tick === 1 ? '85%' : '45%' }}
            />
          </div>
          
          {/* Overlay icon with neon glow */}
          <div className="relative z-10">
            <TrendingUp className="w-5 h-5 text-cyan-400 neon-glow-blue" />
          </div>
        </div>
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-1 h-1 bg-cyan-400 rounded-full" />
      <div className="absolute top-0 right-0 w-1 h-1 bg-blue-400 rounded-full" />
      <div className="absolute bottom-0 left-0 w-1 h-1 bg-blue-400 rounded-full" />
      <div className="absolute bottom-0 right-0 w-1 h-1 bg-cyan-400 rounded-full" />
    </div>
  );
}
