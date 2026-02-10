
import React, { useState, useEffect } from 'react';
import { X, Unlock, RefreshCcw, AlertTriangle } from 'lucide-react';

interface DecryptoAppProps {
  onBack: () => void;
  onWin: (amount: number) => void;
}

const WORDS = [
    { word: "PHISHING", hint: "Email scam" },
    { word: "MALWARE", hint: "Bad software" },
    { word: "FIREWALL", hint: "Network shield" },
    { word: "ENCRYPTION", hint: "Hidden data" },
    { word: "PASSWORD", hint: "Secret key" },
    { word: "VIRUS", hint: "Infects files" },
    { word: "IDENTITY", hint: "Who you are" },
    { word: "NETWORK", hint: "Connected computers" },
    { word: "HACKER", hint: "Breaches security" },
    { word: "COOKIES", hint: "Browser data" },
    { word: "RANSOMWARE", hint: "Locks files for money" },
    { word: "SPYWARE", hint: "Watches you" },
    { word: "BOTNET", hint: "Zombie computers" },
    { word: "TROJAN", hint: "Hidden threat" },
    { word: "ADMIN", hint: "Super user" },
    { word: "LOGIN", hint: "Sign in" },
    { word: "SAFE", hint: "Not dangerous" },
    { word: "CODE", hint: "Programming language" },
    { word: "TOKEN", hint: "Digital coin" },
    { word: "SECURE", hint: "Protected" },
    { word: "DATA", hint: "Information" },
    { word: "WIFI", hint: "Wireless internet" },
    { word: "CLICK", hint: "Mouse action" },
    { word: "LINK", hint: "URL address" }
];

export const DecryptoApp: React.FC<DecryptoAppProps> = ({ onBack, onWin }) => {
  const [current, setCurrent] = useState({ word: "", hint: "", scrambled: "" });
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [streak, setStreak] = useState(0);
  const [shake, setShake] = useState(false);

  const shuffle = (str: string) => {
      const arr = str.split('');
      for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr.join('');
  };

  const nextWord = () => {
      const w = WORDS[Math.floor(Math.random() * WORDS.length)];
      let s = shuffle(w.word);
      while(s === w.word) s = shuffle(w.word);
      setCurrent({ word: w.word, hint: w.hint, scrambled: s });
      setInput("");
      setMessage("");
  };

  useEffect(() => { nextWord(); }, []);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (input.toUpperCase().trim() === current.word) {
          const reward = 50 + (streak * 10);
          onWin(reward);
          setStreak(s => s + 1);
          setMessage(`CORRECT! +$${reward}`);
          setTimeout(nextWord, 1000);
      } else {
          // PENALTY
          onWin(-20);
          setMessage("WRONG! -$20");
          setStreak(0);
          setShake(true);
          setTimeout(() => setShake(false), 500);
          setInput("");
      }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-green-400 font-mono">
      <div className="pt-12 pb-4 px-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onBack}><X size={24} className="text-green-500" /></button>
        <h1 className="font-bold text-lg flex items-center gap-2"><Unlock size={20}/> DECRYPTO</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
        
        <div className="mb-8 text-center">
            <span className="text-xs text-slate-500 uppercase tracking-widest">Streak: {streak}</span>
            <div className="text-4xl font-bold tracking-[0.2em] mb-2 break-all text-white min-h-[3rem]">
                {current.scrambled}
            </div>
            <div className="text-sm text-slate-400 bg-slate-800 px-3 py-1 rounded-full inline-block">
                Hint: {current.hint}
            </div>
        </div>

        <form onSubmit={handleSubmit} className={`w-full max-w-xs space-y-4 ${shake ? 'animate-shake' : ''}`}>
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-slate-800 border-2 border-slate-700 p-4 rounded-xl text-center text-xl text-white uppercase outline-none focus:border-green-500 transition-colors placeholder:text-slate-600"
                placeholder="TYPE ANSWER"
                autoFocus
            />
            
            <button 
                type="submit"
                className="w-full bg-green-600 text-black font-bold py-4 rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.4)] active:scale-95 transition-transform"
            >
                DECRYPT
            </button>
        </form>

        <div className={`h-8 mt-6 font-bold text-center text-lg ${message.includes('WRONG') ? 'text-red-500' : 'text-green-400'}`}>
            {message}
        </div>

        <button onClick={nextWord} className="mt-8 text-slate-500 flex items-center gap-2 text-xs hover:text-white">
            <RefreshCcw size={14}/> Skip Word
        </button>

      </div>
      <style>{`
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
};
