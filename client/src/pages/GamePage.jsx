import { useParams, Link } from "react-router-dom";
import games from "../data/games";
import "./GamePage.css";

function GamePage() {
  const { gameSlug } = useParams();
  const game = games.find((g) => g.slug === gameSlug);

  if (!game) {
    return (
      <div className="game-page">
        <div className="game-not-found">
          <h2>Game not found</h2>
          <Link to="/" className="back-btn">Back to Arcade</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="game-page">
      <div className="game-header">
        <Link to="/" className="back-btn">
          <span className="back-arrow">&lt;</span> BACK TO ARCADE
        </Link>
        <div className="game-info">
          <span className="game-icon">{game.icon}</span>
          <div>
            <h1 className="game-title">{game.title}</h1>
            <p className="game-creator">by {game.creator}</p>
          </div>
        </div>
      </div>

      <div className="iframe-container" style={{ "--game-color": game.color }}>
        <iframe
          src={game.path}
          title={game.title}
          className="game-iframe"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );
}

export default GamePage;
