import { Link } from "react-router-dom";
import games from "../data/games";
import "./Credits.css";

function Credits() {
  return (
    <div className="credits-page">
      <h1 className="credits-title">CREDITS</h1>
      <div className="credits-line" />
      <p className="credits-subtitle">The developers behind CyberBeanGames</p>

      <div className="credits-list">
        {games.map((game) => (
          <div key={game.slug} className="credit-item" style={{ "--accent": game.color }}>
            <span className="credit-icon">{game.icon}</span>
            <div className="credit-info">
              <h3 className="credit-name">{game.creator}</h3>
              <Link to={`/game/${game.slug}`} className="credit-game">
                {game.title}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <Link to="/" className="credits-back">Back to Arcade</Link>
    </div>
  );
}

export default Credits;
