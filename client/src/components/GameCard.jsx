import "./GameCard.css";

function GameCard({ game }) {
  return (
    <div className="game-card" style={{ "--card-color": game.color }}>
      <div className="card-glow" />
      <div className="card-top">
        <span className="card-icon">{game.icon}</span>
        <span className="card-creator">by {game.creator}</span>
      </div>
      <h3 className="card-title">{game.title}</h3>
      <p className="card-desc">{game.description}</p>
      <div className="card-bottom">
        <span className="play-btn">
          PLAY <span className="play-arrow">&gt;&gt;</span>
        </span>
      </div>
    </div>
  );
}

export default GameCard;
