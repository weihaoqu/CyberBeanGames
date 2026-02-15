import "./GameCard.css";

function GameCard({ game, index }) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <div className="game-card" style={{ "--card-color": game.color }}>
      <div className="card-index">{num}</div>
      <div className="card-content">
        <div className="card-top">
          <span className="card-icon">{game.icon}</span>
          <span className="card-creator">{game.creator}</span>
        </div>
        <h3 className="card-title">{game.title}</h3>
        <p className="card-desc">{game.description}</p>
      </div>
      <div className="card-bottom">
        <span className="card-tag">PLAY</span>
        <span className="card-arrow">&rarr;</span>
      </div>
    </div>
  );
}

export default GameCard;
