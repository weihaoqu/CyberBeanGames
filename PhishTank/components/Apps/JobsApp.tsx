
import React, { useState, useEffect } from 'react';
import { X, Briefcase, CheckCircle2, AlertTriangle, UserCheck, DollarSign, BrainCircuit, DoorOpen } from 'lucide-react';

interface JobsAppProps {
  onBack: () => void;
  currentJob: string;
  jobLevel: number;
  onApply: (title: string, level: number, salary: number) => void;
  onWork: (salary: number, bonus: number, eventOutcome: string) => void;
  reputation: number;
  ownedCerts: string[];
  onFire: () => void;
}

const JOBS = [
    { title: "Help Desk Intern", level: 1, salary: 100, reqRep: 0, reqCert: null, desc: "Reset passwords and fix printers." },
    { title: "Jr. Security Analyst", level: 2, salary: 250, reqRep: 30, reqCert: "net_plus", desc: "Monitor logs for suspicious activity." },
    { title: "Penetration Tester", level: 3, salary: 550, reqRep: 60, reqCert: "sec_plus", desc: "Ethically hack systems to find flaws." },
    { title: "Security Architect", level: 4, salary: 1200, reqRep: 85, reqCert: "cism", desc: "Design secure network infrastructures." },
    { title: "CISO", level: 5, salary: 3000, reqRep: 95, reqCert: "cissp", desc: "Chief Information Security Officer." }
];

const QUESTION_POOL = [
    { level: 1, q: "A user reports a 'weird email' asking for their password. This is likely:", options: ["A System Update", "Phishing", "Spam", "Two-Factor Auth"], correct: 1 },
    { level: 1, q: "Which password is the most secure?", options: ["P@ssword1", "admin123", "Tr0ub4dour&3!", "12345678"], correct: 2 },
    { level: 1, q: "What does '2FA' stand for?", options: ["2-Factor Authorization", "2-Factor Authentication", "2-Fast Access", "2-File Access"], correct: 1 },
    { level: 2, q: "Which port is commonly used for secure web traffic (HTTPS)?", options: ["80", "21", "443", "25"], correct: 2 },
    { level: 2, q: "What is the purpose of a Firewall?", options: ["To cool down servers", "To block unauthorized traffic", "To speed up WiFi", "To clean viruses"], correct: 1 },
    { level: 3, q: "Which tool is the industry standard for network scanning?", options: ["Photoshop", "Nmap", "Excel", "Spotify"], correct: 1 },
    { level: 3, q: "You found an input field vulnerable to 'OR 1=1'. What is this?", options: ["XSS", "Buffer Overflow", "SQL Injection", "CSRF"], correct: 2 },
    { level: 4, q: "Which encryption algorithm is considered symmetric?", options: ["RSA", "AES", "ECC", "Diffie-Hellman"], correct: 1 },
    { level: 4, q: "To securely segment a network, you would use:", options: ["Hubs", "VLANs", "Repeaters", "Cables"], correct: 1 },
    { level: 5, q: "Which framework is developed by NIST for cybersecurity?", options: ["CSF (Cybersecurity Framework)", "Agile", "Scrum", "React"], correct: 0 },
    { level: 5, q: "Under GDPR, how soon must a major breach be reported?", options: ["72 hours", "1 week", "1 month", "Never"], correct: 0 },
];

const WORK_EVENTS = [
    { q: "A co-worker asks to borrow your badge to get in.", a1: "Give Badge", a2: "Refuse & Report", correct: 2, reward: 50 },
    { q: "You find a USB drive labeled 'Payroll' in the lobby.", a1: "Plug it in", a2: "Give to IT Security", correct: 2, reward: 100 },
    { q: "Phishing email detected targeting the CEO.", a1: "Delete it", a2: "Analyze & Block", correct: 2, reward: 75 },
    { q: "System update requires a restart during business hours.", a1: "Restart Now", a2: "Schedule for Night", correct: 2, reward: 25 },
    { q: "Vendor offers you free tickets for a contract renewal.", a1: "Accept", a2: "Decline (Policy)", correct: 2, reward: 150 },
    { q: "You notice a server running an old, unpatched OS.", a1: "Ignore it", a2: "Flag for Update", correct: 2, reward: 50 },
    { q: "A user requests admin rights to install a game.", a1: "Grant Access", a2: "Deny Request", correct: 2, reward: 25 },
];

export const JobsApp: React.FC<JobsAppProps> = ({ onBack, currentJob, jobLevel, onApply, onWork, reputation, ownedCerts, onFire }) => {
  const [view, setView] = useState<'list' | 'working' | 'interview' | 'fired'>('list');
  const [progress, setProgress] = useState(0);
  const [activeEvent, setActiveEvent] = useState<any>(null);
  const [strikes, setStrikes] = useState(0); 
  
  const [applyingJob, setApplyingJob] = useState<any>(null);
  const [activeQuestion, setActiveQuestion] = useState<any>(null);
  const [interviewStatus, setInterviewStatus] = useState<'question' | 'success' | 'fail'>('question');

  const myJob = JOBS.find(j => j.level === jobLevel);

  const startApplication = (job: any) => {
      setApplyingJob(job);
      const pool = QUESTION_POOL.filter(q => q.level === job.level);
      const randomQ = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : QUESTION_POOL[0];
      setActiveQuestion(randomQ);
      setInterviewStatus('question');
      setView('interview');
  };

  const handleInterviewAnswer = (idx: number) => {
      if (idx === activeQuestion.correct) {
          setInterviewStatus('success');
      } else {
          setInterviewStatus('fail');
      }
  };

  const finalizeHiring = () => {
      onApply(applyingJob.title, applyingJob.level, applyingJob.salary);
      setView('list');
      setApplyingJob(null);
      setActiveQuestion(null);
  };

  const startShift = () => {
      setView('working');
      setProgress(0);
      setActiveEvent(null);
      setStrikes(0);
  };

  useEffect(() => {
      let interval: any;
      if (view === 'working' && !activeEvent) {
          interval = setInterval(() => {
              setProgress(p => {
                  if (p >= 100) {
                      finishShift();
                      return 100;
                  }
                  if (p > 30 && p < 80 && Math.random() > 0.6) {
                      triggerEvent();
                      return p;
                  }
                  return p + 1.0;
              });
          }, 50);
      }
      return () => clearInterval(interval);
  }, [view, activeEvent]);

  const triggerEvent = () => {
      const evt = WORK_EVENTS[Math.floor(Math.random() * WORK_EVENTS.length)];
      setActiveEvent(evt);
  };

  const handleEventChoice = (choiceIdx: number) => {
      if (choiceIdx === activeEvent.correct) {
          setActiveEvent(null);
      } else {
          const newStrikes = strikes + 1;
          setStrikes(newStrikes);
          
          if (newStrikes >= 3) {
              setView('fired');
              setActiveEvent(null);
          } else {
            setActiveEvent(null);
            onWork(-50, 0, `Violation! Strike ${newStrikes}/3`);
          }
      }
  };

  const finishShift = () => {
      if (myJob) {
          onWork(myJob.salary, 0, "Shift Completed");
          setView('list');
      }
  };

  const handlePackThings = () => {
      onFire();
      setView('list');
  };

  const getCertName = (id: string) => {
      if (id === 'net_plus') return 'Net+';
      if (id === 'sec_plus') return 'Sec+';
      if (id === 'ceh') return 'CEH';
      if (id === 'cism') return 'CISM';
      if (id === 'cissp') return 'CISSP';
      return id;
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 font-sans">
      <div className="pt-12 pb-4 px-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
        <button onClick={onBack}><X size={24} className="text-blue-700" /></button>
        <h1 className="font-bold text-lg flex items-center gap-2"><Briefcase size={20} className="text-blue-700"/> CyberJobs</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
          
          {view === 'interview' && applyingJob && activeQuestion && (
               <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
                   <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl relative animate-in zoom-in-95">
                       {interviewStatus === 'question' && (
                           <>
                               <div className="flex justify-between items-center mb-4">
                                   <h2 className="text-xl font-black text-blue-900">Interview</h2>
                                   <div className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">Lvl {applyingJob.level}</div>
                               </div>
                               <div className="mb-6">
                                   <BrainCircuit className="text-blue-500 mb-2" size={32}/>
                                   <p className="font-bold text-lg leading-tight mb-2">{activeQuestion.q}</p>
                               </div>
                               <div className="space-y-3">
                                   {activeQuestion.options.map((opt: string, i: number) => (
                                       <button 
                                            key={i} 
                                            onClick={() => handleInterviewAnswer(i)}
                                            className="w-full text-left p-4 border-2 border-slate-100 rounded-xl font-semibold hover:border-blue-500 hover:bg-blue-50 transition-all text-sm"
                                       >
                                           {opt}
                                       </button>
                                   ))}
                               </div>
                               <button onClick={() => setView('list')} className="mt-4 text-gray-400 text-xs font-bold w-full text-center hover:text-red-500">Cancel</button>
                           </>
                       )}

                       {interviewStatus === 'success' && (
                           <div className="text-center animate-in zoom-in">
                               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle2 size={40} className="text-green-600"/></div>
                               <h2 className="text-2xl font-black text-green-700 mb-2">Hired!</h2>
                               <button onClick={finalizeHiring} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg">Start Career</button>
                           </div>
                       )}

                       {interviewStatus === 'fail' && (
                           <div className="text-center animate-in zoom-in">
                               <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle size={40} className="text-red-600"/></div>
                               <h2 className="text-2xl font-black text-red-700 mb-2">Rejected</h2>
                               <button onClick={() => setView('list')} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl shadow-lg">Close</button>
                           </div>
                       )}
                   </div>
               </div>
          )}

          {view === 'fired' && (
               <div className="fixed inset-0 z-50 bg-red-950/90 backdrop-blur-md flex items-center justify-center p-6 text-center animate-in zoom-in">
                   <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl border-4 border-red-600">
                       <DoorOpen size={64} className="text-red-600 mx-auto mb-4"/>
                       <h1 className="text-4xl font-black text-red-600 mb-2 uppercase">You're Fired!</h1>
                       <p className="text-gray-600 font-bold mb-6">Too many policy violations.</p>
                       <button onClick={handlePackThings} className="w-full bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-red-700">Pack Things</button>
                   </div>
               </div>
          )}

          {view !== 'interview' && view !== 'fired' && (
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-6 text-white shadow-lg mb-6">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="text-blue-200 text-xs font-bold uppercase tracking-wider">Position</p>
                        <h2 className="text-2xl font-black">{currentJob || "Unemployed"}</h2>
                    </div>
                    {jobLevel > 0 && <div className="bg-white/20 p-2 rounded-lg"><UserCheck size={24}/></div>}
                </div>
                
                {jobLevel > 0 ? (
                    <>
                        <div className="flex items-center gap-4 mt-4">
                            <div className="bg-black/20 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"><DollarSign size={14}/> ${myJob?.salary}/shift</div>
                            <div className="bg-black/20 px-3 py-1 rounded-full text-sm font-medium">Lvl {jobLevel}</div>
                        </div>
                        {view === 'list' && (
                            <button onClick={startShift} className="w-full mt-6 bg-white text-blue-800 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg active:scale-95 flex items-center justify-center gap-2">START SHIFT</button>
                        )}
                    </>
                ) : (
                    <p className="mt-2 text-sm opacity-80">Apply below.</p>
                )}
            </div>
          )}

          {view === 'working' && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
                  <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative">
                      <div className="absolute top-4 right-4 flex gap-1">
                          {[...Array(3)].map((_, i) => (
                              <div key={i} className={`w-3 h-3 rounded-full ${i < strikes ? 'bg-red-500' : 'bg-gray-200'}`}></div>
                          ))}
                      </div>

                      {activeEvent ? (
                          <div className="animate-in zoom-in">
                              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto"><AlertTriangle size={32} className="text-red-600"/></div>
                              <h3 className="text-xl font-bold text-center mb-2">Incident</h3>
                              <p className="text-center text-gray-600 mb-6">{activeEvent.q}</p>
                              <div className="space-y-3">
                                  <button onClick={() => handleEventChoice(1)} className="w-full py-4 border-2 border-slate-200 rounded-xl font-bold hover:bg-slate-50">{activeEvent.a1}</button>
                                  <button onClick={() => handleEventChoice(2)} className="w-full py-4 border-2 border-slate-200 rounded-xl font-bold hover:bg-slate-50">{activeEvent.a2}</button>
                              </div>
                          </div>
                      ) : (
                          <div className="text-center">
                              <h3 className="text-2xl font-bold mb-2 text-blue-800">Working...</h3>
                              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-2">
                                  <div className="h-full bg-blue-600 transition-all duration-100" style={{ width: `${progress}%` }}></div>
                              </div>
                              <p className="text-xs font-bold text-blue-600">{progress.toFixed(0)}%</p>
                          </div>
                      )}
                  </div>
              </div>
          )}

          {view === 'list' && (
              <div>
                  <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2"><Briefcase size={18}/> Open Positions</h3>
                  <div className="space-y-3">
                      {JOBS.map((job) => {
                          const isCurrent = jobLevel === job.level;
                          const isUnlocked = reputation >= job.reqRep && (!job.reqCert || ownedCerts.includes(job.reqCert));
                          const hasCert = !job.reqCert || ownedCerts.includes(job.reqCert);
                          
                          return (
                              <div key={job.title} className={`p-4 rounded-xl border ${isCurrent ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-300' : 'bg-white border-slate-200'}`}>
                                  <div className="flex justify-between items-start mb-1">
                                      <h4 className="font-bold text-slate-900">{job.title}</h4>
                                      <span className="text-green-600 font-bold text-sm">${job.salary}</span>
                                  </div>
                                  <p className="text-xs text-slate-500 mb-3">{job.desc}</p>
                                  <div className="flex justify-between items-end">
                                      <div className="flex flex-col gap-1">
                                           <span className={`text-[10px] font-bold px-2 py-1 rounded w-fit ${reputation >= job.reqRep ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>Req: {job.reqRep} Rep</span>
                                           {job.reqCert && (
                                               <span className={`text-[10px] font-bold px-2 py-1 rounded w-fit ${hasCert ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>Cert: {getCertName(job.reqCert)}</span>
                                           )}
                                      </div>
                                      {!isCurrent && (
                                          <button 
                                            disabled={!isUnlocked}
                                            onClick={() => startApplication(job)}
                                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${isUnlocked ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                                          >
                                              {isUnlocked ? "APPLY" : "LOCKED"}
                                          </button>
                                      )}
                                      {isCurrent && <span className="text-blue-600 text-xs font-bold flex items-center gap-1"><CheckCircle2 size={14}/> HIRED</span>}
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};
