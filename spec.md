# CyberBeanGames — Project Specification

## Overview

**CyberBeanGames** is a Miniclip-style cybersecurity arcade website that hosts 6 student-built cybersecurity games under one roof. Visitors can browse the game catalog and play any game directly in the browser. The site has a futuristic cyberpunk visual theme.

**Target Audience:** General public — anyone interested in playing cybersecurity education games.

---

## Games Catalog

| # | Game | Creator | Tech Stack | Type |
|---|------|---------|------------|------|
| 1 | Cyber Analyst Dashboard | Ziv | React 18 (CRA) | Interactive training tool |
| 2 | Password Security Challenge | Eric & Mat | Static HTML/CSS | Quiz/challenge game |
| 3 | Hack the System | Lynda | Flask + HTML/CSS/JS | Timed quiz (15 scenarios, 60s) |
| 4 | Access Control Simulator | Brian | Static HTML/CSS | Interactive simulator |
| 5 | Malware Lab Escape | Matt | Static HTML/CSS/JS | Grid-based strategy game |
| 6 | PhishTank | Chris | React 19 + Vite + TypeScript + Gemini API | AI-powered phishing detection |

---

## Architecture

### Frontend
- **Framework:** React + Vite
- **Routing:** React Router (client-side)
- **Styling:** CSS with futuristic cyber/cyberpunk theme

### Backend
- **Server:** Node.js + Express
- **Responsibilities:**
  - Serve the built React frontend
  - Serve each game's static files under dedicated routes (e.g., `/games/labEscape/`)
  - Host Lynda's Flask game logic rewritten as Express API routes (quiz data, answer checking, scoring)
  - Serve the React-based games (Ziv's cyberanalyst, Chris's PhishTank) as pre-built static bundles
  - Provide iframe-compatible game endpoints

### Game Embedding Strategy
- All games are embedded via `<iframe>` elements pointing to routes on the same Express server
- Static HTML games (Eric & Mat, Brian, Matt) are served directly as static files
- React games (Ziv, Chris) are pre-built (`npm run build`) and served as static bundles
- Lynda's Flask game is converted to Express routes + static HTML/JS (no Python dependency)

---

## Pages & Routes

### 1. Homepage (`/`)
- Hero section with "CyberBeanGames" branding and tagline
- Grid of 6 game cards, each showing:
  - Game thumbnail/preview image
  - Game title
  - Creator name
  - Short description (1-2 sentences)
  - "Play" button
- Futuristic cyberpunk aesthetic: dark background, glowing neon edges, holographic feel, animated elements

### 2. Game Page (`/game/:gameSlug`)
- Full-width iframe embedding the selected game
- Game title and creator credit displayed above/below the iframe
- "Back to Arcade" button to return to homepage
- Responsive — iframe scales appropriately on mobile

### 3. Credits Page (`/credits`)
- Lists all 6 creators with their name and game title
- Simple, clean layout

---

## Visual Design

**Theme:** Futuristic Cyberpunk
- Dark background (#0a0a1a or similar deep dark blue/black)
- Neon accent colors: cyan (#00ffff), magenta (#ff00ff), electric blue (#0066ff)
- Glowing edge effects and subtle animated backgrounds
- Modern sans-serif fonts with a monospace accent font for headings
- Card hover effects with glow/holographic transitions
- Responsive grid layout that adapts from 3 columns (desktop) to 2 (tablet) to 1 (mobile)

---

## Technical Details

### Project Structure
```
cyberbeans/
├── server/
│   ├── index.js              # Express server entry point
│   ├── routes/
│   │   └── hackTheSystem.js  # Lynda's game API routes (converted from Flask)
│   └── package.json
├── client/                   # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx      # Homepage with game grid
│   │   │   ├── GamePage.jsx  # Individual game iframe page
│   │   │   └── Credits.jsx   # Credits page
│   │   ├── components/
│   │   │   ├── GameCard.jsx  # Individual game card component
│   │   │   ├── Navbar.jsx    # Navigation bar
│   │   │   └── Footer.jsx    # Footer component
│   │   └── data/
│   │       └── games.js      # Game catalog data (titles, descriptions, slugs, creators)
│   ├── public/
│   └── package.json
├── games/                    # Individual game directories (served by Express)
│   ├── cyberanalyst/         # Ziv's game (pre-built React bundle)
│   ├── CS450/                # Eric & Mat's game (static HTML)
│   ├── CyberGame/            # Lynda's game (static files, API via Express)
│   ├── CS450-github/         # Brian's game (static HTML)
│   ├── labEscape/            # Matt's game (static HTML/JS)
│   └── PhishTank/            # Chris's game (pre-built React bundle)
└── spec.md
```

### Express Server Routes
- `GET /` — Serve React frontend (production build)
- `GET /games/:gameName/*` — Serve individual game static files
- `POST /api/hack-the-system/*` — Lynda's game API endpoints (converted from Flask)
- All other routes — React Router handles client-side

### Game Build Process
1. **Static HTML games** (CS450, CS450-github, labEscape): No build needed, serve as-is
2. **React games** (cyberanalyst, PhishTank): Run `npm run build` in each directory, serve the `build`/`dist` output
3. **Flask game** (CyberGame): Convert Flask API to Express routes; serve HTML/CSS/JS templates as static files with updated API endpoints

### Responsive Breakpoints
- Desktop: >= 1024px (3-column game grid)
- Tablet: 768px - 1023px (2-column game grid)
- Mobile: < 768px (1-column game grid, full-width iframe)

---

## Scope

### In Scope
- Arcade homepage with game catalog
- Individual game pages with iframe embedding
- Credits page
- Futuristic cyberpunk theme
- Responsive design (mobile/tablet/desktop)
- Converting Lynda's Flask backend to Express
- Building and serving React-based games
- Chris's PhishTank game embedded as-is (requires Gemini API key to function)

### Out of Scope
- User accounts / authentication
- Game ratings or comments
- Search or filter functionality
- Leaderboards
- Game analytics
- Deployment (handled separately via AWS deploy skill)

---

## Success Criteria
- All 6 games load and are playable via their iframe embeds on localhost
- Homepage displays all game cards with correct info and working navigation
- Credits page lists all creators
- Site is responsive and usable on mobile, tablet, and desktop
- Futuristic cyber theme is cohesive and visually polished
