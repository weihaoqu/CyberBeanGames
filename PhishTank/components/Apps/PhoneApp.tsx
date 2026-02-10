import React, { useEffect, useState } from 'react';
import { CallState } from '../../types';
import { Phone, PhoneOff, Mic, MicOff, Volume2 } from 'lucide-react';

interface PhoneAppProps {
  callState: CallState;
  onHangup: () => void;
  onAnswer: () => void;
  micVolume?: number; 
  onBack?: () => void;
}

export const PhoneApp: React.FC<PhoneAppProps> = ({ callState, onHangup, onAnswer, micVolume = 0, onBack }) => {
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [durationStr, setDurationStr] = useState("00:00");
  const [waves, setWaves] = useState<number[]>([10, 10, 10, 10, 10, 10]);

  useEffect(() => {
    let interval: any;
    if (callState.status === 'connected') {
      const startTime = Date.now();
      interval = setInterval(() => {
        const diff = Math.floor((Date.now() - startTime) / 1000);
        const mins = Math.floor(diff / 60).toString().padStart(2, '0');
        const secs = (diff % 60).toString().padStart(2, '0');
        setDurationStr(`${mins}:${secs}`);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [callState.status]);

  // Update Visualizer based on Mic Volume
  useEffect(() => {
      if (callState.status === 'connected') {
          // Map single volume value to 6 bars with random variance
          const baseHeight = 10 + (micVolume * 40); // Base height + volume boost
          setWaves([
              baseHeight + Math.random() * 5,
              baseHeight + Math.random() * 10,
              baseHeight + Math.random() * 15,
              baseHeight + Math.random() * 15,
              baseHeight + Math.random() * 10,
              baseHeight + Math.random() * 5,
          ]);
      }
  }, [micVolume, callState.status]);

  // --- 1. INCOMING CALL SCREEN ---
  if (callState.status === 'incoming') {
    return (
      <div className="h-full w-full bg-slate-900 relative flex flex-col items-center justify-between py-10 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-md z-0"></div>
        
        <div className="z-10 flex flex-col items-center mt-8 w-full flex-1 justify-center">
          <div className="flex flex-col items-center">
             <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4 shadow-xl">
                <span className="text-4xl text-gray-500 font-bold">{callState.callerName.charAt(0)}</span>
             </div>
             <h2 className="text-2xl font-bold text-white mb-1 text-center px-4 leading-tight">{callState.callerName}</h2>
             <p className="text-gray-300 text-sm">PhishGuard Audio...</p>
          </div>
        </div>

        <div className="z-10 w-full px-8 flex justify-between items-center mb-8">
          <div className="flex flex-col items-center gap-2">
            <button onClick={onHangup} className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-all active:scale-95">
              <PhoneOff size={32} color="white" fill="white" />
            </button>
            <span className="text-white text-xs font-medium">Decline</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <button onClick={onAnswer} className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-all animate-pulse active:scale-95">
              <Phone size={32} color="white" fill="white" />
            </button>
            <span className="text-white text-xs font-medium">Accept</span>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. ACTIVE CALL SCREEN ---
  if (callState.status === 'connected') {
    return (
      <div className="h-full w-full bg-gradient-to-b from-gray-800 to-gray-900 flex flex-col items-center py-6 text-white overflow-hidden">
        
        {/* Top Section: Info & Viz */}
        <div className="flex-1 flex flex-col items-center justify-center w-full px-6 min-h-0">
          <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center mb-3 shadow-inner shrink-0">
               <span className="text-3xl text-white font-bold">{callState.callerName.charAt(0)}</span>
          </div>
          <h2 className="text-2xl font-semibold mb-1 text-center truncate w-full">{callState.callerName}</h2>
          <p className="text-gray-400 mb-4 font-mono text-sm">{durationStr}</p>
          
          {/* Audio Visualizer */}
          <div className="flex items-center justify-center gap-1.5 h-12 w-full mb-2">
               {waves.map((h, i) => (
                   <div key={i} className="w-2 bg-green-400 rounded-full transition-all duration-75 ease-in-out opacity-80 shadow-[0_0_10px_rgba(74,222,128,0.5)]" style={{ height: `${Math.min(48, h)}px`}}></div>
               ))}
          </div>
        </div>
  
        {/* Controls Grid */}
        <div className="w-full max-w-[320px] px-6 mb-4 shrink-0">
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-12 px-8">
              <ControlButton 
                  icon={<MicOff size={24}/>} 
                  label="Mute" 
                  active={muted} 
                  onClick={() => setMuted(!muted)} 
              />
              <ControlButton 
                  icon={<Volume2 size={24}/>} 
                  label="Speaker" 
                  active={speaker}
                  onClick={() => setSpeaker(!speaker)}
              />
          </div>
          
          <div className="flex justify-center">
              <button onClick={onHangup} className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.5)] hover:bg-red-600 transition-all active:scale-95">
                  <PhoneOff size={40} color="white" fill="white" />
              </button>
          </div>
        </div>
      </div>
    );
  }

  // If no active call, show nothing (or handled by parent to close app)
  return null;
};

const ControlButton = ({ icon, label, active, onClick, disabled }: any) => (
    <button 
        onClick={onClick}
        disabled={disabled}
        className={`flex flex-col items-center justify-center gap-2 group ${disabled ? 'opacity-30' : 'opacity-100'}`}
    >
        <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${active ? 'bg-white text-gray-900' : 'bg-white/10 text-white hover:bg-white/20'}`}>
            {icon}
        </div>
        <span className="text-xs text-white font-medium">{label}</span>
    </button>
);