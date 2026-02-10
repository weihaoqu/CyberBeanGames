import { GoogleGenAI, Type, LiveServerMessage, Modality, FunctionDeclaration } from "@google/genai";
import { Message, SocialPost, QuizQuestion, CallScenario } from "../types";

// ============================================================================
//  LOCAL CONTENT DATABASE (Bypasses API for texts/emails/quizzes to save quota)
// ============================================================================

const LOCAL_SMS_SCENARIOS = [
  { sender: "USPS", content: "Address incomplete on package #9921. Update now: usps-redeliver.com", isScam: true },
  { sender: "Mom", content: "Did you water the plants?", isScam: false },
  { sender: "BankAlert", content: "Debit card locked. Suspicious transaction at Apple Store.", isScam: true },
  { sender: "Netflix", content: "Payment failed. Update info to keep watching.", isScam: true },
  { sender: "Amazon", content: "Your driver is 5 stops away.", isScam: false },
  { sender: "Boss", content: "Can you hop on a quick call?", isScam: false },
  { sender: "Verification", content: "Your code is 492-110. Do not share this.", isScam: false },
  { sender: "IRS", content: "Tax refund pending. Claim here: irs-gov-claims.net", isScam: true },
  { sender: "Unknown", content: "Hey is this Sarah? We met at the gym.", isScam: true },
  { sender: "DoorDash", content: "Your food has been delivered.", isScam: false },
  { sender: "AT&T", content: "Bill for March is ready. Amount: $0.00 (Credit applied)", isScam: false },
  { sender: "CryptoBot", content: "Elon Musk is doubling BTC sent to this wallet!", isScam: true },
  { sender: "Dad", content: "How do I print from the iPad?", isScam: false },
  { sender: "JobOffer", content: "Remote Data Entry. $50/hr. No interview needed.", isScam: true },
  { sender: "Uber", content: "Your ride is arriving in 2 mins.", isScam: false },
  { sender: "Pharmacy", content: "Rx #9921 is ready for pickup.", isScam: false },
  { sender: "Lottery", content: "CONGRATS! You won a Walmart Gift Card.", isScam: true },
  { sender: "Security", content: "New login from Moscow, Russia.", isScam: true },
  { sender: "Gym", content: "Membership renewal failed.", isScam: true },
  { sender: "Landlord", content: "Water will be shut off for maintenance tmrw.", isScam: false }
];

const LOCAL_EMAIL_SCENARIOS = [
  { sender: "HR Dept", subject: "Urgent: Payroll Update", content: "We switched payroll providers. Please log in to confirm your direct deposit details immediately.", isScam: true },
  { sender: "Netflix", subject: "Account On Hold", content: "We could not process your last payment. Update your card to avoid suspension.", isScam: true },
  { sender: "Google", subject: "Security Alert", content: "New sign-in detected on Windows PC. Was this you?", isScam: false },
  { sender: "Boss", subject: "Wire Transfer", content: "I am in a meeting and can't talk. I need you to process a wire transfer to a vendor ASAP.", isScam: true },
  { sender: "Amazon", subject: "Order #112-9921", content: "Thank you for your order of 'Sony 65 TV'. Total: $1,299.99. If this wasn't you, call us.", isScam: true },
  { sender: "Spotify", subject: "Your Receipt", content: "Here is your receipt for Premium Individual.", isScam: false },
  { sender: "LinkedIn", subject: "You appeared in 5 searches", content: "See who is looking at your profile this week.", isScam: false },
  { sender: "Zoom", subject: "Meeting Invitation", content: "Project Sync joined. Click to join meeting.", isScam: false },
  { sender: "IT Support", subject: "Password Expiry", content: "Your password expires in 24 hours. Click here to keep current password.", isScam: true },
  { sender: "Dropbox", subject: "File Shared", content: "Unknown User shared 'Financials_2024.exe' with you.", isScam: true }
];

const LOCAL_SOCIAL_POSTS = [
  // REAL POSTS (Tech, Lifestyle, Gaming)
  { username: "Travel_Blogger", handle: "@wandernow", content: "Sunset in Bali is unreal 🌅 #blessed", imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80", isScam: false },
  { username: "TechGuru", handle: "@tech_daily", content: "My new desk setup is finally complete. Thoughts? 🖥️", imageUrl: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=80", isScam: false },
  { username: "Sarah_J", handle: "@sarah_life", content: "Homemade pizza night! 🍕 It actually tastes good this time.", imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80", isScam: false },
  { username: "Gaming_Clips", handle: "@gamer_zone", content: "Can't believe we won this round! 🏆", imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80", isScam: false },
  { username: "Nature_Lover", handle: "@eco_friendly", content: "Morning hikes > everything else.", imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80", isScam: false },
  { username: "Dev_Life", handle: "@code_monkey", content: "Why does my code only work at 3 AM? ☕", imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80", isScam: false },
  
  // SCAM POSTS (Crypto, Giveaways, Phishing)
  { username: "Elon_Giveaway", handle: "@elon_official_99", content: "Sending 2x BTC to everyone who sends 0.1 BTC! Limited time only! 🚀", imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=800&q=80", isScam: true },
  { username: "FreeStuff", handle: "@giveaway_bot", content: "Amazon warehouse clearance! iPhone 15s for $10 shipping. Link in bio!", imageUrl: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80", isScam: true },
  { username: "CryptoKing", handle: "@forex_master", content: "I turned $50 into $50,000 in 2 days. DM me 'HOW' to start. 💸", imageUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=800&q=80", isScam: true },
  { username: "Hot_Singles", handle: "@love_finder_88", content: "Single and looking for fun in your area... 😉 Click link.", imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80", isScam: true },
  { username: "Invest_Safe", handle: "@trust_wallet_support", content: "Validate your wallet to receive the pending airdrop. Official support.", imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80", isScam: true },
  { username: "Cash_App_Blessing", handle: "@money_flip", content: "First 5 people to DM get $500! #blessed #cashapp", imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5d49e93?auto=format&fit=crop&w=800&q=80", isScam: true }
];

const LOCAL_QUIZ_QUESTIONS: QuizQuestion[] = [
    { id: "q1", question: "You get an email from 'PayPa1' asking for your password. What do you do?", options: ["Reply", "Click Link", "Mark Phishing", "Ignore"], correctAnswerIndex: 2, reward: 50 },
    { id: "q2", question: "Which password is strongest?", options: ["password123", "Monkey!", "Tr0ub4dour&3", "admin"], correctAnswerIndex: 2, reward: 50 },
    { id: "q3", question: "What does 'HTTPS' indicate?", options: ["Faster speed", "Encrypted connection", "Hacked site", "Nothing"], correctAnswerIndex: 1, reward: 50 },
    { id: "q4", question: "A 'Prince' offers you $1M inheritance. He needs $500 fees first.", options: ["Pay him", "Scam", "Ask for half", "Call police"], correctAnswerIndex: 1, reward: 50 },
    { id: "q5", question: "Should you use the same password for banking and gaming?", options: ["Yes", "No", "Only if complex", "Sometimes"], correctAnswerIndex: 1, reward: 50 },
    { id: "q6", question: "What is Two-Factor Authentication (2FA)?", options: ["Two passwords", "Password + Code", "Fingerprint only", "Face ID"], correctAnswerIndex: 1, reward: 50 },
    { id: "q7", question: "Public Wi-Fi at a coffeeshop is:", options: ["Secure", "Private", "Unsafe for banking", "Faster than home"], correctAnswerIndex: 2, reward: 50 },
    { id: "q8", question: "Someone calls claiming to be Microsoft Support. They want remote access.", options: ["Grant access", "Hang up", "Pay them", "Install tool"], correctAnswerIndex: 1, reward: 50 },
    { id: "q9", question: "What is a 'Keylogger'?", options: ["Locksmith tool", "Spyware recording keys", "Password manager", "Admin tool"], correctAnswerIndex: 1, reward: 50 },
    { id: "q10", question: "You find a USB drive in the parking lot.", options: ["Plug it in", "Throw it away/Report", "Check files", "Format it"], correctAnswerIndex: 1, reward: 50 }
];

// ============================================================================
//  GENERATORS (Hybrid: Local First, API for Calls)
// ============================================================================

export const generateScenario = async (type: 'sms' | 'email'): Promise<Partial<Message>> => {
  // Use Local DB to save API Quota
  const list = type === 'sms' ? LOCAL_SMS_SCENARIOS : LOCAL_EMAIL_SCENARIOS;
  const item = list[Math.floor(Math.random() * list.length)];
  
  return {
    sender: item.sender,
    content: item.content,
    fullContent: item.content + (type === 'email' ? "\n\nClick link to resolve." : ""),
    subject: type === 'email' ? (item as any).subject : undefined,
    isScam: item.isScam
  };
};

export const generateSocialPost = async (): Promise<Partial<SocialPost>> => {
  const item = LOCAL_SOCIAL_POSTS[Math.floor(Math.random() * LOCAL_SOCIAL_POSTS.length)];
  return { ...item, likes: Math.floor(Math.random() * 5000) };
};

export const generateQuizQuestion = async (previousQuestions: string[] = []): Promise<QuizQuestion> => {
  // Filter out used questions if possible, or just pick random
  const available = LOCAL_QUIZ_QUESTIONS.filter(q => !previousQuestions.includes(q.question));
  if (available.length > 0) {
      const q = available[Math.floor(Math.random() * available.length)];
      return { ...q, id: Date.now().toString() };
  }
  return { ...LOCAL_QUIZ_QUESTIONS[0], id: Date.now().toString() };
};

// ============================================================================
//  CALL LOGIC (Requires API)
// ============================================================================

const CALL_TOPICS = [
  { name: "IRS Agent", topic: "Back Taxes", instruction: "You are an aggressive IRS agent named Agent Smith. Demand immediate payment of $5000 via gift cards or the user will be arrested. If they give you the card codes, report failure.", isScam: true },
  { name: "Grandson", topic: "Bail Money", instruction: "You are the user's grandson, Billy. You are in jail in Mexico and need bail money sent immediately. You are crying. If they agree to wire money, report failure.", isScam: true },
  { name: "Bank Security", topic: "Fraud Alert", instruction: "You are calling from Chase Bank Fraud Dept. Ask the user to verify their PIN number to stop a transaction. If they give the PIN, report failure.", isScam: true },
  { name: "Tech Support", topic: "Virus", instruction: "You are 'Microsoft'. You detected a virus. Ask user to download AnyDesk. If they agree, report failure.", isScam: true },
  { name: "Amazon", topic: "Refund", instruction: "You are Amazon. You accidentally refunded the user $5000 instead of $50. Ask them to send it back. If they agree, report failure.", isScam: true },
  { name: "Doctor Office", topic: "Appt", instruction: "You are confirming a dentist appointment for next Tuesday at 2pm. Be polite. If they confirm and say goodbye, report success.", isScam: false },
  { name: "Mom", topic: "Chat", instruction: "You are the user's mom. Just calling to say hi and ask about dinner. If they chat for a bit and say bye, report success.", isScam: false }
];

export const generateCallScenario = async (): Promise<CallScenario> => {
  // Use local templates for the scenario SETUP, but the CALL itself is live AI.
  const template = CALL_TOPICS[Math.floor(Math.random() * CALL_TOPICS.length)];
  
  return {
      id: Date.now().toString(),
      callerName: template.name,
      topic: template.topic,
      isScam: template.isScam,
      systemInstruction: template.instruction
  };
};

// --- LIVE AUDIO HANDLING ---

let audioContext: AudioContext | null = null;
let mediaStream: MediaStream | null = null;
let audioProcessor: ScriptProcessorNode | null = null;
let sourceNode: MediaStreamAudioSourceNode | null = null;
let nextStartTime = 0;
let currentSession: any = null;

// Helper to safely get API key from various environments (Vite/Vercel/Node)
const getApiKey = (): string | undefined => {
    try {
        // Try standard process.env (Node/Webpack)
        if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
            return process.env.API_KEY;
        }
        // Try Vite style env vars (exposed via import.meta.env)
        // @ts-ignore
        if (import.meta && import.meta.env) {
            // @ts-ignore
            if (import.meta.env.VITE_API_KEY) return import.meta.env.VITE_API_KEY;
            // @ts-ignore
            if (import.meta.env.API_KEY) return import.meta.env.API_KEY;
        }
    } catch (e) {
        console.warn("Failed to check environment variables", e);
    }
    return undefined;
};

export const startLiveCall = async (
  scenario: CallScenario,
  onOutcome: (success: boolean, reason: string) => void,
  onClose: () => void,
  onVolumeChange?: (volume: number) => void
): Promise<any> => {
  
  await endLiveCall();

  const apiKey = getApiKey();
  
  if (!apiKey) {
      console.error("API Key missing. Cannot start live call. Please set VITE_API_KEY or API_KEY in your environment variables.");
      onClose();
      return null;
  }

  // Initialize AI here to prevent crash if API key is missing on load
  const ai = new GoogleGenAI({ apiKey });

  const reportOutcomeTool: FunctionDeclaration = {
    name: "report_outcome",
    description: "Call this function when the call ends or reaches a conclusion. 'userPassed' should be TRUE if the user successfully identified a scam (or was polite to a real caller and said goodbye). 'userPassed' should be FALSE if the user gave up sensitive info to a scammer.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        userPassed: { type: Type.BOOLEAN, description: "True if user passed the test (hung up on scam, or handled real call well)." },
        reason: { type: Type.STRING, description: "Reason for the outcome." }
      },
      required: ["userPassed", "reason"]
    }
  };

  try {
      // 1. Setup Audio Context - Force resume to bypass Autoplay policy
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioContext.state === 'suspended') {
          console.log("Resuming audio context...");
          await audioContext.resume();
      }
      
      nextStartTime = audioContext.currentTime;
      const currentSampleRate = audioContext.sampleRate;

      // 2. Get Mic
      mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // 3. Connect to Gemini Live
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: `
            SCENARIO: ${scenario.systemInstruction}
            
            RULES:
            1. Speak immediately. Don't wait. Be short and conversational.
            2. IF SCAM (${scenario.isScam}):
               - Try to trick the user.
               - IF user gives sensitive info (PIN, Password, agrees to pay), call 'report_outcome(false, "User gave info")'.
               - IF user says "Goodbye" or "Bye" or attempts to end the call without giving info, call 'report_outcome(true, "User ended call safely")'.
               - OTHERWISE keep trying until they hang up manually.
            3. IF REAL (${!scenario.isScam}):
               - Be helpful.
               - IF user answers your question and says "Goodbye" or "Bye", call 'report_outcome(true, "User was helpful")'.
               - IF user is rude or hangs up abruptly, do nothing (user will hang up manually).
            4. START SPEAKING IMMEDIATELY.
          `,
          tools: [{ functionDeclarations: [reportOutcomeTool] }],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
        },
        callbacks: {
          onopen: async () => {
            console.log("Live Session Open");
            if (!audioContext || !mediaStream) return;
            
            sourceNode = audioContext.createMediaStreamSource(mediaStream);
            audioProcessor = audioContext.createScriptProcessor(4096, 1, 1);
            
            audioProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              
              // Calculate Volume for UI
              if (onVolumeChange) {
                  let sum = 0;
                  for(let i = 0; i < inputData.length; i += 10) { 
                      sum += inputData[i] * inputData[i];
                  }
                  const rms = Math.sqrt(sum / (inputData.length / 10));
                  onVolumeChange(Math.min(1, rms * 5)); 
              }

              const pcmBlob = createBlob(inputData, currentSampleRate);
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };

            sourceNode.connect(audioProcessor);
            audioProcessor.connect(audioContext.destination);

            // Kickstart conversation
            sessionPromise.then(s => s.sendRealtimeInput({ 
                content: { role: "user", parts: [{ text: "The user has answered the phone. Start speaking your script now." }] } 
            }));
          },
          onmessage: (msg: LiveServerMessage) => {
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) queueAudioChunk(audioData);

            if (msg.toolCall) {
                msg.toolCall.functionCalls.forEach(fc => {
                    if (fc.name === 'report_outcome') {
                        const args = fc.args as any;
                        onOutcome(args.userPassed, args.reason);
                        sessionPromise.then(s => s.sendToolResponse({
                            functionResponses: { id: fc.id, name: fc.name, response: { result: "OK" } }
                        }));
                    }
                });
            }
          },
          onclose: () => console.log("Live Session Closed"),
          onerror: (err) => {
              console.error("Live Session Error", err);
              onClose(); 
          }
        }
      });

      // Track session for cleanup
      sessionPromise.then(s => { currentSession = s; });

      return sessionPromise;

  } catch (e) {
      console.error("Call Setup Failed (likely quota or api key)", e);
      onClose();
      return null;
  }
};

export const endLiveCall = async () => {
  if (sourceNode) sourceNode.disconnect();
  if (audioProcessor) audioProcessor.disconnect();
  if (mediaStream) mediaStream.getTracks().forEach(track => track.stop());
  if (audioContext && audioContext.state !== 'closed') await audioContext.close();
  
  if (currentSession && typeof currentSession.close === 'function') {
      try {
          // currentSession.close(); 
      } catch (e) { console.error("Error closing session", e); }
  }

  sourceNode = null;
  audioProcessor = null;
  mediaStream = null;
  audioContext = null;
  currentSession = null;
  nextStartTime = 0;
};

function createBlob(data: Float32Array, sampleRate: number): { data: string, mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  
  let binary = '';
  const bytes = new Uint8Array(int16.buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return {
    data: btoa(binary),
    mimeType: `audio/pcm;rate=${sampleRate}`,
  };
}

async function queueAudioChunk(base64Data: string) {
    if (!audioContext) return;
    if (audioContext.state === 'suspended') await audioContext.resume();

    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    
    const dataInt16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(dataInt16.length);
    for(let i=0; i<dataInt16.length; i++) float32[i] = dataInt16[i] / 32768.0;

    const buffer = audioContext.createBuffer(1, float32.length, 24000); // 24kHz is standard for Gemini
    buffer.copyToChannel(float32, 0);

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);

    const now = audioContext.currentTime;
    if (nextStartTime < now) nextStartTime = now;
    source.start(nextStartTime);
    nextStartTime += buffer.duration;
}