
import React, { useState } from 'react';
import { X, Lock, RefreshCw, Check, AlertTriangle } from 'lucide-react';

interface PasswordAppProps {
  onBack: () => void;
  onFix: (amount: number) => void;
}

export const PasswordApp: React.FC<PasswordAppProps> = ({ onBack, onFix }) => {
  const [passwords, setPasswords] = useState([
      { id: 1, site: "MyBank.com", pass: "password123", strength: "weak" },
      { id: 2, site: "SocialMedia", pass: "User@2024", strength: "medium" },
      { id: 3, site: "WorkEmail", pass: "companyName", strength: "weak" },
      { id: 4, site: "GamingAcct", pass: "Tr0ub4dour&3", strength: "strong" },
      { id: 5, site: "Netflix", pass: "monkey", strength: "weak" },
      { id: 6, site: "Amazon", pass: "iloveyou", strength: "weak" },
      { id: 7, site: "Spotify", pass: "123456", strength: "weak" },
      { id: 8, site: "Gmail", pass: "admin", strength: "weak" },
      { id: 9, site: "Router", pass: "admin123", strength: "weak" },
      { id: 10, site: "Disney+", pass: "princess", strength: "weak" },
      { id: 11, site: "Slack", pass: "qwerty", strength: "weak" },
      { id: 12, site: "PayPal", pass: "football", strength: "weak" },
      { id: 13, site: "Ebay", pass: "dragon", strength: "weak" },
      { id: 14, site: "Hulu", pass: "letmein", strength: "weak" }
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [inputVal, setInputVal] = useState("");
  const [error, setError] = useState("");

  const startEdit = (id: number) => {
      setEditingId(id);
      setInputVal("");
      setError("");
  };

  const validateAndSave = () => {
      // Logic: Length > 8, Has Number, Has Special Char
      const hasLen = inputVal.length >= 8;
      const hasNum = /\d/.test(inputVal);
      const hasSym = /[!@#$%^&*(),.?":{}|<>]/.test(inputVal);

      if (!hasLen) { setError("Too short (min 8 chars)"); return; }
      if (!hasNum) { setError("Add a number"); return; }
      if (!hasSym) { setError("Add a symbol (!@#$)"); return; }

      setPasswords(prev => prev.map(p => 
          p.id === editingId ? { ...p, pass: inputVal, strength: "strong" } : p
      ));
      onFix(30);
      setEditingId(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 relative">
      {/* Header */}
      <div className="pt-12 pb-4 px-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onBack}><X size={24} className="text-blue-600" /></button>
        <h1 className="font-bold text-lg flex items-center gap-2"><Lock size={20} className="text-blue-600"/> PassKeeper</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <h2 className="font-bold text-xl mb-4 text-slate-800">Security Audit</h2>
        
        <div className="space-y-4 pb-20">
            {passwords.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-base">{item.site}</span>
                        {item.strength === 'weak' && <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1"><AlertTriangle size={10}/> WEAK</span>}
                        {item.strength === 'medium' && <span className="bg-yellow-100 text-yellow-600 text-[10px] font-bold px-2 py-1 rounded-full">FAIR</span>}
                        {item.strength === 'strong' && <span className="bg-green-100 text-green-600 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1"><Check size={10}/> SECURE</span>}
                    </div>
                    
                    <div className="bg-slate-100 p-2 rounded text-xs font-mono text-slate-500 flex justify-between items-center">
                        {item.pass.replace(/./g, '•')}
                        {item.strength !== 'strong' && (
                            <button 
                                onClick={() => startEdit(item.id)}
                                className="text-blue-600 font-bold text-xs flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                            >
                                <RefreshCw size={12}/> Fix
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editingId !== null && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
              <div className="bg-white w-full rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg">Create Strong Password</h3>
                      <button onClick={() => setEditingId(null)}><X size={20} className="text-gray-400"/></button>
                  </div>
                  
                  <p className="text-xs text-gray-500 mb-2">Must be 8+ chars, include number & symbol.</p>
                  <input 
                    autoFocus
                    type="text" 
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    className="w-full bg-gray-100 p-3 rounded-lg font-mono text-sm border border-gray-200 mb-2 outline-blue-500"
                    placeholder="Type new password..."
                  />
                  
                  {error && <p className="text-red-500 text-xs font-bold mb-3">{error}</p>}

                  <button 
                    onClick={validateAndSave}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-transform"
                  >
                      Save Secure Password
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};
