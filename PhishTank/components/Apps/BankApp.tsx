
import React, { useState } from 'react';
import { Transaction } from '../../types';
import { X, Wallet, TrendingUp, TrendingDown, ShieldCheck, PiggyBank, ArrowRightLeft } from 'lucide-react';

interface BankAppProps {
  balance: number;
  savings: number; // New prop
  reputation: number;
  transactions: Transaction[];
  onBack: () => void;
  onTransfer: (amount: number, type: 'to_savings' | 'to_checking') => void;
}

export const BankApp: React.FC<BankAppProps> = ({ balance, savings = 0, reputation, transactions, onBack, onTransfer }) => {
  const [tab, setTab] = useState<'checking' | 'savings'>('checking');
  const [amount, setAmount] = useState('');

  const handleTransfer = () => {
      const val = parseInt(amount);
      if (isNaN(val) || val <= 0) return;
      
      if (tab === 'checking') {
          // Deposit to savings
          if (balance >= val) onTransfer(val, 'to_savings');
      } else {
          // Withdraw from savings
          if (savings >= val) onTransfer(val, 'to_checking');
      }
      setAmount('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      {/* Header */}
      <div className="pt-12 pb-4 px-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onBack}><X size={24} /></button>
        <div className="flex items-center gap-2 font-bold text-lg"><Wallet className="text-green-400"/> CyberBank</div>
        <div className="w-6"></div>
      </div>

      <div className="p-6 overflow-y-auto">
        
        {/* Account Tabs */}
        <div className="flex bg-slate-800 p-1 rounded-xl mb-6">
            <button 
                onClick={() => setTab('checking')} 
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'checking' ? 'bg-slate-600 text-white shadow' : 'text-slate-400'}`}
            >
                Checking
            </button>
            <button 
                onClick={() => setTab('savings')} 
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'savings' ? 'bg-slate-600 text-white shadow' : 'text-slate-400'}`}
            >
                Savings
            </button>
        </div>

        {/* Main Card */}
        {tab === 'checking' ? (
            <div className="bg-gradient-to-br from-green-600 to-emerald-800 rounded-2xl p-6 shadow-xl mb-6 relative overflow-hidden animate-in fade-in">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <p className="text-green-100 text-sm font-medium mb-1">Checking Balance</p>
                <h1 className="text-4xl font-bold mb-4">${balance.toLocaleString()}</h1>
                <div className="flex items-center gap-2 bg-black/20 w-fit px-3 py-1 rounded-full">
                    <ShieldCheck size={16} className="text-green-300"/>
                    <span className="text-xs font-bold text-green-100">Credit Score: {reputation}</span>
                </div>
            </div>
        ) : (
             <div className="bg-gradient-to-br from-purple-600 to-indigo-800 rounded-2xl p-6 shadow-xl mb-6 relative overflow-hidden animate-in fade-in">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="flex justify-between">
                    <p className="text-purple-100 text-sm font-medium mb-1">High Yield Savings</p>
                    <PiggyBank className="text-purple-200 opacity-50"/>
                </div>
                <h1 className="text-4xl font-bold mb-4">${savings.toLocaleString()}</h1>
                <div className="flex items-center gap-2 bg-black/20 w-fit px-3 py-1 rounded-full">
                    <TrendingUp size={16} className="text-purple-300"/>
                    <span className="text-xs font-bold text-purple-100">APY: 5.0% (Daily Payout)</span>
                </div>
            </div>
        )}

        {/* Quick Transfer */}
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-6">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                <ArrowRightLeft size={16}/> {tab === 'checking' ? 'Deposit to Savings' : 'Withdraw to Checking'}
            </h3>
            <div className="flex gap-2">
                <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount"
                    className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white outline-none focus:border-green-500"
                />
                <button 
                    onClick={handleTransfer}
                    className="bg-green-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-500 active:scale-95 transition-transform"
                >
                    {tab === 'checking' ? 'Deposit' : 'Withdraw'}
                </button>
            </div>
        </div>

        {/* History */}
        <h3 className="font-bold text-lg mb-4 text-gray-300">Transaction History</h3>
        
        <div className="space-y-3 pb-20 overflow-y-auto">
            {transactions.length === 0 && <p className="text-gray-500 text-center py-10">No recent activity.</p>}
            {[...transactions].reverse().map(t => (
                <div key={t.id} className="bg-slate-800 p-4 rounded-xl flex items-center justify-between border border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'income' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                            {t.type === 'income' ? <TrendingUp size={20}/> : <TrendingDown size={20}/>}
                        </div>
                        <div>
                            <p className="font-bold text-sm">{t.title}</p>
                            <p className="text-xs text-gray-400">{new Date(t.timestamp).toLocaleTimeString()}</p>
                        </div>
                    </div>
                    <span className={`font-mono font-bold ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                        {t.type === 'income' ? '+' : '-'}${Math.abs(t.amount)}
                    </span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
