# CyberBeanGames — Planned Changes

## High Priority

### 1. Get Gemini API Key for PhishTank
- Chris's PhishTank game requires a `GEMINI_API_KEY` to function
- Need to set up the API key in a `.env` file or environment variable
- The game embeds fine but won't work without the key
- Options: get a key from Google AI Studio, or have Chris provide one

### 2. Hide Navbar/Header When Playing a Game
- When a user is on a game page (`/game/:slug`), the Navbar takes up vertical space
- The iframe needs maximum screen real estate for gameplay
- **Plan:** Hide the Navbar on GamePage, replace with a minimal floating "Back" button overlay
- Could also add a fullscreen toggle button

### 3. Mobile Friendly Improvements
- The arcade homepage grid is responsive (3/2/1 columns) but the game iframes need work
- **Iframe sizing:** On mobile, iframes should take full viewport height minus minimal controls
- **Touch targets:** Ensure the back button and game cards have proper tap target sizes (48px+)
- **Orientation:** Some games may work better in landscape — consider suggesting rotation
- **Safe areas:** Handle iPhone notch/home indicator with `env(safe-area-inset-*)`
- **Test each game individually** to make sure they're playable on mobile within the iframe

---

## Medium Priority

### 4. Game Thumbnails / Preview Images
- Currently game cards only show an icon emoji
- Add actual screenshot/thumbnail images for each game
- Would make the arcade feel much more polished

### 5. Loading States for Iframes
- When a game iframe is loading, show a skeleton/spinner
- Some games (React-based) take a moment to initialize

### 6. Error Handling for Games That Don't Load
- If a game fails to load in the iframe, show a fallback message
- Especially important for PhishTank without the API key

---

## Low Priority / Future

### 7. AWS Deployment
- Deploy using AWS deploy skill (separate task)
- Will need to handle environment variables for API keys
- Consider using a single EC2/ECS instance or static hosting + Lambda

### 8. Game Categories / Tags
- Tag games by type (quiz, strategy, simulation, AI-powered)
- Could enable filtering later if more games are added

### 9. Analytics
- Track which games are most played
- Simple page view counter per game
