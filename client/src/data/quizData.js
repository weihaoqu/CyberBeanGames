// General pre-quiz: asked ONCE on first game visit (baseline cyber knowledge)
export const generalPreQuiz = [
  {
    id: "gen-1",
    question: "Which of these is the strongest indicator that an email is a phishing attempt?",
    options: [
      "The email contains a company logo",
      "The sender's domain doesn't match the real organization",
      "The email uses formal language",
      "The email was sent during business hours",
    ],
    correct: 1,
  },
  {
    id: "gen-2",
    question: "Why are passwords based on personal information (pet names, birthdays) considered weak?",
    options: [
      "They are too short to be secure",
      "Attackers can find this information on social media and guess them",
      "They don't contain special characters",
      "They expire faster than random passwords",
    ],
    correct: 1,
  },
  {
    id: "gen-3",
    question: "The 'Principle of Least Privilege' means:",
    options: [
      "Everyone should have administrator access for convenience",
      "Users should only have the minimum access needed for their role",
      "Access should be granted based on seniority",
      "Privileges should be rotated weekly",
    ],
    correct: 1,
  },
  {
    id: "gen-4",
    question: "When malware is detected on a system, the first priority should be:",
    options: [
      "Reformat the entire network immediately",
      "Ignore it if the system still works normally",
      "Isolate the infected system to prevent it from spreading",
      "Email the attacker to negotiate",
    ],
    correct: 2,
  },
  {
    id: "gen-5",
    question: "What is the primary purpose of a firewall?",
    options: [
      "To encrypt all stored data on disk",
      "To filter network traffic based on security rules",
      "To scan files for viruses automatically",
      "To back up data to the cloud",
    ],
    correct: 1,
  },
];

// Post-game quizzes: 2 questions per game, testing what THAT game specifically taught
const postQuizzes = {
  cyberanalyst: [
    {
      id: "ca-post-1",
      question: "You receive an email saying you won a lottery you never entered, with a link to 'claim-prize-now.tk'. What is the biggest red flag?",
      options: [
        "The email is too long",
        "Free domain (.tk) and winning something you never entered",
        "The email has a subject line",
        "It was sent on a weekend",
      ],
      correct: 1,
    },
    {
      id: "ca-post-2",
      question: "Multiple failed login attempts from a single IP address in rapid succession most likely indicates:",
      options: [
        "A user who forgot their password",
        "Normal network traffic during peak hours",
        "A brute-force attack trying to guess credentials",
        "A scheduled system backup running",
      ],
      correct: 2,
    },
  ],

  "password-challenge": [
    {
      id: "pc-post-1",
      question: "In the game, passwords were cracked using pet names and birth years from social media. What does this demonstrate?",
      options: [
        "Social media platforms have weak security",
        "Attackers use publicly shared personal info (OSINT) to guess passwords",
        "All 8-character passwords are insecure",
        "Only hackers can find social media profiles",
      ],
      correct: 1,
    },
    {
      id: "pc-post-2",
      question: "Which password strategy best protects against the kind of attack shown in this game?",
      options: [
        "Use your pet's name but add a number at the end",
        "Use the same strong password for all accounts",
        "Use a unique random passphrase or password manager for each account",
        "Change your password every week to a slight variation",
      ],
      correct: 2,
    },
  ],

  "hack-the-system": [
    {
      id: "hts-post-1",
      question: "You find an unfamiliar USB drive in the office parking lot. What should you do?",
      options: [
        "Plug it into your computer to check what's on it",
        "Give it to a coworker to investigate",
        "Report it to IT security without connecting it to any device",
        "Format it and use it for your own files",
      ],
      correct: 2,
    },
    {
      id: "hts-post-2",
      question: "A critical security patch is released for your system. When should you install it?",
      options: [
        "Wait a few months to see if others have issues",
        "Install it immediately — patches fix known vulnerabilities",
        "Only install it if your system shows signs of infection",
        "Skip it if your antivirus is up to date",
      ],
      correct: 1,
    },
  ],

  "access-control": [
    {
      id: "ac-post-1",
      question: "A department manager requests access to view employee salary data. Based on RBAC, you should:",
      options: [
        "Grant it — managers outrank regular employees",
        "Deny it — salary data is restricted to HR and executives only",
        "Grant it temporarily for one day",
        "Ask the manager's supervisor for approval",
      ],
      correct: 1,
    },
    {
      id: "ac-post-2",
      question: "Why is 'separation of duties' important in access control?",
      options: [
        "It divides work evenly among employees",
        "It prevents any single person from having too much control over critical processes",
        "It reduces the number of employees needed",
        "It makes system administration simpler",
      ],
      correct: 1,
    },
  ],

  "lab-escape": [
    {
      id: "le-post-1",
      question: "In the game, patching costs 1 action point but deleting malware costs 3. What real-world lesson does this teach?",
      options: [
        "Antivirus software is expensive",
        "Prevention (patching) is cheaper and easier than remediation (removing infections)",
        "You should never delete infected files",
        "Malware always requires professional help to remove",
      ],
      correct: 1,
    },
    {
      id: "le-post-2",
      question: "Worms spread to all adjacent nodes at 100% rate, while trojans are hidden and spread at 50%. What does this teach about real malware?",
      options: [
        "All malware behaves identically",
        "Different malware types require different detection and containment strategies",
        "Slower malware is always more dangerous",
        "Hidden malware can be safely ignored",
      ],
      correct: 1,
    },
  ],

  phishtank: [
    {
      id: "pt-post-1",
      question: "You receive a text saying your bank account is locked with a link to 'secure-bankofamerica.com'. What should you do?",
      options: [
        "Click the link immediately — your money could be at risk",
        "Reply to the text asking for more details",
        "Ignore the text and contact your bank directly using their official number or app",
        "Forward it to friends to check if they got the same message",
      ],
      correct: 2,
    },
    {
      id: "pt-post-2",
      question: "Someone calls claiming to be from the IRS, saying you owe back taxes and must pay immediately with gift cards or face arrest. This is:",
      options: [
        "Likely legitimate — the IRS does call about overdue taxes",
        "A common phone scam — the IRS never demands gift card payments or threatens immediate arrest",
        "Something you should verify by giving them your Social Security Number",
        "A situation where you should pay to be safe, then investigate later",
      ],
      correct: 1,
    },
  ],
};

export default postQuizzes;
