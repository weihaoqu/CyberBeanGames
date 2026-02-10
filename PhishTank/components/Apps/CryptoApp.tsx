
import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Star, Lock } from 'lucide-react';

interface CryptoAppProps {
  onBack: () => void;
  cash: number;
  onTrade: (amount: number) => void;
  cyberCoins: number;
  cyberLevel: number;
  onBuyCoin: () => void;
}

export const CryptoApp: React.FC<CryptoAppProps> = ({ onBack, cash, onTrade, cyberCoins, cyberLevel, onBuyCoin }) => {
  const [btcPrice, setBtcPrice] = useState(10000);
  const [portfolio, setPortfolio] = useState(0); // Amount of BTC
  const [history, setHistory] = useState<number[]>([10000, 10100, 9900, 10200, 10050]);
  const [news, setNews] = useState("Market Stable");

  const COIN_PRICE = 50000;

  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 500;
      setBtcPrice(p => {
         const newP = Math.max(1000, p + change);
         setHistory(h => [...h.slice(-10), newP]);
         return newP;
      });

      if (Math.random() > 0.9) {
          const boom = Math.random() > 0.5;
          setBtcPrice(p => boom ? p * 1.1 : p * 0.9);
          setNews(boom ? "Whale buying detected!" : "Regulatory crackdown rumors!");
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleBuy = () => {
      if (cash >= btcPrice) {
          onTrade(-btcPrice);
          setPortfolio(p => p + 1);
      }
  };

  const handleSell = () => {
      if (portfolio >= 1) {
          onTrade(btcPrice);
          setPortfolio(p => p - 1);
      }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      <div className="pt-12 pb-4 px-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onBack}><ArrowLeft size={24} /></button>
        <h1 className="font-bold text-lg">CryptoZone</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 p-6 flex flex-col overflow-y-auto">
        
        {/* Cyber Coin / Win Section */}
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-6 rounded-2xl border-2 border-indigo-500/50 mb-6 relative overflow-hidden shadow-lg">
             <div className="absolute top-0 right-0 p-4 opacity-10"><Star size={100}/></div>
             <div className="relative z-10">
                 <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-indigo-100 flex items-center gap-2">
                        Cyber Level: <span className="text-yellow-400 text-2xl">{cyberLevel}</span>
                    </h2>
                    <span className="bg-indigo-950/50 px-2 py-1 rounded text-xs text-indigo-300">Owned: {cyberCoins}</span>
                 </div>
                 
                 <p className="text-sm text-indigo-200 mb-4 font-medium border-l-2 border-yellow-400 pl-3">
                     GOAL: Accumulate <span className="text-white font-bold">$50,000</span> cash to buy 1 Cyber Coin and win the game!
                 </p>
                 
                 <div className="flex items-center justify-between mt-2 bg-black/20 p-3 rounded-xl">
                    <div className="flex flex-col">
                         <span className="text-[10px] text-indigo-300 uppercase tracking-wider">Coin Price</span>
                         <span className="text-lg font-mono font-bold text-white">${COIN_PRICE.toLocaleString()}</span>
                    </div>
                    <button 
                        onClick={onBuyCoin}
                        disabled={cash < COIN_PRICE}
                        className={`px-4 py-3 rounded-lg font-bold text-xs flex items-center gap-2 transition-all ${cash >= COIN_PRICE ? 'bg-yellow-400 text-black shadow-lg hover:scale-105 hover:bg-yellow-300' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                    >
                        {cash < COIN_PRICE ? <Lock size={14}/> : <Star size={14} className="fill-black"/>}
                        BUY COIN
                    </button>
                 </div>
             </div>
        </div>

        {/* Regular Trading */}
        <div className="bg-slate-800 p-4 rounded-xl mb-6 border border-slate-700">
            <p className="text-xs text-gray-400">Bitcoin Price</p>
            <h2 className="text-3xl font-bold flex items-center gap-2">
                ${Math.floor(btcPrice).toLocaleString()}
                <span className="text-xs font-normal text-gray-400 bg-slate-700 px-2 py-1 rounded-full">{news}</span>
            </h2>
        </div>

        {/* Fake Chart */}
        <div className="h-32 flex items-end gap-1 mb-8">
            {history.map((h, i) => {
                const height = Math.min(100, Math.max(10, ((h - 40000) / 10000) * 100));
                return (
                    <div key={i} className={`flex-1 rounded-t-sm transition-all duration-500 ${h > history[i-1] ? 'bg-green-500' : 'bg-red-500'}`} style={{ height: `${height}%`}}></div>
                )
            })}
        </div>

        <div className="flex-1">
            <p className="text-center text-gray-400 mb-2">Portfolio: {portfolio} BTC</p>
            <div className="flex gap-4">
                <button onClick={handleBuy} className="flex-1 bg-green-600 py-4 rounded-xl font-bold active:scale-95 transition-transform flex flex-col items-center shadow-lg hover:bg-green-500">
                    <TrendingUp />
                    Buy 1 BTC
                </button>
                <button onClick={handleSell} className="flex-1 bg-red-600 py-4 rounded-xl font-bold active:scale-95 transition-transform flex flex-col items-center shadow-lg hover:bg-red-500">
                    <TrendingDown />
                    Sell 1 BTC
                </button>
            </div>
            <p className="text-center text-xs text-gray-500 mt-4 font-mono">Wallet Cash: ${cash.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};
