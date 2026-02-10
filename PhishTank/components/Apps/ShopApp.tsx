
import React from 'react';
import { X, ShoppingBag, Smartphone, Shield, Zap, Lock, Check } from 'lucide-react';

interface ShopAppProps {
  onBack: () => void;
  cash: number;
  inventory: string[];
  onBuy: (id: string, cost: number, type: 'wallpaper' | 'upgrade', value: string) => void;
  onEquip: (id: string, value: string) => void;
  currentWallpaper: string;
}

const WALLPAPERS = [
    { id: 'wp_default', name: 'Cyber Blue', cost: 0, url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop' },
    { id: 'wp_matrix', name: 'The Matrix', cost: 500, url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop' },
    { id: 'wp_neon', name: 'Neon City', cost: 1200, url: 'https://images.unsplash.com/photo-1565214975484-3cfa9e56f914?q=80&w=1000&auto=format&fit=crop' },
    { id: 'wp_hacker', name: 'Red Ops', cost: 2500, url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop' },
    { id: 'wp_gold', name: 'Executive Gold', cost: 5000, url: 'https://images.unsplash.com/photo-1605218427306-635ba2439af2?q=80&w=1000&auto=format&fit=crop' },
];

const UPGRADES = [
    { id: 'upg_firewall', name: 'Firewall v2.0', desc: 'Auto-blocks 10% of scams.', cost: 3000, icon: Shield },
    { id: 'upg_mining', name: 'Background Miner', desc: 'Passive income (+$5/min).', cost: 4500, icon: Zap },
];

export const ShopApp: React.FC<ShopAppProps> = ({ onBack, cash, inventory, onBuy, onEquip, currentWallpaper }) => {
  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900">
      <div className="pt-12 pb-4 px-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onBack}><X size={24} className="text-pink-600" /></button>
        <h1 className="font-bold text-lg flex items-center gap-2"><ShoppingBag size={20} className="text-pink-600"/> CyberStore</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        
        {/* Cash Header */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl p-6 text-white mb-6 shadow-lg">
            <p className="text-pink-100 text-xs font-bold uppercase tracking-wider">Available Funds</p>
            <h2 className="text-3xl font-black">${cash.toLocaleString()}</h2>
        </div>

        {/* Wallpapers */}
        <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2"><Smartphone size={18}/> Wallpapers</h3>
        <div className="grid grid-cols-2 gap-3 mb-8">
            {WALLPAPERS.map(wp => {
                const owned = inventory.includes(wp.id) || wp.cost === 0;
                const equipped = currentWallpaper === wp.url;

                return (
                    <div key={wp.id} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm relative group">
                        <div className="h-24 bg-gray-200 bg-cover bg-center" style={{ backgroundImage: `url('${wp.url}')` }}>
                            {equipped && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><Check className="text-white" size={32}/></div>}
                        </div>
                        <div className="p-3">
                            <div className="font-bold text-xs mb-1 truncate">{wp.name}</div>
                            {owned ? (
                                <button 
                                    onClick={() => onEquip(wp.id, wp.url)}
                                    disabled={equipped}
                                    className={`w-full py-2 rounded-lg text-xs font-bold transition-colors ${equipped ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                >
                                    {equipped ? 'Active' : 'Equip'}
                                </button>
                            ) : (
                                <button 
                                    onClick={() => onBuy(wp.id, wp.cost, 'wallpaper', wp.url)}
                                    disabled={cash < wp.cost}
                                    className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors ${cash >= wp.cost ? 'bg-pink-600 text-white hover:bg-pink-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                >
                                    {cash < wp.cost && <Lock size={10}/>} ${wp.cost}
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>

        {/* System Upgrades */}
        <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2"><Zap size={18}/> System Upgrades</h3>
        <div className="space-y-3 mb-8">
            {UPGRADES.map(upg => {
                const owned = inventory.includes(upg.id);
                return (
                    <div key={upg.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                                <upg.icon size={20}/>
                            </div>
                            <div>
                                <div className="font-bold text-sm">{upg.name}</div>
                                <div className="text-xs text-slate-500">{upg.desc}</div>
                            </div>
                        </div>
                        {owned ? (
                            <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">INSTALLED</span>
                        ) : (
                            <button 
                                onClick={() => onBuy(upg.id, upg.cost, 'upgrade', '')}
                                disabled={cash < upg.cost}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${cash >= upg.cost ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                            >
                                ${upg.cost}
                            </button>
                        )}
                    </div>
                );
            })}
        </div>

      </div>
    </div>
  );
};
