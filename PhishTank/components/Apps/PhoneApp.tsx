import React, { useEffect, useState, useRef, useCallback } from 'react';
import { CallState } from '../../types';
import { Phone, PhoneOff } from 'lucide-react';

// Helper: speak text aloud (works on iOS when called from a tap handler)
const speakText = (text: string) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.05;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  window.speechSynthesis.speak(utterance);
};

const stopSpeech = () => {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
};

// Scripted call dialogues
const CALL_SCRIPTS: Record<string, {
  lines: { caller: string; responses: { text: string; isBad?: boolean }[] }[];
  finalGood: string;
  finalBad: string;
}> = {
  "IRS Agent": {
    lines: [
      {
        caller: "This is Agent Smith from the IRS. We've found you owe $5,000 in back taxes. If you don't pay immediately, a warrant will be issued for your arrest.",
        responses: [
          { text: "That sounds serious! How do I pay?", isBad: true },
          { text: "The IRS doesn't call or threaten arrest. I'm hanging up." },
          { text: "Can you send me official documentation by mail?" },
        ],
      },
      {
        caller: "There's no time for mail! You need to go to your nearest store and purchase $5,000 in gift cards. Read me the codes and your case will be cleared.",
        responses: [
          { text: "OK, I'll go buy gift cards right now.", isBad: true },
          { text: "The IRS never asks for gift cards. This is a scam." },
          { text: "I'm going to verify this by calling the IRS directly." },
        ],
      },
    ],
    finalGood: "You recognized the scam! The real IRS never demands gift cards or threatens immediate arrest over the phone.",
    finalBad: "You fell for it! The IRS never demands gift card payments or threatens immediate arrest by phone.",
  },
  "Grandson": {
    lines: [
      {
        caller: "*crying* Grandma? Grandpa? It's me... I'm in trouble. I got arrested in Mexico and I need bail money right away. Please don't tell Mom and Dad!",
        responses: [
          { text: "Oh no! How much do you need? I'll send it!", isBad: true },
          { text: "What's your full name? Tell me something only my grandchild would know." },
          { text: "I'm going to call your parents to verify this." },
        ],
      },
      {
        caller: "Please, you can't call anyone! They said if I don't pay $3,000 by tonight I'll be stuck here. Can you wire money through Western Union?",
        responses: [
          { text: "OK, I'll wire the money. Give me the details.", isBad: true },
          { text: "I'm hanging up and calling my actual grandchild directly." },
          { text: "If this were real, you'd know my name. This is a scam." },
        ],
      },
    ],
    finalGood: "Smart move! The 'grandparent scam' preys on emotions. Always verify by calling the real person directly.",
    finalBad: "This was the classic 'grandparent scam.' Always verify by contacting family directly before sending money.",
  },
  "Bank Security": {
    lines: [
      {
        caller: "Hello, this is Chase Bank Fraud Department. We've detected suspicious activity on your account. We need to verify your identity to stop an unauthorized transaction of $2,400.",
        responses: [
          { text: "Oh no! Yes, please help me stop it!", isBad: true },
          { text: "I'll call Chase directly using the number on my card." },
          { text: "What specific transaction are you referring to?" },
        ],
      },
      {
        caller: "For security purposes, I need you to verify your PIN number and the last 4 of your Social Security Number so I can lock the transaction.",
        responses: [
          { text: "OK, my PIN is...", isBad: true },
          { text: "A real bank would never ask for my PIN over the phone." },
          { text: "I'm going to hang up and call the number on my bank card." },
        ],
      },
    ],
    finalGood: "Correct! Banks will never ask for your PIN or SSN over the phone. Always call them directly.",
    finalBad: "Banks never ask for your PIN by phone! Always hang up and call the number on your card.",
  },
  "Tech Support": {
    lines: [
      {
        caller: "Hello, this is Microsoft Technical Support. Our system has detected a critical virus on your computer. We need to remotely access your machine to remove it before your files are destroyed.",
        responses: [
          { text: "Please help! How do I let you in?", isBad: true },
          { text: "Microsoft doesn't make unsolicited calls like this." },
          { text: "I'll run my own antivirus software, thanks." },
        ],
      },
      {
        caller: "Please download the application called AnyDesk from the internet. This will allow our certified technicians to clean your computer. There's also a $299 service fee.",
        responses: [
          { text: "OK, I'm downloading it now.", isBad: true },
          { text: "I'm not installing remote access software for a stranger." },
          { text: "This is clearly a scam. I'm reporting this number." },
        ],
      },
    ],
    finalGood: "Right! Microsoft never cold-calls about viruses. Never install remote access software for unsolicited callers.",
    finalBad: "This was a tech support scam! Never install remote access tools for unsolicited callers.",
  },
  "Amazon": {
    lines: [
      {
        caller: "Hi, this is Amazon Customer Service. We accidentally refunded $5,000 to your bank account instead of $50. We need you to send back the difference or you could face legal action.",
        responses: [
          { text: "Oh, I'll check my account and send it back!", isBad: true },
          { text: "Amazon wouldn't call about this. I'll check my account myself." },
          { text: "If there's really a mistake, Amazon can reverse it on their end." },
        ],
      },
      {
        caller: "Please log into your bank account while I'm on the line so we can process the return. I'll guide you through the transfer.",
        responses: [
          { text: "OK, I'm logging into my bank now.", isBad: true },
          { text: "I'm not accessing my bank with a stranger on the phone." },
          { text: "I'll contact Amazon directly through my account. Goodbye." },
        ],
      },
    ],
    finalGood: "Good catch! The 'accidental refund' scam tricks you into sending real money. Companies handle refund errors internally.",
    finalBad: "This was the 'accidental refund' scam! Companies fix refund errors themselves — they'd never ask you to send money.",
  },
  "Doctor Office": {
    lines: [
      {
        caller: "Hi, this is Dr. Wilson's office calling. We're confirming your dental appointment for next Tuesday at 2:00 PM. Will you be able to make it?",
        responses: [
          { text: "Yes, I'll be there! Thanks for reminding me." },
          { text: "I need to reschedule, actually. Can we find another time?" },
          { text: "Hang up — this could be a scam.", isBad: true },
        ],
      },
    ],
    finalGood: "This was a legitimate call! Not every call is a scam — appointment confirmations from known offices are normal.",
    finalBad: "This was actually a legitimate appointment reminder! Not every unexpected call is a scam.",
  },
  "Mom": {
    lines: [
      {
        caller: "Hey sweetie! Just calling to check in. How's your week going? Are you eating enough?",
        responses: [
          { text: "Hi Mom! Everything's good, just busy with work." },
          { text: "Hey! I'm doing well. Want to grab dinner this weekend?" },
          { text: "Hang up — this could be a scam.", isBad: true },
        ],
      },
    ],
    finalGood: "This was just Mom checking in! Good job recognizing a normal, legitimate call.",
    finalBad: "That was actually your mom! Not every call is suspicious — it's important to recognize legitimate ones too.",
  },
};

interface PhoneAppProps {
  callState: CallState;
  onHangup: () => void;
  onAnswer: () => void;
  micVolume?: number;
  onBack?: () => void;
}

export const PhoneApp: React.FC<PhoneAppProps> = ({ callState, onHangup, onAnswer }) => {
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState<{ from: 'caller' | 'you'; text: string }[]>([]);
  const [madeError, setMadeError] = useState(false);
  const [finished, setFinished] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const speechUnlocked = useRef(false);

  const script = CALL_SCRIPTS[callState.callerName];

  // Reset state when call changes
  useEffect(() => {
    if (callState.status === 'connected') {
      setStep(0);
      setMessages([]);
      setMadeError(false);
      setFinished(false);
    }
  }, [callState.status, callState.callerName]);

  // Stop speech on unmount
  useEffect(() => {
    return () => stopSpeech();
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Accept call: unlock speech with first caller line (called directly from tap)
  const handleAccept = useCallback(() => {
    if (!script) { onAnswer(); return; }

    // Unlock iOS speechSynthesis by speaking from a direct user gesture
    // Speak the first caller message immediately
    const firstLine = script.lines[0].caller;
    speakText(firstLine);
    speechUnlocked.current = true;

    // Set the first message in state
    setMessages([{ from: 'caller', text: firstLine }]);

    // Tell parent to transition to connected
    onAnswer();
  }, [script, onAnswer]);

  // User picks a response (called directly from tap — speech stays unlocked)
  const handleResponse = useCallback((response: { text: string; isBad?: boolean }) => {
    if (finished || !script) return;
    const hadError = response.isBad || false;
    if (hadError) setMadeError(true);

    const newMessages = [...messages, { from: 'you' as const, text: response.text }];

    const nextStep = step + 1;
    if (nextStep < script.lines.length) {
      // More dialogue — speak next caller line directly from this tap handler
      const nextCallerText = script.lines[nextStep].caller;
      speakText(nextCallerText);
      setMessages([...newMessages, { from: 'caller', text: nextCallerText }]);
      setStep(nextStep);
    } else {
      // Conversation ended — speak final message from this tap handler
      const finalMsg = (hadError || madeError) ? script.finalBad : script.finalGood;
      speakText(finalMsg);
      setMessages([...newMessages, { from: 'caller', text: finalMsg }]);
      setFinished(true);
    }
  }, [finished, script, messages, step, madeError]);

  const handleHangup = useCallback(() => {
    stopSpeech();
    onHangup();
  }, [onHangup]);

  // --- INCOMING CALL SCREEN ---
  if (callState.status === 'incoming') {
    return (
      <div className="h-full w-full bg-slate-900 relative flex flex-col items-center justify-between py-10 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-md z-0"></div>

        <div className="z-10 flex flex-col items-center mt-8 w-full flex-1 justify-center">
          <div className="flex flex-col items-center">
             <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4 shadow-xl">
                <span className="text-4xl text-gray-500 font-bold">{callState.callerName.charAt(0)}</span>
             </div>
             <h2 className="text-2xl font-bold text-white mb-1 text-center px-4 leading-tight">{callState.callerName}</h2>
             <p className="text-gray-300 text-sm">Incoming call...</p>
          </div>
        </div>

        <div className="z-10 w-full px-8 flex justify-between items-center mb-8">
          <div className="flex flex-col items-center gap-2">
            <button onClick={handleHangup} className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-all active:scale-95">
              <PhoneOff size={32} color="white" fill="white" />
            </button>
            <span className="text-white text-xs font-medium">Decline</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <button onClick={handleAccept} className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-all animate-pulse active:scale-95">
              <Phone size={32} color="white" fill="white" />
            </button>
            <span className="text-white text-xs font-medium">Accept</span>
          </div>
        </div>
      </div>
    );
  }

  // --- ACTIVE CALL (TEXT-BASED) ---
  if (callState.status === 'connected' && script) {
    const currentLine = !finished && step < script.lines.length ? script.lines[step] : null;
    const lastMsg = messages[messages.length - 1];
    const showOptions = currentLine && lastMsg?.from === 'caller' && !finished;

    return (
      <div className="h-full w-full bg-gradient-to-b from-gray-800 to-gray-900 flex flex-col text-white overflow-hidden">
        {/* Header */}
        <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
            <span className="text-lg font-bold">{callState.callerName.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold truncate">{callState.callerName}</h2>
            <p className="text-xs text-green-400">{finished ? "Call ended" : "On call"}</p>
          </div>
          <button onClick={handleHangup} className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 active:scale-95 transition-all shrink-0">
            <PhoneOff size={18} color="white" fill="white" />
          </button>
        </div>

        {/* Chat area */}
        <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 no-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === 'you' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                msg.from === 'caller'
                  ? 'bg-white/10 text-gray-100 rounded-bl-sm'
                  : 'bg-blue-600 text-white rounded-br-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Response options */}
        <div className="shrink-0 px-3 py-3 border-t border-white/10 space-y-2">
          {showOptions ? (
            currentLine!.responses.map((r, i) => (
              <button
                key={i}
                onClick={() => handleResponse(r)}
                className="w-full text-left px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/25 text-sm text-gray-100 transition-all leading-snug"
              >
                {r.text}
              </button>
            ))
          ) : finished ? (
            <button
              onClick={handleHangup}
              className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-all active:scale-[0.98]"
            >
              End Call
            </button>
          ) : (
            <div className="text-center text-gray-400 text-xs py-2">Waiting...</div>
          )}
        </div>
      </div>
    );
  }

  return null;
};
