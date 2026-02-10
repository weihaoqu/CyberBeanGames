
import React, { useState } from 'react';
import { X, Award, CheckCircle2, Lock, BookOpen, GraduationCap } from 'lucide-react';

interface CertifyAppProps {
  onBack: () => void;
  cash: number;
  ownedCerts: string[];
  onTakeExam: (cost: number, certId: string, certName: string) => void;
}

const CERTS = [
    { 
        id: 'net_plus', 
        name: 'Net+', 
        cost: 500, 
        level: 1, 
        desc: 'Network Fundamentals', 
        questions: [
            { q: "What protocol is used for secure web browsing?", options: ["HTTP", "FTP", "HTTPS", "SMTP"], correct: 2 },
            { q: "What is the purpose of DNS?", options: ["Assign IP to MAC", "Resolve Names to IPs", "Encrypt data", "Route packets"], correct: 1 },
            { q: "Which device operates at Layer 3 (Network)?", options: ["Hub", "Switch", "Router", "Cable"], correct: 2 }
        ]
    },
    { 
        id: 'sec_plus', 
        name: 'Sec+', 
        cost: 1000, 
        level: 2, 
        desc: 'Security Baseline', 
        questions: [
            { q: "Which confidentiality principle ensures only authorized users access data?", options: ["Availability", "Access Control", "Integrity", "Obfuscation"], correct: 1 },
            { q: "What is hashing used for?", options: ["Encryption", "Integrity Check", "Compression", "Availability"], correct: 1 },
            { q: "What is Phishing?", options: ["Fishing for compliments", "Deceptive emails", "Secure coding", "Hardware repair"], correct: 1 }
        ]
    },
    { 
        id: 'ceh', 
        name: 'CEH', 
        cost: 2500, 
        level: 3, 
        desc: 'Ethical Hacker', 
        questions: [
            { q: "In Nmap, what flag enables OS detection?", options: ["-sS", "-O", "-P", "-A"], correct: 1 },
            { q: "What tool is used for packet sniffing?", options: ["Wireshark", "Notepad", "Chrome", "Excel"], correct: 0 },
            { q: "What is a 'Buffer Overflow'?", options: ["Too much internet", "Memory overwrite attack", "Full hard drive", "Fast CPU"], correct: 1 }
        ]
    },
    { 
        id: 'cism', 
        name: 'CISM', 
        cost: 5000, 
        level: 4, 
        desc: 'Security Manager', 
        questions: [
            { q: "What is the primary goal of Risk Management?", options: ["Eliminate Risk", "Transfer Risk", "Reduce Risk to Acceptable Level", "Ignore Risk"], correct: 2 },
            { q: "Which role is responsible for data accuracy?", options: ["Data Owner", "Data Custodian", "System Admin", "User"], correct: 0 },
            { q: "What is BCP?", options: ["Big Computer Power", "Business Continuity Planning", "Basic Control Protocol", "Binary Code Program"], correct: 1 }
        ]
    },
    { 
        id: 'cissp', 
        name: 'CISSP', 
        cost: 10000, 
        level: 5, 
        desc: 'Chief Officer Level', 
        questions: [
            { q: "Which law protects EU citizen data privacy?", options: ["HIPAA", "SOX", "GDPR", "FISMA"], correct: 2 },
            { q: "What is non-repudiation?", options: ["Denying an action", "Proof of origin/delivery", "Encrypted storage", "Hidden identity"], correct: 1 },
            { q: "Which security model focuses on integrity?", options: ["Bell-LaPadula", "Biba", "Brewer-Nash", "Clark-Wilson"], correct: 1 }
        ]
    },
];

export const CertifyApp: React.FC<CertifyAppProps> = ({ onBack, cash, ownedCerts, onTakeExam }) => {
  const [activeExam, setActiveExam] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [examStatus, setExamStatus] = useState<'intro' | 'question' | 'success' | 'fail'>('intro');

  const startExam = (cert: any) => {
      setActiveExam(cert);
      // Pick random question from pool
      const randomQ = cert.questions[Math.floor(Math.random() * cert.questions.length)];
      setCurrentQuestion(randomQ);
      setExamStatus('intro');
  };

  const confirmStart = () => {
      setExamStatus('question');
  };

  const handleAnswer = (idx: number) => {
      if (idx === currentQuestion.correct) {
          setExamStatus('success');
      } else {
          setExamStatus('fail');
      }
  };

  const finalizePass = () => {
      onTakeExam(activeExam.cost, activeExam.id, activeExam.name);
      setActiveExam(null);
      setCurrentQuestion(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      <div className="pt-12 pb-4 px-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onBack}><X size={24} /></button>
        <h1 className="font-bold text-lg flex items-center gap-2"><Award size={20} className="text-yellow-400"/> Certify Center</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        
        {/* EXAM MODAL */}
        {activeExam && currentQuestion && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
                <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl text-slate-900 animate-in zoom-in-95">
                    
                    {examStatus === 'intro' && (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BookOpen size={32} className="text-blue-600"/>
                            </div>
                            <h2 className="text-2xl font-bold mb-2">{activeExam.name} Exam</h2>
                            <p className="text-gray-500 mb-6">Cost: ${activeExam.cost}</p>
                            <p className="text-sm bg-yellow-50 p-3 rounded-lg border border-yellow-200 mb-6">
                                Passing this exam requires answering a critical security question. No refunds if you fail.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setActiveExam(null)} className="flex-1 py-3 bg-gray-200 rounded-xl font-bold">Cancel</button>
                                <button onClick={confirmStart} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg">Start Exam</button>
                            </div>
                        </div>
                    )}

                    {examStatus === 'question' && (
                        <div>
                            <h3 className="font-bold text-lg mb-4">{currentQuestion.q}</h3>
                            <div className="space-y-3">
                                {currentQuestion.options.map((opt: string, i: number) => (
                                    <button 
                                        key={i} 
                                        onClick={() => handleAnswer(i)}
                                        className="w-full text-left p-4 border-2 border-slate-100 rounded-xl font-semibold hover:border-blue-500 hover:bg-blue-50 transition-all text-sm"
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {examStatus === 'success' && (
                        <div className="text-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <GraduationCap size={40} className="text-green-600"/>
                            </div>
                            <h2 className="text-2xl font-black text-green-700 mb-2">Certified!</h2>
                            <p className="text-gray-600 mb-6">You are now {activeExam.name} certified.</p>
                            <button onClick={finalizePass} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg">Collect Certification</button>
                        </div>
                    )}

                    {examStatus === 'fail' && (
                        <div className="text-center">
                             <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Lock size={40} className="text-red-600"/>
                            </div>
                            <h2 className="text-2xl font-black text-red-700 mb-2">Failed</h2>
                            <p className="text-gray-600 mb-6">That answer was incorrect. Study hard and try again.</p>
                            <button onClick={() => setActiveExam(null)} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl shadow-lg">Close</button>
                        </div>
                    )}

                </div>
            </div>
        )}

        <div className="mb-6">
            <h2 className="text-2xl font-bold mb-1">Career Path</h2>
            <p className="text-slate-400 text-sm">Earn certifications to unlock high-paying jobs.</p>
        </div>

        <div className="space-y-4 pb-20">
            {CERTS.map(cert => {
                const isOwned = ownedCerts.includes(cert.id);
                const canAfford = cash >= cert.cost;

                return (
                    <div key={cert.id} className={`bg-slate-800 rounded-xl p-4 border ${isOwned ? 'border-green-500/50' : 'border-slate-700'} relative overflow-hidden`}>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    {cert.name}
                                    {isOwned && <CheckCircle2 size={16} className="text-green-400"/>}
                                </h3>
                                <p className="text-xs text-slate-400">{cert.desc}</p>
                            </div>
                            <div className="text-right">
                                {isOwned ? (
                                    <span className="text-green-400 font-bold text-xs bg-green-900/30 px-2 py-1 rounded">ACQUIRED</span>
                                ) : (
                                    <span className="text-yellow-400 font-bold text-sm">${cert.cost}</span>
                                )}
                            </div>
                        </div>

                        {!isOwned && (
                            <button 
                                onClick={() => startExam(cert)}
                                disabled={!canAfford}
                                className={`w-full py-3 rounded-lg font-bold text-sm mt-2 flex items-center justify-center gap-2 transition-all ${canAfford ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                            >
                                {canAfford ? 'Take Exam' : 'Insufficient Funds'}
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
