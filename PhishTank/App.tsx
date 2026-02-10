import React, { useState, useEffect, useRef } from 'react';
import { PhoneFrame } from './components/PhoneFrame';
import { StatusBar } from './components/StatusBar';
import { AppID, GameState, Message, CallState, SocialPost, CallScenario, Transaction, Mission } from './types';
import { MessagesApp } from './components/Apps/MessagesApp';
import { MailApp } from './components/Apps/MailApp';
import { PhoneApp } from './components/Apps/PhoneApp';
import { SocialApp } from './components/Apps/SocialApp';
import { QuizApp } from './components/Apps/QuizApp';
import { BankApp } from './components/Apps/BankApp';
import { FileGuardApp } from './components/Apps/FileGuardApp';
import { BrowserApp } from './components/Apps/BrowserApp';
import { PasswordApp } from './components/Apps/PasswordApp';
import { DecryptoApp } from './components/Apps/DecryptoApp';
import { FirewallApp } from './components/Apps/FirewallApp';
import { ShopApp } from './components/Apps/ShopApp';
import { JobsApp } from './components/Apps/JobsApp';
import { MusicApp } from './components/Apps/MusicApp';
import { CertifyApp } from './components/Apps/CertifyApp';
import { CyberRunnerApp } from './components/Apps/CyberRunnerApp';
import { BugBlasterApp } from './components/Apps/BugBlasterApp';
import { FeedbackModal } from './components/FeedbackModal';
import { 
  generateScenario, 
  generateSocialPost, 
  generateCallScenario, 
  startLiveCall, 
  endLiveCall 
} from './services/geminiService';
import { 
  MessageSquare, Mail, Phone, Lock, 
  CreditCard, Instagram, BrainCircuit, 
  Globe, Shield, ShoppingBag, Briefcase, 
  Music4, Award, Zap, Crosshair
} from 'lucide-react';

const INITIAL_STATE: GameState = {
  reputation: 50,
  cash: 500,
  savings: 0,
  day: 1,
  isLocked: false,
  certifications: [],
  wallpaper: "",
  inventory: [],
  jobTitle: "",
  jobLevel: 0
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [activeApp, setActiveApp] = useState<AppID | null>(null);
  const [notifications, setNotifications] = useState<Record<AppID, number>>({} as any);
  
  // Data Stores
  const [messages, setMessages] = useState<Message[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [callState, setCallState] = useState<CallState>({ isActive: false, callerName: "", status: 'ended', isScammer: false, duration: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Audio
  const [micVolume, setMicVolume] = useState(0);

  // Modals
  const [modal, setModal] = useState<{type: 'success'|'error', title: string, message: string, amount: number} | null>(null);

  // Loop Refs
  const lastEventTime = useRef(Date.now());

  // --- GAME LOOP ---
  useEffect(() => {
    const loop = setInterval(async () => {
        const now = Date.now();
        // Slowed down to 15s to save API/CPU
        if (now - lastEventTime.current > 15000) { 
            lastEventTime.current = now;
            
            // Random Event
            const rand = Math.random();
            if (rand < 0.3) {
                // SMS
                const msg = await generateScenario('sms');
                const newMsg: Message = { 
                    id: Date.now().toString(), 
                    timestamp: Date.now(), 
                    replied: false, 
                    type: 'sms', 
                    sender: msg.sender!, 
                    content: msg.content!, 
                    isScam: msg.isScam! 
                };
                setMessages(prev => [newMsg, ...prev]);
                setNotifications(prev => ({ ...prev, [AppID.MESSAGES]: (prev[AppID.MESSAGES] || 0) + 1 }));
            } else if (rand < 0.5) {
                // Email
                const email = await generateScenario('email');
                const newEmail: Message = { 
                    id: Date.now().toString(), 
                    timestamp: Date.now(), 
                    replied: false, 
                    type: 'email', 
                    sender: email.sender!, 
                    content: email.content!, 
                    fullContent: email.fullContent,
                    subject: email.subject,
                    isScam: email.isScam! 
                };
                setMessages(prev => [newEmail, ...prev]);
                setNotifications(prev => ({ ...prev, [AppID.MAIL]: (prev[AppID.MAIL] || 0) + 1 }));
            } else if (rand < 0.7) {
                // Social Post
                const post = await generateSocialPost();
                const newPost: SocialPost = {
                    id: Date.now().toString(),
                    timestamp: Date.now(),
                    username: post.username!,
                    handle: post.handle!,
                    content: post.content!,
                    imageUrl: post.imageUrl,
                    isScam: post.isScam!,
                    likes: post.likes!,
                    interacted: false
                };
                setSocialPosts(prev => [newPost, ...prev]);
                setNotifications(prev => ({ ...prev, [AppID.SOCIAL]: (prev[AppID.SOCIAL] || 0) + 1 }));
            } else if (rand < 0.85 && !callState.isActive) {
                 // Phone Call
                 const scenario = await generateCallScenario();
                 setCallState({
                     isActive: true,
                     callerName: scenario.callerName,
                     status: 'incoming',
                     isScammer: scenario.isScam,
                     duration: 0,
                     scenario: scenario
                 });
                 setNotifications(prev => ({ ...prev, [AppID.PHONE]: (prev[AppID.PHONE] || 0) + 1 }));
                 setActiveApp(AppID.PHONE); // FORCE OPEN
            }
        }

        // Daily Savings Interest
        if (Math.random() > 0.99) {
            setGameState(prev => {
                if (prev.savings > 0) {
                    const interest = Math.floor(prev.savings * 0.05);
                    return { ...prev, savings: prev.savings + interest };
                }
                return prev;
            });
        }

    }, 1000);
    return () => clearInterval(loop);
  }, [callState.isActive]);

  // --- ACTIONS ---

  const handleTransaction = (amount: number, title: string) => {
      setGameState(prev => ({ ...prev, cash: prev.cash + amount }));
      setTransactions(prev => [...prev, { id: Date.now().toString(), title, amount, type: amount >= 0 ? 'income' : 'expense', timestamp: Date.now() }]);
      
      if (amount !== 0) {
          setModal({
              type: amount > 0 ? 'success' : 'error',
              title: amount > 0 ? 'Cash Earned' : 'Cash Lost',
              message: title,
              amount: amount
          });
      }
  };

  const handleJobFire = () => {
      setGameState(prev => ({
          ...prev,
          jobTitle: "",
          jobLevel: 0
      }));
      setModal({
          type: 'error',
          title: 'FIRED!',
          message: 'You have been terminated for security violations.',
          amount: 0
      });
  };

  const handleMessageAction = (id: string, action: 'block' | 'reply') => {
      setMessages(prev => prev.map(m => {
          if (m.id === id) {
              const isCorrect = (action === 'block' && m.isScam) || (action === 'reply' && !m.isScam);
              if (!m.replied) {
                   handleTransaction(isCorrect ? 50 : -200, isCorrect ? "Security Protocol Followed" : "Security Breach");
              }
              return { ...m, replied: true, replyAction: action };
          }
          return m;
      }));
  };

  const handleSocialAction = (id: string, action: 'like' | 'report') => {
      setSocialPosts(prev => prev.map(p => {
          if (p.id === id) {
              if (p.interacted) return p;
              const isCorrect = (action === 'report' && p.isScam) || (action === 'like' && !p.isScam);
              handleTransaction(isCorrect ? 30 : -100, isCorrect ? "Social Awareness" : "Fell for Social Scam");
              return { ...p, interacted: true };
          }
          return p;
      }));
  };

  const handleCallAnswer = async () => {
      if (!callState.scenario) return;
      
      // Update UI immediately
      setCallState(prev => ({ ...prev, status: 'connected' }));
      
      // Start AI
      await startLiveCall(
          callState.scenario, 
          (userPassed, reason) => {
              // This callback triggers if AI determines outcome (e.g. user gave info or user said goodbye)
              if (userPassed) {
                   handleTransaction(50, reason || "Call handled safely");
              } else {
                   handleTransaction(-200, reason || "Sensitive info compromised!");
              }
              handleCallHangup(false); // End call via AI trigger
          },
          () => {
             // On Close/Error
             handleCallHangup(false); // Connection dropped or error, don't penalize
          },
          (vol) => setMicVolume(vol)
      );
  };

  const handleCallHangup = (manual: boolean = true) => {
      endLiveCall();
      
      if (manual) {
          if (callState.status === 'incoming') {
              if (callState.isScammer) {
                  handleTransaction(50, "Dodged Potential Scam Call");
              } else {
                  handleTransaction(-50, "Ignored Legitimate Call");
              }
          } else if (callState.status === 'connected') {
             // Hung up on active call
             if (callState.isScammer) {
                handleTransaction(100, "Hung up on Scammer! (Good Job)");
             } else {
                handleTransaction(-50, "Hung up on Real Person (Rude!)");
             }
          }
      }
      
      setCallState({ isActive: false, callerName: "", status: 'ended', isScammer: false, duration: 0 });
      setNotifications(prev => ({ ...prev, [AppID.PHONE]: 0 }));
      setActiveApp(null); // Return to home screen
  };

  const handleBuyItem = (id: string, cost: number, type: 'wallpaper' | 'upgrade', value: string) => {
      if (gameState.cash >= cost) {
          handleTransaction(-cost, `Bought ${id}`);
          setGameState(prev => ({ 
              ...prev, 
              inventory: [...prev.inventory, id]
          }));
      }
  };

  const handleEquip = (id: string, value: string) => {
      setGameState(prev => ({ ...prev, wallpaper: value }));
  };

  const handleApplyJob = (title: string, level: number, salary: number) => {
      setGameState(prev => ({ ...prev, jobTitle: title, jobLevel: level }));
      handleTransaction(0, `Hired as ${title}`);
  };

  const handleWork = (salary: number, bonus: number, outcome: string) => {
      handleTransaction(salary + bonus, outcome);
  };

  const handleExam = (cost: number, certId: string, certName: string) => {
      if (gameState.cash >= cost) {
          handleTransaction(-cost, `Exam Fee: ${certName}`);
          // Award cert immediately for now (assuming they passed in the App logic)
          setGameState(prev => ({ ...prev, certifications: [...prev.certifications, certId] }));
          setModal({ type: 'success', title: 'Certified!', message: `You earned the ${certName} certification.`, amount: 0 });
      }
  };

  const openApp = (id: AppID) => {
      setActiveApp(id);
      setNotifications(prev => ({ ...prev, [id]: 0 }));
  };

  // Helper to cash out and close app immediately
  const handleGameWin = (amt: number, desc: string) => {
      setActiveApp(null);
      handleTransaction(amt, desc);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-transparent font-sans">
      <PhoneFrame wallpaper={gameState.wallpaper}>
        <StatusBar />
        
        {/* HOME SCREEN */}
        {!activeApp && (
          <div className="pt-14 px-5 pb-28 h-full flex flex-col">
            
            {/* Widget Area */}
            <div className="mb-4 flex gap-3">
                <div className="flex-1 bg-white/20 backdrop-blur-md rounded-2xl p-3 text-white shadow-lg border border-white/10">
                    <p className="text-[10px] font-bold opacity-80 uppercase tracking-wider">CyberBank</p>
                    <h2 className="text-xl font-bold">${gameState.cash.toLocaleString()}</h2>
                    <p className="text-[9px] opacity-70 mt-0.5">Savings: ${gameState.savings.toLocaleString()}</p>
                </div>
                <div className="w-1/3 bg-black/40 backdrop-blur-md rounded-2xl p-3 flex flex-col items-center justify-center border border-white/10">
                    <Shield className="text-blue-400 mb-1" size={18}/>
                    <span className="text-white text-[10px] font-bold">{gameState.reputation}% Rep</span>
                </div>
            </div>

            {/* App Grid */}
            <div className="grid grid-cols-4 gap-x-2 gap-y-3 px-2">
               <AppIcon id={AppID.MESSAGES} label="Messages" icon={<MessageSquare className="text-white" size={14}/>} color="bg-green-500" notif={notifications[AppID.MESSAGES]} onClick={() => openApp(AppID.MESSAGES)} />
               <AppIcon id={AppID.MAIL} label="Mail" icon={<Mail className="text-white" size={14}/>} color="bg-blue-500" notif={notifications[AppID.MAIL]} onClick={() => openApp(AppID.MAIL)} />
               {/* Phone removed from grid to prevent confusion - only popup */}
               <AppIcon id={AppID.SOCIAL} label="InstaFace" icon={<Instagram className="text-white" size={14}/>} color="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500" notif={notifications[AppID.SOCIAL]} onClick={() => openApp(AppID.SOCIAL)} />
               
               <AppIcon id={AppID.BANK} label="Bank" icon={<CreditCard className="text-white" size={14}/>} color="bg-slate-700" onClick={() => openApp(AppID.BANK)} />
               <AppIcon id={AppID.BROWSER} label="SafeSurf" icon={<Globe className="text-white" size={14}/>} color="bg-blue-400" onClick={() => openApp(AppID.BROWSER)} />
               <AppIcon id={AppID.FILEGUARD} label="FileGuard" icon={<Shield className="text-white" size={14}/>} color="bg-indigo-500" onClick={() => openApp(AppID.FILEGUARD)} />
               <AppIcon id={AppID.PASSKEEPER} label="PassKeep" icon={<Lock className="text-white" size={14}/>} color="bg-slate-800" onClick={() => openApp(AppID.PASSKEEPER)} />
               
               <AppIcon id={AppID.JOBS} label="Careers" icon={<Briefcase className="text-white" size={14}/>} color="bg-blue-800" onClick={() => openApp(AppID.JOBS)} />
               <AppIcon id={AppID.CERTIFY} label="Certify" icon={<Award className="text-white" size={14}/>} color="bg-yellow-600" onClick={() => openApp(AppID.CERTIFY)} />
               <AppIcon id={AppID.SHOP} label="Shop" icon={<ShoppingBag className="text-white" size={14}/>} color="bg-pink-500" onClick={() => openApp(AppID.SHOP)} />
               <AppIcon id={AppID.MUSIC} label="Music" icon={<Music4 className="text-white" size={14}/>} color="bg-red-500" onClick={() => openApp(AppID.MUSIC)} />
               
               <AppIcon id={AppID.QUIZ} label="Quiz" icon={<BrainCircuit className="text-white" size={14}/>} color="bg-purple-600" onClick={() => openApp(AppID.QUIZ)} />
               <AppIcon id={AppID.DECRYPTO} label="Decrypto" icon={<Lock className="text-white" size={14}/>} color="bg-emerald-600" onClick={() => openApp(AppID.DECRYPTO)} />
               <AppIcon id={AppID.FIREWALL} label="Firewall" icon={<Shield className="text-white" size={14}/>} color="bg-orange-600" onClick={() => openApp(AppID.FIREWALL)} />
               <AppIcon id={AppID.CYBER_RUNNER} label="Runner" icon={<Zap className="text-white" size={14}/>} color="bg-cyan-600" onClick={() => openApp(AppID.CYBER_RUNNER)} />
               
               <AppIcon id={AppID.BUG_BLASTER} label="Blaster" icon={<Crosshair className="text-white" size={14}/>} color="bg-lime-600" onClick={() => openApp(AppID.BUG_BLASTER)} />
            </div>

            {/* Dock */}
            <div className="absolute bottom-4 left-4 right-4 h-14 bg-white/20 backdrop-blur-xl rounded-[1.5rem] flex items-center justify-evenly px-2 border border-white/10 z-30">
                <AppIcon id={AppID.MESSAGES} showLabel={false} icon={<MessageSquare className="text-white" size={18}/>} color="bg-green-500" notif={notifications[AppID.MESSAGES]} onClick={() => openApp(AppID.MESSAGES)} />
                <AppIcon id={AppID.MAIL} showLabel={false} icon={<Mail className="text-white" size={18}/>} color="bg-blue-500" notif={notifications[AppID.MAIL]} onClick={() => openApp(AppID.MAIL)} />
                <AppIcon id={AppID.BROWSER} showLabel={false} icon={<Globe className="text-white" size={18}/>} color="bg-blue-400" onClick={() => openApp(AppID.BROWSER)} />
            </div>
          </div>
        )}

        {/* ACTIVE APPS */}
        <div className={`absolute inset-0 z-20 transition-transform duration-300 ${activeApp ? 'translate-y-0' : 'translate-y-full'}`}>
           {activeApp === AppID.MESSAGES && <MessagesApp messages={messages} onBack={() => setActiveApp(null)} onAction={handleMessageAction} />}
           {activeApp === AppID.MAIL && <MailApp messages={messages} onBack={() => setActiveApp(null)} onAction={handleMessageAction} />}
           {activeApp === AppID.PHONE && <PhoneApp callState={callState} onHangup={() => handleCallHangup(true)} onAnswer={handleCallAnswer} micVolume={micVolume} onBack={() => setActiveApp(null)} />}
           {activeApp === AppID.SOCIAL && <SocialApp posts={socialPosts} onBack={() => setActiveApp(null)} onInteract={handleSocialAction} />}
           {activeApp === AppID.BANK && <BankApp balance={gameState.cash} savings={gameState.savings} reputation={gameState.reputation} transactions={transactions} onBack={() => setActiveApp(null)} onTransfer={(amt, type) => {
               if (type === 'to_savings') setGameState(p => ({ ...p, cash: p.cash - amt, savings: p.savings + amt }));
               else setGameState(p => ({ ...p, cash: p.cash + amt, savings: p.savings - amt }));
           }} />}
           {activeApp === AppID.QUIZ && <QuizApp onBack={() => setActiveApp(null)} onWin={(amt) => handleGameWin(amt, "Quiz Reward")} />}
           {activeApp === AppID.SHOP && <ShopApp onBack={() => setActiveApp(null)} cash={gameState.cash} inventory={gameState.inventory} currentWallpaper={gameState.wallpaper} onBuy={handleBuyItem} onEquip={handleEquip} />}
           {activeApp === AppID.JOBS && <JobsApp onBack={() => setActiveApp(null)} currentJob={gameState.jobTitle} jobLevel={gameState.jobLevel} reputation={gameState.reputation} ownedCerts={gameState.certifications} onApply={handleApplyJob} onWork={handleWork} onFire={handleJobFire}/>}
           {activeApp === AppID.CERTIFY && <CertifyApp onBack={() => setActiveApp(null)} cash={gameState.cash} ownedCerts={gameState.certifications} onTakeExam={handleExam} />}
           {activeApp === AppID.MUSIC && <MusicApp onBack={() => setActiveApp(null)} />}
           {activeApp === AppID.BROWSER && <BrowserApp onBack={() => setActiveApp(null)} onAction={(amt, desc) => handleTransaction(amt, desc)} />}
           {activeApp === AppID.FILEGUARD && <FileGuardApp onBack={() => setActiveApp(null)} onAction={(amt, desc) => handleTransaction(amt, desc)} />}
           {activeApp === AppID.PASSKEEPER && <PasswordApp onBack={() => setActiveApp(null)} onFix={(amt) => handleTransaction(amt, "Password Fixed")} />}
           {activeApp === AppID.DECRYPTO && <DecryptoApp onBack={() => setActiveApp(null)} onWin={(amt) => handleGameWin(amt, "Decrypto Win")} />}
           {activeApp === AppID.FIREWALL && <FirewallApp onBack={() => setActiveApp(null)} onWin={(amt) => handleGameWin(amt, "Firewall Bounty")} />}
           {activeApp === AppID.CYBER_RUNNER && <CyberRunnerApp onBack={() => setActiveApp(null)} onWin={(amt) => handleGameWin(amt, "Runner Cash Out")} />}
           {activeApp === AppID.BUG_BLASTER && <BugBlasterApp onBack={() => setActiveApp(null)} onWin={(amt) => handleGameWin(amt, "Bug Blaster Reward")} />}
        </div>
        
        {/* Modals */}
        {modal && <FeedbackModal {...modal} onClose={() => setModal(null)} />}

      </PhoneFrame>
    </div>
  );
};

const AppIcon = ({ id, label, icon, color, notif, onClick, showLabel = true }: any) => (
    <button onClick={onClick} className="flex flex-col items-center gap-1 group relative">
        <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center shadow-lg group-active:scale-90 transition-all duration-200 ring-1 ring-white/20`}>
            {icon}
            {notif > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full border-2 border-black">
                    {notif}
                </div>
            )}
        </div>
        {showLabel && <span className="text-[9px] font-medium text-white drop-shadow-md tracking-tight leading-tight">{label}</span>}
    </button>
);

export default App;