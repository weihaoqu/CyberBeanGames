
import React, { useState, useEffect } from 'react';
import { Wifi } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="absolute top-0 w-full h-[6%] px-6 pt-2 flex justify-between items-center text-white z-40 text-xs font-medium select-none pointer-events-none">
      <span className="ml-2">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      <div className="flex gap-2 items-center mr-2">
        <Wifi size={14} />
        {/* Realistic Battery Icon */}
        <div className="w-6 h-3 border border-white/80 rounded-[3px] p-[1px] relative flex items-center">
            <div className="h-full bg-white w-[80%] rounded-[1px]"></div>
            <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-[2px] h-1.5 bg-white/80 rounded-r-[1px]"></div>
        </div>
      </div>
    </div>
  );
};
