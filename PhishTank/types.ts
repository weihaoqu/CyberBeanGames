
export enum AppID {
  HOME = 'HOME',
  MESSAGES = 'MESSAGES',
  MAIL = 'MAIL',
  PHONE = 'PHONE',
  BANK = 'BANK',
  SOCIAL = 'SOCIAL',
  QUIZ = 'QUIZ',
  CERTIFY = 'CERTIFY', // Replaces Crypto
  BROWSER = 'BROWSER',
  FILEGUARD = 'FILEGUARD',
  SHOP = 'SHOP',
  PASSKEEPER = 'PASSKEEPER',
  DECRYPTO = 'DECRYPTO',
  FIREWALL = 'FIREWALL',
  CYBER_RUNNER = 'CYBER_RUNNER',
  BUG_BLASTER = 'BUG_BLASTER',
  JOBS = 'JOBS',
  MUSIC = 'MUSIC'
}

export enum ThreatLevel {
  SAFE = 'SAFE',
  SUSPICIOUS = 'SUSPICIOUS',
  DANGEROUS = 'DANGEROUS'
}

export interface GameState {
  reputation: number; // Health/Credit Score
  cash: number; // Score
  savings: number;
  day: number;
  isLocked: boolean;
  certifications: string[]; // List of owned cert IDs (e.g., 'sec_plus', 'cissp')
  wallpaper: string;
  inventory: string[];
  jobTitle: string; // Current Job
  jobLevel: number; // 0 = Unemployed
}

export interface Mission {
  id: string;
  desc: string;
  target: number;
  current: number;
  reward: number;
  completed: boolean;
  type: 'block_scam' | 'win_firewall' | 'clean_virus' | 'pass_exam' | 'work_shift';
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  timestamp: number;
}

export interface Notification {
  id: string;
  appId: AppID;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
}

export interface Message {
  id: string;
  sender: string;
  content: string; // Preview or short content
  fullContent?: string; // For emails or longer texts
  isScam: boolean;
  timestamp: number;
  replied: boolean;
  replyAction?: 'block' | 'reply'; // Track what the user did
  type: 'sms' | 'email';
  subject?: string; // For emails
}

export interface SocialPost {
  id: string;
  username: string;
  handle: string;
  content: string;
  imageUrl?: string; // New field for images
  isScam: boolean;
  timestamp: number;
  likes: number;
  interacted: boolean; // Liked or Reported
}

export interface QuizQuestion {
  id: string; // Added ID for deduplication
  question: string;
  options: string[];
  correctAnswerIndex: number;
  reward: number;
}

export interface CallScenario {
  id: string;
  callerName: string;
  topic: string;
  isScam: boolean; // True = Scam, False = Legit (User should agree)
  systemInstruction: string;
}

export interface CallState {
  isActive: boolean;
  callerName: string;
  status: 'incoming' | 'connected' | 'ended';
  isScammer: boolean;
  duration: number;
  scenario?: CallScenario;
}
