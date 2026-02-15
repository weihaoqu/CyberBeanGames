import { Activity, AlertTriangle, Award, CheckCircle, Database, Search, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import './app.css';

const CyberSOCAnalyst = () => {
  const [gameState, setGameState] = useState('story'); // story, menu, playing, battle, showResults
  const [storyProgress, setStoryProgress] = useState(() => {
    const saved = localStorage.getItem('storyProgress');
    return saved ? parseInt(saved) : 0;
  });
  const [currentScenario, setCurrentScenario] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(() => {
    const saved = localStorage.getItem('totalScore');
    return saved ? parseInt(saved) : 0;
  });
  const [showResults, setShowResults] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  // Battle system
  const [playerHealth, setPlayerHealth] = useState(5);
  const [hackerHealth, setHackerHealth] = useState(5);
  const [maxPlayerHealth, setMaxPlayerHealth] = useState(5);
  const [showBattleAnimation, setShowBattleAnimation] = useState('');
  const [battleMessage, setBattleMessage] = useState('');
  const [questionRevealed, setQuestionRevealed] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const [filter, setFilter] = useState('All');
  const [completedScenarios, setCompletedScenarios] = useState(() => {
    const saved = localStorage.getItem('completedScenarios');
    return saved ? JSON.parse(saved) : [];
  });

  // Mini-game state
  const [snakePos, setSnakePos] = useState([{ x: 10, y: 10 }]);
  const [snakeDir, setSnakeDir] = useState({ x: 1, y: 0 });
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [gameOver, setGameOver] = useState(false);
  const [snakeScore, setSnakeScore] = useState(0);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('completedScenarios', JSON.stringify(completedScenarios));
    localStorage.setItem('storyProgress', storyProgress.toString());
    localStorage.setItem('totalScore', totalScore.toString());
  }, [completedScenarios, storyProgress, totalScore]);

  const scenarios = [
    // ===== BEGINNER LEVEL: Scam Detection - No tech knowledge needed! =====
    {
      id: 1,
      title: "Email Phishing - Lottery Winner Scam",
      difficulty: "Beginner",
      description: "You received an email claiming you won $1 million. Is it real or a scam?",
      briefing: "You receive an email from 'International Lottery Commission' stating you won $1,000,000 in a lottery you never entered. The email asks you to provide personal information and pay a 'processing fee' of $500 to claim your prize.",
      logs: [
        { time: "09:15:23", event: "EMAIL_RECEIVED", from: "winner-notification@intl-lottery-commission.tk", subject: "CONGRATULATIONS! You Won $1,000,000!" },
        { time: "09:15:23", event: "EMAIL_CONTENT", text: "Dear Lucky Winner, You have won the grand prize..." },
        { time: "09:15:23", event: "SENDER_DOMAIN", domain: ".tk (Tokelau - free domain service)" },
        { time: "09:15:23", event: "LINK_DETECTED", url: "http://claim-prize-now.tk/form.php" },
        { time: "09:15:23", event: "REQUEST", action: "Provide: Full name, address, SSN, bank account" },
        { time: "09:15:23", event: "REQUEST", action: "Pay $500 processing fee via wire transfer" },
      ],
      questions: [
        {
          id: 1,
          question: "What is the FIRST red flag that suggests this email is a scam?",
          options: [
            "You never entered any lottery",
            "The email has colorful text",
            "It arrived in the morning",
            "It mentions money"
          ],
          correct: 0,
          explanation: "The biggest red flag is that you can't win a lottery you never entered! Legitimate lotteries only contact actual participants."
        },
        {
          id: 2,
          question: "Why is the email domain '.tk' suspicious?",
          options: [
            "It's a normal business domain",
            "It's a free domain service often used by scammers",
            "It means 'ticket'",
            "Nothing suspicious about it"
          ],
          correct: 1,
          explanation: ".tk domains are free and commonly used by scammers because they're untraceable and disposable."
        },
        {
          id: 3,
          question: "What's wrong with asking for a 'processing fee'?",
          options: [
            "$500 is too cheap",
            "Legitimate lotteries NEVER ask winners to pay fees upfront",
            "Wire transfer is the safest payment method",
            "Processing fees are normal for prizes"
          ],
          correct: 1,
          explanation: "Real lottery organizations deduct fees from winnings. Asking winners to pay upfront is a classic scam tactic."
        },
        {
          id: 4,
          question: "What information should you NEVER provide in response?",
          options: [
            "Your favorite color",
            "Your Social Security Number (SSN) and bank account",
            "Your first name only",
            "The current date"
          ],
          correct: 1,
          explanation: "Never share SSN, bank account, or sensitive personal information via email, especially to unknown senders."
        },
        {
          id: 5,
          question: "What should you do with this email?",
          options: [
            "Reply asking for more details",
            "Click the link to investigate",
            "Delete it and mark as spam",
            "Forward it to all your friends"
          ],
          correct: 2,
          explanation: "Delete suspicious emails, mark as spam, and never click links or provide information to unknown senders."
        },
        {
          id: 6,
          question: "If you accidentally clicked the link, what should you do?",
          options: [
            "Fill out the form quickly",
            "Close the browser immediately and run antivirus software",
            "Enter fake information to trick them",
            "Nothing, it's already too late"
          ],
          correct: 1,
          explanation: "Close the browser immediately, avoid entering any data, and scan your computer for malware. It's not too late if you didn't enter information."
        }
      ]
    },
    {
      id: 2,
      title: "SMS Phishing (Smishing) - Bank Alert",
      difficulty: "Beginner",
      description: "You get an urgent text message from your 'bank' about suspicious activity.",
      briefing: "You receive a text message: 'URGENT: Suspicious activity detected on your account. Click here immediately to verify: bit.ly/bank-verify-now or your account will be locked in 2 hours. -YourBank Security'",
      logs: [
        { time: "14:32:18", event: "SMS_RECEIVED", from: "+1-555-BANK-MSG (unknown number)" },
        { time: "14:32:18", event: "MESSAGE", text: "URGENT: Suspicious activity detected..." },
        { time: "14:32:18", event: "LINK_DETECTED", url: "bit.ly/bank-verify-now (shortened URL)" },
        { time: "14:32:18", event: "SENDER", verified: "NO - Not from official bank number" },
        { time: "14:32:18", event: "PRESSURE_TACTIC", note: "Threatens account lockout in 2 hours" },
        { time: "14:32:18", event: "GRAMMAR", note: "Generic greeting, no account number mentioned" },
      ],
      questions: [
        {
          id: 1,
          question: "What type of scam is this?",
          options: [
            "Email phishing",
            "SMS phishing (Smishing)",
            "Phone call scam",
            "Social media scam"
          ],
          correct: 1,
          explanation: "This is 'smishing' - phishing via SMS text messages. Scammers send fake urgent texts to steal information."
        },
        {
          id: 2,
          question: "What's the biggest red flag in this message?",
          options: [
            "It mentions the bank name",
            "Uses a shortened URL (bit.ly) and unknown sender number",
            "Sent during business hours",
            "Uses capital letters"
          ],
          correct: 1,
          explanation: "Banks never use shortened URLs or send security alerts from random numbers. Legitimate alerts use official channels."
        },
        {
          id: 3,
          question: "Why does the message create urgency ('2 hours to verify')?",
          options: [
            "Banks always set 2-hour deadlines",
            "To make you panic and click without thinking",
            "It's the law for security alerts",
            "To be helpful"
          ],
          correct: 1,
          explanation: "Scammers use urgency and fear to pressure victims into acting quickly without verifying the message."
        },
        {
          id: 4,
          question: "What should you do if you're worried about your account?",
          options: [
            "Click the link to check quickly",
            "Reply to the text asking questions",
            "Call your bank using the official number on their website or your card",
            "Text back your account number for verification"
          ],
          correct: 2,
          explanation: "Never use contact info from suspicious messages. Always call your bank using the official number from their website or your bank card."
        },
        {
          id: 5,
          question: "What information would the scam link likely ask for?",
          options: [
            "Your favorite color",
            "Bank account number, password, Social Security Number",
            "Your phone model",
            "Your email address only"
          ],
          correct: 1,
          explanation: "Scam links lead to fake websites designed to steal sensitive banking credentials and personal information."
        },
        {
          id: 6,
          question: "How can you verify if a bank alert is real?",
          options: [
            "Click any links to check",
            "Log into your bank app or website directly (not via the link)",
            "Reply to the message",
            "Forward it to friends"
          ],
          correct: 1,
          explanation: "Always access your bank by typing the official website or using the official app, never through links in messages."
        }
      ]
    },
    {
      id: 3,
      title: "Fake Job Offer - Social Media Scam",
      difficulty: "Beginner",
      description: "Someone messaged you on social media with an amazing job offer. Too good to be true?",
      briefing: "You receive a direct message on Instagram: 'Hi! I found your profile and think you'd be perfect for a work-from-home position. Earn $5,000/week with just 2 hours of work daily! No experience needed. Click this link to apply now: jobs-easy-money.com/apply'",
      logs: [
        { time: "11:45:00", event: "DM_RECEIVED", platform: "Instagram", from: "@hiring_manager_2024 (account created 3 days ago)" },
        { time: "11:45:00", event: "MESSAGE", text: "Earn $5,000/week, 2 hours daily, no experience..." },
        { time: "11:45:00", event: "SENDER_PROFILE", followers: "25", following: "2,340", posts: "1" },
        { time: "11:45:00", event: "LINK", url: "jobs-easy-money.com (registered 1 week ago)" },
        { time: "11:45:00", event: "RED_FLAG", note: "No company name mentioned, unrealistic salary" },
        { time: "11:45:00", event: "REQUEST", action: "Application asks for: SSN, bank account for 'direct deposit'" },
      ],
      questions: [
        {
          id: 1,
          question: "What makes this job offer suspicious?",
          options: [
            "It's on social media",
            "Unrealistic pay ($5,000/week for 2 hours work) and no company name",
            "Uses professional language",
            "Sent during the day"
          ],
          correct: 1,
          explanation: "Legitimate jobs don't pay $5,000/week for minimal work. Scammers use unrealistic promises to lure victims."
        },
        {
          id: 2,
          question: "What's suspicious about the sender's profile?",
          options: [
            "Has 25 followers",
            "Brand new account (3 days old) following many people but few followers",
            "Uses Instagram",
            "Has one post"
          ],
          correct: 1,
          explanation: "Scam accounts are typically new, follow many people to find victims, but have few followers and minimal content."
        },
        {
          id: 3,
          question: "Why would the 'application' ask for your bank account?",
          options: [
            "For legitimate direct deposit setup",
            "To steal your money and identity",
            "Required by law for all jobs",
            "To verify employment eligibility"
          ],
          correct: 1,
          explanation: "Real employers never ask for bank details or SSN in initial applications. Scammers use this to drain accounts or commit identity theft."
        },
        {
          id: 4,
          question: "What should you do with this message?",
          options: [
            "Apply quickly before spots fill up",
            "Report the account as spam/scam and block the sender",
            "Ask for more details",
            "Share with friends"
          ],
          correct: 1,
          explanation: "Report and block scam accounts to protect yourself and others. Social media platforms can shut down fraudulent accounts."
        },
        {
          id: 5,
          question: "How can you find legitimate remote jobs?",
          options: [
            "Click on any social media job offers",
            "Use established job sites (LinkedIn, Indeed) and verify company websites",
            "Only trust messages from strangers",
            "Follow random hiring accounts"
          ],
          correct: 1,
          explanation: "Use reputable job platforms and always research companies independently by visiting their official websites."
        },
        {
          id: 6,
          question: "What's a common next step in this type of scam?",
          options: [
            "Sending you a real paycheck",
            "Asking you to buy 'equipment' or pay 'training fees' upfront",
            "Scheduling a video interview",
            "Sending a formal job offer letter"
          ],
          correct: 1,
          explanation: "Job scams often ask victims to pay for equipment, training, or background checks upfront. Real employers never charge you to work."
        }
      ]
    },
    {
      id: 4,
      title: "Fake Website - Online Shopping Scam",
      difficulty: "Beginner",
      description: "You found an amazing deal on a brand new iPhone for $200. Is this website legit?",
      briefing: "You're shopping online and find a website 'appleestore-deals.com' selling the latest iPhone for only $200 (regular price $999). The site has spelling errors and requires payment via wire transfer or gift cards only.",
      logs: [
        { time: "16:22:00", event: "WEBSITE_VISIT", url: "appleestore-deals.com (NOTE: Real Apple store is apple.com)" },
        { time: "16:22:00", event: "DOMAIN_AGE", registered: "Created 5 days ago" },
        { time: "16:22:00", event: "SSL_CHECK", status: "No HTTPS security certificate" },
        { time: "16:22:00", event: "CONTENT", note: "Multiple spelling errors, poor grammar" },
        { time: "16:22:00", event: "PAYMENT", methods: "Wire transfer, iTunes gift cards ONLY (no credit cards)" },
        { time: "16:22:00", event: "CONTACT", info: "No phone number, physical address, or customer service" },
      ],
      questions: [
        {
          id: 1,
          question: "What's the first clue that this website is fake?",
          options: [
            "They sell iPhones",
            "Domain name 'appleestore-deals.com' - extra 'e' and '-deals' (not official apple.com)",
            "Offers a discount",
            "Uses the color white"
          ],
          correct: 1,
          explanation: "Scammers create fake domains that look similar to real ones. The official Apple store is 'apple.com', not 'appleestore-deals.com'."
        },
        {
          id: 2,
          question: "Why is the price ($200 for a $999 phone) a major red flag?",
          options: [
            "It's a normal sale price",
            "Too good to be true - legitimate retailers don't discount 80% off new products",
            "$200 is too expensive",
            "Apple always has these deals"
          ],
          correct: 1,
          explanation: "Scammers lure victims with unrealistic prices. If a deal seems too good to be true, it almost always is."
        },
        {
          id: 3,
          question: "Why is 'no HTTPS' a security concern?",
          options: [
            "HTTPS doesn't matter for shopping",
            "No HTTPS means your payment info is sent unencrypted and easily stolen",
            "HTTPS is only for banks",
            "Gift card payments don't need HTTPS"
          ],
          correct: 1,
          explanation: "Legitimate shopping sites use HTTPS (padlock icon) to encrypt your data. No HTTPS means your information is transmitted in plain text."
        },
        {
          id: 4,
          question: "Why do scam sites only accept wire transfers or gift cards?",
          options: [
            "They're the safest payment methods",
            "These methods are untraceable and non-refundable (you can't get money back)",
            "Credit cards don't work online",
            "It's faster than credit cards"
          ],
          correct: 1,
          explanation: "Scammers prefer wire transfers and gift cards because they're impossible to reverse. Credit cards offer fraud protection and chargebacks."
        },
        {
          id: 5,
          question: "What does 'Domain created 5 days ago' tell you?",
          options: [
            "It's a fresh, new legitimate business",
            "Scammers create new domains frequently to avoid being shut down",
            "Newer websites are more trustworthy",
            "Nothing suspicious"
          ],
          correct: 1,
          explanation: "Legitimate businesses have established domains. Brand new domains are often scam sites that will disappear after stealing money."
        },
        {
          id: 6,
          question: "Before buying from an unfamiliar website, you should:",
          options: [
            "Pay quickly before the deal expires",
            "Search for reviews, check domain age, verify contact information, and use secure payment methods",
            "Trust any website with product photos",
            "Only check the price"
          ],
          correct: 1,
          explanation: "Always research unfamiliar sites: read reviews, verify they're legitimate, check for contact info, and never pay via untraceable methods."
        }
      ]
    },
    {
      id: 5,
      title: "Tech Support Phone Scam",
      difficulty: "Beginner",
      description: "You receive a call from 'Microsoft Support' saying your computer has viruses.",
      briefing: "Your phone rings. Caller ID shows 'Microsoft Technical Support'. Voice says: 'This is Microsoft Windows Support. We detected dangerous viruses on your computer. We need remote access immediately to remove them, or your personal data will be destroyed. Please download TeamViewer software and give us the access code.'",
      logs: [
        { time: "10:05:00", event: "PHONE_CALL", from: "Spoofed number showing 'Microsoft Support'" },
        { time: "10:05:00", event: "CLAIM", text: "Your computer has viruses detected by Microsoft" },
        { time: "10:05:00", event: "REQUEST", action: "Download remote access software (TeamViewer)" },
        { time: "10:05:00", event: "PRESSURE", tactic: "Urgent - data will be destroyed soon" },
        { time: "10:05:00", event: "RED_FLAG", note: "Microsoft NEVER makes unsolicited support calls" },
        { time: "10:05:00", event: "FOLLOW_UP", request: "May ask for payment for 'support services'" },
      ],
      questions: [
        {
          id: 1,
          question: "What's wrong with this call?",
          options: [
            "Microsoft is calling during business hours",
            "Microsoft NEVER makes unsolicited support calls - this is a scam",
            "They detected viruses (this is normal)",
            "They want to help you"
          ],
          correct: 1,
          explanation: "Microsoft, Apple, and other tech companies NEVER cold-call customers about viruses or security issues. All such calls are scams."
        },
        {
          id: 2,
          question: "What would happen if you gave them remote access?",
          options: [
            "They'd fix your computer for free",
            "They'd install actual malware, steal files, and demand payment",
            "They'd install Windows updates",
            "Nothing bad"
          ],
          correct: 1,
          explanation: "Scammers use remote access to install malware, steal passwords and files, view personal data, and then charge fake 'support fees'."
        },
        {
          id: 3,
          question: "How did they make the caller ID show 'Microsoft Support'?",
          options: [
            "They are really from Microsoft",
            "Caller ID spoofing - scammers can fake any number or name",
            "It's impossible to fake caller ID",
            "Your phone is broken"
          ],
          correct: 1,
          explanation: "Scammers use 'caller ID spoofing' technology to display fake names and numbers. Never trust caller ID alone."
        },
        {
          id: 4,
          question: "What should you do when you receive this call?",
          options: [
            "Follow their instructions immediately",
            "Hang up immediately without engaging or providing any information",
            "Give them access to check if it's real",
            "Argue with them"
          ],
          correct: 1,
          explanation: "Hang up immediately. Don't engage, argue, or provide any info. Legitimate companies don't operate this way."
        },
        {
          id: 5,
          question: "How can you really check if your computer has viruses?",
          options: [
            "Wait for Microsoft to call you",
            "Use reputable antivirus software you installed yourself",
            "Download software from callers",
            "Call random tech support numbers"
          ],
          correct: 1,
          explanation: "Use trusted antivirus software (Windows Defender, Norton, McAfee) that you download directly from official websites."
        },
        {
          id: 6,
          question: "If you already gave remote access, what should you do?",
          options: [
            "Nothing, it's too late",
            "Disconnect from internet, run antivirus, change all passwords, monitor bank accounts",
            "Give them more money to fix it",
            "Wait and see what happens"
          ],
          correct: 1,
          explanation: "Act fast: disconnect internet, scan for malware, change passwords (from a safe device), monitor bank/credit cards for fraud."
        }
      ]
    },
    {
      id: 6,
      title: "Suspicious Link - URL Shortener Trap",
      difficulty: "Beginner",
      description: "A friend's social media account sent you a link. Should you click it?",
      briefing: "Your friend's Facebook account messages you: 'OMG is this you in this video?? 😂😂 bit.ly/wtch-this-now' You notice your friend's messages are usually more personal and they haven't mentioned any video before.",
      logs: [
        { time: "19:40:00", event: "MESSAGE_RECEIVED", platform: "Facebook Messenger", from: "Friend's account" },
        { time: "19:40:00", event: "MESSAGE", text: "OMG is this you in this video?? bit.ly/wtch-this-now" },
        { time: "19:40:00", event: "LINK_TYPE", note: "Shortened URL (bit.ly) - can't see real destination" },
        { time: "19:40:00", event: "CONTEXT", note: "Friend never mentioned taking any video of you" },
        { time: "19:40:00", event: "LANGUAGE", note: "Generic message, not friend's usual style" },
        { time: "19:40:00", event: "WARNING", note: "Friend's account may be compromised or hacked" },
      ],
      questions: [
        {
          id: 1,
          question: "What's likely happening here?",
          options: [
            "Your friend really found a video of you",
            "Your friend's account was hacked and is spreading malware links",
            "It's a normal message",
            "Facebook sent you a notification"
          ],
          correct: 1,
          explanation: "Compromised accounts send generic, urgent messages with suspicious links to all contacts. This is a classic account hack pattern."
        },
        {
          id: 2,
          question: "Why are shortened URLs (bit.ly, tinyurl) risky?",
          options: [
            "They load faster",
            "You can't see the real destination - could lead to malware or phishing sites",
            "They're always safe",
            "They're official Facebook links"
          ],
          correct: 1,
          explanation: "URL shorteners hide the actual destination. Scammers use them to trick people into clicking malicious links."
        },
        {
          id: 3,
          question: "What would likely happen if you clicked the link?",
          options: [
            "Watch a funny video",
            "Redirected to fake login page stealing your password, or download malware",
            "Win a prize",
            "See your friend's photos"
          ],
          correct: 1,
          explanation: "Malicious links lead to fake login pages (steal your password) or automatically download viruses/spyware."
        },
        {
          id: 4,
          question: "What should you do first?",
          options: [
            "Click the link to see what it is",
            "Contact your friend through a different method (call/text) to verify they sent it",
            "Share the link with others",
            "Reply asking for more details"
          ],
          correct: 1,
          explanation: "Verify suspicious messages through a different communication channel. Call or text your friend directly to check if they sent it."
        },
        {
          id: 5,
          question: "How can you safely check where a shortened URL leads?",
          options: [
            "Just click it",
            "Use URL expander tools (like unshorten.it) to preview the destination first",
            "There's no way to check",
            "Ask the scammer"
          ],
          correct: 1,
          explanation: "URL expander services reveal the real destination without visiting the link. But when in doubt, don't click at all."
        },
        {
          id: 6,
          question: "If you clicked and entered your password on a fake page, do:",
          options: [
            "Nothing, your password is already stolen",
            "Immediately change your password and enable two-factor authentication",
            "Wait a few days to see",
            "Delete your account"
          ],
          correct: 1,
          explanation: "Change your password immediately from the official website, enable 2FA, and check for unauthorized access in account settings."
        }
      ]
    },
    {
      id: 7,
      title: "Fake Invoice Email - Business Scam",
      difficulty: "Beginner",
      description: "You receive an email with an invoice attachment for something you didn't buy.",
      briefing: "Email from 'accounts@payable-invoice.com' with subject 'URGENT: Unpaid Invoice #47239 - Payment Required'. Message says you owe $1,247 for software licensing and threatens legal action. Attachment: 'Invoice_47239.pdf.exe'",
      logs: [
        { time: "08:12:00", event: "EMAIL_RECEIVED", from: "accounts@payable-invoice.com (not a company you know)" },
        { time: "08:12:00", event: "SUBJECT", text: "URGENT: Unpaid Invoice - Payment Required" },
        { time: "08:12:00", event: "ATTACHMENT", filename: "Invoice_47239.pdf.exe (SUSPICIOUS!)" },
        { time: "08:12:00", event: "FILE_TYPE", note: ".exe is executable program, NOT a PDF document" },
        { time: "08:12:00", event: "THREAT", text: "Legal action threatened if not paid within 24 hours" },
        { time: "08:12:00", event: "SENDER", verification: "Not from any legitimate vendor you work with" },
      ],
      questions: [
        {
          id: 1,
          question: "What's the biggest red flag in this email?",
          options: [
            "It mentions money",
            "File named 'Invoice.pdf.exe' - .exe is a program file, not a document",
            "Uses the word URGENT",
            "Sent in the morning"
          ],
          correct: 1,
          explanation: ".exe files are executable programs. Scammers disguise malware as documents. Real invoices are PDF, not .exe files."
        },
        {
          id: 2,
          question: "Why do scammers use fake invoice emails?",
          options: [
            "To help you track expenses",
            "People often click on business-looking emails, especially if they fear owing money",
            "Invoices are fun to read",
            "To send real bills"
          ],
          correct: 1,
          explanation: "Fake invoices exploit fear and urgency. People panic about owing money and click without thinking, installing malware."
        },
        {
          id: 3,
          question: "What would happen if you opened the .exe attachment?",
          options: [
            "View a PDF invoice",
            "Install ransomware or spyware that steals data or locks your files",
            "Pay the invoice online",
            "Nothing"
          ],
          correct: 1,
          explanation: "Running .exe files from emails installs malware - often ransomware that encrypts your files or spyware that steals passwords."
        },
        {
          id: 4,
          question: "How can you verify if an invoice is legitimate?",
          options: [
            "Open the attachment to check",
            "Contact the supposed vendor using official contact info from their website (not the email)",
            "Pay immediately to avoid legal action",
            "Reply to the email asking questions"
          ],
          correct: 1,
          explanation: "Never use contact info from suspicious emails. Look up the company independently and call their official number to verify."
        },
        {
          id: 5,
          question: "What's suspicious about the sender domain 'payable-invoice.com'?",
          options: [
            "Nothing, it's professional",
            "Generic domain, not from a specific company you do business with",
            "Too short",
            "Contains a dash"
          ],
          correct: 1,
          explanation: "Legitimate invoices come from specific companies you work with (e.g., microsoft.com), not generic domains like 'payable-invoice.com'."
        },
        {
          id: 6,
          question: "Best practice for email attachments from unknown senders?",
          options: [
            "Always open them to see what they are",
            "Never open attachments from unknown senders, especially .exe files",
            "Open on your phone first",
            "Forward to colleagues to check"
          ],
          correct: 1,
          explanation: "Never open unexpected attachments, especially from unknown senders. Delete suspicious emails without opening attachments."
        }
      ]
    },

    // ===== INTERMEDIATE LEVEL: Password Security & Authentication Attacks =====
    {
      id: 8,
      title: "Weak Password Attack - Brute Force",
      difficulty: "Intermediate",
      description: "A user account was compromised through password guessing. Investigate the attack.",
      briefing: "Security logs show 127 failed login attempts on user account 'jsmith@company.com' within 5 minutes, followed by successful login from an unusual location. The attack used common password combinations.",
      logs: [
        { time: "14:23:12", event: "LOGIN_FAIL", user: "jsmith@company.com", attempt: "password123" },
        { time: "14:23:15", event: "LOGIN_FAIL", user: "jsmith@company.com", attempt: "letmein" },
        { time: "14:23:18", event: "LOGIN_FAIL", user: "jsmith@company.com", attempt: "admin123" },
        { time: "14:24:45", event: "LOGIN_FAIL", user: "jsmith@company.com", attempt: "welcome1" },
        { time: "14:25:12", event: "LOGIN_SUCCESS", user: "jsmith@company.com", password_used: "summer2023", location: "Romania" },
        { time: "14:25:30", event: "USER_LOCATION", usual: "New York, USA", current: "Romania" },
      ],
      questions: [
        {
          id: 1,
          question: "What type of attack successfully compromised this account?",
          options: [
            "SQL Injection",
            "Brute force password attack",
            "Phishing",
            "Man-in-the-middle"
          ],
          correct: 1,
          explanation: "Multiple rapid login attempts with different passwords followed by success indicates a brute force attack that guessed the password."
        },
        {
          id: 2,
          question: "What was wrong with the user's password 'summer2023'?",
          options: [
            "Too long",
            "Predictable pattern - common word + year (easily guessed)",
            "Too random",
            "Nothing wrong"
          ],
          correct: 1,
          explanation: "'summer2023' follows a predictable pattern. Attackers use dictionaries of common words + years. Strong passwords are random and complex."
        },
        {
          id: 3,
          question: "What security feature could have prevented this attack?",
          options: [
            "Longer username",
            "Account lockout after multiple failed attempts or rate limiting",
            "Faster internet",
            "Better email"
          ],
          correct: 1,
          explanation: "Account lockout (e.g., after 5 failed attempts) or rate limiting prevents brute force attacks by stopping repeated guessing."
        },
        {
          id: 4,
          question: "Which is the STRONGEST password?",
          options: [
            "Password123!",
            "p@ssw0rd",
            "X9$mK2#vL8^qR4&nP7",
            "JohnSmith2024"
          ],
          correct: 2,
          explanation: "Random combination of uppercase, lowercase, numbers, and symbols with good length (option 3) is strongest. Avoid patterns and personal info."
        },
        {
          id: 5,
          question: "What additional protection would make hacking much harder?",
          options: [
            "Writing password on sticky note",
            "Two-factor authentication (2FA) - requires code from phone",
            "Using same password everywhere",
            "Shorter passwords"
          ],
          correct: 1,
          explanation: "2FA requires a second verification (SMS code, app token) even if password is stolen, making unauthorized access nearly impossible."
        },
        {
          id: 6,
          question: "The login came from Romania but user is in New York. What does this indicate?",
          options: [
            "User is traveling",
            "Strong evidence of account compromise - geographic impossibility",
            "VPN use (normal)",
            "Nothing suspicious"
          ],
          correct: 1,
          explanation: "Sudden logins from distant locations are major red flags. Legitimate users don't teleport across continents."
        }
      ]
    },
    {
      id: 9,
      title: "Password Reuse - Credential Stuffing",
      difficulty: "Intermediate",
      description: "Hackers obtained passwords from a data breach and are testing them on your systems.",
      briefing: "Your company detects login attempts using valid usernames with passwords from a leaked database of another website. Attackers are testing if users reused passwords across multiple sites.",
      logs: [
        { time: "03:15:00", event: "BREACH_ALERT", source: "SocialMediaSite breach - 50 million passwords leaked" },
        { time: "03:45:23", event: "LOGIN_ATTEMPT", user: "alice@company.com", password: "(from breached database)" },
        { time: "03:45:24", event: "LOGIN_SUCCESS", user: "alice@company.com", note: "Same password used as breached site!" },
        { time: "03:45:25", event: "LOGIN_ATTEMPT", user: "bob@company.com", password: "(from breached database)" },
        { time: "03:45:26", event: "LOGIN_SUCCESS", user: "bob@company.com", note: "Same password used as breached site!" },
        { time: "03:46:00", event: "ATTACK_PATTERN", name: "Credential Stuffing - automated password reuse testing" },
      ],
      questions: [
        {
          id: 1,
          question: "What is 'credential stuffing'?",
          options: [
            "Making passwords longer",
            "Using leaked passwords from one site to hack accounts on other sites",
            "Storing passwords securely",
            "Random password guessing"
          ],
          correct: 1,
          explanation: "Credential stuffing exploits password reuse. When one site is breached, attackers test those passwords on banks, email, work accounts."
        },
        {
          id: 2,
          question: "Why did alice@ and bob@'s accounts get hacked?",
          options: [
            "Their passwords were too long",
            "They reused the same password across multiple websites",
            "They used 2FA",
            "Their passwords were random"
          ],
          correct: 1,
          explanation: "They used the same password for their social media account AND company account. One breach compromised both."
        },
        {
          id: 3,
          question: "Best practice to prevent credential stuffing attacks?",
          options: [
            "Use the same strong password everywhere",
            "Use unique passwords for each website/service",
            "Never use passwords",
            "Share passwords with friends"
          ],
          correct: 1,
          explanation: "Unique passwords for each site means one breach doesn't compromise all accounts. Use a password manager to track them."
        },
        {
          id: 4,
          question: "How can you manage many unique passwords?",
          options: [
            "Write them all on paper",
            "Use a password manager (LastPass, 1Password, Bitwarden)",
            "Use same password with different numbers (password1, password2)",
            "Don't use passwords"
          ],
          correct: 1,
          explanation: "Password managers securely store unique passwords for each site and generate strong random passwords automatically."
        },
        {
          id: 5,
          question: "How do attackers get breached passwords?",
          options: [
            "Guessing randomly",
            "Hackers steal databases from insecure websites, then sell/share them online",
            "Companies give them away",
            "Password managers leak them"
          ],
          correct: 1,
          explanation: "When websites get hacked, password databases are stolen and leaked online. Attackers then test these passwords everywhere."
        },
        {
          id: 6,
          question: "If a site you use has a data breach, what should you do?",
          options: [
            "Nothing",
            "Immediately change your password on that site AND any other sites using the same password",
            "Wait a few months",
            "Delete your email"
          ],
          correct: 1,
          explanation: "Change the compromised password immediately, and anywhere else you reused it. Enable 2FA. Use sites like haveibeenpwned.com to check breaches."
        }
      ]
    },
    {
      id: 10,
      title: "Dictionary Attack - Common Passwords",
      difficulty: "Intermediate",
      description: "Hackers are using lists of common passwords to break into accounts.",
      briefing: "Automated attack detected trying common passwords against multiple accounts: 'password', '123456', 'qwerty', 'letmein', 'welcome'. 3 accounts were successfully compromised.",
      logs: [
        { time: "22:10:00", event: "ATTACK_START", type: "Dictionary Attack - Top 10,000 common passwords" },
        { time: "22:10:05", event: "ATTEMPT", user: "user1@company.com", password: "password" },
        { time: "22:10:06", event: "SUCCESS", user: "user1@company.com", password_was: "password" },
        { time: "22:10:15", event: "ATTEMPT", user: "user2@company.com", password: "123456" },
        { time: "22:10:16", event: "SUCCESS", user: "user2@company.com", password_was: "123456" },
        { time: "22:10:45", event: "ATTEMPT", user: "admin@company.com", password: "admin" },
        { time: "22:10:46", event: "SUCCESS", user: "admin@company.com", password_was: "admin" },
      ],
      questions: [
        {
          id: 1,
          question: "What is a dictionary attack?",
          options: [
            "Looking up words in a dictionary",
            "Trying lists of common passwords (like 'password', '123456') against accounts",
            "Throwing dictionaries at computers",
            "Teaching computers to read"
          ],
          correct: 1,
          explanation: "Dictionary attacks use lists of the most common passwords people choose. Attackers know people are predictable and use weak passwords."
        },
        {
          id: 2,
          question: "Which of these passwords would FAIL a dictionary attack?",
          options: [
            "password",
            "123456",
            "qwerty",
            "9K$x2#mP&vL@Q5"
          ],
          correct: 3,
          explanation: "Random complex passwords aren't in dictionaries. 'password' and '123456' are the #1 and #2 most common passwords - hacked instantly."
        },
        {
          id: 3,
          question: "Why is 'password' a terrible password?",
          options: [
            "Too short",
            "It's the most common password - first thing attackers try",
            "Too long",
            "Has too many letters"
          ],
          correct: 1,
          explanation: "'password', '123456', and 'qwerty' are tried first in every attack because millions of people use them. Never use common words/patterns."
        },
        {
          id: 4,
          question: "What makes 'admin' a particularly dangerous password for an admin account?",
          options: [
            "It's professional",
            "Username='admin', Password='admin' - first combination attackers try for admin accounts",
            "Too technical",
            "Nothing wrong"
          ],
          correct: 1,
          explanation: "Attackers always try username=password (especially admin=admin, root=root). Admin accounts need strongest passwords + 2FA."
        },
        {
          id: 5,
          question: "How long would it take to crack 'password' vs 'X9$mK2#vL8^qR4'?",
          options: [
            "Both take years",
            "'password' = instant (in dictionary), 'X9$mK2#vL8^qR4' = thousands of years",
            "Same time",
            "'password' is stronger"
          ],
          correct: 1,
          explanation: "Dictionary passwords are cracked instantly. Random 15+ character passwords with mixed characters take longer than the age of the universe."
        },
        {
          id: 6,
          question: "What's a better alternative to passwords?",
          options: [
            "No security",
            "Passphrase: random words like 'correct-horse-battery-staple' (long, memorable, strong)",
            "Shorter passwords",
            "Reuse one password"
          ],
          correct: 1,
          explanation: "Passphrases (random words combined) are long, easy to remember, and very strong. Or use password managers to generate/store random passwords."
        }
      ]
    },

    // ===== ADVANCED/PRO HACKER LEVEL: Complex Technical Attacks =====
    {
      id: 11,
      title: "Insider Threat - Data Exfiltration",
      difficulty: "Advanced",
      description: "Unusual data access patterns from internal user. Investigate potential data exfiltration.",
      briefing: "User account mchen@company.com shows abnormal data access patterns. Database logs indicate queries against sensitive tables outside business hours. The employee submitted resignation notice 3 days ago.",
      logs: [
        { time: "23:15:44", event: "VPN_CONNECT", user: "mchen@company.com", ip: "192.168.1.105", location: "Home" },
        { time: "23:17:12", event: "DB_QUERY", user: "mchen@company.com", table: "customer_contacts", rows: "12,847", action: "SELECT" },
        { time: "23:18:33", event: "DB_QUERY", user: "mchen@company.com", table: "product_roadmap", rows: "234", action: "SELECT" },
        { time: "23:19:01", event: "DB_QUERY", user: "mchen@company.com", table: "financial_projections", rows: "156", action: "SELECT" },
        { time: "23:21:45", event: "FILE_COPY", user: "mchen@company.com", source: "//fileserver/shared", dest: "USB_DRIVE_E", size: "2.4GB" },
        { time: "23:24:12", event: "CLOUD_UPLOAD", user: "mchen@company.com", service: "personal_dropbox", size: "2.4GB" },
        { time: "23:25:30", event: "BROWSER_HISTORY", user: "mchen@company.com", url: "competitor.com/careers" },
        { time: "23:27:08", event: "VPN_DISCONNECT", user: "mchen@company.com" },
      ],
      questions: [
        {
          id: 1,
          question: "What makes this activity suspicious?",
          options: [
            "VPN connection from home",
            "Accessing multiple sensitive tables after hours before resignation",
            "Using Dropbox",
            "Visiting career websites"
          ],
          correct: 1,
          explanation: "The combination of after-hours access to sensitive data, mass data extraction, and timing before resignation strongly indicates data theft."
        },
        {
          id: 2,
          question: "Approximately how much data was potentially exfiltrated?",
          options: [
            "156 MB",
            "234 GB",
            "2.4 GB",
            "12,847 KB"
          ],
          correct: 2,
          explanation: "The logs show 2.4GB copied to USB and uploaded to personal cloud storage, indicating this is the volume of data exfiltrated."
        },
        {
          id: 3,
          question: "What type of insider threat is this?",
          options: [
            "Accidental data exposure",
            "Malicious insider - data theft before departure",
            "Compromised credentials",
            "Legitimate business activity"
          ],
          correct: 1,
          explanation: "This is a classic departing employee data theft scenario - accessing sensitive data before leaving to take to a competitor."
        },
        {
          id: 4,
          question: "What evidence suggests the user may be joining a competitor?",
          options: [
            "VPN usage",
            "Database queries",
            "Browser history showing competitor.com/careers",
            "USB drive usage"
          ],
          correct: 2,
          explanation: "The browser history showing visits to a competitor's career page suggests the employee is likely joining a competing organization."
        }
      ]
    },
    {
      id: 12,
      title: "Ransomware Detection",
      difficulty: "Advanced",
      description: "Multiple file encryption events detected. Investigate the ransomware infection origin.",
      briefing: "EDR alerts indicate rapid file modifications on workstation WS-2891. User jsmith@company.com reported files becoming inaccessible with .locked extension. Initial detection at 09:45 UTC.",
      logs: [
        { time: "09:43:22", event: "EMAIL_OPEN", user: "jsmith@company.com", subject: "Invoice_July_2024.pdf.exe", attachment: "true" },
        { time: "09:43:45", event: "PROCESS_START", user: "jsmith@company.com", process: "Invoice_July_2024.pdf.exe", hash: "a8f7d92c..." },
        { time: "09:44:01", event: "NETWORK_CONNECTION", process: "Invoice_July_2024.pdf.exe", dest_ip: "198.51.100.78", port: "443" },
        { time: "09:45:12", event: "FILE_MODIFY", file: "Documents/report.docx", new_ext: ".locked" },
        { time: "09:45:13", event: "FILE_MODIFY", file: "Documents/budget.xlsx", new_ext: ".locked" },
        { time: "09:45:15", event: "FILE_MODIFY", file: "Pictures/photo.jpg", new_ext: ".locked" },
        { time: "09:45:17", event: "FILE_CREATE", file: "Desktop/DECRYPT_INSTRUCTIONS.txt" },
        { time: "09:46:30", event: "NETWORK_SCAN", source: "WS-2891", ports: "445, 139, 3389" },
      ],
      questions: [
        {
          id: 1,
          question: "What was the initial infection vector?",
          options: [
            "Drive-by download from website",
            "Malicious email attachment",
            "USB drive",
            "Compromised software update"
          ],
          correct: 1,
          explanation: "The logs show the user opened an email with a suspicious .exe attachment disguised as a PDF, which is the initial infection vector."
        },
        {
          id: 2,
          question: "What indicator suggests this ransomware may spread laterally?",
          options: [
            "File encryption activities",
            "Network scan on ports 445, 139, 3389",
            "Email opening",
            "Process execution"
          ],
          correct: 1,
          explanation: "The network scan on SMB (445, 139) and RDP (3389) ports indicates the ransomware is attempting to find other vulnerable systems to infect."
        },
        {
          id: 3,
          question: "What is the most critical first response action?",
          options: [
            "Pay the ransom immediately",
            "Isolate WS-2891 from the network",
            "Restart the computer",
            "Run antivirus scan"
          ],
          correct: 1,
          explanation: "Immediately isolating the infected workstation prevents the ransomware from spreading to other systems on the network."
        },
        {
          id: 4,
          question: "What is the suspicious file hash identifier?",
          options: [
            "198.51.100.78",
            "a8f7d92c...",
            "WS-2891",
            ".locked"
          ],
          correct: 1,
          explanation: "The hash 'a8f7d92c...' is associated with the malicious executable and can be used for threat intelligence and blocking."
        }
      ]
    },
    {
      id: 13,
      title: "SQL Injection on Customer Portal",
      difficulty: "Advanced",
      description: "Unexpected database errors and suspicious query parameters on the customer support portal.",
      briefing: "Customers report strange errors when searching order history. Web logs show requests containing SQL-like payloads to /search?order_id=",
      logs: [
        { time: "10:12:03", event: "HTTP_REQUEST", method: "GET", path: "/search?order_id=1' OR '1'='1", status: "500", user: "-" },
        { time: "10:12:04", event: "DB_ERROR", message: "syntax error near 'OR'", query: "SELECT * FROM orders WHERE id = '1' OR '1'='1'" },
        { time: "10:12:10", event: "DATA_DUMP", table: "orders", rows: "10234" }
      ],
      questions: [
        {
          id: 1,
          question: "What vulnerability is being exploited?",
          options: ["Cross-Site Scripting (XSS)", "SQL Injection", "CSRF", "Broken Authentication"],
          correct: 1,
          explanation: "The query parameter contains SQL metacharacters and causes DB errors and data dump - indicative of SQL injection."
        },
        {
          id: 2,
          question: "Which immediate mitigation would help prevent this class of attack?",
          options: ["Use prepared statements / parameterized queries", "Block all GET requests", "Disable database logging", "Use client-side input validation only"],
          correct: 0,
          explanation: "Prepared statements/parameterized queries prevent attacker-controlled input from being interpreted as SQL."
        },
        {
          id: 3,
          question: "What indicator in the logs suggests successful data exposure?",
          options: ["500 status code and DB_ERROR", "Normal 200 responses", "Presence of cookies", "TLS negotiation failure"],
          correct: 0,
          explanation: "The combination of a 500 error and DB_ERROR with a DATA_DUMP suggests the injection succeeded in exposing data."
        },
        {
          id: 4,
          question: "What follow-up action should be taken?",
          options: ["Ignore - false positive", "Sanitize inputs, rotate DB credentials, and review logs for exfiltration", "Shut down the webserver permanently", "Require users to change browsers"],
          correct: 1,
          explanation: "Sanitizing inputs and rotating credentials, plus investigating logs, are appropriate follow-ups."
        }
      ]
    },
    {
      id: 14,
      title: "Supply Chain Compromise - Malicious Dependency",
      difficulty: "Advanced",
      description: "A third-party library inserted malicious code into builds, leading to a backdoor in production services.",
      briefing: "CI pipeline pulled a tainted package during build. Post-deploy telemetry shows unexpected outbound connections from a microservice.",
      logs: [
        { time: "04:10:00", event: "CI_PULL", repo: "npm://lib-utils@2.1.0", status: "OK" },
        { time: "04:12:45", event: "BUILD_STEP", step: "npm install", output: "installed lib-utils@2.1.0" },
        { time: "04:20:30", event: "DEPLOY", service: "orders-api", version: "1.4.2" },
        { time: "04:45:00", event: "NET_CONN", service: "orders-api", dest_ip: "198.51.100.99", dest_port: "8080" }
      ],
      questions: [
        { id: 1, question: "What is the likely root cause?", options: ["Malicious third-party dependency", "DDoS", "Expired certificate", "Insider threat in ops team"], correct: 0, explanation: "The tainted package pulled during CI indicates a supply chain compromise." },
        { id: 2, question: "Which process helps mitigate this risk?", options: ["Use dependency scanning and pin trusted versions", "Disable CI", "Allow anonymous packages", "Run without monitoring"], correct: 0, explanation: "Dependency scanning and pinning reduce supply chain risk." },
        { id: 3, question: "First response step?", options: ["Isolate the service and roll back to known-good build", "Reboot all servers", "Delete the repo", "Block all external traffic permanently"], correct: 0, explanation: "Isolate and roll back to a trusted build to stop malicious behavior." },
        { id: 4, question: "What telemetry indicates compromise?", options: ["Unexpected outbound connections after deploy", "Normal health checks", "Scheduled backups", "DNS lookups for internal domains"], correct: 0, explanation: "New outbound connections to unknown IPs after deployment indicate malicious activity." }
      ]
    }
  ];

  // Story chapters that unlock scenarios
  const storyChapters = [
    {
      id: 0,
      title: "Day 1: Your First Day",
      narrative: "Welcome to CyberSecure Inc.! You're the newest Junior Security Analyst. Your manager, Sarah, greets you warmly.\n\n'Great to have you on the team! We'll start you off easy. Your first task? Help our employees identify scam emails. We've been getting a lot of phishing attempts lately.'\n\nYour mission: Complete beginner-level scam detection training.",
      unlockScenarios: [1, 2, 3],
      requiredScore: 0,
      minigame: null
    },
    {
      id: 1,
      title: "Day 3: Phishing Storm",
      narrative: "Sarah rushes to your desk. 'We have a situation! Multiple employees clicked on suspicious links. We need to train everyone fast!'\n\nShe continues: 'I need you to work through more phishing scenarios. The company depends on this.'\n\nYour mission: Complete more scam detection scenarios.",
      unlockScenarios: [4, 5, 6, 7],
      requiredScore: 150,
      minigame: null
    },
    {
      id: 2,
      title: "Week 2: Password Crisis",
      narrative: "🔐 SECURITY ALERT! Multiple accounts have been compromised. Sarah calls an emergency meeting.\n\n'We need to understand how these password attacks work. I'm assigning you to investigate password security. This is critical!'\n\n*Mini-game unlocked: Hack the System* - Test your reflexes!\n\nYour mission: Learn about password attacks.",
      unlockScenarios: [8, 9, 10],
      requiredScore: 350,
      minigame: 'snake'
    },
    {
      id: 3,
      title: "Month 1: The Big Leagues",
      narrative: "🎖️ Congratulations! Your hard work hasn't gone unnoticed.\n\nSarah smiles: 'You've proven yourself. It's time for advanced training. We're facing sophisticated threats - ransomware, supply chain attacks, insider threats. Think you're ready for the Pro Hacker level?'\n\nYour mission: Face advanced cybersecurity threats.",
      unlockScenarios: [11, 12, 13, 14],
      requiredScore: 550,
      minigame: null
    },
    {
      id: 4,
      title: "FINAL: The Breach",
      narrative: "🚨 RED ALERT! A sophisticated attack is underway!\n\nSarah: 'This is it. Everything you've learned has led to this moment. Our entire network is under attack. I need my best analyst on this. That's you. Save the company!'\n\nYour mission: Defend against the final attack.",
      unlockScenarios: [11, 12, 13, 14],
      requiredScore: 750,
      minigame: 'snake'
    }
  ];

  const getCurrentChapter = () => {
    for (let i = storyChapters.length - 1; i >= 0; i--) {
      if (totalScore >= storyChapters[i].requiredScore) {
        return storyChapters[i];
      }
    }
    return storyChapters[0];
  };

  const getUnlockedScenarios = () => {
    const chapter = getCurrentChapter();
    return scenarios.filter(s => chapter.unlockScenarios.includes(s.id));
  };

  const difficultyOptions = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const filteredScenarios = scenarios.filter(s => filter === 'All' || s.difficulty === filter);

  const startScenario = (scenario) => {
    setCurrentScenario(scenario);
    setCurrentQuestion(0);
    setAnswers({});
    setScore(0);
    setShowResults(false);
    setSelectedLog(null);
    
    // Initialize battle
    const baseHealth = 5;
    const bonusHealth = Math.floor(completedScenarios.length / 3); // Gain 1 heart per 3 completed scenarios
    setMaxPlayerHealth(baseHealth + bonusHealth);
    setPlayerHealth(baseHealth + bonusHealth);
    setHackerHealth(scenario.questions.length); // Hacker has hearts equal to number of questions
    setQuestionRevealed(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setBattleMessage('⚔️ Battle Start!');
    
    setGameState('battle');
  };

  const handleBattleAnswer = (answerIndex) => {
    if (selectedAnswer !== null || showExplanation) return;
    
    setSelectedAnswer(answerIndex);
    const question = currentScenario.questions[currentQuestion];
    const isCorrect = answerIndex === question.correct;
    
    if (isCorrect) {
      // Player attacks hacker
      setShowBattleAnimation('player-attack');
      setBattleMessage('💥 Correct! You strike the hacker!');
      
      setTimeout(() => {
        setHackerHealth(prev => prev - 1);
        setShowBattleAnimation('');
        setShowExplanation(true);
        
        // Check if hacker defeated
        setTimeout(() => {
          if (hackerHealth - 1 <= 0) {
            // Victory!
            const scenarioScore = (maxPlayerHealth * 50) + (playerHealth * 20);
            setScore(scenarioScore);
            setTotalScore(prev => prev + scenarioScore);
            
            if (!completedScenarios.includes(currentScenario.id)) {
              setCompletedScenarios(prev => [...prev, currentScenario.id]);
            }
            
            setShowResults(true);
            setGameState('victory');
            window.parent.postMessage({
              type: 'gameComplete', game: 'cyberanalyst', success: true,
              score: (maxPlayerHealth * 50) + (playerHealth * 20),
              details: { totalScore: totalScore + (maxPlayerHealth * 50) + (playerHealth * 20), playerHealth }
            }, '*');
          } else {
            // Next question
            setTimeout(() => {
              setCurrentQuestion(prev => prev + 1);
              setSelectedAnswer(null);
              setShowExplanation(false);
              setBattleMessage('Next attack incoming...');
            }, 2000);
          }
        }, 500);
      }, 1000);
    } else {
      // Hacker attacks player
      setShowBattleAnimation('hacker-attack');
      setBattleMessage('❌ Wrong! The hacker strikes back!');
      
      setTimeout(() => {
        setPlayerHealth(prev => prev - 1);
        setShowBattleAnimation('');
        setShowExplanation(true);
        
        // Check if player defeated
        setTimeout(() => {
          if (playerHealth - 1 <= 0) {
            setShowResults(true);
            setGameState('defeat');
            window.parent.postMessage({
              type: 'gameComplete', game: 'cyberanalyst', success: false,
              score: totalScore,
              details: { totalScore, playerHealth: 0 }
            }, '*');
          } else {
            // Next question
            setTimeout(() => {
              setCurrentQuestion(prev => prev + 1);
              setSelectedAnswer(null);
              setShowExplanation(false);
              setBattleMessage('Prepare for the next attack...');
            }, 2000);
          }
        }, 500);
      }, 1000);
    }
  };

  const restartBattle = () => {
    startScenario(currentScenario);
  };

  // Snake mini-game logic
  const resetSnakeGame = () => {
    setSnakePos([{ x: 10, y: 10 }]);
    setSnakeDir({ x: 1, y: 0 });
    setFood({ x: 15, y: 15 });
    setGameOver(false);
    setSnakeScore(0);
  };

  useEffect(() => {
    if (gameState !== 'minigame' || gameOver) return;

    const moveSnake = () => {
      setSnakePos(prev => {
        const newHead = {
          x: (prev[0].x + snakeDir.x + 20) % 20,
          y: (prev[0].y + snakeDir.y + 20) % 20
        };

        // Check collision with self
        if (prev.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];

        // Check if ate food
        if (newHead.x === food.x && newHead.y === food.y) {
          setSnakeScore(s => s + 10);
          setFood({
            x: Math.floor(Math.random() * 20),
            y: Math.floor(Math.random() * 20)
          });
          return newSnake;
        }

        newSnake.pop();
        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, 150);
    return () => clearInterval(interval);
  }, [gameState, snakeDir, food, gameOver]);

  useEffect(() => {
    if (gameState !== 'minigame') return;

    const handleKeyPress = (e) => {
      switch(e.key) {
        case 'ArrowUp':
          if (snakeDir.y === 0) setSnakeDir({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (snakeDir.y === 0) setSnakeDir({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (snakeDir.x === 0) setSnakeDir({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (snakeDir.x === 0) setSnakeDir({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, snakeDir]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty === 'Beginner') return 'text-green-400';
    if (difficulty === 'Intermediate') return 'text-yellow-400';
    if (difficulty === 'Advanced') return 'text-red-400';
    return 'text-gray-400';
  };

  // Story intro screen
  if (gameState === 'story') {
    const chapter = getCurrentChapter();
    const nextChapter = storyChapters.find(c => c.requiredScore > totalScore);

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Shield className="w-20 h-20 text-cyan-400 mx-auto mb-4 animate-pulse" />
            <h1 className="text-6xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Cyber Defender
            </h1>
            <p className="text-xl text-slate-400">Your Journey to Cybersecurity Mastery</p>
          </div>

          {/* Progress Bar */}
          <div className="bg-slate-900 rounded-lg p-6 mb-8 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-slate-400">Total Score</span>
              <span className="text-2xl font-bold text-cyan-400">{totalScore} pts</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-4 mb-2">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((totalScore / 1000) * 100, 100)}%` }}
              />
            </div>
            {nextChapter && (
              <p className="text-xs text-slate-500">
                Next chapter unlocks at {nextChapter.requiredScore} pts
              </p>
            )}
          </div>

          {/* Current Chapter */}
          <div className="bg-slate-900 border border-cyan-500/50 rounded-lg p-8 mb-8 shadow-xl">
            <div className="flex items-center mb-4">
              <Award className="w-8 h-8 text-cyan-400 mr-3" />
              <h2 className="text-3xl font-bold text-cyan-400">{chapter.title}</h2>
            </div>
            <div className="text-slate-300 text-lg leading-relaxed whitespace-pre-line mb-6">
              {chapter.narrative}
            </div>
            
            {chapter.minigame && (
              <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-lg p-4 mb-4">
                <p className="text-purple-300 text-sm font-semibold">🎮 Mini-Game Available: Hack the System!</p>
                <button
                  onClick={() => { resetSnakeGame(); setGameState('minigame'); }}
                  className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded text-sm font-semibold transition-all"
                >
                  Play Mini-Game
                </button>
              </div>
            )}

            <button
              onClick={() => setGameState('menu')}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-lg transition-all text-xl shadow-lg"
            >
              Start Missions →
            </button>
          </div>

          {/* Chapter Progress */}
          <div className="grid grid-cols-5 gap-2">
            {storyChapters.map((ch, idx) => (
              <div
                key={ch.id}
                className={`text-center p-3 rounded-lg border-2 ${
                  totalScore >= ch.requiredScore
                    ? 'border-cyan-500 bg-cyan-900/30'
                    : 'border-slate-700 bg-slate-800/30'
                }`}
              >
                <div className={`text-xs font-semibold mb-1 ${
                  totalScore >= ch.requiredScore ? 'text-cyan-400' : 'text-slate-500'
                }`}>
                  {totalScore >= ch.requiredScore ? '✓' : '🔒'} Ch.{idx + 1}
                </div>
                <div className="text-xs text-slate-400">{ch.requiredScore}+</div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                if (window.confirm('Reset all progress?')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
            >
              Reset Progress
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Snake mini-game screen
  if (gameState === 'minigame') {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-purple-400 mb-2">🎮 Hack the System</h2>
            <p className="text-slate-400">Use arrow keys to move. Collect data packets!</p>
            <div className="text-2xl font-bold text-cyan-400 mt-4">Score: {snakeScore}</div>
          </div>

          <div className="bg-slate-900 p-4 rounded-lg border-4 border-purple-500 inline-block mx-auto">
            <div className="grid grid-cols-20 gap-0 bg-slate-800" style={{ width: '400px', height: '400px' }}>
              {Array.from({ length: 20 }).map((_, y) =>
                Array.from({ length: 20 }).map((_, x) => {
                  const isSnake = snakePos.some(pos => pos.x === x && pos.y === y);
                  const isHead = snakePos[0]?.x === x && snakePos[0]?.y === y;
                  const isFood = food.x === x && food.y === y;

                  return (
                    <div
                      key={`${x}-${y}`}
                      className={`w-5 h-5 ${
                        isHead ? 'bg-cyan-400' :
                        isSnake ? 'bg-cyan-600' :
                        isFood ? 'bg-yellow-400 animate-pulse' :
                        'bg-slate-800'
                      }`}
                    />
                  );
                })
              )}
            </div>
          </div>

          {gameOver && (
            <div className="mt-8 bg-red-900/30 border border-red-500 rounded-lg p-6 text-center">
              <h3 className="text-2xl font-bold text-red-400 mb-2">System Crashed!</h3>
              <p className="text-slate-300 mb-4">Final Score: {snakeScore}</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetSnakeGame}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded font-semibold transition-all"
                >
                  Try Again
                </button>
                <button
                  onClick={() => setGameState('story')}
                  className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded font-semibold transition-all"
                >
                  Back to Story
                </button>
              </div>
            </div>
          )}

          {!gameOver && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setGameState('story')}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded font-semibold transition-all"
              >
                Back to Story
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (gameState === 'menu') {
    const unlockedScenarios = getUnlockedScenarios();
    const chapter = getCurrentChapter();

    return (
      <div className="min-h-screen bg-slate-950 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setGameState('story')}
              className="flex items-center text-slate-400 hover:text-cyan-400 transition-colors"
            >
              ← Back to Story
            </button>
            <div className="text-right">
              <div className="text-sm text-slate-400">Total Score</div>
              <div className="text-2xl font-bold text-cyan-400">{totalScore} pts</div>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-16 h-16 text-cyan-400 mr-4" />
              <div>
                <h1 className="text-5xl font-bold">Mission Select</h1>
                <p className="text-xl text-slate-400">{chapter.title}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {unlockedScenarios.map(scenario => {
              const isCompleted = completedScenarios.includes(scenario.id);
              
              return (
                <div key={scenario.id} className={`bg-slate-900 border rounded-lg p-6 hover:border-cyan-500 transition-all ${
                  isCompleted ? 'border-green-500/50' : 'border-slate-800'
                }`}>
                  {isCompleted && (
                    <div className="flex items-center text-green-400 text-sm mb-2">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Completed
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-cyan-400">{scenario.title}</h3>
                    <span className={`text-sm font-semibold ${getDifficultyColor(scenario.difficulty)}`}>
                      {scenario.difficulty}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">{scenario.description}</p>
                  <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                    <span className="flex items-center">
                      <Database className="w-4 h-4 mr-1" />
                      {scenario.logs.length} logs
                    </span>
                    <span className="flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      {scenario.questions.length} questions
                    </span>
                  </div>
                  <button
                    onClick={() => startScenario(scenario)}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 rounded transition-all"
                  >
                    {isCompleted ? 'Play Again' : 'Start Mission'}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">How It Works</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center mb-2">
                  <Search className="w-5 h-5 text-cyan-400 mr-2" />
                  <h4 className="font-semibold">Analyze Logs</h4>
                </div>
                <p className="text-slate-400 text-sm">Review security logs and identify suspicious patterns.</p>
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <Activity className="w-5 h-5 text-cyan-400 mr-2" />
                  <h4 className="font-semibold">Answer Questions</h4>
                </div>
                <p className="text-slate-400 text-sm">Demonstrate analysis skills with scenario questions.</p>
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <Award className="w-5 h-5 text-cyan-400 mr-2" />
                  <h4 className="font-semibold">Get Scored</h4>
                </div>
                <p className="text-slate-400 text-sm">Earn points and receive detailed explanations.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Battle Mode - Visual fight between player and hacker!
  if (gameState === 'battle') {
    const question = currentScenario.questions[currentQuestion];
    
    // Guard: If no question exists (battle ended), don't render
    if (!question) return null;
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-950 to-slate-900 text-white p-4">
        <div className="max-w-6xl mx-auto">
          {/* Scenario Header */}
          <div className="mb-6 bg-slate-900 rounded-xl p-6 border-2 border-purple-500">
            <h1 className="text-3xl font-bold text-purple-300 mb-2">{currentScenario.title}</h1>
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-purple-600 rounded-full text-sm font-bold">
                {currentScenario.difficulty}
              </span>
              <span className="text-slate-400 text-sm">⚔️ Battle Mode</span>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 border-l-4 border-yellow-500">
              <div className="flex items-start">
                <span className="text-2xl mr-3">📧</span>
                <div>
                  <div className="font-bold text-yellow-400 mb-1">Scenario Briefing:</div>
                  <p className="text-slate-300 text-sm leading-relaxed">{currentScenario.briefing}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Battle Message */}
          <div className="text-center mb-6">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500 mb-2 animate-pulse">
              {battleMessage}
            </h2>
            <p className="text-slate-400">Question {currentQuestion + 1} of {currentScenario.questions.length}</p>
          </div>

          {/* Battle Arena */}
          <div className="grid grid-cols-3 gap-8 mb-8">
            {/* Player (Defender) */}
            <div className="col-span-1">
              <div className={`bg-gradient-to-br from-blue-900 to-cyan-900 rounded-2xl p-6 border-4 border-cyan-400 relative ${
                showBattleAnimation === 'player-attack' ? 'animate-stab' : ''
              } ${
                showBattleAnimation === 'hacker-attack' ? 'animate-shake animate-flash' : ''
              }`}>
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-cyan-400 text-slate-900 px-4 py-1 rounded-full font-bold text-sm">
                  YOU
                </div>
                
                {/* Player Character */}
                <div className="text-center mb-4">
                  <div className={`text-8xl mb-2 ${
                    showBattleAnimation === 'player-attack' ? 'scale-110' : ''
                  }`}>🛡️</div>
                  <div className="text-2xl font-bold text-cyan-300">Cyber Defender</div>
                </div>
                
                {/* Attack Effect Overlay */}
                {showBattleAnimation === 'player-attack' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-9xl animate-slash opacity-80">🗡️</div>
                  </div>
                )}

                {/* Player Health */}
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-1">
                    {[...Array(maxPlayerHealth)].map((_, i) => (
                      <span key={i} className="text-3xl">
                        {i < playerHealth ? '❤️' : '🖤'}
                      </span>
                    ))}
                  </div>
                  <div className="text-center text-sm text-cyan-300 font-bold">
                    Health: {playerHealth}/{maxPlayerHealth}
                  </div>
                </div>

                {/* Power Indicator */}
                <div className="mt-4 bg-cyan-950 rounded-lg p-3">
                  <div className="text-xs text-cyan-300 mb-1">🔋 Defense Power</div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${(playerHealth / maxPlayerHealth) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* VS Symbol */}
            <div className="col-span-1 flex items-center justify-center relative">
              <div className="text-center">
                <div className="text-6xl font-bold text-yellow-400 animate-pulse mb-4">⚔️</div>
                <div className="text-2xl font-bold text-yellow-300">VS</div>
                {showBattleAnimation && (
                  <div className="mt-4 relative">
                    {showBattleAnimation === 'player-attack' && (
                      <div className="space-y-2">
                        <div className="text-6xl animate-ping">🗡️</div>
                        <div className="text-5xl animate-bounce">💥</div>
                        <div className="text-3xl text-green-400 font-bold animate-pulse">HIT!</div>
                      </div>
                    )}
                    {showBattleAnimation === 'hacker-attack' && (
                      <div className="space-y-2">
                        <div className="text-6xl animate-ping">⚡</div>
                        <div className="text-5xl animate-pulse">💥</div>
                        <div className="text-3xl text-red-400 font-bold animate-pulse">ZAP!</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Hacker (Enemy) */}
            <div className="col-span-1">
              <div className={`bg-gradient-to-br from-red-900 to-orange-900 rounded-2xl p-6 border-4 border-red-500 relative ${
                showBattleAnimation === 'hacker-attack' ? 'animate-zap' : ''
              } ${
                showBattleAnimation === 'player-attack' ? 'animate-shake animate-flash' : ''
              }`}>
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-1 rounded-full font-bold text-sm">
                  ENEMY
                </div>
                
                {/* Hacker Character */}
                <div className="text-center mb-4">
                  <div className={`text-8xl mb-2 ${
                    showBattleAnimation === 'hacker-attack' ? 'scale-125' : ''
                  }`}>👾</div>
                  <div className="text-2xl font-bold text-red-300">Evil Hacker</div>
                </div>
                
                {/* Zap Effect Overlay */}
                {showBattleAnimation === 'hacker-attack' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-9xl animate-ping opacity-80">⚡</div>
                    <div className="absolute text-7xl animate-pulse">💥</div>
                  </div>
                )}

                {/* Hacker Health */}
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-1">
                    {[...Array(currentScenario.questions.length)].map((_, i) => (
                      <span key={i} className="text-3xl">
                        {i < hackerHealth ? '💀' : '✨'}
                      </span>
                    ))}
                  </div>
                  <div className="text-center text-sm text-red-300 font-bold">
                    Health: {hackerHealth}/{currentScenario.questions.length}
                  </div>
                </div>

                {/* Attack Indicator */}
                <div className="mt-4 bg-red-950 rounded-lg p-3">
                  <div className="text-xs text-red-300 mb-1">⚡ Attack Power</div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all"
                      style={{ width: `${(hackerHealth / currentScenario.questions.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Question & Answers */}
          <div className="bg-slate-900 border-4 border-purple-500 rounded-2xl p-8">
            <div className="flex items-start mb-6">
              <div className="bg-purple-600 rounded-lg p-3 mr-4">
                <span className="text-4xl">❓</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-purple-300 mb-3">
                  {question.question}
                </h3>
                
                {/* Answer Options */}
                <div className="grid grid-cols-1 gap-3">
                  {question.options.map((option, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === question.correct;
                    const showAsCorrect = showExplanation && isCorrect;
                    const showAsWrong = showExplanation && isSelected && !isCorrect;
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => handleBattleAnswer(idx)}
                        disabled={selectedAnswer !== null}
                        className={`text-left p-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 ${
                          showAsCorrect ? 'bg-green-600 border-4 border-green-400 text-white' :
                          showAsWrong ? 'bg-red-600 border-4 border-red-400 text-white' :
                          isSelected ? 'bg-yellow-600 border-4 border-yellow-400' :
                          'bg-slate-800 border-2 border-slate-600 hover:border-purple-400'
                        } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center">
                          <span className="bg-slate-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{option}</span>
                          {showAsCorrect && <span className="ml-auto text-2xl">✅</span>}
                          {showAsWrong && <span className="ml-auto text-2xl">❌</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {showExplanation && (
                  <div className={`mt-6 p-4 rounded-lg border-2 ${
                    selectedAnswer === question.correct 
                      ? 'bg-green-900/30 border-green-500' 
                      : 'bg-red-900/30 border-red-500'
                  }`}>
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">💡</span>
                      <div>
                        <div className="font-bold text-lg mb-2">
                          {selectedAnswer === question.correct ? '🎉 Great job!' : '📚 Learn this:'}
                        </div>
                        <p className="text-slate-200">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 bg-slate-800 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${((currentQuestion + 1) / currentScenario.questions.length) * 100}%` }}
            >
              <span className="text-xs font-bold text-white">
                {currentQuestion + 1}/{currentScenario.questions.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Victory Screen
  if (gameState === 'victory') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-950 to-slate-950 text-white p-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-9xl mb-6 animate-bounce">🏆</div>
          <h1 className="text-6xl font-bold text-green-400 mb-4">VICTORY!</h1>
          <p className="text-3xl text-green-300 mb-8">You defeated the hacker!</p>
          
          <div className="bg-slate-900 rounded-2xl p-8 mb-8 border-4 border-green-500">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-5xl mb-2">⭐</div>
                <div className="text-4xl font-bold text-yellow-400">{score}</div>
                <div className="text-slate-400">Points Earned</div>
              </div>
              <div>
                <div className="text-5xl mb-2">❤️</div>
                <div className="text-4xl font-bold text-red-400">{playerHealth}/{maxPlayerHealth}</div>
                <div className="text-slate-400">Health Remaining</div>
              </div>
              <div>
                <div className="text-5xl mb-2">🎯</div>
                <div className="text-4xl font-bold text-cyan-400">{totalScore}</div>
                <div className="text-slate-400">Total Score</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={restartBattle}
              className="px-8 py-4 bg-yellow-600 hover:bg-yellow-500 rounded-xl font-bold text-xl transition-all transform hover:scale-105"
            >
              🔄 Battle Again
            </button>
            <button
              onClick={() => setGameState('menu')}
              className="px-8 py-4 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-xl transition-all transform hover:scale-105"
            >
              ➡️ Next Mission
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Defeat Screen
  if (gameState === 'defeat') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-950 to-slate-950 text-white p-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-9xl mb-6 animate-pulse">💔</div>
          <h1 className="text-6xl font-bold text-red-400 mb-4">DEFEATED!</h1>
          <p className="text-3xl text-red-300 mb-4">The hacker won this round...</p>
          <p className="text-xl text-slate-400 mb-8">Don't give up! Learn from your mistakes and try again!</p>
          
          <div className="bg-slate-900 rounded-2xl p-8 mb-8 border-4 border-red-500">
            <div className="text-lg text-slate-300 mb-4">
              💡 <strong>Tip:</strong> Read the explanations carefully to learn how to defend better!
            </div>
            <div className="text-2xl font-bold text-cyan-400">
              Total Score: {totalScore} pts
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={restartBattle}
              className="px-8 py-4 bg-yellow-600 hover:bg-yellow-500 rounded-xl font-bold text-xl transition-all transform hover:scale-105"
            >
              🔄 Try Again
            </button>
            <button
              onClick={() => setGameState('menu')}
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold text-xl transition-all transform hover:scale-105"
            >
              📋 Choose Different Mission
            </button>
            <button
              onClick={() => setGameState('story')}
              className="px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold text-xl transition-all transform hover:scale-105"
            >
              📖 Back to Story
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CyberSOCAnalyst;