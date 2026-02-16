import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import GamePage from "./pages/GamePage";
import Credits from "./pages/Credits";
import AdminDashboard from "./pages/AdminDashboard";
import ExitSurvey from "./pages/ExitSurvey";
import CreatorSurvey from "./pages/CreatorSurvey";
import "./App.css";

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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
