
import React, { useState } from 'react';
import { X, Shield, ShieldAlert, ShieldCheck, Loader2 } from 'lucide-react';

interface AntivirusAppProps {
  onBack: () => void;
  onClean: (amount: number) => void;
}

export const AntivirusApp: React.FC<AntivirusAppProps> = ({ onBack, onClean }) => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'infected' | 'clean'>('idle');
  const [progress, setProgress] = useState(0);
  const [threats, setThreats] = useState<string[]>([]);

  const startScan = () => {
    setStatus('scanning');
    setProgress(0);
    setThreats([]);

    let p = 0;
    const interval = setInterval(() => {
      p += 2;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        finishScan();
      }
    }, 50);
  };

  const finishScan = () => {
    const foundThreats = [];
    if (Math.random() > 0.3) foundThreats.push("Trojan.Win32.Agent");
    if (Math.random() > 0.5) foundThreats.push("Adware.SuperClick");
    if (Math.random() > 0.7) foundThreats.push("Spyware.KeyLog");

    if (foundThreats.length > 0) {
        setThreats(foundThreats);
        setStatus('infected');
    } else {
        setStatus('clean');
    }
  };

  const cleanThreats = () => {
      onClean(threats.length * 50);
      setStatus('clean');
      setThreats([]);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      <div className="pt-12 pb-4 px-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onBack}><X size={24} /></button>
        <h1 className="font-bold text-lg flex items-center gap-2"><Shield size={20} className="text-blue-400"/> CyberGuard AV</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
        
        {status === 'idle' && (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                <div className="w-40 h-40 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border-4 border-blue-500/30">
                    <Shield size={64} className="text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">System Protected</h2>
                <p className="text-gray-400 mb-8 max-w-xs">Last scan was 2 days ago. Run a diagnostic to ensure system integrity.</p>
                <button onClick={startScan} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg active:scale-95 transition-all w-full max-w-xs">
                    SCAN NOW
                </button>
            </div>
        )}

        {status === 'scanning' && (
             <div className="flex flex-col items-center w-full">
                <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                    <Loader2 size={80} className="text-blue-400 animate-spin absolute" />
                    <span className="font-bold text-xl">{progress}%</span>
                </div>
                <h2 className="text-xl font-bold mb-2 animate-pulse">Scanning Files...</h2>
                <p className="text-gray-400 font-mono text-xs">/usr/bin/system/core...</p>
             </div>
        )}

        {status === 'infected' && (
            <div className="flex flex-col items-center w-full">
                <div className="w-40 h-40 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border-4 border-red-500/30 animate-pulse">
                    <ShieldAlert size={64} className="text-red-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-red-500">{threats.length} Threats Found!</h2>
                <div className="bg-slate-800 w-full rounded-xl p-4 mb-6 text-left space-y-2 border border-red-900/50">
                    {threats.map((t, i) => (
                        <div key={i} className="flex items-center gap-2 text-red-400 font-mono text-sm">
                            <ShieldAlert size={14}/> {t}
                        </div>
                    ))}
                </div>
                <button onClick={cleanThreats} className="bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg active:scale-95 transition-all w-full max-w-xs">
                    QUARANTINE ALL
                </button>
            </div>
        )}

        {status === 'clean' && (
             <div className="flex flex-col items-center w-full">
                <div className="w-40 h-40 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border-4 border-green-500/30">
                    <ShieldCheck size={64} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-green-400">No Threats Found</h2>
                <p className="text-gray-400 mb-8">Your device is secure.</p>
                <button onClick={() => setStatus('idle')} className="bg-slate-700 text-white px-8 py-3 rounded-full font-bold shadow-lg active:scale-95 transition-all w-full max-w-xs">
                    Done
                </button>
             </div>
        )}

      </div>
    </div>
  );
};
