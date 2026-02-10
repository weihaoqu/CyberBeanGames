"""
HACK THE SYSTEM - Cybersecurity Training Game
==============================================

A timed challenge game where players act as ethical hackers securing vulnerable systems.

HOW TO RUN:
1. Install Flask: pip install flask
2. Run: python app.py
3. Open browser to: http://localhost:5000

GAME RULES:
- You have 60 seconds to secure as many vulnerabilities as possible
- Each correct answer: +10 points and +5 seconds
- Each incorrect answer: -5 points and -3 seconds
- Game ends when timer reaches 0 or all challenges completed

SCORING:
- 0-30: Cyber Apprentice
- 31-60: Security Analyst
- 61-90: Senior Engineer
- 91+: Master Hacker
"""

from flask import Flask, render_template, request, jsonify, session
import os
import random
from datetime import datetime

app = Flask(__name__)
# Use a stable secret key from the environment so session cookies remain valid
# across process restarts (important on Vercel / serverless). Keep a fallback
# for local testing but set SECRET_KEY in production.
app.secret_key = os.environ.get('SECRET_KEY', 'dev-secret-key-change-this')

# Game challenges database - cybersecurity training scenarios
CHALLENGES = [
    {
        "id": 1,
        "scenario": "🔗 An email contains a link: 'bit.ly/urgent-security-update' - What do you do?",
        "options": [
            "Click it immediately to stay secure",
            "Hover over the link to check the real URL first",
            "Forward it to all colleagues",
            "Reply asking if it's legitimate"
        ],
        "correct": 1,
        "explanation": "Always hover to preview URLs before clicking. Shortened links hide the real destination."
    },
    {
        "id": 2,
        "scenario": "🔐 Which password is MOST secure?",
        "options": [
            "Password123!",
            "MyDog2024",
            "Tr!c0l0r#F$9mQ&zK",
            "admin"
        ],
        "correct": 2,
        "explanation": "Strong passwords use a mix of uppercase, lowercase, numbers, and special characters with high length."
    },
    {
        "id": 3,
        "scenario": "🌐 Port 22 (SSH) is exposed to the internet. Best action?",
        "options": [
            "Leave it open for remote access",
            "Change to port 23 instead",
            "Restrict to specific IPs or use VPN",
            "Disable SSH completely"
        ],
        "correct": 2,
        "explanation": "Restrict SSH access to trusted IPs or require VPN connection to minimize attack surface."
    },
    {
        "id": 4,
        "scenario": "🛡️ Your firewall is disabled. What's the FIRST step?",
        "options": [
            "Continue working normally",
            "Immediately enable the firewall",
            "Restart the computer",
            "Download antivirus software"
        ],
        "correct": 1,
        "explanation": "Enable firewall immediately to restore network protection before taking other actions."
    },
    {
        "id": 5,
        "scenario": "📦 Software update available for 6 months. What do you do?",
        "options": [
            "Ignore it - if it ain't broke, don't fix it",
            "Wait for automatic updates",
            "Install immediately - security patches are critical",
            "Update only if forced"
        ],
        "correct": 2,
        "explanation": "Security patches fix known vulnerabilities. Delaying updates leaves systems exposed to exploits."
    },
    {
        "id": 6,
        "scenario": "💾 USB drive found in parking lot. Your action?",
        "options": [
            "Plug it in to see who owns it",
            "Take it home for personal use",
            "Report to IT/Security without connecting",
            "Throw it away"
        ],
        "correct": 2,
        "explanation": "Unknown USB drives can contain malware. Report to security without connecting to any device."
    },
    {
        "id": 7,
        "scenario": "📱 Public WiFi 'Free_Airport_WiFi' requires no password. Do you:",
        "options": [
            "Connect and check email immediately",
            "Use it but avoid sensitive activities",
            "Connect only through VPN",
            "Use it for banking - it's convenient"
        ],
        "correct": 2,
        "explanation": "Open public WiFi is insecure. Always use VPN to encrypt traffic on untrusted networks."
    },
    {
        "id": 8,
        "scenario": "🔑 Two-Factor Authentication (2FA) setup available. Should you:",
        "options": [
            "Skip it - too much hassle",
            "Enable it on all critical accounts",
            "Use it only for banking",
            "Disable it for convenience"
        ],
        "correct": 1,
        "explanation": "2FA adds crucial security layer. Enable on all accounts, especially email and financial services."
    },
    {
        "id": 9,
        "scenario": "🚨 Antivirus detects malware. Best response?",
        "options": [
            "Ignore if computer still works",
            "Quarantine/remove immediately and scan",
            "Restart and hope it goes away",
            "Wait for IT to notice"
        ],
        "correct": 1,
        "explanation": "Immediately quarantine/remove detected malware and perform full system scan."
    },
    {
        "id": 10,
        "scenario": "👤 Colleague asks for your login credentials 'just this once'. You:",
        "options": [
            "Share it - they're trustworthy",
            "Refuse and offer to help them properly",
            "Write it down for them",
            "Give them temporary access"
        ],
        "correct": 1,
        "explanation": "Never share credentials. Help them get proper access through official channels."
    },
    {
        "id": 11,
        "scenario": "📧 Email from 'CEO' asks to wire funds urgently. You should:",
        "options": [
            "Send immediately - it's the CEO",
            "Verify through separate channel (call/in person)",
            "Reply asking for confirmation",
            "Forward to accounting"
        ],
        "correct": 1,
        "explanation": "Verify unusual financial requests through independent channels. This is classic CEO fraud."
    },
    {
        "id": 12,
        "scenario": "🔍 You notice unusual login from unknown location. Action?",
        "options": [
            "Ignore - might be VPN",
            "Change password and enable alerts",
            "Log out and wait",
            "Delete the account"
        ],
        "correct": 1,
        "explanation": "Unauthorized access attempt requires immediate password change and security review."
    },
    {
        "id": 13,
        "scenario": "💻 Database backup hasn't run in 3 months. Priority?",
        "options": [
            "Schedule for next month",
            "Immediately configure and run backup",
            "Wait for system upgrade",
            "Backups are optional"
        ],
        "correct": 1,
        "explanation": "Regular backups are critical for disaster recovery. Fix backup system immediately."
    },
    {
        "id": 14,
        "scenario": "🔓 Default admin credentials still active on server. Do you:",
        "options": [
            "Keep them for easy access",
            "Change immediately to strong unique password",
            "Just add another admin account",
            "Disable the account completely"
        ],
        "correct": 1,
        "explanation": "Default credentials are widely known. Change immediately to prevent unauthorized access."
    },
    {
        "id": 15,
        "scenario": "📊 Employee downloads work files to personal cloud. Response?",
        "options": [
            "Allow - it's convenient",
            "Stop and explain data policy/risks",
            "Report to HR immediately",
            "Ignore if they're senior staff"
        ],
        "correct": 1,
        "explanation": "Educate about data policies and risks of using unauthorized cloud services for work data."
    }
]

@app.route('/')
def index():
    """Home page - game introduction and start button"""
    return render_template('index.html')

@app.route('/play')
def play():
    """Initialize game session and serve the game page"""
    # Initialize session variables
    session['score'] = 0
    session['time_remaining'] = 60  # seconds
    session['challenges_completed'] = 0
    session['start_time'] = datetime.now().isoformat()
    
    # Shuffle challenges for variety
    session['challenge_order'] = random.sample(range(len(CHALLENGES)), len(CHALLENGES))
    session['current_challenge_index'] = 0
    
    return render_template('play.html')

@app.route('/api/get-challenge')
def get_challenge():
    """API endpoint to get the current challenge"""
    challenge_index = session.get('current_challenge_index', 0)
    challenge_order = session.get('challenge_order', list(range(len(CHALLENGES))))
    
    # Check if game is complete
    if challenge_index >= len(CHALLENGES):
        return jsonify({
            "complete": True,
            "score": session.get('score', 0),
            "challenges_completed": session.get('challenges_completed', 0)
        })
    
    # Get current challenge
    challenge_id = challenge_order[challenge_index]
    challenge = CHALLENGES[challenge_id].copy()
    
    # Remove correct answer and explanation from response
    challenge.pop('correct')
    challenge.pop('explanation')
    
    return jsonify({
        "complete": False,
        "challenge": challenge,
        "progress": {
            "current": challenge_index + 1,
            "total": len(CHALLENGES)
        },
        "score": session.get('score', 0),
        "time_remaining": session.get('time_remaining', 60)
    })

@app.route('/api/submit-answer', methods=['POST'])
def submit_answer():
    """Process player's answer and return feedback"""
    data = request.json
    challenge_index = session.get('current_challenge_index', 0)
    challenge_order = session.get('challenge_order', list(range(len(CHALLENGES))))
    
    # Validate request
    if challenge_index >= len(CHALLENGES):
        return jsonify({"error": "Game already complete"}), 400
    
    # Get the challenge
    challenge_id = challenge_order[challenge_index]
    challenge = CHALLENGES[challenge_id]
    
    # Check answer
    user_answer = data.get('answer')
    correct = user_answer == challenge['correct']
    
    # Update score and time
    current_score = session.get('score', 0)
    current_time = session.get('time_remaining', 60)
    
    if correct:
        current_score += 10
        current_time += 5  # Bonus time for correct answer
    else:
        current_score -= 5
        current_time -= 3  # Time penalty for wrong answer
    
    # Ensure time doesn't go negative
    current_time = max(0, current_time)
    
    session['score'] = current_score
    session['time_remaining'] = current_time
    session['challenges_completed'] = challenge_index + 1
    session['current_challenge_index'] = challenge_index + 1
    
    return jsonify({
        "correct": correct,
        "explanation": challenge['explanation'],
        "score": current_score,
        "time_remaining": current_time,
        "game_complete": challenge_index + 1 >= len(CHALLENGES) or current_time <= 0
    })

@app.route('/api/update-time', methods=['POST'])
def update_time():
    """Update remaining time from client-side timer"""
    data = request.json
    time_remaining = data.get('time_remaining', 0)
    session['time_remaining'] = time_remaining
    
    return jsonify({
        "success": True,
        "time_remaining": time_remaining
    })

@app.route('/result')
def result():
    """Display final results and security rank"""
    score = session.get('score', 0)
    challenges_completed = session.get('challenges_completed', 0)
    
    # Calculate rank based on score
    if score >= 91:
        rank = "Master Hacker"
        rank_class = "master"
        rank_icon = "👑"
    elif score >= 61:
        rank = "Senior Security Engineer"
        rank_class = "senior"
        rank_icon = "⭐"
    elif score >= 31:
        rank = "Security Analyst"
        rank_class = "analyst"
        rank_icon = "🛡️"
    else:
        rank = "Cyber Apprentice"
        rank_class = "apprentice"
        rank_icon = "📚"
    
    return render_template('result.html',
                         score=score,
                         challenges_completed=challenges_completed,
                         total_challenges=len(CHALLENGES),
                         rank=rank,
                         rank_class=rank_class,
                         rank_icon=rank_icon)

if __name__ == '__main__':
    app.run(debug=True, port=5000)