
import React, { useState, useEffect, useRef } from 'react';
import { X, Terminal } from 'lucide-react';

interface TerminalAppProps {
  onBack: () => void;
  onWin: (amount: number) => void;
}

export const TerminalApp: React.FC<TerminalAppProps> = ({ onBack, onWin }) => {
  const [logs, setLogs] = useState<string[]>(["> System initialized...", "> Listening for threats..."]);
  const [activeThreat, setActiveThreat] = useState<string | null>(null);
  const [command, setCommand] = useState("");
  const [progress, setProgress] = useState(0);

  const commands = {
      "SQL_INJECTION": "patch --sql",
      "DDOS_ATTACK": "firewall --enable",
      "MALWARE_UPLOAD": "scan --delete"
  };

  useEffect(() => {
      const t = setInterval(() => {
          if (!activeThreat && Math.random() > 0.7) {
              const threats = Object.keys(commands);
              const threat = threats[Math.floor(Math.random() * threats.length)];
              setActiveThreat(threat);
              setLogs(l => [...l, `> ALERT: ${threat} DETECTED!`]);
              setProgress(0);
          }
      }, 2000);
      return () => clearInterval(t);
  }, [activeThreat]);

  useEffect(() => {
      let t: any;
      if (activeThreat) {
          t = setInterval(() => {
              setProgress(p => {
                  if (p >= 100) {
                      setLogs(l => [...l, "> SYSTEM COMPROMISED. REBOOTING..."]);
                      setActiveThreat(null);
                      return 0;
                  }
                  return p + 5;
              });
          }, 200);
      }
      return () => clearInterval(t);
  }, [activeThreat]);

  const handleCommand = (e: React.FormEvent) => {
      e.preventDefault();
      setLogs(l => [...l, `$ ${command}`]);
      
      if (activeThreat && command === (commands as any)[activeThreat]) {
          setLogs(l => [...l, "> Threat Neutralized. Bonus Earned."]);
          onWin(50);
          setActiveThreat(null);
      } else if (activeThreat) {
           setLogs(l => [...l, "> Invalid patch command!"]);
      }
      setCommand("");
  };

  return (
    <div className="flex flex-col h-full bg-black text-green-500 font-mono text-sm">
      <div className="pt-12 pb-2 px-4 border-b border-green-900/50 flex items-center justify-between sticky top-0 z-10 bg-black">
        <button onClick={onBack}><X size={20} /></button>
        <span className="font-bold flex items-center gap-2"><Terminal size={16}/> ROOT_ACCESS</span>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-1">
        {logs.map((log, i) => (
            <div key={i} className="break-words">{log}</div>
        ))}
        {activeThreat && (
             <div className="mt-4 border border-red-500 p-2 text-red-500 animate-pulse">
                 WARNING: {activeThreat}<br/>
                 REQUIRED: {(commands as any)[activeThreat]}<br/>
                 CRITICALITY: {progress}%
                 <div className="w-full h-1 bg-red-900 mt-1">
                     <div className="h-full bg-red-500" style={{ width: `${progress}%`}}></div>
                 </div>
             </div>
        )}
      </div>

      <form onSubmit={handleCommand} className="p-4 border-t border-green-900 bg-black">
          <div className="flex gap-2">
              <span>$</span>
              <input 
                autoFocus
                type="text" 
                value={command} 
                onChange={(e) => setCommand(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-green-500 placeholder-green-900"
                placeholder="Type command..."
              />
          </div>
      </form>
    </div>
  );
};
