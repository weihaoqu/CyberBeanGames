import { Link } from "react-router-dom";
import games from "../data/games";
import "./Credits.css";

function Credits() {
  return (
    <div className="credits-page">
      <div className="credits-header">
        <span className="credits-tag">// THE TEAM</span>
        <h1 className="credits-title">CREDITS</h1>
        <p className="credits-subtitle">The developers behind CyberBeanGames</p>
      </div>

      <div className="credits-list">
        {games.map((game, index) => (
          <div key={game.slug} className="credit-item" style={{ "--accent": game.color }}>
            <span className="credit-num">{String(index + 1).padStart(2, "0")}</span>
            <span className="credit-icon">{game.icon}</span>
            <div className="credit-info">
              <h3 className="credit-name">{game.creator}</h3>
              <Link to={`/game/${game.slug}`} className="credit-game">
                {game.title} &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>

      <Link to="/" className="credits-back">&larr; BACK TO ARCADE</Link>
    </div>
  );
}

export default Credits;
