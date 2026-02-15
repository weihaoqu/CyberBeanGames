import "./TutorialWrapper.css";

function TutorialWrapper({ game, onStart, children }) {
  const { tutorial } = game;

  return (
    <div className="tutorial-screen" style={{ "--game-color": game.color }}>
      <div className="tutorial-hero">
        <span className="tutorial-hero-icon">{game.icon}</span>
        <h2>{game.title}</h2>
        <p>{game.description}</p>
        <div className="tutorial-badges">
          <span className="tutorial-badge">
            <span className="tutorial-badge-label">DIFFICULTY</span>
            {tutorial.difficulty}
          </span>
          <span className="tutorial-badge">
            <span className="tutorial-badge-label">TIME</span>
            {tutorial.duration}
          </span>
        </div>
      </div>

      {/* Game-specific visual content */}
      {children && (
        <div className="tutorial-custom-content">
          {children}
        </div>
      )}

      <div className="tutorial-sections">
        <div className="tutorial-section">
          <h3>What You'll Learn</h3>
          <div className="tutorial-concepts">
            {tutorial.concepts.map((c) => (
              <div className="tutorial-concept" key={c.title}>
                <strong>{c.title}</strong>
                <span>{c.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="tutorial-section">
          <h3>How to Play</h3>
          <ol className="tutorial-steps">
            {tutorial.howToPlay.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>

          {tutorial.tips && tutorial.tips.length > 0 && (
            <>
              <h3 style={{ marginTop: 24 }}>Tips</h3>
              <ul className="tutorial-tips">
                {tutorial.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      <div className="tutorial-start">
        <button
          className="start-game-btn"
          style={{ background: game.color }}
          onClick={onStart}
        >
          START GAME ▶
        </button>
      </div>
    </div>
  );
}

export default TutorialWrapper;
