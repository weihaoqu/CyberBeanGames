
import React, { useState, useEffect } from 'react';
import { X, Globe, Lock, RefreshCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

interface BrowserAppProps {
  onBack: () => void;
  onAction: (bonus: number, desc: string) => void;
}

// Simulated websites
const SCENARIOS = [
    { id: 1, url: "paypal-secure-login.com/auth", title: "PayPal | Login", isSafe: false, content: "Urgent: Verify your identity to prevent account lock." },
    { id: 2, url: "google.com", title: "Google", isSafe: true, content: "Search the world's information..." },
    { id: 3, url: "amazon-support-help.net", title: "Amazon Support", isSafe: false, content: "Chat with an agent to claim your $500 gift card." },
    { id: 4, url: "chase.com", title: "Chase Bank", isSafe: true, content: "Welcome to Chase Online Banking." },
    { id: 5, url: "apple-id-verify.xyz", title: "Apple ID", isSafe: false, content: "Your iPhone has been located in Russia. Log in to block." },
    { id: 6, url: "netflix.com", title: "Netflix", isSafe: true, content: "Unlimited movies, TV shows, and more." },
    { id: 7, url: "microsoft-security-alert.com", title: "Windows Defender", isSafe: false, content: "CRITICAL ALERT: VIRUS DETECTED. Call 1-800-XXX-XXXX" },
    { id: 8, url: "irs-gov-refund.com", title: "IRS Tax Refund", isSafe: false, content: "You have a pending tax refund of $1,400. Claim now." },
    { id: 9, url: "facebook.com", title: "Facebook", isSafe: true, content: "Connect with friends and the world around you." },
    { id: 10, url: "bankofamerica.com", title: "Bank of America", isSafe: true, content: "Log in to your Online Banking." },
    { id: 11, url: "instagram-verify-badge.net", title: "Instagram Verified", isSafe: false, content: "Get your blue checkmark today for free." },
    { id: 12, url: "wikipedia.org", title: "Wikipedia", isSafe: true, content: "The Free Encyclopedia." },
    { id: 13, url: "dropbox-share-file.io", title: "Dropbox", isSafe: false, content: "You have received a secure file 'Bonus_Plan.pdf'" },
    { id: 14, url: "linkedin.com", title: "LinkedIn", isSafe: true, content: "Welcome to your professional community." },
    { id: 15, url: "zoom-meeting-install.exe.net", title: "Zoom Meeting", isSafe: false, content: "Update Zoom Client immediately to join meeting." },
    { id: 16, url: "target-rewards-claim.com", title: "Target Rewards", isSafe: false, content: "You have (1) unclaimed $500 Reward." },
    { id: 17, url: "bestbuy.com", title: "Best Buy", isSafe: true, content: "Shop computers, appliances, and more." },
    { id: 18, url: "wellsfargo.com", title: "Wells Fargo", isSafe: true, content: "Personal & Business Banking." }
];

export const BrowserApp: React.FC<BrowserAppProps> = ({ onBack, onAction }) => {
  const [currentSite, setCurrentSite] = useState(SCENARIOS[0]);
  const [loading, setLoading] = useState(false);

  const nextSite = () => {
    setLoading(true);
    setTimeout(() => {
        const next = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
        setCurrentSite(next);
        setLoading(false);
    }, 500);
  };

  const handleDecision = (choice: 'safe' | 'unsafe') => {
      const isCorrect = (choice === 'safe' && currentSite.isSafe) || (choice === 'unsafe' && !currentSite.isSafe);
      if (isCorrect) {
          onAction(50, `Correctly Identified ${currentSite.isSafe ? 'Safe Site' : 'Phishing Site'}`);
      } else {
          onAction(-50, `Failed to Identify ${currentSite.isSafe ? 'Safe Site' : 'Phishing Site'}`);
      }
      nextSite();
  };

  useEffect(() => {
      nextSite();
  }, []);

  return (
    <div className="flex flex-col h-full bg-white text-slate-800">
      {/* Browser Chrome */}
      <div className="pt-12 pb-2 px-2 bg-slate-100 border-b border-slate-300 sticky top-0 z-10">
        <div className="flex items-center gap-2 mb-2 px-2">
             <button onClick={onBack}><X size={20} className="text-slate-500"/></button>
             <div className="flex-1 bg-white rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm border border-slate-200 text-sm">
                 {currentSite.isSafe ? <Lock size={12} className="text-green-600"/> : <AlertTriangle size={12} className="text-red-500"/>}
                 <span className="truncate">{currentSite.url}</span>
                 <RefreshCcw size={12} className="ml-auto text-slate-400"/>
             </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden">
          {loading && (
              <div className="absolute inset-0 bg-white z-20 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
          )}

          {/* Fake Website Content */}
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center bg-slate-50">
               <div className="w-24 h-24 bg-slate-200 rounded-full mb-6 flex items-center justify-center">
                   <Globe size={48} className="text-slate-400"/>
               </div>
               <h1 className="text-2xl font-bold mb-2">{currentSite.title}</h1>
               <p className="text-slate-500 max-w-xs leading-relaxed">{currentSite.content}</p>
               
               {!currentSite.isSafe && (
                   <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-700 max-w-xs mx-auto">
                       <strong>Tip:</strong> Check the URL carefully for typos or weird domains!
                   </div>
               )}
          </div>

          {/* Controls */}
          <div className="p-4 bg-white border-t border-slate-200 flex gap-3">
              <button 
                onClick={() => handleDecision('unsafe')}
                className="flex-1 py-4 bg-red-100 text-red-700 font-bold rounded-xl flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform"
              >
                  <AlertTriangle size={24}/>
                  Mark Unsafe
              </button>
              <button 
                onClick={() => handleDecision('safe')}
                className="flex-1 py-4 bg-green-100 text-green-700 font-bold rounded-xl flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform"
              >
                  <ShieldCheck size={24}/>
                  Mark Safe
              </button>
          </div>
      </div>
    </div>
  );
};
