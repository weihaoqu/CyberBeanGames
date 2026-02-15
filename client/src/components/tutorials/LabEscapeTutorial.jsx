import TutorialWrapper from "./TutorialWrapper";

// Generate a sample 8x8 grid showing malware spread
const GRID_STATES = [
  "healthy","healthy","healthy","patched","healthy","healthy","healthy","healthy",
  "healthy","infected","healthy","patched","healthy","healthy","healthy","healthy",
  "healthy","infected","infected","healthy","healthy","healthy","healthy","healthy",
  "healthy","healthy","quarantined","healthy","healthy","healthy","infected","healthy",
  "healthy","healthy","healthy","healthy","healthy","healthy","healthy","healthy",
  "healthy","healthy","healthy","healthy","healthy","infected","healthy","healthy",
  "healthy","healthy","healthy","healthy","healthy","healthy","healthy","patched",
  "healthy","healthy","healthy","healthy","healthy","healthy","healthy","healthy",
];

const CELL_LABELS = { healthy: "", infected: "☠", patched: "🛡", quarantined: "⚠" };

function LabEscapeTutorial({ game, onStart }) {
  return (
    <TutorialWrapper game={game} onStart={onStart}>
      <div className="tutorial-grid-preview">
        <div className="tutorial-grid">
          {GRID_STATES.map((state, i) => (
            <div key={i} className={`tutorial-grid-cell ${state}`}>
              {CELL_LABELS[state]}
            </div>
          ))}
        </div>
        <div className="tutorial-tool-legend">
          <div className="tutorial-tool">
            <div className="tutorial-tool-icon" style={{ background: "rgba(0,100,255,0.3)" }}>🔍</div>
            Scan
          </div>
          <div className="tutorial-tool">
            <div className="tutorial-tool-icon" style={{ background: "rgba(0,100,255,0.3)" }}>🛡</div>
            Patch
          </div>
          <div className="tutorial-tool">
            <div className="tutorial-tool-icon" style={{ background: "rgba(255,170,0,0.3)" }}>⚠</div>
            Quarantine
          </div>
          <div className="tutorial-tool">
            <div className="tutorial-tool-icon" style={{ background: "rgba(255,0,0,0.3)" }}>🗑</div>
            Delete
          </div>
        </div>
      </div>
    </TutorialWrapper>
  );
}

export default LabEscapeTutorial;
