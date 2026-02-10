
import React, { useState } from 'react';
import { X, Globe, Power, Shield, MapPin } from 'lucide-react';

interface VPNAppProps {
  onBack: () => void;
  onConnect: (bonus: number) => void;
}

export const VPNApp: React.FC<VPNAppProps> = ({ onBack, onConnect }) => {
  const [connected, setConnected] = useState(false);
  const [location, setLocation] = useState("Exposed (Real IP)");
  
  const toggleVPN = () => {
      if (!connected) {
          setTimeout(() => {
              setConnected(true);
              setLocation("Switzerland (Secure)");
              onConnect(10);
          }, 1500);
      } else {
          setConnected(false);
          setLocation("Exposed (Real IP)");
      }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white relative overflow-hidden">
      {/* World Map Background Effect */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center pointer-events-none"></div>

      <div className="pt-12 pb-4 px-4 bg-transparent z-10 flex items-center justify-between sticky top-0">
        <button onClick={onBack}><X size={24} /></button>
        <h1 className="font-bold text-lg flex items-center gap-2"><Globe size={20} className="text-cyan-400"/> CyberVPN</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 z-10 overflow-y-auto">
        
        <div className={`w-48 h-48 shrink-0 rounded-full border-8 flex items-center justify-center mb-8 transition-all duration-500 shadow-[0_0_50px_rgba(0,0,0,0.5)] ${connected ? 'border-green-500 bg-green-500/10 shadow-[0_0_50px_rgba(34,197,94,0.3)]' : 'border-slate-700 bg-slate-800'}`}>
            <button 
                onClick={toggleVPN}
                className={`w-32 h-32 rounded-full flex items-center justify-center transition-all active:scale-95 ${connected ? 'bg-green-500 text-white' : 'bg-slate-600 text-slate-400 hover:bg-slate-500 hover:text-white'}`}
            >
                <Power size={48} />
            </button>
        </div>

        <div className="text-center mb-10 shrink-0">
            <h2 className={`text-2xl font-bold mb-1 ${connected ? 'text-green-400' : 'text-slate-400'}`}>
                {connected ? "CONNECTED" : "DISCONNECTED"}
            </h2>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400 bg-black/30 px-4 py-2 rounded-full backdrop-blur-md">
                <MapPin size={14}/> {location}
            </div>
        </div>

        <div className="w-full bg-slate-800/80 backdrop-blur-md p-4 rounded-xl border border-slate-700 shrink-0">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-cyan-900/50 rounded-lg flex items-center justify-center text-cyan-400">
                    <Shield size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-sm">Connection Status</h3>
                    <p className="text-xs text-gray-400">{connected ? "Traffic Encrypted (AES-256)" : "Traffic Unsecured"}</p>
                </div>
            </div>
            <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-1000 ${connected ? 'w-full bg-cyan-400' : 'w-[5%] bg-red-500'}`}></div>
            </div>
        </div>
      </div>
    </div>
  );
};
