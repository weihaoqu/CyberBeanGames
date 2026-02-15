import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GameCard from "../components/GameCard";
import games from "../data/games";
import "./Home.css";

function Home() {
  const [showSurveyBanner, setShowSurveyBanner] = useState(false);

  useEffect(() => {
    fetch("/api/research/player-progress", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.gamesPlayed >= 2 && !d.exitSurveyDone) {
          setShowSurveyBanner(true);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="home">
      {showSurveyBanner && (
        <div className="survey-banner">
          <div className="survey-banner-text">
            <span className="survey-banner-tag">// RESEARCH</span>
            <span>You've played multiple games — help us by taking the exit survey!</span>
          </div>
          <Link to="/survey" className="survey-banner-btn">TAKE SURVEY</Link>
        </div>
      )}

      <section className="hero">
        <div className="hero-lab-badge">
          <span className="lab-badge-icon">&#x1F3DB;</span>
          <span>Monmouth University Cybersecurity Lab</span>
        </div>
        <div className="hero-tag">// CYBERSECURITY TRAINING ARCADE</div>
        <h1 className="hero-title">
          <span className="title-line title-cyber">CYBER</span>
          <span className="title-line title-bean">BEAN</span>
          <span className="title-line title-games">GAMES</span>
        </h1>
        <p className="hero-desc">
          Play. Learn. Defend. &mdash; 6 interactive cybersecurity games built by students
          at Monmouth University's Cybersecurity Lab.
        </p>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-num">06</span>
            <span className="stat-label">GAMES</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-num">06</span>
            <span className="stat-label">DEVS</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-num">&infin;</span>
            <span className="stat-label">THREATS</span>
          </div>
        </div>
      </section>

      <section className="games-section">
        <div className="section-header">
          <h2>SELECT_GAME</h2>
          <span className="section-count">{games.length} AVAILABLE</span>
        </div>
        <div className="games-grid">
          {games.map((game, index) => (
            <Link
              key={game.slug}
              to={`/game/${game.slug}`}
              className="game-link"
            >
              <GameCard game={game} index={index} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
