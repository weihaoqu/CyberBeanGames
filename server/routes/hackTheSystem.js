import express from "express";
const router = express.Router();

const CHALLENGES = [
  {
    id: 1,
    scenario: "An email contains a link: 'bit.ly/urgent-security-update' - What do you do?",
    options: [
      "Click it immediately to stay secure",
      "Hover over the link to check the real URL first",
      "Forward it to all colleagues",
      "Reply asking if it's legitimate",
    ],
    correct: 1,
    explanation: "Always hover to preview URLs before clicking. Shortened links hide the real destination.",
  },
  {
    id: 2,
    scenario: "Which password is MOST secure?",
    options: ["Password123!", "MyDog2024", "Tr!c0l0r#F$9mQ&zK", "admin"],
    correct: 2,
    explanation: "Strong passwords use a mix of uppercase, lowercase, numbers, and special characters with high length.",
  },
  {
    id: 3,
    scenario: "Port 22 (SSH) is exposed to the internet. Best action?",
    options: [
      "Leave it open for remote access",
      "Change to port 23 instead",
      "Restrict to specific IPs or use VPN",
      "Disable SSH completely",
    ],
    correct: 2,
    explanation: "Restrict SSH access to trusted IPs or require VPN connection to minimize attack surface.",
  },
  {
    id: 4,
    scenario: "Your firewall is disabled. What's the FIRST step?",
    options: [
      "Continue working normally",
      "Immediately enable the firewall",
      "Restart the computer",
      "Download antivirus software",
    ],
    correct: 1,
    explanation: "Enable firewall immediately to restore network protection before taking other actions.",
  },
  {
    id: 5,
    scenario: "Software update available for 6 months. What do you do?",
    options: [
      "Ignore it - if it ain't broke, don't fix it",
      "Wait for automatic updates",
      "Install immediately - security patches are critical",
      "Update only if forced",
    ],
    correct: 2,
    explanation: "Security patches fix known vulnerabilities. Delaying updates leaves systems exposed to exploits.",
  },
  {
    id: 6,
    scenario: "USB drive found in parking lot. Your action?",
    options: [
      "Plug it in to see who owns it",
      "Take it home for personal use",
      "Report to IT/Security without connecting",
      "Throw it away",
    ],
    correct: 2,
    explanation: "Unknown USB drives can contain malware. Report to security without connecting to any device.",
  },
  {
    id: 7,
    scenario: "Public WiFi 'Free_Airport_WiFi' requires no password. Do you:",
    options: [
      "Connect and check email immediately",
      "Use it but avoid sensitive activities",
      "Connect only through VPN",
      "Use it for banking - it's convenient",
    ],
    correct: 2,
    explanation: "Open public WiFi is insecure. Always use VPN to encrypt traffic on untrusted networks.",
  },
  {
    id: 8,
    scenario: "Two-Factor Authentication (2FA) setup available. Should you:",
    options: [
      "Skip it - too much hassle",
      "Enable it on all critical accounts",
      "Use it only for banking",
      "Disable it for convenience",
    ],
    correct: 1,
    explanation: "2FA adds crucial security layer. Enable on all accounts, especially email and financial services.",
  },
  {
    id: 9,
    scenario: "Antivirus detects malware. Best response?",
    options: [
      "Ignore if computer still works",
      "Quarantine/remove immediately and scan",
      "Restart and hope it goes away",
      "Wait for IT to notice",
    ],
    correct: 1,
    explanation: "Immediately quarantine/remove detected malware and perform full system scan.",
  },
  {
    id: 10,
    scenario: "Colleague asks for your login credentials 'just this once'. You:",
    options: [
      "Share it - they're trustworthy",
      "Refuse and offer to help them properly",
      "Write it down for them",
      "Give them temporary access",
    ],
    correct: 1,
    explanation: "Never share credentials. Help them get proper access through official channels.",
  },
  {
    id: 11,
    scenario: "Email from 'CEO' asks to wire funds urgently. You should:",
    options: [
      "Send immediately - it's the CEO",
      "Verify through separate channel (call/in person)",
      "Reply asking for confirmation",
      "Forward to accounting",
    ],
    correct: 1,
    explanation: "Verify unusual financial requests through independent channels. This is classic CEO fraud.",
  },
  {
    id: 12,
    scenario: "You notice unusual login from unknown location. Action?",
    options: [
      "Ignore - might be VPN",
      "Change password and enable alerts",
      "Log out and wait",
      "Delete the account",
    ],
    correct: 1,
    explanation: "Unauthorized access attempt requires immediate password change and security review.",
  },
  {
    id: 13,
    scenario: "Database backup hasn't run in 3 months. Priority?",
    options: [
      "Schedule for next month",
      "Immediately configure and run backup",
      "Wait for system upgrade",
      "Backups are optional",
    ],
    correct: 1,
    explanation: "Regular backups are critical for disaster recovery. Fix backup system immediately.",
  },
  {
    id: 14,
    scenario: "Default admin credentials still active on server. Do you:",
    options: [
      "Keep them for easy access",
      "Change immediately to strong unique password",
      "Just add another admin account",
      "Disable the account completely",
    ],
    correct: 1,
    explanation: "Default credentials are widely known. Change immediately to prevent unauthorized access.",
  },
  {
    id: 15,
    scenario: "Employee downloads work files to personal cloud. Response?",
    options: [
      "Allow - it's convenient",
      "Stop and explain data policy/risks",
      "Report to HR immediately",
      "Ignore if they're senior staff",
    ],
    correct: 1,
    explanation: "Educate about data policies and risks of using unauthorized cloud services for work data.",
  },
];

// In-memory session store (keyed by a simple session id from cookie)
const sessions = new Map();

function getSession(req) {
  let sid = req.cookies?.hts_session;
  if (!sid || !sessions.has(sid)) {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessions.set(sid, {});
  }
  req._htsSid = sid;
  return sessions.get(sid);
}

function setSessionCookie(req, res) {
  res.cookie("hts_session", req._htsSid, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 3600000,
  });
}

// Shuffle helper
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Initialize / reset game
router.get("/play", (req, res) => {
  const session = getSession(req);
  session.score = 0;
  session.time_remaining = 60;
  session.challenges_completed = 0;
  session.challenge_order = shuffleArray(
    Array.from({ length: CHALLENGES.length }, (_, i) => i)
  );
  session.current_challenge_index = 0;
  setSessionCookie(req, res);
  res.json({ success: true });
});

// Get current challenge
router.get("/get-challenge", (req, res) => {
  const session = getSession(req);
  setSessionCookie(req, res);

  const idx = session.current_challenge_index || 0;
  const order = session.challenge_order || Array.from({ length: CHALLENGES.length }, (_, i) => i);

  if (idx >= CHALLENGES.length) {
    return res.json({
      complete: true,
      score: session.score || 0,
      challenges_completed: session.challenges_completed || 0,
    });
  }

  const challenge = { ...CHALLENGES[order[idx]] };
  delete challenge.correct;
  delete challenge.explanation;

  res.json({
    complete: false,
    challenge,
    progress: { current: idx + 1, total: CHALLENGES.length },
    score: session.score || 0,
    time_remaining: session.time_remaining || 60,
  });
});

// Submit answer
router.post("/submit-answer", (req, res) => {
  const session = getSession(req);
  setSessionCookie(req, res);

  const idx = session.current_challenge_index || 0;
  const order = session.challenge_order || Array.from({ length: CHALLENGES.length }, (_, i) => i);

  if (idx >= CHALLENGES.length) {
    return res.status(400).json({ error: "Game already complete" });
  }

  const challenge = CHALLENGES[order[idx]];
  const userAnswer = req.body.answer;
  const correct = userAnswer === challenge.correct;

  let score = session.score || 0;
  let time = session.time_remaining || 60;

  if (correct) {
    score += 10;
    time += 5;
  } else {
    score -= 5;
    time -= 3;
  }
  time = Math.max(0, time);

  session.score = score;
  session.time_remaining = time;
  session.challenges_completed = idx + 1;
  session.current_challenge_index = idx + 1;

  res.json({
    correct,
    explanation: challenge.explanation,
    score,
    time_remaining: time,
    game_complete: idx + 1 >= CHALLENGES.length || time <= 0,
  });
});

// Update time
router.post("/update-time", (req, res) => {
  const session = getSession(req);
  setSessionCookie(req, res);
  session.time_remaining = req.body.time_remaining || 0;
  res.json({ success: true, time_remaining: session.time_remaining });
});

// Get result
router.get("/result", (req, res) => {
  const session = getSession(req);
  setSessionCookie(req, res);

  const score = session.score || 0;
  const challengesCompleted = session.challenges_completed || 0;

  let rank, rankClass, rankIcon;
  if (score >= 91) {
    rank = "Master Hacker";
    rankClass = "master";
    rankIcon = "crown";
  } else if (score >= 61) {
    rank = "Senior Security Engineer";
    rankClass = "senior";
    rankIcon = "star";
  } else if (score >= 31) {
    rank = "Security Analyst";
    rankClass = "analyst";
    rankIcon = "shield";
  } else {
    rank = "Cyber Apprentice";
    rankClass = "apprentice";
    rankIcon = "book";
  }

  res.json({
    score,
    challenges_completed: challengesCompleted,
    total_challenges: CHALLENGES.length,
    rank,
    rank_class: rankClass,
    rank_icon: rankIcon,
  });
});

export default router;
