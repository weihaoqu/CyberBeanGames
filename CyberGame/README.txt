# 🎮 HACK THE SYSTEM
### Cybersecurity Training Game

An interactive, timed web game that teaches ethical hacking and cybersecurity awareness through hands-on challenges.

---

## 📋 Table of Contents
- [Game Overview](#game-overview)
- [Installation & Setup](#installation--setup)
- [How to Play](#how-to-play)
- [Game Mechanics](#game-mechanics)
- [Project Structure](#project-structure)
- [Technical Details](#technical-details)
- [Customization](#customization)

---

## 🎯 Game Overview

**Hack the System** is an educational cybersecurity game where players act as ethical hackers securing vulnerable systems. Players face realistic security scenarios and must choose the correct defensive actions before time runs out.

### Features
- ⏱️ **Timed Challenge Mode**: 60-second countdown with time bonuses/penalties
- 🎓 **15 Real-World Scenarios**: Phishing, passwords, ports, firewalls, and more
- 🏆 **Ranking System**: From Cyber Apprentice to Master Hacker
- 💻 **Futuristic UI**: Hacker terminal aesthetic with glowing effects
- 📊 **Score Tracking**: Points system with detailed feedback
- 🔄 **Randomized Questions**: Different order each playthrough

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.7 or higher
- pip (Python package manager)

### Step-by-Step Installation

1. **Create a project directory**
```bash
mkdir hack-the-system
cd hack-the-system
```

2. **Install Flask**
```bash
pip install flask
```

3. **Create the folder structure**
```
hack-the-system/
├── app.py
├── static/
│   ├── style.css
│   └── script.js
└── templates/
    ├── index.html
    ├── play.html
    └── result.html
```

4. **Copy the files**
   - Copy `app.py` to the root directory
   - Copy `style.css` and `script.js` to the `static/` folder
   - Copy all HTML files to the `templates/` folder

5. **Run the application**
```bash
python app.py
```

6. **Open your browser**
Navigate to: `http://localhost:5000`

---

## 🎮 How to Play

### Starting the Game
1. Click **"INITIATE HACK"** on the home screen
2. Timer starts immediately at 60 seconds
3. Read each security scenario carefully

### Answering Questions
1. Read the vulnerability scenario
2. Choose the best security response
3. Click your answer
4. Receive instant feedback with explanation
5. Click **"NEXT THREAT"** to continue

### Winning Conditions
- Answer all 15 challenges correctly
- Maximize your score before time expires
- Earn time bonuses for correct answers

### Losing Conditions
- Timer reaches 0 (game ends automatically)
- You can still complete challenges with a low score

---

## ⚙️ Game Mechanics

### Scoring System

| Action | Score Change | Time Change |
|--------|-------------|-------------|
| ✅ Correct Answer | **+10 points** | **+5 seconds** |
| ❌ Wrong Answer | **-5 points** | **-3 seconds** |

### Ranking System

Your final score determines your security rank:

| Score Range | Rank | Icon |
|-------------|------|------|
| 0-30 | Cyber Apprentice | 📚 |
| 31-60 | Security Analyst | 🛡️ |
| 61-90 | Senior Security Engineer | ⭐ |
| 91+ | Master Hacker | 👑 |

### Challenge Topics

The game covers 15 critical cybersecurity areas:
1. 🔗 Phishing email detection
2. 🔐 Password security
3. 🌐 Network port security (SSH)
4. 🛡️ Firewall management
5. 📦 Software updates
6. 💾 USB drive security
7. 📱 Public WiFi safety
8. 🔑 Two-factor authentication
9. 🚨 Malware response
10. 👤 Credential sharing
11. 📧 CEO fraud/Business Email Compromise
12. 🔍 Unauthorized access detection
13. 💻 Database backups
14. 🔓 Default credential management
15. 📊 Data policy compliance

---

## 📁 Project Structure

```
hack-the-system/
│
├── app.py                 # Flask backend (main application)
│   ├── Routes: /, /play, /result
│   ├── API endpoints: /api/get-challenge, /api/submit-answer
│   ├── Session management
│   └── Challenge database (15 scenarios)
│
├── templates/
│   ├── index.html        # Home/landing page
│   ├── play.html         # Main game interface
│   └── result.html       # Results/scoring page
│
└── static/
    ├── style.css         # All styling (hacker theme)
    └── script.js         # Client-side game logic
```

---

## 🔧 Technical Details

### Backend (Flask)

**app.py** handles:
- Serving HTML templates
- Managing game sessions
- Challenge randomization
- Score calculation
- Time tracking
- API endpoints for AJAX requests

**Key Routes:**
- `GET /` - Home page
- `GET /play` - Initialize game session and serve game page
- `GET /api/get-challenge` - Fetch current challenge
- `POST /api/submit-answer` - Process answer and return feedback
- `POST /api/update-time` - Sync timer with server
- `GET /result` - Display final results

### Frontend

**HTML Structure:**
- Modular terminal window design
- Responsive layout
- Semantic markup

**CSS Styling:**
- Custom CSS variables for theme consistency
- Keyframe animations (glitch, pulse, glow)
- Responsive grid layouts
- Hover effects and transitions

**JavaScript Logic:**
- Real-time countdown timer
- AJAX for dynamic content loading
- DOM manipulation for UI updates
- Event handling for user interactions
- Game state management

### Session Data

The game stores the following in Flask sessions:
```python
{
    'score': int,                    # Current score
    'time_remaining': int,           # Seconds left
    'challenges_completed': int,     # Number answered
    'challenge_order': list,         # Randomized question order
    'current_challenge_index': int,  # Current question index
    'start_time': str               # ISO timestamp
}
```

---

## 🎨 Customization

### Adding New Challenges

Edit `CHALLENGES` list in `app.py`:

```python
{
    "id": 16,
    "scenario": "Your security question here",
    "options": [
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4"
    ],
    "correct": 2,  # Index of correct answer (0-3)
    "explanation": "Educational explanation here"
}
```

### Modifying Time Limits

In `app.py`, change initial time:
```python
session['time_remaining'] = 90  # 90 seconds instead of 60
```

In `script.js`, change starting time:
```javascript
let timeRemaining = 90;
```

### Adjusting Scoring

In `app.py`, modify the scoring logic:
```python
if correct:
    current_score += 15  # Change from 10
    current_time += 8    # Change from 5
else:
    current_score -= 3   # Change from 5
    current_time -= 5    # Change from 3
```

### Changing Theme Colors

In `style.css`, modify CSS variables:
```css
:root {
    --primary-green: #00ff41;     /* Main accent color */
    --secondary-cyan: #00ffff;    /* Secondary accent */
    --danger-red: #ff0040;        /* Warnings/errors */
    --bg-dark: #0b0b0b;          /* Background */
}
```

### Customizing Ranks

In `app.py`, adjust rank thresholds in `/result` route:
```python
if score >= 100:
    rank = "Elite Hacker"
elif score >= 75:
    rank = "Expert Analyst"
# ... etc
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue:** `ModuleNotFoundError: No module named 'flask'`
- **Solution:** Install Flask: `pip install flask`

**Issue:** Templates not found
- **Solution:** Ensure `templates/` folder exists in same directory as `app.py`

**Issue:** CSS/JS not loading
- **Solution:** Check that `static/` folder exists and contains `style.css` and `script.j