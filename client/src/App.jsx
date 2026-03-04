import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import GamePage from "./pages/GamePage";
import Credits from "./pages/Credits";
import AdminDashboard from "./pages/AdminDashboard";
import ExitSurvey from "./pages/ExitSurvey";
import CreatorSurvey from "./pages/CreatorSurvey";
import "./App.css";

function NotFound() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: 20, padding: 40 }}>
      <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "3rem", fontWeight: 800, letterSpacing: 4, color: "var(--accent-lime)" }}>404</h1>
      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.85rem", color: "var(--text-secondary)", letterSpacing: 2 }}>PAGE NOT FOUND</p>
      <Link to="/" style={{ padding: "12px 28px", border: "2px solid var(--accent-lime)", color: "var(--accent-lime)", textDecoration: "none", fontFamily: "'Space Mono', monospace", fontSize: "0.8rem", fontWeight: 700, letterSpacing: 2 }}>
        &larr; BACK TO ARCADE
      </Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <div className="bg-grid" />
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game/:gameSlug" element={<GamePage />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/survey" element={<ExitSurvey />} />
            <Route path="/creator-survey" element={<CreatorSurvey />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
