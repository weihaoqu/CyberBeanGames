import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import hackTheSystemRoutes from "./routes/hackTheSystem.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// --- Hack the System API (Lynda's game, converted from Flask) ---
app.use("/api/hack-the-system", hackTheSystemRoutes);

// --- Serve individual games as static files ---

// Static HTML games
app.use("/games/CS450", express.static(path.join(ROOT, "CS450")));
app.use("/games/CS450-github", express.static(path.join(ROOT, "CS450-github")));
app.use("/games/labEscape", express.static(path.join(ROOT, "labEscape")));

// Lynda's game - serve static assets, templates become static HTML
app.use("/games/CyberGame/static", express.static(path.join(ROOT, "CyberGame", "static")));
app.use("/games/CyberGame", express.static(path.join(ROOT, "games", "CyberGame")));

// React games - serve built bundles
app.use("/games/cyberanalyst", express.static(path.join(ROOT, "cyberanalyst", "build")));
app.use("/games/PhishTank", express.static(path.join(ROOT, "PhishTank", "dist")));

// SPA fallbacks for React games
app.get("/games/cyberanalyst/*", (req, res) => {
  res.sendFile(path.join(ROOT, "cyberanalyst", "build", "index.html"));
});
app.get("/games/PhishTank/*", (req, res) => {
  res.sendFile(path.join(ROOT, "PhishTank", "dist", "index.html"));
});

// --- Serve the React frontend (production build) ---
const clientDist = path.join(ROOT, "client", "dist");
app.use(express.static(clientDist));

// SPA fallback for React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

app.listen(PORT, () => {
  console.log(`CyberBeanGames server running at http://localhost:${PORT}`);
});
