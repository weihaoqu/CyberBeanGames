# CyberBeanGames — Build Progress

## What We Built

A Miniclip-style cybersecurity arcade website called **CyberBeanGames** that hosts 6 student-built games under one roof. Built with React + Vite on the frontend and Node/Express on the backend.

---

## Games Integrated

| Game | Creator | Original Stack | How It's Served |
|------|---------|---------------|-----------------|
| Cyber Analyst Dashboard | Ziv | React 18 (CRA) | Pre-built, served as static bundle from `cyberanalyst/build/` |
| Password Security Challenge | Eric & Mat | Static HTML/CSS | Served directly from `CS450/` |
| Hack the System | Lynda | Python Flask + HTML/JS | Flask API converted to Express routes; HTML templates rewritten as static files in `games/CyberGame/` |
| Access Control Simulator | Brian | Static HTML/CSS | Served directly from `CS450-github/` |
| Malware Lab Escape | Matt | Static HTML/CSS/JS | Served directly from `labEscape/` |
| PhishTank | Chris | React 19 + Vite + Gemini API | Pre-built, served as static bundle from `PhishTank/dist/` |

---

## Architecture

```
Browser
  |
  v
Express Server (port 3001)
  |
  ├── /                     → React frontend (built to client/dist/)
  ├── /game/:slug           → React Router handles game pages with iframes
  ├── /credits              → React Router handles credits page
  ├── /games/CS450/*        → Static files (Eric & Mat)
  ├── /games/CS450-github/* → Static files (Brian)
  ├── /games/labEscape/*    → Static files (Matt)
  ├── /games/CyberGame/*    → Static HTML (Lynda, converted from Flask templates)
  ├── /games/cyberanalyst/* → Built React bundle (Ziv)
  ├── /games/PhishTank/*    → Built React bundle (Chris)
  └── /api/hack-the-system/* → Express API (Lynda's game logic, converted from Flask)
```

---

## Project Structure

```
cyberbeans/
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx            # Root component with React Router
│   │   ├── App.css            # Global styles + cyberpunk theme
│   │   ├── pages/
│   │   │   ├── Home.jsx       # Game grid homepage
│   │   │   ├── GamePage.jsx   # Individual game iframe page
│   │   │   └── Credits.jsx    # Credits page
│   │   ├── components/
│   │   │   ├── GameCard.jsx   # Game card with hover effects
│   │   │   ├── Navbar.jsx     # Top navigation bar
│   │   │   └── Footer.jsx     # Footer
│   │   └── data/
│   │       └── games.js       # Game catalog (titles, slugs, creators, paths)
│   └── dist/                  # Production build output
├── server/
│   ├── index.js               # Express entry point
│   ├── routes/
│   │   └── hackTheSystem.js   # Lynda's Flask API converted to Express
│   └── package.json
├── games/
│   └── CyberGame/             # Lynda's game static HTML (converted from Flask templates)
│       ├── index.html
│       ├── play.html
│       └── result.html
├── cyberanalyst/              # Ziv's repo (with build/ output)
├── CS450/                     # Eric & Mat's repo
├── CyberGame/                 # Lynda's original repo (static assets used)
├── CS450-github/              # Brian's repo
├── labEscape/                 # Matt's repo
├── PhishTank/                 # Chris's repo (with dist/ output)
├── spec.md                    # Project specification
├── PROGRESS.md                # This file
└── TODO.md                    # Planned changes
```

---

## What Was Done

### 1. Cloned All Repos
- Cloned 6 game repos from GitHub into the `cyberbeans/` directory

### 2. Created React Frontend
- Scaffolded with Vite + React
- Added React Router for client-side routing
- Built 3 pages: Home (game grid), GamePage (iframe embed), Credits
- Designed futuristic cyberpunk theme: dark background, neon cyan/magenta accents, glowing cards, Orbitron font
- Responsive grid: 3 columns desktop, 2 tablet, 1 mobile

### 3. Created Express Backend
- Set up Express server to serve:
  - The React production build
  - All game static files under `/games/` routes
  - SPA fallbacks for React-based games
  - Lynda's converted API endpoints

### 4. Converted Lynda's Flask Game
- Rewrote all Flask API endpoints (`get-challenge`, `submit-answer`, `update-time`, `result`) as Express routes
- Converted Jinja2 HTML templates to static HTML with client-side JavaScript
- Replaced Flask sessions with cookie-based in-memory sessions in Express
- Game is now fully playable without Python

### 5. Built React Games
- Ran `npm install && npm run build` for Ziv's cyberanalyst (output: `build/`)
- Ran `npm install && npm run build` for Chris's PhishTank (output: `dist/`)

### 6. Verified Everything Works
- All 6 games load at their respective `/games/` routes (HTTP 200)
- Homepage serves with correct title
- Hack the System API returns proper JSON
- React Router handles navigation

---

## How to Run

```bash
# Start the server
cd server && node index.js

# Open in browser
open http://localhost:3001
```

For development with hot reload:
```bash
# Terminal 1
cd server && node index.js

# Terminal 2
cd client && npm run dev
# Open http://localhost:5173
```
